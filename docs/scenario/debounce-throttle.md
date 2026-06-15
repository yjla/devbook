---
sidebar_position: 1
sidebar_label: 1 防抖节流
---

# 防抖节流

两者都是**限制高频事件的执行次数**，区别在「怎么限」：

- **防抖 (debounce)**：事件触发后等一段时间再执行，期间只要再次触发就**重新计时**。只认「最后一次」。
- **节流 (throttle)**：固定时间间隔内**最多执行一次**，不管触发多频繁。按「固定节奏」执行。

一个记忆类比：**防抖**像电梯——不断有人进来就一直等，直到没人进了才关门；**节流**像地铁——不管站台多少人，每隔固定时间发一班车。

## 防抖

核心是一个 `timer`：每次触发都先清掉上一个定时器，重新计时，只有「安静」够久才真正执行。

```js
function debounce(fn, delay) {
  let timer = null;

  return function (...args) {
    if (timer) clearTimeout(timer); // 又触发了，取消上一次的等待
    timer = setTimeout(() => {
      fn.apply(this, args); // delay 内没再触发，才执行
    }, delay);
  };
}
```

适用场景：**搜索框输入联想**（停止输入才发请求）、`resize` / `input` 事件。

## 节流

核心是记一个「上次执行时间」，没到间隔就直接跳过。

```js
function throttle(fn, interval) {
  let last = 0;

  return function (...args) {
    const now = Date.now();
    if (now - last >= interval) {
      last = now;
      fn.apply(this, args); // 距上次够久，才执行
    }
  };
}
```

适用场景：**滚动加载**、拖拽、鼠标移动等持续触发、但要稳定响应的事件。

:::tip
节流还有「定时器版」（用 `setTimeout`，在间隔结束时执行最后一次）。时间戳版「先执行、间隔末尾不补」，定时器版「延迟执行、能补最后一次」。面试讲清两者差异即可，时间戳版更简单好记。
:::

## Hook 写法

在 React 里直接用上面的闭包版会有两个坑：每次渲染都会**重新生成**一个新的防抖函数，导致 `timer` 丢失、防抖失效；闭包还会**捕获到旧的 props / state**。所以要用 `useRef` 把定时器和最新的 `fn` 存住，用 `useCallback` 把返回的函数固定下来。

```js
import { useRef, useEffect, useCallback } from 'react';

// 防抖一个函数（用于事件回调，如 onChange、onScroll）
function useDebounceFn(fn, delay) {
  const fnRef = useRef(fn);
  fnRef.current = fn; // 每次渲染同步最新的 fn，避免闭包拿到旧的 state

  const timerRef = useRef(null);

  // 组件卸载时清掉残留定时器，防止在已卸载组件上执行
  useEffect(() => () => clearTimeout(timerRef.current), []);

  return useCallback(
    (...args) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => fnRef.current(...args), delay);
    },
    [delay], // 只要 delay 不变，返回的函数引用就稳定
  );
}
```

```js
// 节流一个函数（用于滚动、拖拽等持续触发的回调）
function useThrottleFn(fn, interval) {
  const fnRef = useRef(fn);
  fnRef.current = fn;

  const lastRef = useRef(0);

  return useCallback(
    (...args) => {
      const now = Date.now();
      if (now - lastRef.current >= interval) {
        lastRef.current = now;
        fnRef.current(...args);
      }
    },
    [interval],
  );
}
```

用法和普通函数一样，但拿到的是一个**跨渲染稳定**的回调：

```jsx
function SearchBox() {
  const onSearch = useDebounceFn((keyword) => {
    fetch(`/api/search?q=${keyword}`);
  }, 300);

  return <input onChange={(e) => onSearch(e.target.value)} />;
}
```

:::tip
如果要防抖的是一个**值**（而不是回调），可以写一个 `useDebounce(value, delay)`：把值放进 `useState`，在 `useEffect` 里用清理函数清掉上一轮定时器，连续 `delay` 不变才更新。原理同上。
:::

## 一句话口诀

> **防抖看「最后一次」——不断触发就一直重新计时；节流看「固定节奏」——每隔一段最多跑一次。**

- 要「等用户停下来」→ 防抖（搜索联想）。
- 要「持续但别太频繁」→ 节流（滚动、拖拽）。
