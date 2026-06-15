---
sidebar_position: 1
sidebar_label: useState
---

# 简版 useState 原理

Hook 的状态存在哪？React 内部维护一个数组，按 hook 的**调用顺序**逐个存放每个 hook 的状态。这就是「hook 必须按固定顺序调用、不能放进 `if` / 循环」的根本原因——顺序乱了，下一次渲染就对不上号。

```js
let hookStates = []; // 存所有 hook 的状态
let hookIndex = 0; // 当前 hook 的下标

function useState(initialValue) {
  const currentIndex = hookIndex; // 用闭包锁住本 hook 的位置
  // 首次渲染才用初始值，之后复用已存的值
  if (hookStates[currentIndex] === undefined) {
    hookStates[currentIndex] = initialValue;
  }

  const setState = (newValue) => {
    hookStates[currentIndex] = newValue;
    render(); // 改了值就触发重新渲染
  };

  hookIndex++; // 指针移到下一个 hook
  return [hookStates[currentIndex], setState];
}

function render() {
  hookIndex = 0; // 每次渲染前归零，保证顺序对齐
  ReactDOM.render(<App />, root);
}
```

:::info
看懂这段就能回答经典追问「为什么 hook 不能写在条件语句里」：状态是**按调用顺序存进数组**的，条件分支会让某次渲染少调一个 hook，导致后面所有 hook 的下标全部错位，状态就串了。
:::

## 一句话口诀

> **useState**：hook 状态按**调用顺序**存进数组，`setState` 改值后重新渲染、渲染前指针归零 → 顺序不能变。
