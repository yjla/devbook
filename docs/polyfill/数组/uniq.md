---
sidebar_position: 5
sidebar_label: uniq
---

# 数组去重 uniq

三种写法，从简到繁，三条思路各不相同。

```js
// 写法 1：Set 最简洁，工程首选
// Set 天生不存重复值，塞进去再用展开运算符摊回数组即可
function unique(arr) {
  return [...new Set(arr)];
}
```

```js
// 写法 2：filter + indexOf，只保留「第一次出现」的元素
function unique(arr) {
  return arr.filter((item, i) => {
    // indexOf 返回该值第一次出现的下标
    // 如果它等于当前下标 i，说明现在这个就是「第一次」，留下
    // 不相等说明前面已经出现过了，是重复项，丢掉
    return arr.indexOf(item) === i;
  });
}
```

```js
// 写法 3：reduce，累加器里没有才放进去
function unique(arr) {
  return arr.reduce((acc, cur) => {
    // 第一步：检查累加结果里是否已经有这个值
    if (acc.includes(cur)) {
      // 已经有了，原样返回累加器，相当于跳过
      return acc;
    }
    // 第二步：没有才追加进去
    return [...acc, cur];
  }, []);
}
```

:::info 形象记忆
去重就像 **「夜店门口的保安记脸」**：每来一个人，保安都看一眼名单——没见过的脸放进去并记下来，见过的直接拦在门外。`Set` 是自带超强记忆的保安（天生不收重复）；`filter + indexOf` 是「只认第一次进门的人」；`reduce` 则是保安手里那张边走边记的名单。
:::

:::info
`indexOf` / `includes` 都是按 `===` 比较，所以能去重基本类型，但**去不了对象**（两个内容相同的对象 `!==`）。`Set` 同理。要按内容给对象去重，得自己定义「键」（比如 `JSON.stringify` 或某个 `id` 字段）再用 `Map` 记录。
:::
