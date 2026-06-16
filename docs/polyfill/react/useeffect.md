---
sidebar_position: 3
sidebar_label: useEffect
---

# 简版 useEffect 原理

结论先行：`useEffect` 同样共用「储物柜数组 + 下标指针」机制，它在自己这一格里存的是**上一次的依赖数组**。每次渲染都拿「这次的依赖」和「上次的依赖」逐项比对，**只有变了才执行回调**。

```js
function useEffect(callback, deps) {
  // 第一步：锁住自己这一格的下标
  const currentIndex = hookIndex;

  // 第二步：取出上一次存在这一格里的依赖数组
  const prevDeps = hookStates[currentIndex];

  // 第三步：判断要不要执行回调
  // 分两种情况，拆开写更清楚：
  let hasChanged;
  if (prevDeps === undefined) {
    // 情况一：首次渲染，没有上次依赖可比 → 必须执行
    hasChanged = true;
  } else {
    // 情况二：逐项浅比较，只要有一项 !== 上次，就算变了
    hasChanged = deps.some((dep, i) => dep !== prevDeps[i]);
  }

  // 第四步：变了才跑回调
  if (hasChanged) {
    callback();
  }

  // 第五步：把本次依赖存进储物柜，留给下次比较
  hookStates[currentIndex] = deps;

  // 第六步：指针后移
  hookIndex++;
}
```

依赖比较用的是 `!==` 逐项浅比较。所以传对象 / 数组 / 内联函数当依赖时，每次渲染都是新引用，会被判定为「变了」而反复执行——这正是 `useCallback` / `useMemo` 存在的意义。

用一个形象的例子理解：`useEffect` 就像**小区门口认人的保安**。他手上记着你上次进门时的样子（`prevDeps`）。你每次回来，他都逐项核对：发型变了吗、衣服变了吗、戴眼镜了吗（逐项 `!==`）。只要有一项对不上，他就重新登记一遍、给你办新出入证（执行 `callback`）；如果你和上次长得一模一样，他就直接放行、啥也不做（跳过回调）。而你第一次来时他没有记录可比对，所以必然要给你登记一次（首次必执行）。

:::info
真实的 `useEffect` 还会在下一次执行前调用上一轮回调返回的**清理函数**，并把 effect 推迟到浏览器绘制之后异步执行。这里只演示「依赖比较」这一核心。
:::

## 一句话口诀

> **useEffect**：把依赖数组存进 hook 槽位，下次渲染像保安认人一样逐项 `!==` 比较，变了才跑回调。
