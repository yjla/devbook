---
sidebar_position: 4
sidebar_label: cloneDeep
---

# 深拷贝 cloneDeep

深拷贝要解决三件事：**递归复制嵌套对象**、**处理循环引用**、**覆盖特殊类型** (Date、RegExp、Map、Set、Symbol 键)。`JSON.parse(JSON.stringify(obj))` 只够应付纯数据对象，遇到函数、`undefined`、循环引用、特殊类型就会出错，所以面试要的是手写版本。

## 最简版本

只处理普通对象和数组，能讲清楚递归思路：

```js
function deepClone(target) {
  if (typeof target !== 'object' || target === null) {
    return target; // 基本类型直接返回
  }

  const result = Array.isArray(target) ? [] : {};

  for (const key in target) {
    if (Object.hasOwn(target, key)) {
      result[key] = deepClone(target[key]);
    }
  }

  return result;
}
```

:::warning
`for...in` 会遍历原型链上的可枚举属性，必须用 `Object.hasOwn` (或 `target.hasOwnProperty`) 过滤，只拷贝自身属性。
:::

## 处理循环引用

对象互相引用时，朴素递归会无限循环爆栈。用一个 `WeakMap` 缓存「已拷贝过的源对象 → 新对象」，再次遇到时直接返回缓存：

```js
function deepClone(target, cache = new WeakMap()) {
  if (typeof target !== 'object' || target === null) {
    return target;
  }

  if (cache.has(target)) {
    return cache.get(target); // 命中缓存，切断循环
  }

  const result = Array.isArray(target) ? [] : {};
  cache.set(target, result); // 先存入缓存，再递归子属性

  for (const key in target) {
    if (Object.hasOwn(target, key)) {
      result[key] = deepClone(target[key], cache);
    }
  }

  return result;
}
```

:::info
用 `WeakMap` 而不是 `Map`，是因为它对键持弱引用，拷贝结束后源对象能被正常 GC，不会内存泄漏。
:::

## 处理特殊类型

`Date`、`RegExp` 直接 `new` 一个新实例，`Map`、`Set` 需要递归拷贝元素：

```js
function deepClone(target, cache = new WeakMap()) {
  if (typeof target !== 'object' || target === null) {
    return target;
  }

  if (target instanceof Date) return new Date(target);
  if (target instanceof RegExp) return new RegExp(target.source, target.flags);

  if (cache.has(target)) {
    return cache.get(target);
  }

  if (target instanceof Map) {
    const result = new Map();
    cache.set(target, result);
    target.forEach((value, key) => {
      result.set(deepClone(key, cache), deepClone(value, cache));
    });
    return result;
  }

  if (target instanceof Set) {
    const result = new Set();
    cache.set(target, result);
    target.forEach((value) => {
      result.add(deepClone(value, cache));
    });
    return result;
  }

  const result = Array.isArray(target) ? [] : {};
  cache.set(target, result);

  // Reflect.ownKeys 能同时拿到 Symbol 键和普通键
  for (const key of Reflect.ownKeys(target)) {
    result[key] = deepClone(target[key], cache);
  }

  return result;
}
```

## 验证

```js
const obj = { a: 1, b: { c: 2 }, d: [3, 4], e: new Date() };
obj.self = obj; // 循环引用

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
面试答题时可以先点出 `structuredClone` 这个标准答案，再手写实现，既体现工程认知又展示底层能力。
:::
