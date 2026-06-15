# Array.prototype.map

```js
Array.prototype._map = function (callback, thisArg) {
    if (typeof callback !== 'function') return;
    const result = [];
    const len = this.length;
    for (let i = 0; i < len; i++) {
        if (i in this) result[i] = callback.call(thisArg, this[i], i, this);
    }
    return result;
}
```



## 参考

1. [Array.prototype.map() - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/map#polyfill)
2. [151. 实现Array.prototype.map() | BFE.dev - 前端刷题，准备前端面试拿到心仪的Offer。](https://bigfrontend.dev/zh/problem/implement-Array-prototype-map)
3. [Array.map\_牛客题霸\_牛客网](https://www.nowcoder.com/practice/8300c998180c4ebbbd2a5aaeb7fbc77c)