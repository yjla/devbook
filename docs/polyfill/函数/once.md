---
sidebar_position: 5
sidebar_label: once
---

# once 只执行一次

`once` 包装一个函数，让它**无论调用多少次，只真正执行第一次**，之后每次都直接返回第一次的结果。典型用途：初始化逻辑、只想绑定一次的事件、只想发一次的请求。

实现核心是闭包：用一个标志位记住「有没有执行过」，再用一个变量缓存「第一次的结果」。

```js
function once(fn) {
  // 第一步：用闭包变量记录状态
  // called 记「有没有执行过」，result 缓存「第一次的结果」
  let called = false;
  let result;

  // 第二步：返回一个包装后的新函数
  return function (...args) {
    // 第三步：只有没执行过时，才真正调用 fn
    if (!called) {
      called = true; // 先把标志翻过来，防止重入时再次进入
      result = fn.apply(this, args); // 执行并缓存结果，this 透传给 fn
    }

    // 第四步：无论第几次调用，都返回第一次的结果
    return result;
  };
}

const init = once(() => {
  console.log("初始化中...");
  return "ready";
});

init(); // 打印「初始化中...」，返回 "ready"
init(); // 不打印，直接返回 "ready"
init(); // 不打印，直接返回 "ready"
```

:::tip 形象记忆
像 **景区门口的一次性手环**：第一次进门，工作人员给你扣上手环（执行 `fn`、记下结果）；之后你再走到门口，工作人员看一眼手环就放行（返回缓存），不会再给你扣第二个手环。`called` 就是那只手环。
:::
