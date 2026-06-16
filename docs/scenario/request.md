---
sidebar_position: 3
sidebar_label: 3 请求封装
---

# 请求封装

一个请求库的能力，拆开看就是几个互相独立的小能力：响应缓存、请求去重、失败重试、超时控制。下面把它们一个个实现出来，最后用一个 Hook 组装，就是 mini 版 React Query。批量请求的并发控制是更通用的任务调度，单列为[并发调度](./concurrency-scheduler.md)。

## 响应缓存

按 `key` 把响应存进一张表，下次同 key 直接返回缓存，不再发请求。形象例子：像**点外卖留小票**——同一家店同样的单子，下次照着小票直接出餐，不用重新做。`key` 和 `expireTime` 都是可选参数。

```js
const cache = new Map(); // key → { data, expireAt }

function getCache(url, params, key, expireTime) {
  // 第一步：算出缓存 key。没传就用 url + 序列化的 params 兜底，key 只是唯一标识
  const cacheKey = key ?? url + JSON.stringify(params);

  // 第二步：查小票。有缓存、且没设过期或还没到期，直接返回，根本不发请求
  const cached = cache.get(cacheKey);
  if (cached && (!cached.expireAt || cached.expireAt > Date.now())) {
    return Promise.resolve(cached.data);
  }

  // 第三步：没缓存或已过期，发请求
  return fetch(url, { method: 'POST', body: JSON.stringify(params) })
    .then((res) => res.json())
    .then((data) => {
      // 第四步：成功后存进缓存。设了过期时间就记下到期时刻，没设则用 0 表示永久有效
      const expireAt = expireTime ? Date.now() + expireTime : 0;
      cache.set(cacheKey, { data, expireAt });
      return data;
    });
}
```

:::tip
缓存防的是「**以后再请求**」——这次请求过了，下次同 key 直接拿结果。这里的 `expireTime` 是**硬过期**：到期后下次访问直接当没缓存、重新发请求。真实的库更进一步做**软过期**（`staleTime`）——到期后先返回旧值、再后台静默刷新，让用户不必等待。
:::

## 请求去重

缓存防「以后」，去重防「**此刻**」：同一份数据被多处**同时**请求，只发一次真实请求，大家共享同一个 Promise。形象例子：一桌人都喊「来杯可乐」，服务员只跑一趟吧台，回来一人一杯，而不是每喊一声跑一趟。

```js
const pendingFetch = new Map(); // key → 正在飞行的 Promise

function dedupe(url, params) {
  // 第一步：算唯一标识
  const key = url + JSON.stringify(params);

  // 第二步：已有同 key 请求在飞，直接复用它的 Promise，不再发新的
  if (pendingFetch.has(key)) return pendingFetch.get(key);

  // 第三步：没有在飞的，发一次真实请求
  const promise = fetch(url, { method: 'POST', body: JSON.stringify(params) })
    .then((res) => res.json())
    .finally(() => {
      // 第四步：请求结束（无论成败），把它移出飞行表，下次才会重新发
      pendingFetch.delete(key);
    });

  // 第五步：登记进飞行表，供这期间的其他调用复用
  pendingFetch.set(key, promise);
  return promise;
}
```

:::info
缓存存的是「**已完成的数据**」，去重存的是「**进行中的 Promise**」。两者配合：页面同时挂载 10 个用到同一份数据的组件，去重保证只发 1 次请求，请求回来后缓存接管，之后再访问走缓存。
:::

## 失败重试

失败后隔一会儿再试，重试若干次，全失败才抛出错误。用**递归 + 剩余次数**控制。形象例子：像**打电话占线了再拨**——隔几秒重拨一次，拨满三次还不通才放弃。

```js
const wait = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

function retry(url, params, times = 3, delay = 0) {
  // 第一步：正常发一次请求
  return fetch(url, { method: 'POST', body: JSON.stringify(params) })
    .then((res) => res.json())
    .catch((err) => {
      // 第二步：失败了，先看还有没有重试次数
      if (times <= 0) throw err; // 次数用完，彻底失败，把错误抛出去

      // 第三步：还有次数，等 delay 毫秒后，把剩余次数减一再递归重试
      return wait(delay).then(() => retry(url, params, times - 1, delay));
    });
}
```

