---
sidebar_position: 1
sidebar_label: forEach
---

# Array.prototype.forEach

`forEach` 遍历数组、对每个元素执行回调，**没有返回值**（返回 `undefined`），纯粹为了「副作用」。和 `map` 的唯一区别：`map` 把回调返回值收集成新数组，`forEach` 不收集。

```js
Array.prototype.myForEach = function (fn, thisArg) {
  // 第一步：从头到尾走一遍数组
  for (let i = 0; i < this.length; i++) {
    // 第二步：跳过稀疏数组的空位（比如 [1, , 3] 中间那个洞）
    if (i in this) {
      // 第三步：执行回调，把 (当前值, 下标, 原数组) 喂给它，
      //         并用 call 把回调里的 this 指向 thisArg
      fn.call(thisArg, this[i], i, this);
    }
  }
  // 注意：这里没有 return，所以默认返回 undefined
};

[1, 2, 3].myForEach((x) => console.log(x)); // 依次打印 1 2 3
```

回调同样接收 `(当前值, 下标, 原数组)`，`thisArg` 指定回调里的 `this`。

:::info 形象记忆
把 `forEach` 想成 **「老师点名」**：老师拿着名册从上往下念每个学生的名字（执行回调），念完就完事了，**手里不会多出一张新名单**（没有返回值）。而且一旦开念就**停不下来**——念到一半想提前结束？`break` 用不了，喊一声 `return` 也只是把当前这个名字咽回去，下一个照念不误。
:::

:::warning
`forEach` **无法中断遍历**：`break` 用不了，`return` 只结束当前这一次回调、不影响后续。需要提前退出就改用 `for` / `for...of`，或语义上更贴切的 `some`（找到就停）/ `every`（不满足就停）。
:::

## 一句话口诀

> **forEach = 只遍历不收集**（返回 `undefined`），和 `map` 就差「要不要返回值」，且**不能 break / return 中断**。
