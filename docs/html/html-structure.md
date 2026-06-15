---
sidebar_position: 2
sidebar_label: HTML 结构
---

# HTML 结构

一个 HTML 文档拆开看就两部分：**`<head>` 放给浏览器和搜索引擎看的元信息，`<body>` 放给用户看的内容**。外面再套一层声明和根元素。

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>页面标题</title>
  </head>
  <body>
    <!-- 用户能看到的内容 -->
  </body>
</html>
```

## `<!DOCTYPE html>`

它不是标签，是给浏览器的一句声明：**用标准模式（standards mode）渲染**。

写了它，浏览器按 W3C 标准解析；不写，浏览器进入**怪异模式（quirks mode）**——模拟上世纪老浏览器的行为，最典型的坑是盒模型变成 IE 老式的「`width` 包含 padding 和 border」，布局全乱。

HTML5 的写法就这一行，没有版本号。早年 HTML4 那串又长又记不住的 DTD（`<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"...>`）已经成为历史。

## `<html lang>`

`lang` 声明页面主语言。别小看它：

- **屏幕阅读器**据此选择发音语种，读中文还是英文
- **浏览器翻译**据此判断是否提示翻译
- **搜索引擎**据此做语言匹配

中文页面写 `lang="zh-CN"`，是基本的可访问性素养。

## `<head>`：元信息

`<head>` 里的内容不渲染到页面上，是给机器看的配置。

```html
<head>
  <!-- 字符编码，必须放在 head 最前面 -->
  <meta charset="UTF-8" />

  <!-- 移动端视口：宽度等于设备宽度，初始不缩放 -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <!-- 给搜索引擎的页面描述，常显示在搜索结果摘要里 -->
  <meta name="description" content="这个页面讲什么" />

  <title>页面标题</title>

  <link rel="stylesheet" href="/style.css" />
</head>
```

:::warning
`<meta charset>` 要放在 `<head>` 的**最前面**（前 1024 字节内）。浏览器解析时先要确定用哪种编码来解释后面的字节，编码声明出现得太晚，前面的中文可能已经被按错误编码解析成乱码。
:::

`<meta viewport>` 是移动端适配的起点。不写它，手机浏览器会假设页面是为 980px 宽的桌面设计的，然后整体缩小塞进屏幕，文字小到看不清。`width=device-width` 让视口宽度等于设备逻辑宽度，页面才会按手机尺寸布局。

## `<body>`：用语义标签搭骨架

`<body>` 里别一律用 `<div>`。HTML5 提供了一组**语义化标签**，标签名本身就说明了这块区域是干什么的：

```html
<body>
  <header>页头：logo、导航</header>
  <nav>主导航</nav>
  <main>
    <article>
      <section>正文的一个章节</section>
      <section>另一个章节</section>
    </article>
    <aside>侧边栏：相关推荐</aside>
  </main>
  <footer>页脚：版权、备案号</footer>
</body>
```

| 标签 | 含义 |
|---|---|
| `<header>` | 页头或某区块的头部 |
| `<nav>` | 导航链接区 |
| `<main>` | 页面主体内容，一个页面只能有一个 |
| `<article>` | 可独立成篇的内容，如一篇博客、一条评论 |
| `<section>` | 主题相关的一段内容，通常带标题 |
| `<aside>` | 与主内容相关但可剥离的部分，如侧边栏 |
| `<footer>` | 页脚或某区块的尾部 |

语义化不是为了好看，换 `<div class="header">` 一样能渲染。它的价值在**机器能读懂结构**：

- **可访问性**：屏幕阅读器能直接跳到 `<nav>`、`<main>`，盲人用户不用从头听到尾
- **SEO**：搜索引擎更准确地理解哪块是正文、哪块是导航
- **可维护**：`<header>` 比 `<div class="top-wrap-box">` 一眼就知道是什么

:::tip
判断该用 `<section>` 还是 `<div>`：如果这块内容**有自己的主题、能配一个标题**，用 `<section>`；如果纯粹是为了 CSS 布局、套个样式容器，用 `<div>`。`<div>` 没有语义，是纯粹的「无意义容器」，这正是它该承担的角色。
:::
