# `host`、`origin` 和 `referer` 的区别

- `Host` 由域名+端口号组成，用于决定访问哪个虚拟主机。
- `Origin` 由协议+域名+端口号组成，只在 CORS 请求和除 GET 和 HEAD 以外的同源请求才会被带上。
- `Referer` 由协议+域名+端口号+路径+参数组成，标识了当前页面是通过哪个页面里的链接跳转进入的，可用于统计分析、日志记录、缓存优化、图片防盗链等。



## 参考

1. [HTTP headers 之 host, referer, origin - 掘金](https://juejin.cn/post/6844903954455724045)
2. [Host - HTTP | MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Host)
3. [Origin - HTTP | MDN	](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Origin)
4. [Referer - HTTP | MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Referer)