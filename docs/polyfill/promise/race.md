---
sidebar_position: 2
sidebar_label: Promise.race
---

# Promise.race

**谁先结束（不论成功失败）就用谁**的结果。下面基于原生 `Promise` 实现。

```js
function myRace(promises) {
  return new Promise((resolve, reject) => {
    promises.forEach((p) => {
      Promise.resolve(p).then(resolve, reject); // 第一个改变状态的说了算
    });
  });
}
```

## 一句话口诀

> **race = 谁快用谁**：第一个改变状态（成功或失败）的结果就是最终结果。
