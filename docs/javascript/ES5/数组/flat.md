# 扁平化



## 测试用例

```js
const arr = [1, 2, ['a', 'b', ['中', '文', [1, 2, 3, [11, 21, 31]]]], 3, {a: {b: 2}}];
console.log(flat(arr));
```



## ES6 方法

```js
const flat = arr => arr.flat(Infinity);
```



## reduce 方法

```js
const flat = arr => arr.reduce((prev, curr) => prev.concat(Array.isArray(curr) ? flat(curr): curr), []);
```

指定展开的结构深度：

```js
const flat = (arr, depth = 1) =>
  depth ? arr.reduce((prev, curr) =>
    prev.concat(Array.isArray(curr) ? flat(curr, depth - 1) : arr), []) : arr;
```



## 栈方法

```js
const flat = function (arr) {
    const result = [];
    const stack = [...arr];
    while (stack.length) {
        const el = stack.shift();
        if (Array.isArray(el)) {
            stack.unshift(...el);
        } else {
            result.push(el);
        }
    }
    return result;
};
```



## 参考

1. [3. 实现Array.prototype.flat() | BFE.dev - 前端刷题，准备前端面试拿到心仪的Offer。](https://bigfrontend.dev/zh/problem/implement-Array-prototype.flat)
2. [js5种方式实现数组扁平化](https://www.cnblogs.com/chenhuichao/p/13564682.html)



