---
sidebar_position: 1
sidebar_label: call
---

# call

`call` 的作用是**改变函数运行时的 `this` 指向，并立即执行**，参数逐个传入。

`call` / `apply` / `bind` 三兄弟都是改 `this`，区别只在「怎么传参」和「是否立即执行」：

| 方法 | 传参方式 | 执行时机 |
|---|---|---|
| `call` | 参数逐个传 | 立即执行 |
| `apply` | 参数放数组里 | 立即执行 |
| `bind` | 参数逐个传 | 返回新函数，不执行 |

## 核心思路

手写的关键只有一句话：**把这个函数临时挂到目标对象上，当成它自己的方法来调用**。

因为 JavaScript 里「谁调用方法，`this` 就指向谁」（`obj.fn()` 里 `fn` 的 `this` 就是 `obj`），所以只要把函数变成目标对象的一个属性再调用，`this` 自然就指向了目标对象。用完再把这个临时属性删掉，不留痕迹。

:::info 形象记忆
把 `call` 想象成 **「借用别人家的厨房做饭」**。函数 `fn` 是一道菜谱，`context` 是别人家。你不能凭空让菜在别人家做出来，于是你先把菜谱「贴」到别人家的灶台上（`context[key] = fn`），在那儿开火做菜（`context[key]()`），这样做出来的菜（`this`）自然属于这家人。做完饭把贴的菜谱撕掉（`delete`），不给人家添乱。
:::

## 实现

```js
Function.prototype.myCall = function (context, ...args) {
  // 第一步：处理 context。传 null/undefined 时，this 应指向全局对象
  if (context === null || context === undefined) {
    context = globalThis;
  }

  // 第二步：用 Symbol 造一个独一无二的 key，避免覆盖 context 上已有的属性
  const fnKey = Symbol('fn');

  // 第三步：把当前函数（this 就是被调用的函数本身）挂到 context 上
  context[fnKey] = this;

  // 第四步：作为 context 的方法来调用，此时函数内部的 this 就指向了 context
  const result = context[fnKey](...args);

  // 第五步：清理临时属性，别污染 context
  delete context[fnKey];

  // 第六步：返回函数执行结果
  return result;
};
```

## 用法

```js
function greet(greeting, punctuation) {
  return greeting + ', ' + this.name + punctuation;
}

const user = { name: '小美' };

greet.myCall(user, '你好', '!'); // "你好, 小美!"
```
