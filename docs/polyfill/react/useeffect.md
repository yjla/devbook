---
sidebar_position: 3
sidebar_label: useEffect
---

# 简版 useEffect 原理

`useEffect` 同样共用「数组 + 下标」机制，核心是**比较依赖数组**：依赖变了才执行回调。

```js
function useEffect(callback, deps) {
  const currentIndex = hookIndex;
  const prevDeps = hookStates[currentIndex];

  // 首次 (没有上次依赖) 或 依赖有变化，才执行
  const hasChanged = prevDeps
    ? deps.some((dep, i) => dep !== prevDeps[i])
    : true;

  if (hasChanged) callback();

  hookStates[currentIndex] = deps; // 存本次依赖供下次比较
  hookIndex++;
}
```

依赖比较用的是 `!==` 逐项浅比较，所以传对象 / 数组 / 内联函数当依赖时，每次渲染都是新引用，会被判定为「变了」而反复执行——这也是 `useCallback` / `useMemo` 存在的意义。

:::info
真实的 `useEffect` 还会在下一次执行前调用上一轮回调返回的**清理函数**，并把 effect 推迟到浏览器绘制之后异步执行。这里只演示依赖比较这一核心。
:::

## 一句话口诀

> **useEffect**：把依赖数组存进 hook 槽位，下次渲染逐项 `!==` 比较，变了才跑回调。
