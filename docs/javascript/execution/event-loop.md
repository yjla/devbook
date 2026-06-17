---
sidebar_position: 2
sidebar_label: 事件循环
---

# 事件循环

JavaScript 是一门单线程的非阻塞的脚本语言，想要实现非阻塞，就需要通过事件循环（Event Loop）机制。事件循环，简单来说就是先执行一个宏任务 (Marco Task)，再执行所有微任务（Micro Task），再执行一个宏任务，接着执行所有微任务，如次循环往复的过程就是事件循环。宏任务和微任务都属于异步任务，而执行一个宏任务后再执行所有微任务就被称为一次循环。具体来说，当拿到一个脚本后（`<script>` 整体代码可以看作是一个宏任务），JavaScript 引擎会一行行地执行其中的代码。如果碰到同步任务，就立即执行；如果碰到宏任务，就将其加入宏任务队列；如果碰到微任务，就将其加入微任务队列。当所有同步任务执行完毕（即 `<script>` 整体代码这个宏任务完成）后，JavaScript 引擎就会去检查微任务队列中是否有可以执行的微任务，并执行所有满足执行条件的微任务。当所有满足执行条件的微任务后，JavaScript 引擎才会去判断宏任务队列中的是否有满足执行条件的宏任务，并取出一个满足条件的宏任务执行。这就意味着在微任务处理过程中如果有新加入的微任务，也需要等这些新加入的满足执行条件的微任务都执行完毕后才去检查宏任务。



## 单线程与非阻塞

JavaScript 引擎本身是单线程的，无法并行执行代码。像 `setTimeout`、AJAX 请求这类异步操作，本质上是**交给浏览器的其他线程**去做（定时器线程、网络线程等），完成后把回调塞进事件队列。JavaScript 引擎执行完当前所有同步代码后，再从队列里取回调执行——这套「主线程不等待、由队列驱动回调」的机制就是非阻塞的由来，而调度这个队列的正是事件循环。

## 微任务

- `Promise.then()` 的回调
- `new MutaionObserver()` 的回调
- `process.nextTick()` 的回调；



## 宏任务

- `<script>` 整体代码
- `setTimeout()`、`setInterval()` 的回调
- UI 事件
- Node.js 中的 I/O
- `setImmediate()` 的回调



## 输出题

:::info
做题时记住三条：

- 执行顺序：**同步代码 → 清空所有微任务 → 取一个宏任务 → 再清空所有微任务**，如此循环
- 每执行完一个宏任务，都要把微任务队列**全部清空**（包括执行过程中新注册的微任务）才会执行下一个宏任务
- `await x` 等价于把后续代码包进 `x` 的 `.then` 微任务里
:::

### async/await 与 Promise 的顺序

```js
async function async1() {
  console.log('async1 start');
  await async2();
  console.log('async1 end');
}

async function async2() {
  console.log('async2');
}

console.log('script start');

setTimeout(function () {
  console.log('setTimeout');
}, 0);

async1();

new Promise(function (resolve) {
  console.log('promise1');
  resolve();
}).then(function () {
  console.log('promise2');
});

console.log('script end');
```

输出顺序：

```
script start
async1 start
async2
promise1
script end
async1 end
promise2
setTimeout
```

- 同步阶段依次打印 `script start`、`async1 start`、`async2`、`promise1`、`script end`
- `await async2()` 之后的 `async1 end` 被挂为微任务；`.then` 里的 `promise2` 也是微任务
- 微任务按入队顺序执行：`async1 end` 先于 `promise2`
- `setTimeout` 是宏任务，最后执行

### 微任务里再注册微任务

```js
setTimeout(() => {
  console.log(0);
  Promise.resolve().then(() => console.log(1));
});
setTimeout(() => console.log(2));
Promise.resolve().then(() => {
  console.log(3);
  Promise.resolve().then(() => console.log(4));
});
Promise.resolve().then(() => console.log(5));
console.log(6);
```

输出顺序 (已用 `node` 实测验证)：

```
6 3 5 4 0 1 2
```

- 同步：`6`
- 清空首轮微任务：先 `3` (其内部又注册一个微任务)，再 `5`；本轮微任务清空前会把新加入的也执行掉，所以接着 `4`
- 取第一个宏任务：`0`，它注册的微任务 `1` 立即在本宏任务后清空
- 取第二个宏任务：`2`

