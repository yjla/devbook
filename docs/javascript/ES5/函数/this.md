# this







### 实现 Function.prototype.call

```js
Function.prototype._call = function(context, ...args) {
  context = Object(context || window);
  const fn = Symbol();
  context[fn] = this;
  const result = context[fn](...args);
  delete context[fn];
  return result;
}
```



### 实现 Function.prototype.apply

```js
Function.prototype._apply = function(context, ...args) {
  context = Object(context || window);
  const fn = Symbol();
  context[fn] = this;
  const result = context[fn](args);
  delete context[fn];
  return result;
}
```



### 实现 Function.prototype.bind

```js
Function.prototype._bind = function(context, ...args) {
  return (...newArgs) => this.apply(context, [...args, ...newArgs]);
};
```



## 参考

1. [手写call、apply、bind实现及详解 - 掘金](https://juejin.cn/post/6844903773979033614)
2. [61. 实现`Function.prototype.call` | BFE.dev - 前端刷题，准备前端面试拿到心仪的Offer。](https://bigfrontend.dev/zh/problem/create-call-method)