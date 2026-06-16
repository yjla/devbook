# React Native

React Native 让你用 React 写出渲染到原生组件的移动应用——不是套壳 WebView，而是 JS 驱动真正的 `UIView` / `android.view`。本章按运行链路拆成六个主题:

| 主题 | 内容 |
| --- | --- |
| **1 架构与运行原理** | 旧 Bridge 架构 vs 新 JSI 架构、三线程模型、Hermes 引擎 |
| **2 渲染原理** | JS 组件树如何映射到原生视图、样式与布局差异 |
| **3 通信机制** | Bridge 异步序列化 vs JSI 同步调用 |
| **4 性能优化** | 启动、列表、动画、内存的优化手段 |
| **5 与原生交互** | 原生模块、原生 UI 组件、事件与回调 |
| **6 高频考点** | RN vs 原生 / Flutter、热更新、Metro、Fast Refresh、闪退排查 |
