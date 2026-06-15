---
sidebar_position: 1
sidebar_label: forEach
---

# Array.prototype.forEach

`forEach` 遍历数组、对每个元素执行回调，**没有返回值**（返回 `undefined`），纯粹为了「副作用」。和 `map` 的唯一区别：`map` 把回调返回值收集成新数组，`forEach` 不收集。

```js
Array.prototype.myForEach = function (fn, thisArg) {
  for (let i = 0; i < this.length; i++) {
    if (i in this) {
      // 跳过稀疏数组的空位
      fn.call(thisArg, this[i], i, this);
    }
  }
};

[1, 2, 3].myForEach((x) => console.log(x)); // 依次打印 1 2 3
```

回调同样接收 `(当前值, 下标, 原数组)`，`thisArg` 指定回调里的 `this`。

:::warning
`forEach` **无法中断遍历**：`break` 用不了，`return` 只结束当前这一次回调、不影响后续。需要提前退出就改用 `for` / `for...of`，或语义上更贴切的 `some`（找到就停）/ `every`（不满足就停）。
:::

## 一句话口诀

> **forEach = 只遍历不收集**（返回 `undefined`），和 `map` 就差「要不要返回值」，且**不能 break / return 中断**。
