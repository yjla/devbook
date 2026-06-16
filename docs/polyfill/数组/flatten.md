---
sidebar_position: 4
sidebar_label: flatten
---

# 数组扁平化 flatten

把任意嵌套的数组「拍平」成一维数组，比如 `[1, [2, [3, [4]]]]` → `[1, 2, 3, 4]`。

思路：遍历每个元素，**是数组就递归拍平再拼接，不是数组就直接收**。

```js
function flatten(arr) {
  // 第一步：用 reduce 一边遍历一边把结果攒进 result，起点是空数组
  return arr.reduce((result, item) => {
    // 第二步：判断当前元素是不是数组
    if (Array.isArray(item)) {
      // 第三步：是数组就先递归拍平它，再拼到结果后面
      return result.concat(flatten(item));
    }
    // 第四步：不是数组就直接收进结果
    return result.concat(item);
  }, []);
}

flatten([1, [2, [3, [4]]]]); // [1, 2, 3, 4]
```

:::info 形象记忆
把嵌套数组想成 **「俄罗斯套娃」**：你想把所有娃娃排成一排。拿起一个，如果它里面还套着小娃娃（是数组），就先把它**拆开**（递归 `flatten`）再排队；如果它是实心的最小娃娃（不是数组），就直接放进队伍。一直拆到没得拆为止，最后所有娃娃都平铺在一条线上。
:::

如果只想拍平**指定层数**，用一个 `depth` 控制递归深度：

```js
function flatten(arr, depth = Infinity) {
  // 第一步：深度用完了就不再往下拆，直接返回当前这层的副本
  if (depth < 1) {
    return arr.slice();
  }

  // 第二步：和上面一样遍历，但递归时把深度减 1
  return arr.reduce((result, item) => {
    if (Array.isArray(item)) {
      return result.concat(flatten(item, depth - 1));
    }
    return result.concat(item);
  }, []);
}
```

:::tip
工程里直接用原生 `arr.flat(Infinity)` 即可。手写题问的是「不用 `flat` 怎么实现」，递归 + `reduce` 是最好记的答案。
:::

## 一句话口诀

> **扁平化**：`reduce` 遍历，是数组就递归拍平再 `concat`，否则直接收。
