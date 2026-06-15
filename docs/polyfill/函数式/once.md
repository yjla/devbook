---
sidebar_position: 3
sidebar_label: once
---

# once 只执行一次

**题目**：让函数无论调用多少次，**只真正执行第一次**，之后都返回第一次的结果（典型如初始化、只绑一次事件）。

```js
function once(fn) {
  let called = false;
  let result;
  return function (...args) {
    if (!called) {
      called = true;
      result = fn.apply(this, args); // 第一次执行并缓存结果
    }
    return result;
  };
}
```

## 一句话口诀

> **once**：闭包存 `called` 标志，只执行第一次，之后返回缓存结果。
