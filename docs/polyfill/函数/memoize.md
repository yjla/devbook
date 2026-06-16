---
sidebar_position: 6
sidebar_label: memoize
---

# memoize 缓存

`memoize` 包装一个函数，**相同参数第二次调用时直接返回上次的结果，不重复计算**。适合开销大的纯函数，比如递归斐波那契、复杂数值计算。

核心思路：用一个 `Map` 把「参数」当 key、「结果」当 value 存起来，每次先查缓存再决定要不要算。

```js
function memoize(fn) {
  // 第一步：建一个缓存仓库，用闭包保存
  const cache = new Map();

  // 第二步：返回包装后的新函数
  return function (...args) {
    // 第三步：把这次的参数序列化成一个字符串当缓存的 key
    const key = JSON.stringify(args);

    // 第四步：命中缓存就直接返回，不再调用 fn
    if (cache.has(key)) {
      return cache.get(key);
    }

    // 第五步：没命中才真正计算，this 透传给 fn
    const result = fn.apply(this, args);

    // 第六步：把结果存进缓存，下次同参数就能直接取
    cache.set(key, result);

    return result;
  };
}

const slowSquare = (n) => {
  console.log("正在计算", n);
  return n * n;
};
const fastSquare = memoize(slowSquare);

fastSquare(4); // 打印「正在计算 4」，返回 16
fastSquare(4); // 不打印，直接返回 16
fastSquare(5); // 打印「正在计算 5」，返回 25
```

:::tip 形象记忆
像 **餐厅的菜单照片**：第一次有人点「番茄炒蛋」，后厨现做、顺手拍张照贴墙上（计算并存进 `cache`）；下次再有人点同一道菜，服务员看墙上照片就知道长啥样，不用再让后厨重做（命中缓存）。参数就是「菜名」，结果就是「那张照片」。
:::

:::warning
用 `JSON.stringify(args)` 当 key 只适合参数是简单值的场景：函数、`undefined`、循环引用都序列化不了，对象属性顺序不同还会被算成不同的 key。所以 memoize 只适合缓存**纯函数**——同样的输入必定得到同样的输出，否则会拿到过期的错误缓存。
:::
