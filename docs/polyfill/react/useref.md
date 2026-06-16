---
sidebar_position: 2
sidebar_label: useRef
---

# 简版 useRef 原理

结论先行：`useRef` 和 `useState` 共用同一套「储物柜数组 + 下标指针」机制，区别只有两点——它存的是一个 `{ current }` 盒子，**每次渲染都返回同一个盒子**；而且改 `current` **不触发重新渲染**。

```js
function useRef(initialValue) {
  // 第一步：和 useState 一样，先锁住自己这一格的下标
  const currentIndex = hookIndex;

  // 第二步：首次渲染时，往这一格放一个 { current } 盒子
  // 之后每次渲染都直接复用同一个盒子，绝不重新创建
  if (hookStates[currentIndex] === undefined) {
    hookStates[currentIndex] = { current: initialValue };
  }

  // 第三步：指针后移
  hookIndex++;

  // 第四步：直接返回这个盒子本身（注意：不带 setter，也不调 render）
  return hookStates[currentIndex];
}
```

和 `useState` 的两点关键差异：

- **返回引用不变**：`useState` 返回的是「值 + setter」，每次渲染值是新的；`useRef` 返回的永远是同一个对象，所以你对 `ref.current` 的修改能跨渲染保留下来。
- **改值不重渲染**：直接给 `ref.current` 赋值不会调用 `render`，适合存「需要持久保留但不该影响 UI」的数据，比如定时器 id、DOM 引用、上一次的值。

用一个形象的例子理解：`useRef` 就像你工位上一个**固定贴着标签的便利贴板**。无论组件重渲染多少次（你上下班多少次），这块板子始终是同一块、挂在同一个位置（引用不变）。你随时可以擦掉重写上面的内容（改 `current`），但擦写便利贴这个动作**不会惊动任何人、不会让公司重新开会**（不触发渲染）。而 `useState` 更像是「按了一下就全公司广播开会」的红色按钮——一改值，整个组件就得重画。

:::tip
一句话记：`useRef` = 一个「跨渲染不变、改了不重渲染」的盒子。需要在渲染之间记住点什么、又不想触发更新时，就用它。
:::

## 一句话口诀

> **useRef**：返回一个固定的 `{ current }` 盒子（便利贴板），跨渲染不变、改 `current` 不触发渲染。
