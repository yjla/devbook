# this指向

`this` 通常被用于函数内部，是在函数被调用时建立的一个绑定，指向函数在调用位置（call-site）被调用时的环境对象

- 默认绑定：函数在调用位置被直接的，毫无修饰的调用。这时，`this` 指向全局对象，严格模式下为 `undefined`
- 隐式绑定：函数在调用位置被一个对象所引用。这时，`this` 指向这个对象。需要注意的是，隐式绑定可能会出现丢失现象，即退回到默认绑定。
- 显示绑定：使用 `call()`，`apply()`，`bind()` 这几种方法改变 `this` 的指向
- `new` 绑定：函数在调用位置作为构造函数使用。这时，`this` 指向构造出来的实例对象



## call、apply、bind的区别

- `call` 和 `apply` 的区别只在传入的参数不同。` call` 接受的是参数序列，而 `apply` 接收的是一个包含多个参数的数组。
- `bind` 接受的也是参数序列，和 `call` 的区别是，该方法返回一个新的函数，不会立即调用。



## 优先级

`new` 绑定 > 显示绑定 > 隐式绑定 > 默认绑定



## 箭头函数

箭头函数没有自己的 `this`，它的 `this` 被设置为封闭的词法环境，也就是从作用域链的上一层继承 `this`



## 参考

1. [this - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/this)
2. [this与对象原型 - 你不懂JS](https://github.com/getify/You-Dont-Know-JS/blob/1ed-zh-CN/this%20%26%20object%20prototypes/ch2.md)
3. [JavaScript 的 this 原理 - 阮一峰的网络日志](https://www.ruanyifeng.com/blog/2018/06/javascript-this.html)
4. [this、apply、call、bind - 掘金](https://juejin.cn/post/6844903496253177863)