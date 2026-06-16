---
sidebar_label: DOMContentLoaded 与 load
---

# `DOMContentLoaded` 与 `load`

两个事件标志着页面加载的不同阶段：**`DOMContentLoaded` 是「结构就绪」，`load` 是「全部就绪」**。

- **`DOMContentLoaded`**：HTML 被解析完、DOM 树构建完成就触发，**不等**图片、样式表、iframe 等外部子资源。
- **`load`**：页面**所有资源**（图片、CSS、脚本、iframe）都加载完毕才触发。

```js
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM 树好了，可以操作元素、绑事件了');
});

window.addEventListener('load', () => {
  console.log('图片等所有资源也加载完了');
});
```

时间线上 `DOMContentLoaded` 总是先于 `load`——有时早很多，因为一张大图就能让 `load` 多等好几秒。

```
解析 HTML ─▶ DOM 构建完成 ─▶ [DOMContentLoaded] ─▶ 图片/样式等加载完 ─▶ [load]
```

## 为什么大多数初始化用 `DOMContentLoaded`

绑事件、初始化组件这些操作只需要 DOM 元素存在就行，不必等图片下载完。用 `DOMContentLoaded` 能让交互**尽早可用**，而不是干等几秒。jQuery 时代的 `$(document).ready()` 本质就是它。

只有当逻辑**真的依赖资源尺寸**时才用 `load`，比如要读取图片的真实宽高来排版。

## 谁会拖慢 `DOMContentLoaded`

`DOMContentLoaded` 等的是「DOM 解析完」，所以凡是**阻塞 HTML 解析**的东西都会推迟它：

- **同步 `<script>`**：解析 HTML 时遇到它会暂停解析、先下载执行脚本，DOM 解析被卡住，`DOMContentLoaded` 随之推迟。
- **脚本前面的 CSS**：CSS 本身不阻塞 DOM 解析，但如果它后面跟着 `<script>`，浏览器会**先等 CSSOM 构建完**再执行脚本（脚本可能读样式），脚本又卡着 DOM 解析——于是 CSS **间接**拖慢了 `DOMContentLoaded`。
- **`defer` 脚本**：在 `DOMContentLoaded` **之前**按顺序执行完，所以它也会让 `DOMContentLoaded` 等自己。

:::info
`async` 脚本是例外：它和 `DOMContentLoaded` **互不等待**——脚本可能在事件前执行，也可能在后，取决于谁先下载完。详见 [脚本加载时机](../../html/script-loading.md)。
:::

## 对比

| | `DOMContentLoaded` | `load` |
|---|---|---|
| 触发时机 | DOM 树构建完成 | 所有资源加载完成 |
| 等图片 / CSS / iframe | 否 | 是 |
| 监听对象 | `document` | `window` |
| 典型用途 | 绑事件、初始化 UI | 依赖资源尺寸的逻辑 |
| 先后 | 先 | 后 |
