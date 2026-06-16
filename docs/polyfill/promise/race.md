---
sidebar_position: 2
sidebar_label: Promise.race
---

# Promise.race

**谁先结束就用谁的结果，不论它是成功还是失败。**

形象例子：一群人赛跑，裁判只认**第一个冲过终点线**的人，后面的人无论快慢都不再计入成绩。这里的「冲过终点线」既包括正常跑完（成功），也包括中途摔倒退赛（失败）——只要是第一个「有结果」的，就是最终结果。这就是 `race`，比的是「谁先有结论」。

```js
function myRace(promises) {
  return new Promise((resolve, reject) => {
    // 第一步：遍历每个 promise，让它们同时开始「赛跑」
    promises.forEach((promise) => {
      // 第二步：用 Promise.resolve 包一层，兼容传入的不是 Promise 的情况
      Promise.resolve(promise).then(
        (value) => {
          // 第三步：谁先成功，就用谁的值 resolve
          resolve(value);
        },
        (error) => {
          // 第四步：谁先失败，就用谁的原因 reject
          reject(error);
        }
      );
    });
  });
}
```

:::info
为什么不用担心「后面的人」覆盖结果？因为一个 Promise 的状态一旦从 pending 变成 fulfilled 或 rejected 就**不可再变**。所以即使后续的 `resolve`／`reject` 还会被调用，它们对外部这个 Promise 都不再产生任何效果，第一个改变状态的结果自然就「锁定」了。
:::

> **race = 谁快用谁**：第一个改变状态的 promise（成功或失败）的结果，就是最终结果。
