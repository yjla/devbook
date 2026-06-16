---
sidebar_position: 4
sidebar_label: sleep
---

# sleep 延时

**实现 `await sleep(1000)` 让程序暂停一段时间。** 本质是把 `setTimeout` 包成一个 Promise。

形象例子：`sleep` 就像微波炉的定时旋钮。你拧到「1000 毫秒」按下开始，然后站在旁边**干等**——在它「叮」一声响之前，你不会去做下一件事。`setTimeout` 是那个计时器，`await` 是「站在旁边等叮一声」的动作，而 `resolve` 就是那声「叮」，告诉你：时间到了，可以继续了。

```js
function sleep(ms) {
  // 第一步：返回一个 Promise，把「等待」这件事包成可 await 的对象
  return new Promise((resolve) => {
    // 第二步：用 setTimeout 在 ms 毫秒后调用 resolve
    // resolve 一执行，这个 Promise 就完成，await 就会放行
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

// 用法
async function run() {
  console.log('开始');
  await sleep(1000); // 在这里停 1 秒
  console.log('1 秒后');
}
```

:::tip
`sleep` 是异步题里的常用积木。配合 `for` 循环 + `await`，能实现「每隔 N 毫秒顺序做一件事」的节流效果，比 `setInterval` 更可控：因为是上一件事 `await` 完成后才进入下一轮，绝不会出现「上一件还没做完，下一件就叠上来」的情况。

```js
async function eachStep() {
  for (let i = 0; i < 3; i = i + 1) {
    console.log('第', i, '步');
    await sleep(1000); // 每步之间间隔 1 秒
  }
}
```
:::

> **sleep**：把 `setTimeout` 包成 Promise，定时器一到就 `resolve`，配 `await` 使用。
