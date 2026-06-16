---
sidebar_position: 4
sidebar_label: curry
---

# 柯里化 curry

柯里化是把一个「必须一次性收齐所有参数」的函数，改造成「**可以分多次传参**」的版本：原来只能 `add(1, 2, 3)`，改造后 `add(1)(2)(3)`、`add(1, 2)(3)`、`add(1)(2, 3)` 都能用。

## 核心思路

关键问题是：**怎么知道参数收够了没有？** 依据是原函数的形参个数 `fn.length`。

每次调用就把这次的参数攒起来：

- 如果攒够的参数个数 **大于等于** `fn.length`，说明齐了，直接执行原函数。
- 如果还不够，就返回一个新函数继续收，把「之前攒的」和「新传的」拼在一起，递归地接着判断。

:::info 形象记忆
把柯里化想象成 **「集卡兑奖」**。原函数 `add(a, b, c)` 就像「集齐 3 张卡换一个大奖」。`fn.length` 就是兑奖要求的「3 张」。你每次去（每次调用）能交几张就交几张，工作人员帮你把卡攒着（拼接参数）：还没集齐 3 张，就给你一张「下次再来」的小票（返回新函数）；一旦凑满 3 张，立刻给你发奖（执行原函数）。
:::

## 实现

```js
function curry(fn) {
  // 第一步：返回一个负责「收集参数」的函数 curried
  return function curried(...args) {
    // 第二步：判断已经收集到的参数够不够
    if (args.length >= fn.length) {
      // 第三步：参数齐了，直接执行原函数并返回结果
      return fn.apply(this, args);
    }

    // 第四步：参数还不够，返回新函数继续收集
    // 把「已有的 args」和「下次传进来的 rest」拼起来，再交给 curried 重新判断
    return function (...rest) {
      const mergedArgs = [...args, ...rest];
      return curried.apply(this, mergedArgs);
    };
  };
}
```

## 用法

```js
const add = (a, b, c) => a + b + c;
const curriedAdd = curry(add);

curriedAdd(1)(2)(3); // 6
curriedAdd(1, 2)(3); // 6
curriedAdd(1)(2, 3); // 6
curriedAdd(1, 2, 3); // 6
```

:::info
`fn.length` 返回函数声明里的形参个数（不含剩余参数，也不含默认值及其之后的参数）。柯里化正是靠它知道「还差几个参数」。
:::

## 一句话口诀

> **柯里化 = 攒参数集卡**：攒够 `fn.length` 个就执行，没攒够就返回新函数继续收。
