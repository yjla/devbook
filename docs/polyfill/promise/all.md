---
sidebar_position: 2
sidebar_label: Promise.all
---

# Promise.all

**全部成功才成功**，结果按原顺序返回；**任意一个失败就立即失败**。下面复用 [Promise 核心](./promise.md) 里的 `MyPromise`。

```js
MyPromise.all = (promises) => {
  return new MyPromise((resolve, reject) => {
    const results = [];
    let count = 0;

    if (promises.length === 0) return resolve([]);

    promises.forEach((p, i) => {
      MyPromise.resolve(p).then((value) => {
        results[i] = value; // 按下标存，保证顺序
        count++;
        if (count === promises.length) resolve(results); // 全齐了才 resolve
      }, reject); // 任意一个失败，整体 reject
    });
  });
};
```

:::tip
用 `count` 计数而不是 `results.length` 判断完成，因为异步结果回来的顺序不固定，提前按下标填坑会让 `length` 不准。
:::

## 一句话口诀

> **all = 全成才成、按序收集**，任一失败立即整体 reject；用 `count` 计数判完成。
