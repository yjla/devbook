---
sidebar_position: 5
sidebar_label: 防抖与节流
---

# 防抖与节流

两者都是**限制高频事件的执行次数**，区别在「怎么限」：

- **防抖 (debounce)**：事件触发后等一段时间再执行，期间只要再次触发就**重新计时**。只认「最后一次」。
- **节流 (throttle)**：固定时间间隔内**最多执行一次**，不管触发多频繁。按「固定节奏」执行。

一个记忆类比：**防抖**像电梯——不断有人进来就一直等，直到没人进了才关门；**节流**像地铁——不管站台多少人，每隔固定时间发一班车。

## 防抖

核心是一个 `timer`：每次触发都先清掉上一个定时器，重新计时，只有「安静」够久才真正执行。

```ts
function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null;

  return function (this: unknown, ...args: Parameters<T>): void {
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

```ts
function throttle<T extends (...args: any[]) => any>(
  fn: T,
  interval: number,
): (...args: Parameters<T>) => void {
  let last = 0;

  return function (this: unknown, ...args: Parameters<T>): void {
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

## 一句话口诀

> **防抖看「最后一次」——不断触发就一直重新计时；节流看「固定节奏」——每隔一段最多跑一次。**

- 要「等用户停下来」→ 防抖（搜索联想）。
- 要「持续但别太频繁」→ 节流（滚动、拖拽）。
