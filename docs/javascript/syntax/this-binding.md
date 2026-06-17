---
sidebar_position: 2
sidebar_label: this 指向
---

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



## 箭头函数 vs 普通函数

最核心的区别一句话:**箭头函数没有自己的 `this`**,它捕获定义时所在作用域的 `this`;其余差异 (没有 `arguments`、不能 `new`、没有 `prototype`) 都由此衍生或相关。

| 维度 | 普通函数 | 箭头函数 |
|------|----------|----------|
| `this` | 取决于**调用方式** (谁调用指向谁) | 词法绑定,继承**定义时**外层的 `this` |
| `arguments` | 有 | 没有,用 rest 参数 `...args` 代替 |
| 能否 `new` | 能 (可作构造函数) | 不能 |
| `prototype` 属性 | 有 | 没有 |
| 能否作 Generator | 能 (`function*`) | 不能 |
| `new.target` / `super` | 有自己的 | 继承外层的 |

### this 的差异 (最常考)

普通函数的 `this` 在**调用时**才确定;箭头函数在**定义时**就锁定为外层的 `this`,之后怎么调用都不变。

```js
const obj = {
  name: 'obj',
  normal() {
    console.log(this.name); // 'obj'——谁调用指向谁
  },
  arrow: () => {
    console.log(this.name); // undefined——this 是定义时外层(模块/全局),不是 obj
  },
};
obj.normal();
obj.arrow();
```

这也让箭头函数特别适合**回调**:不用再 `const self = this` 或 `.bind(this)`。

```js
class Timer {
  constructor() {
    this.count = 0;
  }
  start() {
    setInterval(() => {
      this.count++; // 箭头函数捕获 start 的 this,正确指向实例
    }, 1000);
  }
}
```

如果上面用普通函数,`setInterval` 回调里的 `this` 会指向全局 (或 `undefined`),`this.count` 就错了。

### 没有 arguments

```js
function normal() {
  console.log(arguments); // 类数组,拿到所有实参
}

const arrow = (...args) => {
  console.log(args); // 箭头函数没有 arguments,用 rest
};
```

### 不能作构造函数

箭头函数没有 `prototype`、没有自己的 `this`,所以不能 `new`:

```js
const Foo = () => {};
new Foo(); // TypeError: Foo is not a constructor
```

### 怎么选

- **需要动态 `this`** 的场景用普通函数:对象方法、原型方法、构造函数、需要 `this` 指向调用者的事件处理。
- **需要固定 `this` 或写法简洁**的场景用箭头函数:回调、`map` / `filter` 等高阶函数的参数、不关心 `this` 的纯函数。

:::warning
别把对象的方法写成箭头函数 (`this` 会指向外层而非对象),也别给 `prototype` 上的方法用箭头函数——这是箭头函数最常见的误用。
:::

## 输出题

### 箭头函数 vs 普通函数

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

### 箭头函数捕获外层普通函数的 `this`

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

### 函数内嵌套普通函数：丢失绑定

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

### 赋值表达式的返回值调用

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

1. [this - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/this)
2. [this与对象原型 - 你不懂JS](https://github.com/getify/You-Dont-Know-JS/blob/1ed-zh-CN/this%20%26%20object%20prototypes/ch2.md)
3. [JavaScript 的 this 原理 - 阮一峰的网络日志](https://www.ruanyifeng.com/blog/2018/06/javascript-this.html)
4. [this、apply、call、bind - 掘金](https://juejin.cn/post/6844903496253177863)