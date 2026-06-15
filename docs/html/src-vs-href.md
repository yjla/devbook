---
sidebar_position: 4
sidebar_label: src 与 href
---

# `src` 与 `href`

一句话区分：**`src` 是把外部资源「嵌进来」，`href` 是和外部资源「建立引用」**。一个是把东西塞进当前元素、成为页面的一部分，一个只是指个路、表明关系。

## `src`：嵌入资源

`src` 是 source 的缩写，用在 `<img>`、`<script>`、`<iframe>`、`<audio>`、`<video>` 上。浏览器会**下载这个资源，并把它的内容替换/填充到当前元素里**——这个元素本身没有内容，内容全靠 `src` 指向的东西。

```html
<img src="logo.png" />
<!-- 图片下载下来，显示在 img 的位置 -->

<script src="app.js"></script>
<!-- 脚本下载下来，在这里执行 -->
```

因为资源是元素不可缺的组成部分，浏览器**默认要等它加载、处理完**。`<script src>` 尤其典型：解析到它时会暂停 HTML 解析，先下载并执行脚本，再继续——这就是「阻塞」。所以传统建议把 `<script>` 放在 `<body>` 末尾，避免它卡住上面内容的渲染（更现代的做法见 [`defer` 与 `async`](./defer-vs-async.md)）。

## `href`：建立引用

`href` 是 hypertext reference 的缩写，用在 `<a>`、`<link>` 上。它**不把资源嵌进来，只是声明当前文档和另一个资源的关联**。

```html
<a href="https://example.com">跳转链接</a>
<!-- 只是指向另一个页面，点了才去 -->

<link rel="stylesheet" href="style.css" />
<!-- 声明引用这个样式表 -->
```

引用关系不需要阻塞解析。浏览器解析到 `<link rel="stylesheet">` 时，会**并行下载 CSS，同时继续解析 HTML**，不会停下来等。

:::info
注意区分「阻塞解析」和「阻塞渲染」：`<link>` 的 CSS 下载**不阻塞 HTML 解析**（DOM 照常构建），但**会阻塞渲染**——浏览器要等 CSS 到位、算出每个元素长啥样，才会把页面画出来，否则会出现没样式的「裸页」闪烁。`<script src>` 则是连解析都一起阻塞。
:::

## 对比

| | `src` | `href` |
|---|---|---|
| 含义 | source，嵌入资源 | reference，建立引用 |
| 资源角色 | 元素内容的一部分 | 一个被指向的目标 |
| 典型标签 | `img` `script` `iframe` | `a` `link` |
| 对解析的影响 | `script` 默认阻塞解析 | 不阻塞解析 |

把 `<script>` 的 `src` 换成 `href`、或把 `<a>` 的 `href` 换成 `src`，浏览器都不认——属性和标签是配死的，背后正是「嵌入」和「引用」这两种根本不同的语义。
