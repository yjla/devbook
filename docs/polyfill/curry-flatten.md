---
sidebar_position: 5
sidebar_label: 柯里化与数组扁平化
---

# 柯里化与数组扁平化

两道高频小题，核心都是**递归**。

## 柯里化 curry

柯里化是把「一次性收齐所有参数」的函数，改造成「**可以分多次传参**」的版本：`add(1, 2, 3)` 变成 `add(1)(2)(3)` 或 `add(1, 2)(3)` 都行。

判断「够不够执行」的依据是**原函数的形参个数 `fn.length`**：收集到的参数够了就执行，不够就返回一个新函数继续收集。

```js
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args); // 参数够了，直接执行
    }
    // 参数不够，返回新函数，把已有参数和新参数拼起来继续收
    return (...rest) => curried.apply(this, [...args, ...rest]);
  };
}

// 用法
const add = (a, b, c) => a + b + c;
const curried = curry(add);
curried(1)(2)(3);   // 6
curried(1, 2)(3);   // 6
curried(1)(2, 3);   // 6
```

:::info
`fn.length` 返回函数声明里的形参个数 (不含剩余参数和默认值后的参数)。柯里化正是靠它知道「还差几个参数」。
:::

## 数组扁平化 flatten

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

> **柯里化**：参数够 (`fn.length`) 就执行，不够就返回新函数继续收。
> **扁平化**：`reduce` 遍历，是数组就递归拍平再 `concat`，否则直接收。
