---
sidebar_position: 1
sidebar_label: Promise.all
---

# Promise.all

**全部成功才算成功，结果按原顺序返回；任意一个失败就立即整体失败。**

形象例子：一家人出门旅行，要等**所有人**都收拾好行李才能发车，少一个人都走不了；但只要有一个人临时说不去了，这趟旅行就直接取消。这就是 `Promise.all`——等齐所有人，或者有人掉链子就全盘放弃。

```js
function myAll(promises) {
  return new Promise((resolve, reject) => {
    // 第一步：准备一个数组按下标存结果，准备一个计数器记已完成数量
    const results = [];
    let completedCount = 0;

    // 第二步：处理空数组的边界情况，没有任何任务就直接成功返回空数组
    if (promises.length === 0) {
      resolve([]);
      return;
    }

    // 第三步：遍历每个 promise，逐个等待它的结果
    promises.forEach((promise, index) => {
      // 用 Promise.resolve 包一层，兼容传入的不是 Promise 的情况
      Promise.resolve(promise).then(
        (value) => {
          // 第四步：成功时把结果按原下标存进数组，保证顺序和传入顺序一致
          results[index] = value;
          completedCount = completedCount + 1;

          // 第五步：只有当完成数量等于总数时，才把整个数组 resolve 出去
          if (completedCount === promises.length) {
            resolve(results);
          }
        },
        (error) => {
          // 第六步：任意一个失败，立即让整体 reject
          reject(error);
        }
      );
    });
  });
}
```

:::tip
为什么用 `completedCount` 计数，而不是用 `results.length` 判断是否完成？因为异步结果回来的顺序不固定。假设第 2 个任务先回来，我们会执行 `results[1] = value`，此时数组的 `length` 已经变成 2，但其实第 0、1 个位置还是空的（hole）。用 `length` 判断会误以为已经做完两个，提前 resolve。所以必须用一个独立的计数器，只在真正完成时 +1。
:::

> **all = 全成才成、按序收集**：任一失败立即整体 reject，用独立计数器判断是否全部完成。
