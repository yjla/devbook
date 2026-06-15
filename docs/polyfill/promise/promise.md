---
sidebar_position: 1
sidebar_label: Promise 核心
---

# Promise 核心实现

Promise 的核心是一个**状态机**：从 `pending`（等待）只能单向变到 `fulfilled`（成功）或 `rejected`（失败），一旦变了就**锁死**不可逆。`then` 注册的回调要在状态确定后异步执行。

抓住三个关键点就能写出来：**三状态单向流转**、**pending 时把回调存起来**、**then 返回新 Promise 以支持链式调用**。

```js
class MyPromise {
  constructor(executor) {
    this.state = 'pending';
    this.value = undefined;
    this.callbacks = []; // 暂存 pending 期间注册的回调

    const resolve = (value) => {
      if (this.state !== 'pending') return; // 状态锁死，二次调用无效
      this.state = 'fulfilled';
      this.value = value;
      this.callbacks.forEach((cb) => cb.onFulfilled(value));
    };

    const reject = (reason) => {
      if (this.state !== 'pending') return;
      this.state = 'rejected';
      this.value = reason;
      this.callbacks.forEach((cb) => cb.onRejected(reason));
    };

    try {
      executor(resolve, reject); // 执行器同步执行，出错就 reject
    } catch (err) {
      reject(err);
    }
  }

  then(onFulfilled, onRejected) {
    // 值穿透：非函数时用默认透传，让 .then().then() 也能拿到值/错误
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (v) => v;
    onRejected = typeof onRejected === 'function' ? onRejected : (e) => { throw e; };

    // 返回新 Promise 才能链式调用
    return new MyPromise((resolve, reject) => {
      const handle = (callback, value) => {
        queueMicrotask(() => { // 回调放进微任务，保证异步执行
          try {
            resolve(callback(value)); // 回调的返回值传给下一个 then
          } catch (err) {
            reject(err);
          }
        });
      };

      if (this.state === 'fulfilled') {
        handle(onFulfilled, this.value);
      } else if (this.state === 'rejected') {
        handle(onRejected, this.value);
      } else {
        // 还在 pending：把回调存起来，等 resolve/reject 时再触发
        this.callbacks.push({
          onFulfilled: (v) => handle(onFulfilled, v),
          onRejected: (e) => handle(onRejected, e),
        });
      }
    });
  }

  catch(onRejected) {
    return this.then(null, onRejected); // catch 就是只传第二个回调的 then
  }
}

// 把任意值包成 Promise，供 all / race 复用
MyPromise.resolve = (value) =>
  value instanceof MyPromise ? value : new MyPromise((resolve) => resolve(value));
```

:::warning
这是**精简版**，足够讲清原理。完整的 Promises/A+ 还要处理「回调返回值本身是 Promise（thenable）」的递归解析，面试能写到这一步、再口头说明这一点，基本就够了。
:::

:::info
下面的 [Promise.all](./all.md)、[Promise.race](./race.md) 都复用这里的 `MyPromise` 和 `MyPromise.resolve`。
:::

## 一句话口诀

> **Promise 是单向锁死的三状态机**：pending 时存回调、定状态时清空触发；`then` 返回新 Promise 串起链条、回调进微任务异步跑。
