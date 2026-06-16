---
sidebar_position: 3
sidebar_label: promisify
---

# promisify

**把「错误优先回调（error-first callback）」风格的函数，转成返回 Promise 的函数。** Node 的 `util.promisify` 就是干这个的。

约定：回调是原函数的**最后一个参数**，回调的第一个参数是 error，第二个是结果。

形象例子：旧式的回调函数像一个「打电话报信」的快递员——你下单后他不当面给你东西，而是说「等好了我打你电话，电话里第一句话先说有没有出事，没出事再告诉你包裹在哪」。`promisify` 就像给这个快递员配了一个**前台秘书**：秘书替你接电话，听到「出事了」就帮你走投诉流程（reject），听到「包裹到了」就帮你签收（resolve）。你以后只管问秘书要结果，不用再守着电话。

```js
function promisify(fn) {
  // 第一步：返回一个新函数，它接收原函数除回调外的那些参数
  return function (...args) {
    // 第二步：新函数内部返回一个 Promise，把异步结果包进去
    return new Promise((resolve, reject) => {
      // 第三步：手动造一个回调函数，把回调的两条路接到 Promise 上
      const callback = (err, data) => {
        if (err) {
          // 出错了走 reject
          reject(err);
        } else {
          // 成功了走 resolve
          resolve(data);
        }
      };

      // 第四步：调用原函数，把造好的回调追加到参数末尾
      // 用 fn.call(this, ...) 是为了保留原函数被调用时的 this
      fn.call(this, ...args, callback);
    });
  };
}

// 用法
const fs = require('fs');
const readFile = promisify(fs.readFile);

readFile('a.txt', 'utf8')
  .then((content) => console.log(content))
  .catch((err) => console.error(err));
```

:::tip
核心就一句话：把回调的两条岔路（`err` 和 `data`）分别接到 Promise 的 `reject` 和 `resolve` 上。两个细节别漏：一是用 `fn.call(this, ...)` 保留原函数的 `this`，否则像 `obj.method` 这种带上下文的方法会丢失 `this`；二是生成的回调一定要追加在参数**末尾**，因为这是 error-first 回调的位置约定。
:::

> **promisify**：返回一个新函数，内部把 error-first 回调的 `err` 接 `reject`、`data` 接 `resolve`，回调追加在参数末尾，并用 `call` 保留 `this`。
