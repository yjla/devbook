---
sidebar_position: 1
sidebar_label: 概览
slug: /html/
---

# HTML

HTML 看着简单，真正考验理解的就几处：文档怎么组织、元素怎么排布、资源怎么加载。这几处搞透，比背一堆标签清单有用得多。

本章聚焦四个核心问题：

- [HTML 结构](./html-structure.md)——一个文档的骨架，`<!DOCTYPE>`、`<head>`、`<body>` 各自的职责，以及语义化标签
- [行内元素与块级元素](./inline-vs-block.md)——标准文档流下，元素默认怎么排布
- [`src` 与 `href`](./src-vs-href.md)——嵌入资源还是建立引用，一字之差行为全不同
- [`defer` 与 `async`](./defer-vs-async.md)——脚本加载与执行的时机，直接影响首屏速度
