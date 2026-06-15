---
sidebar_position: 9
sidebar_label: 函数组合与高阶函数
---

# 函数组合与高阶函数

高阶函数 = **接收函数或返回函数的函数**。这几道题的共同套路是「**返回一个包了额外逻辑的新函数**」，是函数式编程和很多库（Redux、Lodash）的底座。

## compose 与 pipe

把多个函数串成「流水线」，前一个的输出当后一个的输入。区别只在方向：

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

## memoize 缓存

**题目**：缓存函数结果，相同参数第二次调用直接返回缓存，不重复计算（典型如缓存斐波那契、纯函数计算）。

思路：用一个 `Map` 以「参数」为 key 存结果。

```js
function memoize(fn) {
  const cache = new Map();
  return function (...args) {
    const key = JSON.stringify(args); // 参数序列化当缓存键
    if (cache.has(key)) return cache.get(key); // 命中直接返回
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

const slowSquare = (n) => n * n;
const fastSquare = memoize(slowSquare);
fastSquare(4); // 计算，缓存
fastSquare(4); // 直接读缓存
```

:::warning
`JSON.stringify` 当 key 只适合参数是简单值的场景：函数、`undefined`、循环引用都序列化不了，对象属性顺序不同也会算成不同 key。生产环境用 memoize 要注意只缓存**纯函数**（同输入必同输出）。
:::

## once 只执行一次

**题目**：让函数无论调用多少次，**只真正执行第一次**，之后都返回第一次的结果（典型如初始化、只绑一次事件）。

```js
function once(fn) {
  let called = false;
  let result;
  return function (...args) {
    if (!called) {
      called = true;
      result = fn.apply(this, args); // 第一次执行并缓存结果
    }
    return result;
  };
}
```

## sleep 延时

**题目**：实现 `await sleep(1000)` 暂停一段时间。本质是把 `setTimeout` 包成 `Promise`。

```js
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// 用法
async function run() {
  console.log('开始');
  await sleep(1000); // 停 1 秒
  console.log('1 秒后');
}
```

:::tip
`sleep` 是异步题的常用积木：配合 `for` 循环 + `await` 能实现「每隔 N 毫秒做一件事」的顺序节流，比 `setInterval` 更可控（上一件没做完不会叠下一件）。
:::

## 一句话口诀

> **compose/pipe**：`reduceRight` 从右到左、`reduce` 从左到右，串成流水线。
> **memoize**：`Map` 以参数为 key 缓存结果（仅限纯函数）。
> **once**：闭包存 `called` 标志，只执行第一次。
> **sleep**：`setTimeout` 包成 `Promise`，配 `await` 用。
