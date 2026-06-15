---
sidebar_position: 3
sidebar_label: promisify
---

# promisify

把「错误优先回调 (error-first callback)」风格的函数，转成返回 Promise 的函数。Node 的 `util.promisify` 就是干这个的。

约定：回调是函数的**最后一个参数**，其第一个参数是 error、第二个是结果。

```js
function promisify(fn) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      // 把生成的回调追加到原参数末尾，保留原函数的 this
      fn.call(this, ...args, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
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
核心是「把回调的两条路（`err` / `data`）接到 Promise 的 `reject` / `resolve` 上」。注意用 `fn.call(this, ...)` 保留原函数的 `this`，并把生成的回调追加到参数末尾。
:::

## 一句话口诀

> **promisify**：返回一个新函数，内部把 error-first 回调的 `err` 接 `reject`、`data` 接 `resolve`，回调追加在参数末尾。
