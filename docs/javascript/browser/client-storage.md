---
sidebar_label: localStorage、sessionStorage 与 Cookie
---

# `localStorage`、`sessionStorage` 与 Cookie

三者都把数据存在浏览器端，但定位完全不同：**Cookie 是为「让服务端识别身份」而生，Web Storage（`localStorage` / `sessionStorage`）才是为「前端存数据」而设计**。最关键的差异有两点——**容量**和**是否随请求自动发给服务器**。

## 对比

| | Cookie | localStorage | sessionStorage |
|---|---|---|---|
| 容量 | ~4KB | ~5MB | ~5MB |
| 生命周期 | 可设过期时间，不设则会话级 | 永久，需手动清除 | 标签页关闭即清除 |
| 作用域 | 同源（可按域/路径细分） | 同源共享 | **仅当前标签页**，不跨标签 |
| 随请求自动发送 | **是**，每次同源请求都带 | 否 | 否 |
| 访问方式 | `document.cookie`（字符串） | `localStorage` API | `sessionStorage` API |
| 设计初衷 | 维持 HTTP 会话状态 | 前端本地存储 | 单次会话的临时存储 |

## Cookie

HTTP 是无状态的——服务器记不住「这次请求和上次是同一个人」。Cookie 就是来补这个缺的：服务器通过 `Set-Cookie` 下发，浏览器之后**每次请求都自动在请求头里带上它**，服务端借此识别会话。

```js
document.cookie = 'token=abc; max-age=3600; path=/'; // 写，一次只能设一条
console.log(document.cookie); // 读，返回所有 cookie 拼成的字符串 "token=abc; theme=dark"
```

它的两个特点直接决定了用法：

- **每次请求都携带**：既是优点（服务端天然拿得到），也是缺点——哪怕是请求图片、CSS 也白白带上，浪费带宽，所以只该放身份标识这类必要的小数据。
- **容量只有 4KB**：存不了多少东西。

:::tip
Cookie 的安全属性很重要：`HttpOnly` 让 JS 读不到它（防 XSS 窃取）、`Secure` 限定只在 HTTPS 下发送、`SameSite` 限制跨站携带（防 CSRF）。正因为能设 `HttpOnly`，**敏感的登录凭证更推荐放 Cookie**，而不是 JS 能直接读到的 `localStorage`。
:::

## localStorage 与 sessionStorage

合称 Web Storage，API 完全一样，区别只在**活多久**：

```js
localStorage.setItem('theme', 'dark'); // 存
localStorage.getItem('theme'); // 取 → 'dark'
localStorage.removeItem('theme'); // 删一项
localStorage.clear(); // 清空
```

- **`localStorage`**：持久化，关掉浏览器、重启电脑都还在，除非手动清除或代码删除。适合存用户偏好（主题、语言）、不敏感的缓存数据。
- **`sessionStorage`**：会话级，**标签页一关就没**。而且作用域是**单个标签页**——同一个网站开两个标签页，各自的 `sessionStorage` 互不相通。适合存只在当前流程里有用的临时数据（如多步表单的中间状态）。

两者都**不会自动发给服务器**，纯客户端读写，没有 Cookie 那种每请求携带的开销。

:::warning
Web Storage 只能存字符串。存对象要先 `JSON.stringify`，取出来再 `JSON.parse`：

```js
localStorage.setItem('user', JSON.stringify({ name: 'Jade' }));
const user = JSON.parse(localStorage.getItem('user'));
```
:::

## 容量不够时

要存大量结构化数据或离线资源，Web Storage 的 5MB 就不够了，浏览器还提供：

- **IndexedDB**：浏览器内置的事务型数据库，容量大（通常按磁盘比例，可达数百 MB 以上），能存对象、二进制（图片、视频），支持索引查询。适合离线应用、大数据缓存。
- **Cache API**：配合 Service Worker 缓存 HTTP 请求的响应，让网站在断网时也能打开。是 PWA 离线能力的基础。
