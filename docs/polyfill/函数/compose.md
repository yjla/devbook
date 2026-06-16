---
sidebar_position: 7
sidebar_label: compose / pipe
---

# compose 与 pipe

`compose` 和 `pipe` 把多个函数串成一条「流水线」，**前一个函数的输出，当作后一个函数的输入**。两者唯一的区别是方向：

- `compose(f, g, h)(x)` = `f(g(h(x)))`——**从右到左**执行，贴合数学里 `f∘g` 的习惯。
- `pipe(f, g, h)(x)` = `h(g(f(x)))`——**从左到右**执行，贴合从左往右的阅读习惯。

实现都是用 `reduce` 把「上一步的结果」一路传给下一个函数，方向不同就用不同的 reduce。

```js
function compose(...fns) {
  // 第一步：收集所有要串联的函数，返回一个新函数
  return function (x) {
    // 第二步：从右往左累加，所以用 reduceRight
    // acc 是「上一步的结果」，初始值就是入参 x
    return fns.reduceRight((acc, fn) => {
      // 第三步：把上一步结果喂给当前函数，得到新结果
      return fn(acc);
    }, x);
  };
}

function pipe(...fns) {
  // 和 compose 只差一个方向：从左往右用 reduce
  return function (x) {
    return fns.reduce((acc, fn) => {
      return fn(acc);
    }, x);
  };
}

const add1 = (x) => x + 1;
const double = (x) => x * 2;

compose(add1, double)(5); // 先 double 再 add1：double(5)=10 → add1=11
pipe(add1, double)(5); // 先 add1 再 double：add1(5)=6 → double=12
```

:::tip 形象记忆
想象 **工厂流水线上的几道工序**：一块铁料依次经过「切割 → 打磨 → 喷漆」，每道工序的产出就是下一道的原料。`pipe` 就是按你写的顺序从左到右过工序；`compose` 则像数学家倒着念，从最右边那道工序开始。料（`x`）只有一份，一路被加工传递下去。
:::

:::info
Redux 的 `applyMiddleware` 内部就是用 `compose` 把多个中间件串成一条处理链的。
:::

## 一句话口诀

> **compose / pipe**：`reduceRight` 从右到左、`reduce` 从左到右，把函数串成流水线，前者输出喂给后者。
