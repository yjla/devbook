---
sidebar_position: 1
sidebar_label: useState
---

# 简版 useState 原理

结论先行：React 内部用一个**数组**按 hook 的**调用顺序**逐个存放状态，用一个**下标指针**标记「现在轮到第几个 hook」。`setState` 改完值就触发重新渲染，渲染前把指针归零，从头再走一遍。这就是「hook 必须按固定顺序调用、不能放进 `if` / 循环」的根本原因——顺序乱了，下一次渲染就对不上号。

```js
// 第一步：准备两个全局变量当「储物柜」和「指针」
let hookStates = []; // 储物柜：一格存一个 hook 的状态
let hookIndex = 0; // 指针：现在轮到第几格

function useState(initialValue) {
  // 第二步：用闭包把「当前这格的下标」锁住
  // 后面 setState 是异步触发的，必须记死自己属于哪一格
  const currentIndex = hookIndex;

  // 第三步：只有首次渲染时这一格是空的，才放入初始值
  // 之后每次渲染都直接复用储物柜里已有的值
  if (hookStates[currentIndex] === undefined) {
    hookStates[currentIndex] = initialValue;
  }

  // 第四步：定义改值函数，改完触发重新渲染
  const setState = (newValue) => {
    hookStates[currentIndex] = newValue;
    render(); // 值变了，重画整个组件
  };

  // 第五步：指针后移，让下一个 hook 用下一格
  hookIndex++;

  return [hookStates[currentIndex], setState];
}

function render() {
  hookIndex = 0; // 关键：每次渲染前指针归零，保证顺序对齐
  ReactDOM.render(<App />, root);
}
```

用一个形象的例子理解：把 `hookStates` 想成**健身房的储物柜**，`hookIndex` 是发钥匙的管理员。你每次进健身房（每次渲染），都必须**按完全相同的顺序**领柜子——第一个领 1 号柜、第二个领 2 号柜。只要顺序一致，你昨天放在 2 号柜的东西今天还在 2 号柜。但如果某天你心血来潮（写了 `if`），跳过了 1 号柜直接领 2 号，那从你之后所有人领的柜子全错位了，拿出来的全是别人的东西——状态就串了。

:::info
看懂这段就能回答经典追问「为什么 hook 不能写在条件语句里」：状态是**按调用顺序存进数组**的，条件分支会让某次渲染少调一个 hook，导致后面所有 hook 的下标全部错位，状态就串了。
:::
