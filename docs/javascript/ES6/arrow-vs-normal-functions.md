---
sidebar_label: 箭头函数 vs 普通函数
---

# 箭头函数 vs 普通函数

最核心的区别一句话:**箭头函数没有自己的 `this`**,它捕获定义时所在作用域的 `this`;其余差异 (没有 `arguments`、不能 `new`、没有 `prototype`) 都是由此衍生或相关的限制。

| 维度 | 普通函数 | 箭头函数 |
|------|----------|----------|
| `this` | 取决于**调用方式** (谁调用指向谁) | 词法绑定,继承**定义时**外层的 `this` |
| `arguments` | 有 | 没有,用 rest 参数 `...args` 代替 |
| 能否 `new` | 能 (可作构造函数) | 不能 |
| `prototype` 属性 | 有 | 没有 |
| 能否作 Generator | 能 (`function*`) | 不能 |
| `new.target` / `super` | 有自己的 | 继承外层的 |

## this 的差异 (最常考)

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

## 没有 arguments

```js
function normal() {
  console.log(arguments); // 类数组,拿到所有实参
}

const arrow = (...args) => {
  console.log(args); // 箭头函数没有 arguments,用 rest
};
```

## 不能作构造函数

箭头函数没有 `prototype`、没有自己的 `this`,所以不能 `new`:

```js
const Foo = () => {};
new Foo(); // TypeError: Foo is not a constructor
```

## 怎么选

- **需要动态 `this`** 的场景用普通函数:对象方法、原型方法、构造函数、需要 `this` 指向调用者的事件处理。
- **需要固定 `this` 或写法简洁**的场景用箭头函数:回调、`map`/`filter` 等高阶函数的参数、不关心 `this` 的纯函数。

:::warning
别把对象的方法写成箭头函数 (`this` 会指向外层而非对象),也别给 `prototype` 上的方法用箭头函数。这是箭头函数最常见的误用。`this` 规则详见 [this 指向](../execution/this-binding)。
:::

## 一句话口诀

> **箭头函数无自己的 `this`/`arguments`/`prototype`,不能 `new`、不能当 Generator**;`this` 在定义时按词法捕获外层。要动态 `this` 用普通函数,要固定 `this` 或图简洁用箭头。
