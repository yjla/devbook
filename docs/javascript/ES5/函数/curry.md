# Curry

```js
const curry = (fn) => {
    return function curried(...args) {
        return args.length >= fn.length ? fn.apply(this, args) : curried.bind(this, ...args);
    }
}
```



## 参考

1. [1. 实现curry() | BFE.dev - 前端刷题，准备前端面试拿到心仪的Offer。](https://bigfrontend.dev/zh/problem/implement-curry)