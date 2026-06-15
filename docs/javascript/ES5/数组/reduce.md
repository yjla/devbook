# Array.prototype.reduce

```js
Array.prototype._reduce = function (callback, init) {
  if ((arguments.length === 1) && this.length === 0) throw new Error();
  const index = arguments.length === 1 ? 1 : 0;
  let result = arguments.length === 1 ? this[0] : init;

  for (let i = index; i < this.length; i++) {
    result = callback(result, this[i], i, this);
  }

  return result;
}
```



## 参考

1. [Array.prototype.reduce() - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce)
2. [146. 实现Array.prototype.reduce() | BFE.dev - 前端刷题，准备前端面试拿到心仪的Offer。](https://bigfrontend.dev/zh/problem/implement-Array-prototype-reduce)
3. [Array.reduce\_牛客题霸\_牛客网](https://www.nowcoder.com/practice/213d0ef21cb841de8cf69fcc5ea60eb6)