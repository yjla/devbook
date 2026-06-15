---
sidebar_position: 1
sidebar_label: call
---

# call

`call` / `apply` / `bind` 三者都是**改变函数的 `this` 指向**，区别只在「怎么传参」和「是否立即执行」：

| 方法 | 传参方式 | 执行时机 |
|---|---|---|
| `call` | 参数逐个传 | 立即执行 |
| `apply` | 参数放数组里 | 立即执行 |
| `bind` | 参数逐个传 | 返回新函数，不执行 |

手写的核心思路是同一个：**把函数挂到目标对象上当它的方法来调用**，那么函数里的 `this` 自然就指向了这个对象，调用完再删掉。

```js
Function.prototype.myCall = function (context, ...args) {
  context = context || globalThis; // null/undefined 时指向全局

  const key = Symbol('fn'); // 用 Symbol 避免覆盖已有属性
  context[key] = this; // this 就是被调用的那个函数

  const result = context[key](...args); // 作为 context 的方法调用，this 即指向 context
  delete context[key]; // 调用完清理，别污染对象

  return result;
};
```

## 一句话口诀

> **call = 换 this + 逐个传参 + 立即执行**：把函数挂到目标对象上当方法跑，跑完删掉。
