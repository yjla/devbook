---
sidebar_position: 6
sidebar_label: React Hooks
---

# React Hooks

Hooks 高频考两类：一是**理解原理**——手写简版 `useState` / `useEffect`，能说清「为什么 hook 不能写在条件语句里」；二是**写自定义 hook**——把通用逻辑（请求、防抖、定时）封装成可复用的钩子。

## 简版 useState / useEffect 原理

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

`useEffect` 的核心是**比较依赖数组**：变了才执行回调。

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

:::info
看懂这两段就能回答经典追问「为什么 hook 不能写在条件语句里」：状态是**按调用顺序存进数组**的，条件分支会让某次渲染少调一个 hook，导致后面所有 hook 的下标全部错位，状态就串了。
:::

## 自定义 hook：useRequest

把「请求 + loading + 错误 + 数据」这套到处重复的逻辑封装起来，是最实用的自定义 hook。下面用的是**真实的 React API**（不是上面的简版）。

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

## 自定义 hook：useDebounce

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

关键还是在 `useEffect` 的清理函数：`value` 每次变化都会先 `clearTimeout` 掉上一轮定时器，只有「连续 `delay` 毫秒不变」定时器才能真正触发——这正是防抖的本质，原理同 [防抖节流](../scenario/debounce-throttle.md)。

## 自定义 hook：usePrevious

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

> **原理**：hook 状态按**调用顺序**存进数组，所以顺序不能变 → 不能写进条件 / 循环。
> **自定义 hook**：把「state + effect + 清理」打包复用；请求要用 `cancelled` 防卸载后更新，防抖靠 effect 清理函数清定时器，取上一次值靠 `useRef`。
