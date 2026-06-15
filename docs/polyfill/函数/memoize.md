---
sidebar_position: 6
sidebar_label: memoize
---

# memoize 缓存

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

## 一句话口诀

> **memoize**：`Map` 以参数为 key 缓存结果（仅限纯函数）。