:::warning
微任务队列是「执行到空为止」，包括执行过程中新注册的微任务。所以 `3` 内部的 `4` 会在进入宏任务之前就执行完。
:::

### Promise.then 中的 setTimeout 嵌套

```js
const p = new Promise((resolve) => {
  setTimeout(() => {
    console.log(111);
    resolve();
  }, 1000);
})
  .then(() => {
    setTimeout(() => {
      console.log(222);
    }, 2000);
  })
  .then(() => {
    setTimeout(() => {
      console.log(333);
    }, 500);
  });
```

输出顺序：

```
111 333 222
```

按时间线推算：

- `1000ms`：打印 `111` 并 `resolve`，触发第一个 `.then`，注册一个 `2000ms` 的定时器 (将在 `1000+2000=3000ms` 触发 `222`)
- 第一个 `.then` 返回 `undefined`，立即触发第二个 `.then`，注册一个 `500ms` 的定时器 (将在约 `1000+500=1500ms` 触发 `333`)
- `1500ms` 先到：打印 `333`
- `3000ms`：打印 `222`

:::tip
`.then` 的回调一旦执行完就立刻进入下一个 `.then`，两个内部定时器几乎同时开始计时。所以比的是 `500ms` 和 `2000ms`，`333` 先于 `222`。
:::

### Node 中 nextTick / Promise / setImmediate / setTimeout

```js
new Promise((resolve, reject) => {
  console.log('init promise');
  process.nextTick(resolve);
}).then(() => console.log('promise.then'));

process.nextTick(() => {
  console.log('nextTick');
});

setImmediate(() => {
  console.log('immediate (setImmediate)');
});

setTimeout(() => {
  console.log('immediate (setTimeout)');
}, 0);
```

输出顺序 (已用 `node` 实测验证)：

```
init promise
nextTick
promise.then
immediate (setImmediate)
immediate (setTimeout)
```

- 同步：`init promise`
- Node 的 `process.nextTick` 队列优先级高于 Promise 微任务队列，先执行 `nextTick`，其中 `resolve` 让 `promise.then` 进入微任务，随后执行 `promise.then`
- 进入事件循环各阶段：本例中 `setImmediate` 早于 `setTimeout` 触发

:::warning
`setTimeout(fn, 0)` 与 `setImmediate` 在主模块中的先后**不确定**，取决于进程启动耗时；但若放在 I/O 回调内部，`setImmediate` 一定先于 `setTimeout`。
:::

### var / let 在循环中的闭包差异

```js
for (var i = 0; i < 3; i++) {
  console.log('for中i的值：' + i);
  setTimeout(() => {
    console.log('setTimeout中i的值：' + i);
  }, 300);
}
```

同步先打印 `0`、`1`、`2`，`300ms` 后三次都打印 `3`。`var` 没有块级作用域，三个回调共享同一个 `i`，循环结束时 `i` 已是 `3`。

```js
for (let i = 0; i < 3; i++) {
  console.log('for中i的值：' + i);
  setTimeout(() => {
    console.log('setTimeout中i的值：' + i);
  }, 300);
}
```

同步打印 `0`、`1`、`2`，`300ms` 后依次打印 `0`、`1`、`2`。`let` 在每次迭代创建独立的块级绑定，每个回调捕获各自的 `i`。

:::tip
想用 `var` 达到 `let` 的效果，可用 IIFE 把 `i` 传进去形成独立作用域：`(function(j){ setTimeout(() => console.log(j), 300); })(i)`。
:::



## 参考

1. [并发模型与事件循环 - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/EventLoop)
2. [详解JavaScript中的Event Loop（事件循环）机制 - 知乎](https://zhuanlan.zhihu.com/p/33058983)
3. [JavaScipt 中的事件循环(event loop)，以及微任务 和宏任务的概念 - daisy,gogogo - 博客园](https://www.cnblogs.com/daisygogogo/p/10116694.html)
4. [详解 JavaScript 中的 Event Loop —— 掘金](https://juejin.cn/post/6844904169967452174)
5. [2分钟了解 JavaScript Event Loop | 面试必备](https://www.bilibili.com/video/BV1kf4y1U7Ln)
6. [Q：你了解异步编程、进程、单线程、多线程吗？ - 掘金](https://juejin.cn/post/6844903517073702926#heading-1)