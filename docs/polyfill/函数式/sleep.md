---
sidebar_position: 4
sidebar_label: sleep
---

# sleep 延时

**题目**：实现 `await sleep(1000)` 暂停一段时间。本质是把 `setTimeout` 包成 `Promise`。

```js
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// 用法
async function run() {
  console.log('开始');
  await sleep(1000); // 停 1 秒
  console.log('1 秒后');
}
```

:::tip
`sleep` 是异步题的常用积木：配合 `for` 循环 + `await` 能实现「每隔 N 毫秒做一件事」的顺序节流，比 `setInterval` 更可控（上一件没做完不会叠下一件）。
:::

## 一句话口诀

> **sleep**：`setTimeout` 包成 `Promise`，配 `await` 用。
