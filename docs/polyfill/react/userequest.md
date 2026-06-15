---
sidebar_position: 2
sidebar_label: useRequest
---

# 自定义 hook：useRequest

把「请求 + loading + 错误 + 数据」这套到处重复的逻辑封装起来，是最实用的自定义 hook。下面用的是**真实的 React API**（不是 [简版原理](./usestate-useeffect.md) 里的那套）。

```js
function useRequest(requestFn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false; // 防止组件卸载后还 setState
    setLoading(true);
    setError(null);

    requestFn()
      .then((res) => { if (!cancelled) setData(res); })
      .catch((err) => { if (!cancelled) setError(err); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; }; // 清理：标记为已取消
  }, deps);

  return { data, loading, error };
}
```

:::warning
`cancelled` 标志位很关键：异步请求回来时组件可能已经卸载，直接 `setState` 会触发警告甚至内存泄漏。用 `useEffect` 的清理函数把它标记为已取消，回调里判断后跳过更新。
:::

## 一句话口诀

> **useRequest**：把「state + effect + 清理」打包复用，用 `cancelled` 防组件卸载后再 `setState`。
