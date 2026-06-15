---
sidebar_position: 4
sidebar_label: usePrevious
---

# 自定义 hook：usePrevious

拿到上一次渲染时的值，靠 `useRef` 实现。`useRef` 的值在渲染之间持久保留，且修改它不触发渲染。

```js
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value; // effect 在渲染之后才跑，所以渲染期间读到的是上一次的值
  });
  return ref.current;
}
```

:::tip
`useRef` = 一个「跨渲染不变、改了不重渲染」的盒子。`usePrevious` 利用的正是 effect 的执行时机：读 `ref.current` 时它还是上一轮存的值，effect 跑完才更新成这一轮。
:::

## 一句话口诀

> **usePrevious**：用 `useRef` 存值，effect 在渲染后才更新它，所以渲染期间读到的是上一次的值。
