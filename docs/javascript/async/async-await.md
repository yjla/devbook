---
sidebar_label: async/await 原理
---

# async/await 原理

一句话:**`async/await` 是 Generator + 自动执行器的语法糖,底层仍是 Promise**。`await` 负责「暂停」,自动执行器负责在 Promise 完成后「恢复」,二者配合就实现了用同步写法写异步。

## 前置:Generator 能暂停

普通函数一旦执行就跑到底;Generator (`function*`) 能用 `yield` **暂停**,靠外部调用 `next()` 恢复,每次返回 `{ value, done }`。

```js
function* gen() {
  const a = yield 1; // 在这里暂停,把 1 交出去
  const b = yield 2; // 下次 next() 才执行到这
  return a + b;
}

const it = gen();
it.next(); // { value: 1, done: false }
it.next(10); // { value: 2, done: false }——10 作为上一个 yield 的返回值传回
it.next(20); // { value: 30, done: true }
```

关键点:`next(x)` 的参数 `x` 会成为**上一个 `yield` 表达式的返回值**——这是把异步结果「送回」函数内部的通道。

## 核心:自动执行器

`async` 函数不用我们手动调 `next()`,因为有个**自动执行器**在驱动:每次 `next()` 拿到的 `value` 如果是 Promise,就等它 resolve,再把结果通过 `next(结果)` 送回去,如此循环直到 `done`。这就是 `co` 库的简化版:

```js
function run(genFn) {
  const it = genFn();

  return new Promise((resolve, reject) => {
    function step(nextFn) {
      let result;
      try {
        result = nextFn(); // 执行一步 next() / throw()
      } catch (e) {
        return reject(e); // 函数内部抛错
      }

      const { value, done } = result;
      if (done) return resolve(value); // 跑完了

      // 把 value 统一包成 Promise,完成后递归驱动下一步
      Promise.resolve(value).then(
        (val) => step(() => it.next(val)), // 成功:结果送回函数内部
        (err) => step(() => it.throw(err)), // 失败:在 yield 处抛出,让 try/catch 能接住
      );
    }

    step(() => it.next()); // 启动
  });
}
```

## 对应关系

把 `async/await` 翻译成 Generator,一一对应:

```js
// async/await 写法
async function getData() {
  const user = await fetchUser();
  const list = await fetchList(user.id);
  return list;
}

// 等价的 Generator + 自动执行
function* getDataGen() {
  const user = yield fetchUser();
  const list = yield fetchList(user.id);
  return list;
}
const getData = () => run(getDataGen);
```

- `async` 函数 = Generator + 自动执行器,且**整体返回一个 Promise**
- `await x` ≈ `yield x`:暂停,等 `x` 这个 Promise 完成,再把结果送回继续
- `try/catch` 能捕获 `await` 的拒绝,靠的就是执行器里的 `it.throw(err)`——把错误抛在 `yield` 暂停处

## 与事件循环的关系

`await` 之后的代码会被包进 `.then` 回调,作为**微任务**在当前同步代码跑完后执行。所以 async 函数里 `await` 前是同步、`await` 后是微任务,这正是 [事件循环](./event-loop) 输出题的高频考点。
