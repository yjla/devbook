---
sidebar_position: 2
sidebar_label: apply
---

# apply

`apply` 和 [`call`](./call.md) 只差在**参数是数组**，其余思路完全一样：把函数挂到目标对象上当方法调用，`this` 即指向该对象。

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

## 一句话口诀

> **apply = call 的「数组传参」版**，其余逻辑一致，立即执行。
