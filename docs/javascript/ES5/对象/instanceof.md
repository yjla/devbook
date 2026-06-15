# 实现 instanceof 运算符



## 递归解法

```js
const _instanceof = (left, right) => {
    if (left === null || typeof left !== 'object') return false;
    const proto = Object.getPrototypeOf(left);
    return proto === right.prototype ? true : _instanceof(proto, right);
}
```



## 迭代解法

```js
const _instanceof = (left, right) => {
    if (left === null) return false;
    let proto = Object.getPrototypeOf(left);
    while (proto !== null) {
        if (proto === right.prototype) return true;
        else proto = Object.getPrototypeOf(proto);
    }
    return false;
}
```



## 参考

1. [instanceof - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/instanceof)
2. [instanceof\_牛客题霸\_牛客网](https://www.nowcoder.com/practice/a1169935fd6145899f953ba8fbccb585)
3. [90. 实现`instanceof` | BFE.dev - 前端刷题，准备前端面试拿到心仪的Offer。](https://bigfrontend.dev/zh/problem/write-your-own-instanceof)

