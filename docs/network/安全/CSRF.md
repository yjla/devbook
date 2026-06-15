# CSRF

CSRF 全称跨站请求伪造（Cross-Site Request Forgery）。首先，跨站和跨域（cross-origin）是不同的，只要协议相同，且顶级（一级）域名和二级域名相同，就属于同站，不用考虑端口号；然而，同源则要求协议，域名，端口号都相同。比如 `http://a.example.com` 和 `http://b.example.com` 就属于同站，但它们属于跨域。`http://a.example.com` 和 `https://b.example.com` 属于跨站，因为它们的协议不同。`http://a.github.io` 和 `http://b.github.io` 也属于跨站，因为 `github.io` 是一个公共域名，属于顶级域名，而 `a` 和 `b` 才属于二级域名，它们的二级域名不相同，所以当然是跨站。因此，同源一定同站，同站不一定同源。那什么是跨站请求？跨站请求指的是在一个网页上请求第三方网站（跨站）的资源。假设 A 网站 `http://a.example.com` 上有一个图片 `<img src="https://b.example.com" >`，或是有一个超链接 `<a href="https://b.example.com">超链接</a>`，那么一旦网页加载完成或是超链接被点击，浏览器就会向 B 网站 `https://b.example.com` 发起请求。与此同时，浏览器发出的请求头中会自动带上属于 B 网站的 Cookie，CSRF 正是利用这一特性进行攻击的。根据同源策略，虽然 A 网站没有获取到 B 网站的 Cookie，但是 A 网站像 B 网站发出跨站请求的时候浏览器自动带上属于 B 网站的 Cookie。假设 A 网站是一个恶意网站，而 B 是一个银行的付款页面，那这种跨站请求就相当于使用用户的 Cookie 伪造用户的操作。



## 防范 CSRF

- 验证码机制
- 验证 `Referer` 字段
- 双重 Cookie 验证
- CSRF Token
- 设置Cookie 的 `SameSite` 属性



## 参考

1. [前端安全系列之二：如何防止CSRF攻击？ - 掘金](https://juejin.cn/post/6844903689702866952)
2. [非常好的一片文章：CSRF - 知乎](https://zhuanlan.zhihu.com/p/158420450)
3. [对于跨站伪造请求（CSRF）的理解和总结 - 知乎](https://zhuanlan.zhihu.com/p/37293032)
4. [Cookie Samesite简析 - 知乎](https://zhuanlan.zhihu.com/p/266282015)
5. [Cookie - JavaScript 教程 - 网道](https://wangdoc.com/javascript/bom/cookie.html#samesite)