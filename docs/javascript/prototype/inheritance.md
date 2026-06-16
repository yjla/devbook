---
sidebar_label: 继承
sidebar_position: 2
---

# 继承

继承的目标是：让子类既拿到父类的 **属性**（如 `name`），又能复用父类原型上的 **方法**（如 `sayName`）。

ES6 之前没有 `class`，开发者靠原型链拼出继承。下面是一部「不断填坑」的演进史：每一种方案都解决了上一种的某个缺点，又暴露出新问题，直到 **寄生组合继承** 收敛成最优解——也就是 `class extends` 的底层。

贯穿全篇的父类如下：

```js
function Parent(name) {
  this.name = name;
  this.hobbies = ["reading"]; // 故意放一个引用类型，用来暴露「共享」问题
}
Parent.prototype.sayName = function () {
  return this.name;
};
```

## 1. 原型链继承

思路：把 **父类的实例** 当作子类的原型。

```js
function Child() {}

// 关键一步：子类原型 = 父类实例，于是子类实例能沿原型链访问父类属性和方法
Child.prototype = new Parent("parent");

const c1 = new Child();
c1.sayName(); // 'parent'，方法继承到了
```

缺点：

- **引用类型属性被所有实例共享**。`hobbies` 现在挂在「父类实例」这个唯一的原型上，所有子类实例共用它，一个改了大家都变。
- **创建子类实例时无法向父类传参**。

```js
const c1 = new Child();
const c2 = new Child();
c1.hobbies.push("coding");
c2.hobbies; // ['reading', 'coding']，c2 被连累了
```

## 2. 借用构造函数

思路：在子类构造函数里用 `call` **借用** 父类构造函数，把父类的属性复制一份到子类实例上。

```js
function Child(name) {
  // 关键一步：以子类实例为 this 执行父类构造函数，name 顺手传进去
  Parent.call(this, name);
}

const c1 = new Child("a");
const c2 = new Child("b");
c1.hobbies.push("coding");
c2.hobbies; // ['reading']，各自独立，互不影响
```

解决了 **共享问题** 和 **传参问题**。但又有新缺点：

- 父类原型上的方法继承不到。`sayName` 在 `Parent.prototype` 上，而这里只是 `call` 了构造函数，没碰原型。

```js
c1.sayName(); // TypeError: c1.sayName is not a function
```

- 如果把方法都写进父类构造函数里来规避这点，那每个实例都会复制一份方法，**无法复用**。

## 3. 组合继承

思路：取前两者之长——用 `call` 拿属性（独立、可传参），用原型链拿方法（可复用）。这是 ES6 之前最经典常用的方案。

```js
function Child(name, age) {
  Parent.call(this, name); // 第一次调用父类：拿到独立的属性
  this.age = age;
}

// 用父类实例做子类原型：拿到原型上的方法
Child.prototype = new Parent(); // 第二次调用父类
Child.prototype.constructor = Child; // 修正 constructor 指向

const c1 = new Child("a", 18);
c1.sayName(); // 'a'，方法有了
c1.hobbies.push("coding");
new Child("b").hobbies; // ['reading']，属性也独立了
```

缺点：

- **父类构造函数被调用了两次**（`Parent.call` 一次，`new Parent()` 一次）。第二次调用在子类原型上留下了一份 `name`、`hobbies` 等多余属性，只是恰好被实例自身的同名属性遮住，没暴露出来而已，但确实浪费且不干净。

## 4. 原型式继承

思路：不借助构造函数，直接以一个 **对象** 为原型造新对象。这正是 `Object.create` 做的事。

```js
const parent = { name: "parent", hobbies: ["reading"] };

// 以 parent 为原型造一个新对象
const child = Object.create(parent);
child.name; // 'parent'，沿原型链找到
```

缺点：和「原型链继承」一样——引用类型属性在原型上被所有派生对象共享，且无法传参。适合「基于一个已有对象造个相似对象」的轻量场景，不适合做完整的类型继承。

## 5. 寄生式继承

思路：在原型式继承的基础上，**包一层工厂函数**，在返回对象前给它增强一些属性或方法。

```js
function createChild(original) {
  const clone = Object.create(original); // 第一步：以 original 为原型造对象
  clone.sayHi = function () {
    // 第二步：增强它
    return "hi";
  };
  return clone;
}

const child = createChild({ name: "parent" });
child.sayHi(); // 'hi'
```

缺点：增强用的方法是在工厂里现加的，**每个对象都会复制一份，无法复用**——和「借用构造函数」的毛病同源。

## 6. 寄生组合继承（最优解）

思路：组合继承唯一的问题是「为了拿父类原型上的方法，多 `new` 了一次父类」。其实我们要的只是「一个以 `Parent.prototype` 为原型的对象」，根本不需要去 `new Parent()`。用 `Object.create(Parent.prototype)` 直接造这个对象即可，避免第二次调用父类构造函数。

```js
function Child(name, age) {
  Parent.call(this, name); // 唯一一次调用父类：拿独立属性
  this.age = age;
}

// 关键一步：用 Object.create(Parent.prototype) 做子类原型
// 它的原型正是 Parent.prototype，能拿到父类方法，又没有 new Parent()
Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child; // 修正 constructor

const c1 = new Child("a", 18);
c1.sayName(); // 'a'
```

这是所有方案里最干净的：属性独立、方法可复用、父类构造函数只调用一次。**ES6 的 `class extends` 在底层就等价于这套逻辑**。

## 方案对比

| 方案 | 属性独立 | 方法可复用 | 能传参 | 父类构造调用次数 | 备注 |
|------|:---:|:---:|:---:|:---:|------|
| 原型链继承 | ❌ 引用类型共享 | ✅ | ❌ | — | 最早的拼法 |
| 借用构造函数 | ✅ | ❌ | ✅ | 1 | 拿不到原型方法 |
| 组合继承 | ✅ | ✅ | ✅ | 2 | 经典，但有多余属性 |
| 原型式继承 | ❌ 引用类型共享 | ✅ | ❌ | — | 轻量克隆对象 |
| 寄生式继承 | ❌ | ❌ | ❌ | — | 工厂增强 |
| **寄生组合继承** | ✅ | ✅ | ✅ | **1** | **最优解，class 底层** |

理解了寄生组合继承，就理解了 `class extends` 在做什么。下一篇看 ES6 怎么把这套逻辑包成语法糖。

## 参考

1. [JavaScript 中的继承 - MDN](https://developer.mozilla.org/zh-CN/docs/Learn/JavaScript/Objects/Classes_in_JavaScript)
2. [对象的继承 - JavaScript 教程 - 网道](https://wangdoc.com/javascript/oop/prototype.html#%E5%A4%9A%E9%87%8D%E7%BB%A7%E6%89%BF)
3. [JavaScript 常用八种继承方案 - 掘金](https://juejin.cn/post/6844903696111763470)
