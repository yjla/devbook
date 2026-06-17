# React Native

React Native 让你用 React 写出渲染到原生组件的移动应用——不是套壳 WebView，而是 JS 驱动真正的 `UIView` / `android.view`。本章按运行链路拆成五个主题:

| 主题 | 内容 |
| --- | --- |
| **1 架构与运行原理** | 旧 Bridge 架构 vs 新 JSI 架构、三线程模型 |
| **2 JS 引擎** | JSC vs Hermes、AOT 字节码预编译 |
| **3 渲染原理** | JS 组件树如何映射到原生视图、样式与布局差异 |
| **4 通信机制** | Bridge 异步序列化 vs JSI 同步调用 |
| **5 性能优化** | 启动、列表、动画、内存的优化手段 |
