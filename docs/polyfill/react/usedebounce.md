---
sidebar_position: 3
sidebar_label: useDebounce
---

# 自定义 hook：useDebounce

防抖一个频繁变化的值（比如搜索框输入），只在停止变化一段时间后才真正更新。

```js
function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer); // value 一变就清掉上一个定时器
  }, [value, delay]);

  return debounced;
}
```

关键还是在 `useEffect` 的清理函数：`value` 每次变化都会先 `clearTimeout` 掉上一轮定时器，只有「连续 `delay` 毫秒不变」定时器才能真正触发——这正是防抖的本质，原理同 [防抖节流](../../scenario/debounce-throttle.md)。

## 一句话口诀

> **useDebounce**：靠 `useEffect` 清理函数清掉上一轮定时器，连续不变到 `delay` 才更新值。
