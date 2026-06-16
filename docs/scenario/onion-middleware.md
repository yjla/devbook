---
sidebar_position: 8
sidebar_label: 8 洋葱模型
---

# 洋葱模型

Koa 的中间件机制俗称「 **洋葱模型** 」：一个请求像穿过洋葱一样，从最外层一层层钻进最里层，再从最里层一层层钻出来。每个中间件形如 `(ctx, next) => {}` ，调用 `next()` 就进入下一层；`next()` **之后** 的代码会在「返回路上」执行。

记忆类比： **像安检进出机场** 。进港时你依次过「证件检查 → 安检门 → 登机口」（前置代码，按顺序进），登机；回来出港时倒着穿过同样几道关卡（后置代码，逆序出）。每一道关卡都是一个中间件，进去时做一件事，出来时还能再补一件事——「记录你进去花了多久」这种事，只能等你出来才知道，所以写在 `next()` 之后。

```mermaid
graph LR
  A[请求] --> B[中间件1 前置] --> C[中间件2 前置] --> D[最内层]
  D --> E[中间件2 后置] --> F[中间件1 后置] --> G[响应]
```

所以两个中间件的执行顺序是：`1 进 → 2 进 → 2 出 → 1 出` ——前置代码按注册顺序、后置代码按相反顺序，对称地包裹起来。

## 核心：洋葱就是「函数套娃」

别急着看实现，先想清楚这套机制要**生成什么**。

三个中间件 `mw1、mw2、mw3` ，洋葱模型的执行，本质就是把它们**一层套一层地嵌套调用**——每一层的 `next` ，就是「调用下一层」这个动作被包成的函数：

```js
mw1(ctx, () =>
  mw2(ctx, () =>
    mw3(ctx, () =>
      Promise.resolve(),
    ),
  ),
);
```

看懂这串嵌套，洋葱模型就懂了一大半： `mw1` 调它的 `next()` 就钻进 `mw2` ，`mw2` 调 `next()` 就钻进 `mw3` ，`mw3` 调 `next()` 发现没有下一层了，用一个空 `Promise.resolve()` 收尾。`next()` **之后**的代码自然要等内层整串跑完才执行——这就是「先进后出」。

要做的，就是**不管注册了几个中间件，都自动生成上面这串嵌套**。

记忆类比： **俄罗斯套娃** 。每个中间件是一个娃，从大到小套好；你打开最外层那个 (`dispatch(0)`)，里面是次大的，一路打开到最小的实心娃 (`Promise.resolve()`) 收底，再一个个合上——打开是「前置」，合上是「后置」。

把它写成一个类，正好贴着真实的 Koa 来记： **`use()` 注册中间件，`run()` 跑整条链** 。核心还是那个递归的 `dispatch(i)` ，含义就一句话：「执行第 `i` 个中间件，把『执行第 `i+1` 个』当作它的 `next` 传进去」。

```js
class Onion {
  // 第一步：构造函数里准备一个数组，存所有注册进来的中间件
  constructor() {
    this.middlewares = [];
  }

  // 第二步：use 注册中间件，和 Koa 的 app.use() 一样；返回 this 支持链式
  use(fn) {
    this.middlewares.push(fn);
    return this;
  }

  // 第三步：run 跑整条链，从最外层的娃开始打开
  run(ctx) {
    // 第四步：dispatch(i) —— 执行第 i 个中间件
    const dispatch = (i) => {
      // 第五步：取第 i 个中间件，取不到说明套到底了，返回空 Promise 收尾（最里层的实心娃）
      const fn = this.middlewares[i];
      if (!fn) {
        return Promise.resolve();
      }

      // 第六步（关键）：把「执行下一个」包成 next 传进去——这就是套娃的「套」
      // 当前中间件里调 next()，等于执行 dispatch(i + 1)，钻进下一层
      // 用 Promise.resolve 包一层，保证同步中间件也返回 Promise，外层能 await
      return Promise.resolve(fn(ctx, () => dispatch(i + 1)));
    };

    return dispatch(0);
  }
}
```

:::tip
`dispatch` 写成 **箭头函数** ，才能直接用外层 `run` 的 `this`（拿到 `this.middlewares`）和闭包里的 `ctx` ；写成普通函数 `this` 就丢了。把 `dispatch` 在脑子里展开一次，就回到了上面那串手写套娃——它俩是同一个东西，递归只是把「套娃」自动化了。
:::

## 跑一遍看顺序

```js
const mw1 = async (ctx, next) => {
  console.log('1 进');
  await next(); // 进入下一层，等它全部执行完
  console.log('1 出');
};

const mw2 = async (ctx, next) => {
  console.log('2 进');
  await next();
  console.log('2 出');
};

const app = new Onion();
app.use(mw1).use(mw2); // 像 Koa 一样注册
app.run({}); // 跑整条链

// 输出：1 进 → 2 进 → 2 出 → 1 出
```

`mw1` 里 `await next()` 会一直等到 `mw2` 整个执行完（包括它的后置代码），才继续打印 `1 出` ——这就是洋葱「先进后出」的对称结构。

:::warning
两个易漏点：

1. `Promise.resolve(fn(...))` **必须包裹** ——中间件可能是同步函数，包一层才能保证 `next()` 始终返回 Promise，外层 `await next()` 才不出错。
2. 工业版（`koa-compose`）还会加一个 `index` **守卫** ——记录执行到第几个，`next` 在同一个中间件里被调用两次时抛错，防止控制流错乱。理解原理时可以先忽略，知道有这回事即可。
   :::

:::info
洋葱模型的价值在于 **后置逻辑** ：像「记录请求耗时」「统一错误捕获」「响应后置处理」这类需求，写在 `await next()` 之后，天然能包裹住内层所有中间件。Koa 的 `app.use()` + `koa-compose` 正是这套机制的工业版。
:::
