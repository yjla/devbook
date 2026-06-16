---
sidebar_position: 3
sidebar_label: bind
---

# bind

`bind` 和 [`call`](./call.md) / [`apply`](./apply.md) 最大的不同是：它**不立即执行**，而是**返回一个永久绑定了 `this` 的新函数**，等你以后想调用时再调用，而且支持分两次传参。

## 核心思路

分三步想：

1. 先把原函数存起来（因为返回的新函数里要用到它）。
2. 返回一个新函数，这个新函数被调用时，借用 `apply` 把 `this` 固定到 `context`，并把「绑定时的参数」和「调用时的参数」拼在一起传进去。
3. 处理一个容易漏掉的坑——**兼容 `new`**：如果这个新函数被 `new` 调用，按规范 `this` 应该指向 `new` 出来的新实例，而不是当初绑定的 `context`，否则原型继承会出错。判断方法是 `this instanceof bound`。

:::info 形象记忆
把 `bind` 想象成 **「提前点好的外卖」**。`call` / `apply` 是现点现吃（立即执行），而 `bind` 是你今天先把订单（`this` 和部分参数）填好下单，但**先不送**，返回给你一张「取餐凭证」（新函数）。等你哪天饿了，拿凭证去取（调用新函数），还能在取餐时临时加几样小菜（第二批参数）。订单里的店家信息（`this`）一旦定好就不会变了。
:::

## 实现

```js
Function.prototype.myBind = function (context, ...preArgs) {
  // 第一步：保存原函数。后面返回的新函数内部 this 会变，得先把它存下来
  const originalFn = this;

  // 第二步：返回一个新函数（用具名函数 bound，方便后面判断 new）
  function bound(...laterArgs) {
    // 第三步：判断新函数是不是被 new 调用
    // 被 new 时 this 是新实例，this instanceof bound 为 true
    const isCalledByNew = this instanceof bound;

    // 第四步：决定 this 指向
    // 被 new 调用时让位给新实例，否则用绑定的 context
    const thisArg = isCalledByNew ? this : context;

    // 第五步：把「绑定时的参数」和「调用时的参数」拼起来一起传
    const allArgs = [...preArgs, ...laterArgs];

    return originalFn.apply(thisArg, allArgs);
  }

  return bound;
};
```

## 用法

```js
function greet(greeting, punctuation) {
  return greeting + ', ' + this.name + punctuation;
}

const user = { name: '小美' };

// 分两次传参：绑定时传 greeting，调用时传 punctuation
const greetUser = greet.myBind(user, '你好');
greetUser('!'); // "你好, 小美!"
```

:::warning
`bind` 最容易被忽略的点就是**兼容 `new`**。被 `new` 调用时，绑定的 `context` 要让位给新创建的实例，否则用 `bind` 出来的函数当构造函数时继承会出问题。判断依据是 `this instanceof bound`。
:::

## 一句话口诀

> **bind = 换 this + 返回新函数延后执行**：像提前下好的外卖，可分两次传参，还得兼容 `new`（被 `new` 时让位给新实例）。
