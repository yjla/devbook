# Hooks



## 闭包陷阱

```js
function useMemoizedFn(fn) {
  const fnRef = useRef(fn);

  fnRef.current = useMemo(() => fn, [fn]);

  const memoizedFn = useRef();
  if (!memoizedFn.current) {
    memoizedFn.current = function (this, ...args) {
      return fnRef.current.apply(this, args);
    };
  }

  return memoizedFn.current;
}
```

设计思路：

1. 首次渲染，创建 `fnRef` 和 `memoizedFn` 这两个 Ref。`fnRef.current` 保存了第一次传入的 `fn` 的内存地址；`memoizedFn.current` 通过闭包机制保存 `fnRef.current` 的内存地址。
2. 之后每次渲染，`fnRef` 的内存地址并不会改变，但 `fnRef.current` 指向新传入 `fn` 的内存地址；`memoizedFn.current` 的内存地址没有改变（因此它所绑定的 prop 没变，不会触发重新渲染），但其通过闭包机制保存的 `fnRef.current` 改变了（因此每次都能执行最新传入的函数，获得新的函数入参）。



### 参考

1. [详解 React useCallback & useMemo - 掘金](https://juejin.cn/post/6844904101445124110)
2. [新的原生Hook？useEvent：一个显著降低Hooks心智负担的原生Hook - 掘金](https://juejin.cn/post/7094186419500875812)
3. [useMemoizedFn - ahooks 3.0](https://ahooks.js.org/zh-CN/hooks/use-memoized-fn)
4. [hooks/index.ts at master · alibaba/hooks](https://github.com/alibaba/hooks/blob/master/packages/hooks/src/useMemoizedFn/index.ts)