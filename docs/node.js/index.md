---
sidebar_position: 1
sidebar_label: 概览
slug: /node.js/
---

# Node.js

Node.js 是运行在服务端的 JavaScript 运行时，核心是 V8 引擎 + libuv 提供的事件驱动、非阻塞 I/O 模型。本章聚焦几个真正需要理解原理的主题：

- [架构](./架构.md)：Node.js 的分层结构，V8、libuv 与标准库如何协作。
- [事件循环](./事件循环.md)：单线程如何靠事件循环处理高并发 I/O，宏任务/微任务/各阶段的执行顺序。
- [进程与线程](./进程与线程.md)：进程与线程的区别、Node.js 的单线程模型与多进程/多线程方案（`cluster`、`worker_threads`）。
- [软链接和硬链接](./软链接和硬链接.md)：文件系统层面的两种链接，及其在包管理（如 `node_modules`）中的应用。
