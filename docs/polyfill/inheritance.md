---
sidebar_position: 7
sidebar_label: 继承
---

# 继承

继承要解决两件事：**子类能拿到父类的属性**（实例属性各自独立），**子类能用父类原型上的方法**（方法共享、不重复创建）。JS 继承的演进史，就是一步步把这两点都做对的过程。

## 几种方案的演进

### 原型链继承：方法能继承，但属性被共享

```js
function Parent() {
  this.hobbies = ['读书'];
}
Parent.prototype.say = function () { console.log('hi'); };

function Child() {}
Child.prototype = new Parent(); // 子类原型 = 父类实例
```

**问题**：所有子类实例**共用同一个父类实例**，引用类型属性（`hobbies`）一改全改。

```js
const a = new Child(), b = new Child();
a.hobbies.push('打球');
b.hobbies; // ['读书', '打球'] —— 被连累了
```

### 借用构造函数：属性独立，但方法不能继承

```js
function Child() {
  Parent.call(this); // 在子类里执行父类构造函数，属性变成自己的
}
```

属性问题解决了，但父类**原型上的方法继承不到**（只 call 了构造函数，没接上原型）。

### 组合继承：两者结合（常见但有小瑕疵）

```js
function Child() {
  Parent.call(this); // 第二次调用 Parent，拿到独立属性
}
Child.prototype = new Parent(); // 第一次调用 Parent，接上原型方法
Child.prototype.constructor = Child;
```

能用，但 **`Parent` 被调用了两次**，子类原型上残留一份用不到的父类属性，有浪费。

### 寄生组合继承：最优解

把「接原型」那步从 `new Parent()` 换成 `Object.create(Parent.prototype)`——只继承原型、不调用父类构造函数，避免重复执行。

```js
function inherit(Child, Parent) {
  // 只拿父类原型，不执行父类构造函数
  Child.prototype = Object.create(Parent.prototype);
  Child.prototype.constructor = Child; // 修正 constructor 指向
}

function Parent(name) {
  this.name = name;
  this.hobbies = ['读书'];
}
Parent.prototype.say = function () { console.log(this.name); };

function Child(name, age) {
  Parent.call(this, name); // 属性独立
  this.age = age;
}
inherit(Child, Parent); // 方法继承，且 Parent 只在 new 实例时被调一次
Child.prototype.study = function () { console.log('study'); };
```

:::tip
寄生组合继承是 ES6 之前的「标准答案」。关键就一句：**用 `Object.create(Parent.prototype)` 接原型**，避免组合继承里多余的那次父类构造函数调用。
:::

## ES6 class extends（语法糖）

`class` + `extends` 底层就是寄生组合继承，但写法清爽得多。

```js
class Parent {
  constructor(name) {
    this.name = name;
    this.hobbies = ['读书'];
  }
  say() { console.log(this.name); }
}

class Child extends Parent {
  constructor(name, age) {
    super(name); // 相当于 Parent.call(this, name)，必须在用 this 之前调用
    this.age = age;
  }
  study() { console.log('study'); }
}
```

:::warning
`super(name)` 必须在子类构造函数里**先于 `this` 调用**——因为子类的 `this` 要靠父类构造函数初始化出来，不先 `super` 就用 `this` 会直接报错。这是 `class` 和寄生组合继承在语义上的一个重要区别。
:::

## 一句话口诀

> **属性靠 `Parent.call(this)` 拿（各自独立），方法靠 `Object.create(Parent.prototype)` 接（共享不重复）**——这就是寄生组合继承。ES6 的 `class extends` 是它的语法糖，`super()` 要先于 `this`。
