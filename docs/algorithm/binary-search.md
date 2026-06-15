---
sidebar_position: 5
sidebar_label: 二分查找
---

# 二分查找

二分查找在**有序**数据上，每次比较中间元素，排除掉一半的搜索范围，把 `O(n)` 的线性查找降到 `O(log n)`。

思路人人都懂，但写对很难——**边界**和**循环终止条件**稍有偏差就会死循环或漏解。关键是**想清楚区间的定义，并让每一处代码都和这个定义保持一致**。

## 基础模板：查找精确值

采用「左闭右闭」区间 `[left, right]`，这是最常用、最不易错的写法：

```js
function binarySearch(nums, target) {
  let left = 0;
  let right = nums.length - 1; // 右闭，所以指向最后一个元素

  while (left <= right) {       // 闭区间，left == right 时区间仍有效，要带等号
    const mid = left + Math.floor((right - left) / 2); // 防溢出写法
    if (nums[mid] === target) {
      return mid;
    } else if (nums[mid] < target) {
      left = mid + 1;   // target 在右半，排除 mid
    } else {
      right = mid - 1;  // target 在左半，排除 mid
    }
  }

  return -1; // 没找到
}
```

:::warning
三个最容易写错的点：

1. **`mid` 计算**：用 `left + (right - left) / 2` 而非 `(left + right) / 2`，后者在大数下会整数溢出 (JS 里数字虽不溢出，但这是通用好习惯)。
2. **循环条件**：闭区间 `[left, right]` 用 `while (left <= right)`，因为 `left == right` 时区间内还有一个元素要查。
3. **指针更新**：因为已经判断过 `mid`，要 `mid + 1` / `mid - 1` 跳过它，否则区间不缩小会死循环。
:::

## 查找左右边界

当数组有重复元素，要找**第一个**或**最后一个**等于 target 的位置时，基础模板不够用。核心改动：找到 target 后**不立即返回，而是继续向一侧收缩**。

查找左边界 (第一个等于 target 的下标):

```js
function leftBound(nums, target) {
  let left = 0;
  let right = nums.length - 1;
  let res = -1;

  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);
    if (nums[mid] === target) {
      res = mid;          // 记录，但不返回
      right = mid - 1;    // 继续向左找更靠前的
    } else if (nums[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return res;
}
```

查找右边界只需把命中后的收缩方向改成 `left = mid + 1`。掌握左右边界后，「在排序数组中查找元素的第一个和最后一个位置」这类题就是它的直接应用。

## 进阶应用

二分查找的威力远不止「在数组里找数」，只要问题具备**单调性** (随某个值变化，判定结果单调地从「否」变「是」)，就能二分：

- **搜索旋转排序数组**：数组被旋转过，但任意时刻 `mid` 的左半或右半必有一半是有序的，据此判断 target 在哪半。
- **二分答案**：答案在一个有范围且单调的区间里 (如「最小的最大值」「最大的最小值」)，直接对答案值域二分，每次用一个 `check(x)` 函数判定 `x` 是否可行。常见于「分割数组的最大值」「在 D 天内送达包裹的最低运力」等题。

:::tip
判断一道题能不能二分，不要只盯着「数组有没有序」，而要问：**是否存在一个单调的判定关系**？只要「小了不行、大了就行」这种单调性成立，哪怕题面里没有有序数组，也能对答案做二分。
:::

## 小结

- 二分查找前提是**有序** (或更一般的**单调判定关系**)，复杂度 `O(log n)`。
- 写对的关键是**区间定义自洽**：推荐「左闭右闭」+ `while (left <= right)` + `mid ± 1`。
- `mid` 用 `left + (right - left) / 2` 防溢出。
- 查找左右边界：命中后不返回，继续向对应方向收缩。
- 进阶是**二分答案**：只要判定关系单调，就能对答案值域二分，这是二分查找最有威力的用法。
