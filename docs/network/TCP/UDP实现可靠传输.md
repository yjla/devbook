# UDP 实现可靠传输

UDP 是一种纯洁的协议，相比较 IP 协议，它仅仅多了一个端口号，所以 UDP 协议拥有 IP 协议的所有特点，比如无序性，不保证可靠性。如果想要 UDP 实现可靠传输，我们只需要在其基础上复刻 TCP 的重传机制、滑动窗口、流量控制、拥塞控制等特性。

让 UDP 实现可靠传输的相关协议：

- QUIC
- RUDP
- RTP
- UDT



## 参考

1. [4.17 如何基于 UDP 协议实现可靠传输？ | 小林coding](https://xiaolincoding.com/network/3_tcp/quic.html)
2. [UDP实现可靠性传输 - 掘金](https://juejin.cn/post/6844904016225239048)
3. [为什么 HTTP/3 基于UDP，可靠么？ - 掘金](https://juejin.cn/post/6984315270038814727)