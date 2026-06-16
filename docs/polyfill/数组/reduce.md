---
sidebar_position: 3
sidebar_label: reduce
---

# Array.prototype.reduce

`reduce` 是 `map` / `filter` 的「母方法」，先把它写出来。要点：**没传初始值时，用第一个元素当初始值、从第二个开始遍历**。

```js
Array.prototype.myReduce = function (fn, initialValue) {
  // 第一步：约定累加器 acc 和起始下标 startIndex
  let acc = initialValue;
  let startIndex = 0;

  // 第二步：处理「没传初始值」的情况
  //         此时拿第一个元素当累加起点，遍历从第二个开始
  if (acc === undefined) {
    acc = this[0];
    startIndex = 1;
  }

  // 第三步：从起始下标开始遍历，每一步把回调的返回值更新到 acc 上
  for (let i = startIndex; i < this.length; i++) {
    acc = fn(acc, this[i], i, this); // (累加器, 当前值, 下标, 原数组)
  }

  // 第四步：返回最终攒下来的累加器
  return acc;
};
```

:::info 形象记忆
把 `reduce` 想成 **「滚雪球下山」**：`acc` 是手里的雪球，从山顶往下滚（遍历），每经过一个元素就把它沾到雪球上、雪球越滚越大，到山脚得到最终那一个结果。`initialValue` 就是你最开始捏的那颗雪核；要是没给雪核，那就**捡起第一个元素当雪核**，从第二个开始滚。
:::

## 用 reduce 实现 map / filter

`map` 和 `filter` 本质都是「遍历 + 累加成新数组」，所以都能用 `reduce` 表达：

```js
// map：每个元素经 fn 变换后，无条件收进新数组
function map(arr, fn) {
  return arr.reduce((acc, cur, i) => {
    // 把变换后的值追加到累加数组末尾
    return [...acc, fn(cur, i)];
  }, []);
}

// filter：满足条件的才收进新数组，不满足就原样把累加器传下去
function filter(arr, fn) {
  return arr.reduce((acc, cur, i) => {
    if (fn(cur, i)) {
      return [...acc, cur];
    }
    return acc;
  }, []);
}
```

:::tip
看懂这层关系很有用：`map` = 无条件收变换后的值，`filter` = 有条件收原值。理解了 `reduce` 能模拟二者，就抓住了「`reduce` 是最通用的遍历」这个本质。
:::
