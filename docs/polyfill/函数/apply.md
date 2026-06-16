---
sidebar_position: 2
sidebar_label: apply
---

# apply

`apply` 的作用和 [`call`](./call.md) 完全一样——**改变 `this` 指向并立即执行**，唯一的区别是：**参数用一个数组一次性传进去**。

## 核心思路

思路和 `call` 一模一样：**把函数临时挂到目标对象上当方法调用**，调用完删掉。区别仅仅是接收参数时，`call` 收的是散开的多个参数，`apply` 收的是一个数组，调用时再用展开运算符 `...` 把数组摊开传给函数。

:::info 形象记忆
还是「借别人家厨房做饭」那个场景，`apply` 和 `call` 是同一个厨子、同一套流程，只是 **食材的打包方式不同**：`call` 是把葱、姜、蒜一样一样递给你（`fn(a, b, c)`），`apply` 是把它们装进一个菜篮子一起递给你（`fn([a, b, c])`），厨子拿到篮子后自己再一样样取出来用。
:::

## 实现

```js
Function.prototype.myApply = function (context, args) {
  // 第一步：处理 context。传 null/undefined 时，this 应指向全局对象
  if (context === null || context === undefined) {
    context = globalThis;
  }

  // 第二步：兜底参数。apply 可以不传第二个参数，此时当作空数组处理
  if (args === undefined || args === null) {
    args = [];
  }

  // 第三步：用 Symbol 造一个独一无二的 key，避免覆盖已有属性
  const fnKey = Symbol('fn');

  // 第四步：把当前函数挂到 context 上
  context[fnKey] = this;

  // 第五步：作为 context 的方法调用，并把数组摊开成一个个参数传进去
  const result = context[fnKey](...args);

  // 第六步：清理临时属性
  delete context[fnKey];

  // 第七步：返回执行结果
  return result;
};
```

## 用法

```js
function sum(a, b, c) {
  return a + b + c + ' by ' + this.name;
}

const user = { name: '小美' };

sum.myApply(user, [1, 2, 3]); // "6 by 小美"
```

## 一句话口诀

> **apply = call 的「数组传参」版**：参数装进一个篮子传，其余逻辑一致，立即执行。
