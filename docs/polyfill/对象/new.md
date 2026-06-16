---
sidebar_position: 1
sidebar_label: new
---

# 手写 new

`new` 做的事就一句话：**新建一个对象，把它接上构造函数的原型，再让构造函数给它填属性**。它和 [`instanceof`](./instanceof.md) 是一体两面——`new` 负责「建链」，`instanceof` 负责「查链」。

引擎执行 `new Constructor()` 时，背后做了四步：

1. 创建一个空对象。
2. 把空对象的原型 (`__proto__`) 指向构造函数的 `prototype`。
3. 执行构造函数，让里面的 `this` 指向这个空对象。
4. 看构造函数的返回值：返回的是对象就用它，否则用第一步建的空对象。

```js
function myNew(Constructor, ...args) {
  // 第一步：建一个空对象，并把它的原型连到 Constructor.prototype
  // Object.create 一步就把「建对象」和「接原型」两件事做完了
  const newObj = Object.create(Constructor.prototype);

  // 第二步：执行构造函数，把 this 绑到新对象上，让它往新对象里塞属性
  const returnValue = Constructor.apply(newObj, args);

  // 第三步：判断构造函数有没有返回一个对象
  const isObject = typeof returnValue === 'object' && returnValue !== null;
  const isFunction = typeof returnValue === 'function';

  // 第四步：返回对象就用返回值，否则用我们自己建的新对象
  if (isObject || isFunction) {
    return returnValue;
  }
  return newObj;
}
```

形象的例子：`new` 就像 **租毛坯房 + 装修**。`Object.create(Constructor.prototype)` 是拿到一套空毛坯房，房子的「公共设施」(原型上的方法) 早就接好了；`Constructor.apply(newObj, args)` 是请装修队 (构造函数) 进门，按你的要求往房里添家具 (实例属性)。最后如果装修队自己另外塞给你一套精装房 (`return` 了一个对象)，你就住那套；否则就住自己这套毛坯房。

```js
function Person(name) {
  this.name = name;
}
Person.prototype.say = function () {
  console.log(this.name);
};

const p = myNew(Person, '小美');
p.say(); // 小美
```

:::info
第四步是最容易漏的点。构造函数若 `return` 一个**对象**，`new` 的结果就是那个对象；若返回基本类型 (或干脆没写 `return`)，才用新建的对象。这正是平时写构造函数从不写 `return` 的原因——写了基本类型也没用，写了对象反而把实例覆盖掉。
:::
