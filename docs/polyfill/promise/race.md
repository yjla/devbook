---
sidebar_position: 3
sidebar_label: Promise.race
---

# Promise.race

**谁先结束（不论成功失败）就用谁**的结果。同样复用 [Promise 核心](./promise.md) 里的 `MyPromise`。

```js
MyPromise.race = (promises) => {
  return new MyPromise((resolve, reject) => {
    promises.forEach((p) => {
      MyPromise.resolve(p).then(resolve, reject); // 第一个改变状态的说了算
    });
  });
};
```

## 一句话口诀

> **race = 谁快用谁**：第一个改变状态（成功或失败）的结果就是最终结果。
