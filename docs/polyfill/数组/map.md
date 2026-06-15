---
sidebar_position: 2
sidebar_label: map
---

# Array.prototype.map

`map` 遍历数组，对每个元素执行回调，把返回值收集成一个**等长的新数组**，不改原数组。

```js
Array.prototype.myMap = function (fn, thisArg) {
  const result = [];
  for (let i = 0; i < this.length; i++) {
    if (i in this) {
      // 跳过稀疏数组的空位
      result[i] = fn.call(thisArg, this[i], i, this);
    }
  }
  return result;
};

[1, 2, 3].myMap((x) => x * 2); // [2, 4, 6]
```

要点：

- 回调接收 `(当前值, 下标, 原数组)` 三个参数，第二个参数 `thisArg` 指定回调里的 `this`。
- `i in this` 判断能跳过稀疏数组的空位，避免把空位映射成 `undefined`。

:::tip
`map` 也能用 `reduce` 表达：`arr.reduce((acc, cur, i) => [...acc, fn(cur, i)], [])`——本质是「无条件收变换后的值」。详见 [reduce](./reduce.md)。
:::

## 一句话口诀

> **map = 遍历 + 收集返回值成等长新数组**，回调拿 `(值, 下标, 原数组)`，记得跳稀疏空位。
