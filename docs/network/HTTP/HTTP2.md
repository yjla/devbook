# HTTP/2

- 二进制分帧层：这是一个在 HTTP/1.1 和底层传输协议之间附加的步骤，代替了原本的明文传输。HTTP/1.1 以及更早的 HTTP 协议报文都是语义可读的。在 HTTP/2中，这些报文被嵌入到了一个新的二进制结构，帧（frame）。帧允许实现很多优化，比如报文头部压缩和多路复用。即使只有原始 HTTP 报文的一部分以 HTTP/2 发送出来，每条报文的语义依旧不变，客户端会重组原始 HTTP/1.1 请求。因此用 HTTP/1.1 格式来理解 HTTP/2 报文仍旧有效。
- 多路复用：将 HTTP/1.x 消息分成帧并嵌入到流（stream）中，不同流中的帧交错地发送给客户端，每帧的 Stream Identifier 的标明这一帧属于哪个流。客户端收到后，根据 Stream Identifier 重组每个流。这种并行方法从根源上移除了 HTTP/1.x 中顺序和阻塞的约束。
- 头部压缩：在 HTTP/1.x 中，头部不像数据主体，不会被压缩；而头部在一系列请求中又常常是相似的。HTTP/2 采用 HPACK 压缩头部，解决了这两个问题。
- 服务器端推送：服务器可以预测客户端需要的资源，主动推送到客户端。



## 局限性

- TCP/TLS 握手会占用时间
- TCP 巨大的头部会浪费带宽
- TCP 层面仍存在队头阻塞问题
- 多路复用会导致服务器压力上升，且容易超时



## 参考

1. [QUIC——快速UDP网络连接协议 - 掘金](https://juejin.cn/post/7066993430102016037#heading-1)
2. [解读 HTTP1/HTTP2/HTTP3 - 掘金](https://juejin.cn/post/6995109407545622542#heading-14)
3. [HTTP的发展 - HTTP | MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Basics_of_HTTP/Evolution_of_HTTP)
4. [面试官问：你了解HTTP2.0吗？ - 掘金](https://juejin.cn/post/6844903734670000142)
5. [HTTP2 详解 - 掘金](https://juejin.cn/post/6844903667569541133)

