---
sidebar_position: 3
sidebar_label: reduce
---

# Array.prototype.reduce

`reduce` 是 `map` / `filter` 的「母方法」，先把它写出来。要点：**没传初始值时，用第一个元素当初始值、从第二个开始遍历**。

```js
Array.prototype.myReduce = function (fn, initialValue) {
  let acc = initialValue;
  let startIndex = 0;

  if (acc === undefined) {
    acc = this[0]; // 没初始值，第一个元素当累加起点
    startIndex = 1; // 从第二个开始遍历
  }

  for (let i = startIndex; i < this.length; i++) {
    acc = fn(acc, this[i], i, this); // (累加器, 当前值, 下标, 原数组)
  }
  return acc;
};
```

## 用 reduce 实现 map / filter

`map` 和 `filter` 本质都是「遍历 + 累加成新数组」，所以都能用 `reduce` 表达：

```js
// map：每个元素经 fn 变换后收进新数组
const map = (arr, fn) =>
  arr.reduce((acc, cur, i) => [...acc, fn(cur, i)], []);

// filter：满足条件的才收进新数组
const filter = (arr, fn) =>
  arr.reduce((acc, cur, i) => (fn(cur, i) ? [...acc, cur] : acc), []);
```

:::tip
看懂这层关系很有用：`map` = 无条件收变换后的值，`filter` = 有条件收原值。理解了 `reduce` 能模拟二者，就抓住了「`reduce` 是最通用的遍历」这个本质。
:::

## 一句话口诀

> **reduce**：无初始值时第一个元素当起点；`map`/`filter` 都能用它实现（收变换值 / 收满足值）。
