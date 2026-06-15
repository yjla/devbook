---
sidebar_position: 8
sidebar_label: 常用 API
---

# 常用 API

一组小而高频的题，考的是对**原型、`reduce`、引用关系**的熟练度。每道都尽量给最好记的写法。

## 数组去重

三种写法，从简到繁：

```js
// 1. Set 最简洁，工程首选
const unique = (arr) => [...new Set(arr)];

// 2. filter + indexOf：只保留"第一次出现"的元素
const unique = (arr) => arr.filter((item, i) => arr.indexOf(item) === i);

// 3. reduce：累加器里没有才放进去
const unique = (arr) =>
  arr.reduce((acc, cur) => (acc.includes(cur) ? acc : [...acc, cur]), []);
```

:::info
`indexOf` / `includes` 都是按 `===` 比较，所以能去重基本类型，但**去不了对象**（两个内容相同的对象 `!==`）。`Set` 同理。要按内容给对象去重，得自己定义「键」（比如 `JSON.stringify` 或某个 `id` 字段）再用 `Map` 记录。
:::

## 手写 Object.create

`Object.create(proto)` 创建一个新对象，并把它的原型指向 `proto`。原理：让一个空构造函数的 `prototype` 等于 `proto`，再 `new` 一下。

```js
function myCreate(proto) {
  function F() {} // 空构造函数
  F.prototype = proto; // 让它的原型指向目标
  return new F(); // new 出来的对象 __proto__ 就是 proto
}
```

## 手写 reduce

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

> **去重**：`[...new Set(arr)]`，对象去重要自定义键。
> **Object.create**：空函数 `prototype` 指向 `proto`，再 `new`。
> **reduce**：无初始值时第一个元素当起点；`map`/`filter` 都能用它实现（收变换值 / 收满足值）。
