# 实现 new 运算符

```js
const _new = (constructor, ...args) => {
  const newObj = Object.create(constructor.prototype);
  const result = constructor.apply(newObj, args);
  return result instanceof Object ? result : newObj;
}
```



## 参考

1. [new 运算符 - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/new)
2. [实现new操作符\_牛客题霸\_牛客网](https://www.nowcoder.com/practice/71c2aff7cb6641099aa17d56157a91b9)
3. [60. 实现自己的`new` | BFE.dev - 前端刷题，准备前端面试拿到心仪的Offer。](https://bigfrontend.dev/zh/problem/create-your-own-new-operator)