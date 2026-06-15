---
sidebar_position: 8
sidebar_label: 8 洋葱模型
---

# 洋葱模型

Koa 的中间件机制俗称「**洋葱模型**」：一个请求像穿过洋葱一样，从最外层一层层钻进最里层，再从最里层一层层钻出来。每个中间件形如 `(ctx, next) => {}`，调用 `next()` 就进入下一层；`next()` **之后**的代码会在「返回路上」执行。

```mermaid
graph LR
  A[请求] --> B[中间件1 前置] --> C[中间件2 前置] --> D[最内层]
  D --> E[中间件2 后置] --> F[中间件1 后置] --> G[响应]
```

所以两个中间件的执行顺序是：`1 进 → 2 进 → 2 出 → 1 出`——前置代码按注册顺序、后置代码按相反顺序，对称地包裹起来。

## 核心：compose

实现洋葱模型的关键是一个 `compose` 函数，把中间件数组组合成一条可串行 `await` 的链。核心技巧：**把「调用下一个中间件」这件事包成 `next` 函数，传给当前中间件**。

```ts
interface Context {
  [key: string]: any;
}

type Next = () => Promise<void>;
type Middleware = (ctx: Context, next: Next) => Promise<void> | void;

function compose(middlewares: Middleware[]): (ctx: Context) => Promise<void> {
  return function (ctx: Context): Promise<void> {
    let index = -1; // 记录执行到第几个，防止 next 被重复调用

    function dispatch(i: number): Promise<void> {
      // 同一个中间件里 next() 调了两次，i 不会前进，报错
      if (i <= index) return Promise.reject(new Error('next() called multiple times'));
      index = i;

      const fn = middlewares[i];
      if (!fn) return Promise.resolve(); // 没有更多中间件，链到底了

      // 关键：把 dispatch(i + 1) 当作 next 传进去
      // 用 Promise.resolve 包裹，保证返回值一定是 Promise，可被 await
      return Promise.resolve(fn(ctx, () => dispatch(i + 1)));
    }

    return dispatch(0); // 从第一个中间件开始
  };
}
```

## 跑一遍看顺序

```ts
const mw1: Middleware = async (ctx, next) => {
  console.log('1 进');
  await next(); // 进入下一层，等它全部执行完
  console.log('1 出');
};

const mw2: Middleware = async (ctx, next) => {
  console.log('2 进');
  await next();
  console.log('2 出');
};

compose([mw1, mw2])({});
// 输出：1 进 → 2 进 → 2 出 → 1 出
```

`mw1` 里 `await next()` 会一直等到 `mw2` 整个执行完（包括它的后置代码），才继续打印 `1 出`——这就是洋葱「先进后出」的对称结构。

:::warning
两个易漏点：
1. **`Promise.resolve(fn(...))` 必须包裹**——中间件可能是同步函数，包一层才能保证 `next()` 始终返回 Promise，外层 `await next()` 才不出错。
2. **`index` 守卫**——`next` 在同一个中间件里被调用两次会让控制流错乱，用 `i <= index` 检测并抛错。
:::

:::info
洋葱模型的价值在于**后置逻辑**：像「记录请求耗时」「统一错误捕获」「响应后置处理」这类需求，写在 `await next()` 之后，天然能包裹住内层所有中间件。Koa 的 `koa-compose` 正是这段代码的工业版。
:::

## 一句话口诀

> **洋葱模型 = 递归式的 compose**：把 `dispatch(i+1)` 当 `next` 传给第 `i` 个中间件；`await next()` 钻进下一层、等它全跑完再执行后置代码 → 先进后出、对称包裹。
