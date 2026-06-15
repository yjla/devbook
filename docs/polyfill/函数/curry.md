---
sidebar_position: 4
sidebar_label: curry
---

# 柯里化 curry

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
curried(1)(2)(3); // 6
curried(1, 2)(3); // 6
curried(1)(2, 3); // 6
```

:::info
`fn.length` 返回函数声明里的形参个数 (不含剩余参数和默认值后的参数)。柯里化正是靠它知道「还差几个参数」。
:::

## 一句话口诀

> **柯里化**：参数够 (`fn.length`) 就执行，不够就返回新函数继续收。
