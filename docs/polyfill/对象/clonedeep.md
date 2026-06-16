---
sidebar_position: 4
sidebar_label: cloneDeep
---

# 深拷贝 cloneDeep

深拷贝要解决三件事：**递归复制每一层嵌套**、**处理循环引用** (对象自己引用自己)、**覆盖特殊类型** (Date、RegExp、Map、Set、Symbol 键)。`JSON.parse(JSON.stringify(obj))` 只够应付纯数据对象，遇到函数、`undefined`、循环引用、特殊类型就会出错，所以要会手写。

形象的例子：深拷贝就像 **临摹一幅画**。浅拷贝是把原画的画框搬过来，画布还是同一张 (改一个动全部)；深拷贝是连同每一层笔触都照着重画一张全新的画，原画和新画从此互不相干。其中循环引用就像画里画了一面镜子、镜子里又照出整幅画——临摹时得记住「这块我刚画过」，否则就会无限往里画下去。

## 最简版本

只处理普通对象和数组，先把递归思路讲清楚：

```js
function deepClone(target) {
  // 第一步：基本类型 (数字、字符串、null 等) 没有「层」，直接返回
  if (typeof target !== 'object' || target === null) {
    return target;
  }

  // 第二步：是数组就建空数组，是对象就建空对象，作为这一层的临摹结果
  const result = Array.isArray(target) ? [] : {};

  // 第三步：遍历自身属性，对每个值递归临摹下一层
  for (const key in target) {
    if (Object.hasOwn(target, key)) {
      result[key] = deepClone(target[key]);
    }
  }

  return result;
}
```

:::warning
`for...in` 会连原型链上的可枚举属性一起遍历，必须用 `Object.hasOwn` (或 `target.hasOwnProperty`) 过滤，只拷贝对象自己的属性。
:::

## 处理循环引用

对象互相引用时，朴素递归会无限套娃直到爆栈。办法是用一个 `WeakMap` 记账，缓存「已临摹过的源对象 → 对应的新对象」，再遇到同一个就直接返回缓存，把环切断：

```js
function deepClone(target, cache = new WeakMap()) {
  // 第一步：基本类型直接返回
  if (typeof target !== 'object' || target === null) {
    return target;
  }

  // 第二步：查记账本，这个对象之前临摹过就直接给出旧结果，切断循环
  if (cache.has(target)) {
    return cache.get(target);
  }

  // 第三步：建好这一层的空容器，并马上记进账本 (一定要在递归之前记)
  const result = Array.isArray(target) ? [] : {};
  cache.set(target, result);

  // 第四步：再递归临摹每个子属性
  for (const key in target) {
    if (Object.hasOwn(target, key)) {
      result[key] = deepClone(target[key], cache);
    }
  }

  return result;
}
```

:::info
用 `WeakMap` 而不是 `Map`，是因为它对键持弱引用，拷贝结束后源对象能被正常 GC，不会造成内存泄漏。
:::

## 处理特殊类型

`Date`、`RegExp` 直接 `new` 一个新实例就行，`Map`、`Set` 则要递归拷贝里面的元素：

```js
function deepClone(target, cache = new WeakMap()) {
  // 第一步：基本类型直接返回
  if (typeof target !== 'object' || target === null) {
    return target;
  }

  // 第二步：Date、RegExp 没有子层，直接造一个等价的新实例
  if (target instanceof Date) {
    return new Date(target);
  }
  if (target instanceof RegExp) {
    return new RegExp(target.source, target.flags);
  }

  // 第三步：查记账本，命中就返回旧结果，切断循环
  if (cache.has(target)) {
    return cache.get(target);
  }

  // 第四步：Map 要逐对拷贝键和值
  if (target instanceof Map) {
    const result = new Map();
    cache.set(target, result);
    target.forEach((value, key) => {
      result.set(deepClone(key, cache), deepClone(value, cache));
    });
    return result;
  }

  // 第五步：Set 要逐个拷贝元素
  if (target instanceof Set) {
    const result = new Set();
    cache.set(target, result);
    target.forEach((value) => {
      result.add(deepClone(value, cache));
    });
    return result;
  }

  // 第六步：普通对象和数组，先建容器再记账本
  const result = Array.isArray(target) ? [] : {};
  cache.set(target, result);

  // 第七步：用 Reflect.ownKeys 遍历，它能同时拿到 Symbol 键和普通键
  for (const key of Reflect.ownKeys(target)) {
    result[key] = deepClone(target[key], cache);
  }

  return result;
}
```

## 验证

```js
const obj = { a: 1, b: { c: 2 }, d: [3, 4], e: new Date() };
obj.self = obj; // 制造循环引用

const cloned = deepClone(obj);
console.log(cloned.b === obj.b); // false，嵌套对象已断开
console.log(cloned.self === cloned); // true，循环引用正确指向新对象
```

## 工程实践

生产环境直接用浏览器原生的 [`structuredClone`](https://developer.mozilla.org/en-US/docs/Web/API/Window/structuredClone)，它原生支持循环引用和大部分内置类型 (但不能拷贝函数和 DOM 节点)：

```js
const cloned = structuredClone(obj);
```

:::tip
答题时可以先点出 `structuredClone` 这个标准答案，再手写实现，既体现工程认知又展示底层能力。
:::

## 一句话口诀

> **深拷贝靠递归一层层重画，靠 `WeakMap` 记账切断循环引用，靠 `instanceof` 判断给特殊类型 (Date/RegExp/Map/Set) 单独开小灶**。
