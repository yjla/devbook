---
sidebar_label: Class 与 extends
sidebar_position: 4
---

# Class 与 extends

`class` 是 **寄生组合继承的语法糖**。它没有引入新的对象模型，底层仍是原型链——只是把「定义构造函数、把方法挂原型、用 `Object.create` 接父类原型」这套繁琐拼装写成了更易读的形式。同时它补了几条更严格的规则，避免误用。

## 基本写法

```js
class Person {
  // constructor 就是构造函数体，new 的时候执行，负责初始化实例属性
  constructor(name) {
    this.name = name;
  }

  // 方法定义在 Person.prototype 上，所有实例共享，不会每个实例复制一份
  sayName() {
    return this.name;
  }
}

const p = new Person("Tom");
p.sayName(); // 'Tom'

// 验证：方法确实在原型上
Object.getPrototypeOf(p) === Person.prototype; // true
p.hasOwnProperty("sayName"); // false，方法不在实例自身上
```

## extends 与 super

`extends` 建立继承，`super` 是连接父子的桥：

- `super(...)` 在子类 `constructor` 里调用，对应寄生组合继承里的 `Parent.call(this, ...)`，负责让父类初始化 `this` 上的属性。
- `super.method()` 调用父类原型上的方法。
- **子类构造函数里必须先调用 `super()`，才能使用 `this`**。因为子类自己不创建 `this`，`this` 是由父类构造逻辑产出后交给子类的，没 `super()` 就没有 `this` 可用。

```js
class Animal {
  constructor(name) {
    this.name = name;
  }
  speak() {
    return this.name + " makes a sound";
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name); // 第一步：先调父类构造，拿到带 name 的 this
    this.breed = breed; // 第二步：super 之后才能碰 this
  }
  speak() {
    // super.speak() 调父类原型上的同名方法，再做增强
    return super.speak() + " (woof)";
  }
}

const d = new Dog("Rex", "Husky");
d.speak(); // 'Rex makes a sound (woof)'
```

## 它等价于寄生组合继承

把上面的 `class` 翻译回 ES5，就是上一篇的「寄生组合继承」：

```js
function Animal(name) {
  this.name = name;
}
Animal.prototype.speak = function () {
  return this.name + " makes a sound";
};

function Dog(name, breed) {
  Animal.call(this, name); // ← super(name)
  this.breed = breed;
}

// ← class 自动做的：子类原型 = Object.create(父类原型)
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

Dog.prototype.speak = function () {
  return Animal.prototype.speak.call(this) + " (woof)"; // ← super.speak()
};
```

:::info
`class` 还多连了一条 ES5 拼不出来的链：`Object.getPrototypeOf(Dog) === Animal` 为 `true`，即子类构造函数本身的原型指向父类构造函数，从而能继承父类的 **静态方法**（`static`）。这是 `class` 比手写寄生组合继承更完整的地方。
:::

## 与函数构造的差异

`class` 不只是好看，它对一些容易出错的用法直接报错或禁止：

- **不提升**。函数声明会提升，`class` 声明不会——必须先定义后使用，否则进入「暂时性死区」抛 `ReferenceError`。
- **内部是严格模式**。`class` 体内的代码默认 `"use strict"`，不写也生效。
- **必须用 `new` 调用**。直接 `Person()` 当普通函数调会抛 `TypeError`，避免漏写 `new` 导致 `this` 指向全局的经典坑。
- **原型方法不可枚举**。`class` 里定义的方法 `enumerable` 为 `false`，`for...in` 遍历实例时不会冒出方法名；而手动挂在 `prototype` 上的方法默认可枚举。

```js
console.log(p); // 假设 p = new Person('Tom')
for (const k in p) {
  console.log(k); // 只打印 'name'，sayName 不会出现
}
```

:::tip 形象记忆
`class` 像 **宜家的成品家具**：寄生组合继承是一堆零件加说明书，你得自己拧螺丝（`call`、`Object.create`、修 `constructor`），少拧一颗就晃。`class` 把这些零件预装好了，你只管用；它还在边上贴了「必须按说明组装」的警告（必须 `new`、必须先 `super()`），不让你乱来。
:::

## 参考

1. [类 - MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Classes)
2. [Class 的继承 - ECMAScript 6 入门 - 阮一峰](https://es6.ruanyifeng.com/#docs/class-extends)
