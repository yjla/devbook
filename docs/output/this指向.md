---
sidebar_position: 2
sidebar_label: this指向
---

# `this` 指向

:::info
`this` 的绑定规则按优先级从高到低：

1. **new 绑定**：`new Foo()`，`this` 指向新创建的对象
2. **显式绑定**：`call` / `apply` / `bind`，`this` 指向传入的对象
3. **隐式绑定**：`obj.fn()`，`this` 指向调用它的对象 `obj`
4. **默认绑定**：独立调用 `fn()`，非严格模式下 `this` 指向全局对象，严格模式下为 `undefined`

**箭头函数**不参与上述规则，它没有自己的 `this`，沿用定义时所在词法作用域的 `this`。
:::

## 箭头函数 vs 普通函数

```js
const a = 10;
const obj = {
  a: 13,
  b: () => {
    console.log(this.a);
  },
  c: function () {
    console.log(this.a);
  },
  d: function () {
    return () => {
      console.log(this);
    };
  },
  e: function () {
    return this.b;
  },
};

obj.b(); // 10
obj.c(); // 13
obj.d()(); // obj
obj.e()(); // 10
```

- `obj.b()`：`b` 是箭头函数，`this` 沿用定义时的外层作用域。这里 `obj` 字面量不构成函数作用域，外层是模块/全局，`this.a` 取到 `10`
- `obj.c()`：普通函数，隐式绑定，`this` 指向 `obj`，输出 `13`
- `obj.d()()`：`d` 是普通函数被 `obj.d()` 调用，`this` 是 `obj`；返回的箭头函数沿用 `d` 的 `this`，所以打印 `obj`
- `obj.e()()`：`e` 返回 `obj.b` 这个函数引用，再以 `()` 独立调用，`b` 又是箭头函数，沿用全局 `this`，输出 `10`

:::warning
顶层 `const a = 10` 不会成为全局对象的属性 (`window.a` 是 `undefined`)。这里能取到 `10`，是因为 ES 模块/普通脚本顶层的 `this.a` 实际取的是同作用域的全局变量 `a`。如果换成严格模式独立函数，`this` 是 `undefined`，会直接报错。
:::

## 箭头函数捕获外层普通函数的 `this`

```js
let obj = {
  name: 'Tyler',
  a: function () {
    let name = 'Anderson';
    let test = () => {
      console.log(this.name);
    };
    test();
  },
};
obj.a(); // 'Tyler'
```

`obj.a()` 隐式绑定，`a` 内的 `this` 是 `obj`。箭头函数 `test` 沿用 `a` 的 `this`，所以 `this.name` 是 `'Tyler'`，与局部变量 `name = 'Anderson'` 无关。`this.name` 永远走对象属性，不会读到函数内的局部变量。

## 函数内嵌套普通函数：丢失绑定

```js
var name = '123';
var obj = {
  name: '456',
  getName: function () {
    function printName() {
      console.log(this.name);
    }
    printName();
  },
};

obj.getName(); // '123'
```

`printName()` 是独立调用，触发默认绑定，`this` 指向全局对象。`var name = '123'` 会挂到全局对象上，所以输出 `'123'`，而不是 `'456'`。

:::tip
内层普通函数无论嵌套多深，只要是 `fn()` 这样独立调用，`this` 就回到默认绑定。想保留外层 `this`，要么用箭头函数，要么 `const self = this` 缓存。
:::

## 赋值表达式的返回值调用

```js
function foo() {
  console.log(this.a);
}

var a = 2;
var o = { a: 3, foo: foo };
var p = { a: 4 };

o.foo(); // 3
(p.foo = o.foo)(); // 2
```

- `o.foo()`：隐式绑定，`this` 是 `o`，输出 `3`
- `(p.foo = o.foo)()`：赋值表达式 `p.foo = o.foo` 的**返回值是函数本身**，而非 `p.foo`。紧接着 `()` 是对这个返回值的独立调用，触发默认绑定，`this` 指向全局，输出 `2`

:::warning
关键点：赋值表达式的值是被赋的那个值 (函数引用)，不是 `p.foo`。所以这是独立调用，不是 `p.foo()`。
:::

## 参考

- [JavaScript 的 this 原理 —— 阮一峰](http://www.ruanyifeng.com/blog/2018/06/javascript-this.html)
