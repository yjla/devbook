---
sidebar_position: 5
sidebar_label: uniq
---

# 数组去重 uniq

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

## 一句话口诀

> **去重**：`[...new Set(arr)]`，对象去重要自定义键。
