---
sidebar_position: 4
sidebar_label: flatten
---

# 数组扁平化 flatten

把任意嵌套的数组「拍平」成一维数组，比如 `[1, [2, [3, [4]]]]` → `[1, 2, 3, 4]`。

思路：遍历每个元素，**是数组就递归拍平再拼接，不是数组就直接收**。用 `reduce` 写最简洁：

```js
function flatten(arr) {
  return arr.reduce(
    (result, item) =>
      result.concat(Array.isArray(item) ? flatten(item) : item),
    []
  );
}

flatten([1, [2, [3, [4]]]]); // [1, 2, 3, 4]
```

如果只想拍平**指定层数**，用一个 `depth` 控制递归深度：

```js
function flatten(arr, depth = Infinity) {
  if (depth < 1) return arr.slice();
  return arr.reduce(
    (result, item) =>
      result.concat(Array.isArray(item) ? flatten(item, depth - 1) : item),
    []
  );
}
```

:::tip
工程里直接用原生 `arr.flat(Infinity)` 即可。手写题问的是「不用 `flat` 怎么实现」，递归 + `reduce` 是最好记的答案。
:::

## 一句话口诀

> **扁平化**：`reduce` 遍历，是数组就递归拍平再 `concat`，否则直接收。
