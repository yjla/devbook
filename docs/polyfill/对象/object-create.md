---
sidebar_position: 5
sidebar_label: Object.create
---

# 手写 Object.create

`Object.create(proto)` 创建一个新对象，并把它的原型指向 `proto`。原理：让一个空构造函数的 `prototype` 等于 `proto`，再 `new` 一下。

```js
function myCreate(proto) {
  function F() {} // 空构造函数
  F.prototype = proto; // 让它的原型指向目标
  return new F(); // new 出来的对象 __proto__ 就是 proto
}
```

:::info
寄生组合[继承](./继承.md)里的 `Object.create(Parent.prototype)` 用的就是这个能力——只接原型、不执行父类构造函数。
:::

## 一句话口诀

> **Object.create**：空函数 `prototype` 指向 `proto`，再 `new`。
