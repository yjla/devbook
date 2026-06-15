---
sidebar_position: 3
sidebar_label: bind
---

# bind

和 [`call`](./call.md) / [`apply`](./apply.md) 不同，`bind` 不立即执行，而是**返回一个永久绑定了 `this` 的新函数**，支持分两次传参。

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

> **bind = 换 this + 返回新函数延后执行**，可分两次传参，还得兼容 `new`（被 `new` 时让位给新实例）。
