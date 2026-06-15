# 去重



## 测试用例

```js
const a = b = function () {};
const c = d = {};
const arr = [0, 1, NaN, NaN, +0, -0, 1.0, 1, a, b, c, d, undefined, [], [], undefined];

// 期望输出
// const ouput = [0, 1, NaN, function() {}, undefined, [], []];
```



## Set 方法

```js
const deduplicate = arr => Array.from(new Set(arr));
```



## 排序方法

```js
const deduplicate = arr => {
    arr.sort();
    const result = [];
    arr.forEach((_, i) => {
        if (!Object.is(arr[i], arr[i - 1])) result.push(arr[i]);
    });
    return result;
}
```

缺点：会改变原数组中元素的顺序



## 暴力解法

```js
const deduplicate = arr => {
    const result = [];
    for (let i = 0; i < arr.length; i++) {
        let unique = true;
        for (let j = i + 1; j < arr.length; j++) {
            if (Object.is(arr[i], arr[j])) {
                unique = false;
                break;
            }
        }
        if (unique) result.push(arr[i]);
    }
    return result;
}
```

缺点：时间复杂度高



## indexOf 方法

```js
const deduplicate = arr => arr.filter((el, idx) => arr.indexOf(el) === idx);
```

缺点：会把 `NaN` 都去掉



## 参考

1. [7种方法实现数组去重 - 掘金](https://juejin.cn/post/6844903602197102605)
2. [数组去重\_牛客题霸\_牛客网](https://www.nowcoder.com/practice/7a26729a75ca4e5db49ea059b01305c9)
3. [66. 去掉数组中的重复元素 | BFE.dev - 前端刷题，准备前端面试拿到心仪的Offer。](https://bigfrontend.dev/zh/problem/remove-duplicates-from-an-array)