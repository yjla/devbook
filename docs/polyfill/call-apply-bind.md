---
sidebar_position: 2
sidebar_label: call / apply / bind
---

# call / apply / bind

三者都是**改变函数的 `this` 指向**，区别只在「怎么传参」和「是否立即执行」：

| 方法 | 传参方式 | 执行时机 |
|---|---|---|
| `call` | 参数逐个传 | 立即执行 |
| `apply` | 参数放数组里 | 立即执行 |
| `bind` | 参数逐个传 | 返回新函数，不执行 |

手写的核心思路是同一个：**把函数挂到目标对象上当它的方法来调用**，那么函数里的 `this` 自然就指向了这个对象，调用完再删掉。

## call

```js
Function.prototype.myCall = function (context, ...args) {
  context = context || globalThis; // null/undefined 时指向全局

  const key = Symbol('fn');        // 用 Symbol 避免覆盖已有属性
  context[key] = this;             // this 就是被调用的那个函数

  const result = context[key](...args); // 作为 context 的方法调用，this 即指向 context
  delete context[key];             // 调用完清理，别污染对象

  return result;
};
```

## apply

和 `call` 只差在参数是数组：

```js
Function.prototype.myApply = function (context, args = []) {
  context = context || globalThis;

  const key = Symbol('fn');
  context[key] = this;

  const result = context[key](...args);
  delete context[key];

  return result;
};
```

## bind

`bind` 不立即执行，而是**返回一个永久绑定了 `this` 的新函数**，支持分两次传参。

```js
Function.prototype.myBind = function (context, ...args) {
  const self = this; // 保存原函数

  return function bound(...rest) {
    // 如果返回的函数被 new 调用，this 应指向新实例，忽略绑定的 context
    const isNew = this instanceof bound;
    return self.apply(isNew ? this : context, [...args, ...rest]);
  };
};
```

:::warning
`bind` 最容易被忽略的点是**兼容 `new`**。被 `new` 调用时，绑定的 `context` 要让位给新创建的实例，否则继承会出问题。判断依据是 `this instanceof bound`。
:::

## 一句话口诀

> **call/apply/bind 都是「换 this」——把函数挂到目标对象上当方法跑。call 逐个传参、apply 传数组、bind 返回新函数延后执行（还得兼容 new）。**
