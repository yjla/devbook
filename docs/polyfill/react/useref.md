---
sidebar_position: 2
sidebar_label: useRef
---

# 简版 useRef 原理

`useRef` 和 `useState` 共用同一套「数组 + 下标」机制，区别在于：它存的是一个 `{ current }` 对象，**每次渲染都返回同一个对象**，且改 `current` **不触发重新渲染**。

```js
function useRef(initialValue) {
  const currentIndex = hookIndex;
  // 首次渲染存一个 { current } 盒子，之后每次渲染都返回同一个盒子
  if (hookStates[currentIndex] === undefined) {
    hookStates[currentIndex] = { current: initialValue };
  }

  hookIndex++;
  return hookStates[currentIndex];
}
```

和 `useState` 的两点关键差异：

- **返回引用不变**：`useState` 返回的是「值 + setter」，`useRef` 返回的是同一个对象，所以 `ref.current` 的修改能跨渲染保留。
- **改值不重渲染**：直接给 `ref.current` 赋值不会调用 `render`，适合存「需要持久保留但不影响 UI」的数据，如定时器 id、DOM 引用、上一次的值。

:::tip
一句话记：`useRef` = 一个「跨渲染不变、改了不重渲染」的盒子。需要在渲染之间记住点什么、又不想触发更新时，就用它。
:::

## 一句话口诀

> **useRef**：返回一个固定的 `{ current }` 盒子，跨渲染不变、改 `current` 不触发渲染。
