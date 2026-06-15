# TCP 和 UDP 的区别

- 连接：TCP 是面向连接，UDP 是不需要连接。
- 服务对象：TCP 仅支持一对一，UDP 支持一对一、一对多、多对多。
- 可靠性：TCP 是可靠交付数据，UDP 不保证可靠交付数据。
- 拥塞控制：TCP 有拥塞控制和流量控制机制，UDP 没有。
- 首部开销：TCP 首部长度较长，UDP 首部开销较小。
- 传输方式：TCP 是流式传输，UDP 是一个包一个包的发送。
- 应用场景：TCP适用于对准确性要求高，对实时性要求低的场景，如文件传输、HTTP/HTTPS；UDP适用于对实时性要求高，对准确性要求低的场景，如视频通话、DNS



## 参考

1. [4.1 TCP 三次握手与四次挥手面试题 | 小林coding](https://xiaolincoding.com/network/3_tcp/tcp_interview.html)
2. [一文搞懂TCP与UDP的区别 - Fundebug - 博客园](https://www.cnblogs.com/fundebug/p/differences-of-tcp-and-udp.html)