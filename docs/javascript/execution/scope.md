---
sidebar_position: 1
sidebar_label: 作用域与闭包
---

# 作用域与闭包

**一句话**:作用域决定「一个变量能在哪些地方被访问」,闭包则是「函数把它定义时的作用域一起带走」,即使离开原地也还能访问那些变量。闭包是作用域规则的自然结果。

## 作用域

作用域 (scope) 又称**词法作用域 / 静态作用域**,指变量存在的范围,在**代码编写时**就已经决定,与运行时怎么调用无关。函数创建时,`[[Scopes]]` 内部插槽一并被创建;函数执行时,会复制该插槽,构建起执行环境的作用域链。

### 分类

- **全局作用域**:任何地方都能访问。
- **函数作用域**:`var` 和函数声明以函数为边界。
- **块级作用域**:`let` / `const` 以 `{}` 为边界。

:::info
`eval` 没有自己的作用域,在当前作用域内执行,因此可能修改当前作用域的变量,造成安全问题。严格模式下,`eval` 内部声明的变量不会影响外部作用域。
:::

### 作用域链

代码执行时,以**作用域链** (scope chain) 的方式查找变量:先在当前作用域 (环境记录) 中找,找不到的变量 (称为**自由变量**) 就顺着外部环境记录到上级作用域找,逐级向上直到全局作用域。

```mermaid
flowchart LR
  A["内层函数作用域"] -->|找不到就往外| B["外层函数作用域"]
  B -->|还找不到| C[全局作用域]
```

### 同名变量的优先级

函数作用域内同名标识符的优先级:**本地变量 > 设默认值的传参 > 函数声明 > 未设默认值的传参 > 变量提升**。

## 闭包

**闭包 = 函数 + 它定义时所在的词法作用域**。一个函数即使在它定义的作用域之外被调用,依然能访问当初那个作用域里的变量——这就是闭包。

```js
function makeCounter() {
  let count = 0; // 被内部函数引用,不会随 makeCounter 返回而销毁
  return function () {
    return ++count;
  };
}

const counter = makeCounter();
counter(); // 1
counter(); // 2 —— count 一直活着
```

`makeCounter` 执行完本该回收 `count`,但返回的函数引用了它,于是 `count` 被「关」在闭包里持续存在。

### 为什么会形成闭包

JavaScript 用**词法作用域**:函数能访问哪些变量,在它**定义**时就决定了,与在哪里调用无关。函数被创建时会保存一个指向其外层作用域的引用 (作用域链)。只要这个函数还存在 (比如被返回、被当回调注册),它引用的外层变量就不会被垃圾回收。

```mermaid
flowchart LR
  A["counter 函数对象"] -->|作用域链| B["makeCounter 作用域<br/>count = 2"]
  B -->|作用域链| C[全局作用域]
```

### 典型用途

- **私有变量 / 数据封装**:把变量藏在函数作用域里,只暴露受控的读写接口 (如上面的 `counter`)。
- **函数工厂**:根据参数生成定制化的函数。

```js
function makeAdder(x) {
  return (y) => x + y; // 每个 adder 闭住自己的 x
}
const add5 = makeAdder(5);
add5(3); // 8
```

- **回调中保留状态**:防抖、节流、`once` 等都靠闭包记住 `timer`、`last`、`called` 等状态,见 [防抖节流](/scenario/debounce-throttle)。

### 经典陷阱:循环中的 var

```js
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0); // 3 3 3
}
```

`var` 没有块级作用域,三个回调闭住的是**同一个** `i`,循环结束时 `i` 已是 `3`。解法:用 `let` (每次迭代创建独立绑定),或用 IIFE 传值形成独立作用域。

```js
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0); // 0 1 2
}
```

:::warning
闭包会延长变量的生命周期,用得不当会导致**内存无法释放**:被闭包引用的大对象、DOM 节点会一直驻留内存。不再需要时把引用置为 `null`,或避免在闭包里抓住不必要的大数据。内存泄漏排查见 [内存管理](../../browser/memory-management.md)。
:::

## 参考

1. [Scope（作用域） - 术语表 | MDN](https://developer.mozilla.org/zh-CN/docs/Glossary/Scope)
2. [闭包 - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Closures)
3. [js函数作用域中的优先级 - CSDN](https://blog.csdn.net/YoungtiNine/article/details/106454099)
