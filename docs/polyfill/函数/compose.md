---
sidebar_position: 7
sidebar_label: compose / pipe
---

# compose 与 pipe

高阶函数 = **接收函数或返回函数的函数**。`compose` / `pipe` 把多个函数串成「流水线」，前一个的输出当后一个的输入。区别只在方向：

- `compose(f, g, h)(x)` = `f(g(h(x)))`——**从右到左**（数学习惯）。
- `pipe(f, g, h)(x)` = `h(g(f(x)))`——**从左到右**（阅读习惯）。

```js
// 从右到左：reduceRight
const compose = (...fns) => (x) => fns.reduceRight((acc, fn) => fn(acc), x);

// 从左到右：reduce
const pipe = (...fns) => (x) => fns.reduce((acc, fn) => fn(acc), x);

// 用法
const add1 = (x) => x + 1;
const double = (x) => x * 2;

compose(add1, double)(5); // add1(double(5)) = 11
pipe(add1, double)(5); // double(add1(5)) = 12
```

:::info
方向是唯一区别：`compose` 用 `reduceRight` 从右往左累加，`pipe` 用 `reduce` 从左往右。Redux 的 `applyMiddleware` 就是用 `compose` 把多个中间件串起来的。
:::

## 一句话口诀

> **compose/pipe**：`reduceRight` 从右到左、`reduce` 从左到右，串成流水线。
