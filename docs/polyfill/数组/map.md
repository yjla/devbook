---
sidebar_position: 2
sidebar_label: map
---

# Array.prototype.map

`map` 遍历数组，对每个元素执行回调，把返回值收集成一个**等长的新数组**，不改原数组。

```js
Array.prototype.myMap = function (fn, thisArg) {
  // 第一步：准备一个空数组，用来装变换后的结果
  const result = [];

  // 第二步：从头到尾走一遍数组
  for (let i = 0; i < this.length; i++) {
    // 第三步：跳过稀疏数组的空位，避免把洞映射成 undefined
    if (i in this) {
      // 第四步：执行回调拿到返回值，放进结果数组对应位置
      result[i] = fn.call(thisArg, this[i], i, this);
    }
  }

  // 第五步：返回这个等长的新数组
  return result;
};

[1, 2, 3].myMap((x) => x * 2); // [2, 4, 6]
```

要点：

- 回调接收 `(当前值, 下标, 原数组)` 三个参数，第二个参数 `thisArg` 指定回调里的 `this`。
- `i in this` 判断能跳过稀疏数组的空位，避免把空位映射成 `undefined`。

:::info 形象记忆
把 `map` 想成 **「工厂流水线」**：原料（原数组）一个个进来，每件都经过同一道加工工序（回调），加工完的成品**按原顺序整齐排进新的传送带**（新数组）。进来几件、出去就几件（等长），原料仓库本身不动（不改原数组）。`forEach` 则是只检查不加工、传送带空空如也的那条线。
:::

:::tip
`map` 也能用 `reduce` 表达：`arr.reduce((acc, cur, i) => [...acc, fn(cur, i)], [])`——本质是「无条件收变换后的值」。详见 [reduce](./reduce.md)。
:::

## 一句话口诀

> **map = 遍历 + 收集返回值成等长新数组**，回调拿 `(值, 下标, 原数组)`，记得跳稀疏空位。