:::info
每次失败 `times - 1`，`wait(delay)` 留出间隔。生产环境常用「**指数退避**」——每次间隔翻倍（`delay * 2`），避免服务端抖动时所有客户端同时重试造成雪崩。
:::

## 超时控制

请求不能无限等。用 `Promise.race` 让「真实请求」和「定时器」赛跑，谁先结束用谁——定时器先 reject 就算超时。形象例子：像**等公交时给自己定个闹钟**，公交先到就上车，闹钟先响就改打车，不会傻等一整天。

```js
function withTimeout(promise, ms) {
  // 第一步：造一个「只会超时 reject、永远不会 resolve」的定时器 Promise
  const timeout = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('请求超时')), ms);
  });

  // 第二步：让真实请求和定时器赛跑，谁先结束用谁
  return Promise.race([promise, timeout]);
}
```

## 请求 Hook

前面的缓存、去重、重试、超时都是**和 React 无关的纯逻辑**，能脱离组件单独用。最后只差一步：把「异步取数」接到组件上——这正是 Hook 的唯一职责，**把数据同步到组件、触发重渲染**。

如果每个组件都把结果存进自己的 `state`，10 个组件用同一份数据就要发 10 次请求、各存一份。所以把数据搬到**组件外的全局缓存**，组件只是「订阅」它：同一个 key 共享一份数据、一次请求，缓存一变，所有订阅者一起重渲染——本质就是[发布订阅](./event-emitter.md)。

形象例子：全局缓存像**小区门口的公告栏**，数据贴在栏上只贴一份；各家各户（组件）不用各自抄一遍，只要「关注」公告栏，栏上一更新，关注的人都看到最新的。

先建一个**脱离 React 的全局 store**：一张缓存表 + 一张订阅表（key → 用到该 key 的回调集合）。

```js
const cache = new Map(); // key → 数据（公告栏贴的内容）
const listeners = new Map(); // key → Set<回调>，谁在关注这个 key

// 订阅某个 key，返回退订函数
function subscribe(key, callback) {
  // 第一步：这个 key 还没人关注，先建一个空的关注名单
  if (!listeners.has(key)) listeners.set(key, new Set());

  // 第二步：把这个回调加进关注名单
  listeners.get(key).add(callback);

  // 第三步：返回退订函数，组件卸载时把自己从名单里划掉
  return () => listeners.get(key).delete(callback);
}

// 写缓存 + 通知所有关注了该 key 的组件
function setCache(key, data) {
  cache.set(key, data); // 更新公告栏内容
  listeners.get(key)?.forEach((notify) => notify()); // 挨个通知关注者
}
```

Hook 用 `useSyncExternalStore` 订阅这个外部 store——它是 React 官方为「订阅组件外状态」提供的 API，缓存变了就让用到它的组件重渲染：

```js
function useQuery(url, params) {
  // 第一步：算出这次请求对应的 key
  const key = url + JSON.stringify(params);

  // 第二步：订阅全局缓存里这个 key。变了就重渲染，读到的是同一份快照
  const data = useSyncExternalStore(
    (notify) => subscribe(key, notify), // 怎么订阅
    () => cache.get(key), // 怎么读当前值
  );

  // 第三步：首次用到这个 key 且缓存里没有时，才去发请求
  useEffect(() => {
    if (cache.has(key)) return; // 已有缓存，直接复用，不再发请求
    fetch(url, { method: 'POST', body: JSON.stringify(params) })
      .then((res) => res.json())
      .then((res) => setCache(key, res)); // 写进全局缓存，自动通知所有订阅者
  }, [key]);

  return data; // 没缓存时为 undefined，可据此显示 loading
}
```

:::tip
分工很清晰：**数据存在组件外的全局缓存里，Hook 只负责订阅它、同步到 UI**。所以同一个 key 多个组件共享一份数据、只发一次请求，一处更新全员重渲染。而重试、超时这些取数增强是与框架无关的普通函数，按需在 `fetch` 外层叠加即可。
:::

:::info
`useSyncExternalStore`（React 18+）专为「订阅组件外部的可变数据源」设计，能保证并发渲染下所有组件读到**一致的快照**，避免手动 `useState` + 事件监听可能出现的状态撕裂。这套「全局缓存 + 按 key 订阅 + 写时通知」正是 React Query、SWR 缓存层的核心骨架。
:::
