---
sidebar_position: 1
sidebar_label: 请求封装
---

# 请求封装

一个请求库的能力，拆开看就是几个互相独立的小能力：响应缓存、请求去重、失败重试、超时控制。下面把它们一个个实现出来，最后用一个 Hook 组装，就是 mini 版 React Query。批量请求的并发控制是更通用的任务调度，单列为[并发调度器](./concurrency-scheduler.md)。

## 响应缓存

按 `key` 把响应存进一张表，下次同 key 直接返回缓存，不再发请求。`key` 和 `expireTime` 都是可选参数：`key` 不传就用 `url` 和 `params` 拼成的字符串兜底；`expireTime` 不传则永久有效。

```ts
interface CacheEntry<T> {
  data: T;
  expireAt: number; // 到期时刻的时间戳，0 表示永久有效
}

const cache = new Map<string, CacheEntry<unknown>>(); // key → { data, expireAt }

function getCache<T>(
  url: string,
  params: unknown,
  key?: string,
  expireTime?: number,
): Promise<T> {
  // 没传 key 就用 url + 序列化的 params 兜底，key 只是唯一标识
  const cacheKey = key ?? url + JSON.stringify(params);

  // 有缓存，且没设过期或还没到期，直接返回，根本不发请求
  const cached = cache.get(cacheKey) as CacheEntry<T> | undefined;
  if (cached && (!cached.expireAt || cached.expireAt > Date.now())) {
    return Promise.resolve(cached.data);
  }

  // 没缓存或已过期，发请求，成功后存进缓存
  return fetch(url, { method: 'POST', body: JSON.stringify(params) })
    .then((res) => res.json() as Promise<T>)
    .then((data) => {
      // 设了过期时间就记下到期时刻，没设则用 0 表示永久有效
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

缓存防「以后」，去重防「**此刻**」：同一份数据被多处**同时**请求，只发一次真实请求，大家共享同一个 Promise。

```ts
const pendingFetch = new Map<string, Promise<unknown>>(); // key → 正在飞行的 Promise

function dedupe<T>(url: string, params: unknown): Promise<T> {
  const key = url + JSON.stringify(params); // url + params 当唯一标识

  // 已有同 key 请求在飞，直接复用它的 Promise
  if (pendingFetch.has(key)) return pendingFetch.get(key) as Promise<T>;

  const promise = fetch(url, { method: 'POST', body: JSON.stringify(params) })
    .then((res) => res.json() as Promise<T>)
    .finally(() => {
      pendingFetch.delete(key); // 请求结束（成功或失败），移出飞行表
    });
  pendingFetch.set(key, promise);
  return promise;
}
```

:::info
缓存存的是「**已完成的数据**」，去重存的是「**进行中的 Promise**」。两者配合：页面同时挂载 10 个用到同一份数据的组件，去重保证只发 1 次请求，请求回来后缓存接管，之后再访问走缓存。
:::

## 失败重试

失败后隔一会儿再试，重试若干次，全失败才抛出错误。用**递归 + 剩余次数**控制。

```ts
const wait = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

function retry<T>(
  url: string,
  params: unknown,
  times = 3,
  delay = 0,
): Promise<T> {
  return fetch(url, { method: 'POST', body: JSON.stringify(params) })
    .then((res) => res.json() as Promise<T>)
    .catch((err) => {
      if (times <= 0) throw err; // 次数用完，彻底失败
      return wait(delay).then(() => retry<T>(url, params, times - 1, delay));
    });
}
```

:::info
每次失败 `times - 1`，`wait(delay)` 留出间隔。生产环境常用「**指数退避**」——每次间隔翻倍（`delay * 2`），避免服务端抖动时所有客户端同时重试造成雪崩。
:::

## 超时控制

请求不能无限等。用 `Promise.race` 让「真实请求」和「定时器」赛跑，谁先结束用谁——定时器先 reject 就算超时。

```ts
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  const timeout = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error('请求超时')), ms);
  });
  return Promise.race([promise, timeout]); // 谁先结束用谁
}
```

## 请求 Hook

前面的缓存、去重、重试、超时都是**和 React 无关的纯逻辑**，能脱离组件单独用。最后只差一步：把「异步取数」接到组件上——这正是 Hook 的唯一职责，**把数据同步到组件、触发重渲染**。

如果每个组件都把结果存进自己的 `state`，10 个组件用同一份数据就要发 10 次请求、各存一份。所以把数据搬到**组件外的全局缓存**，组件只是「订阅」它：同一个 key 共享一份数据、一次请求，缓存一变，所有订阅者一起重渲染——本质就是[发布订阅](./event-emitter.md)。

先建一个**脱离 React 的全局 store**：一张缓存表 + 一张订阅表（key → 用到该 key 的回调集合）。

```ts
type Listener = () => void;

const cache = new Map<string, unknown>(); // key → 数据
const listeners = new Map<string, Set<Listener>>(); // key → Set<回调>，谁在用这个 key

// 订阅某个 key，返回退订函数
function subscribe(key: string, callback: Listener): () => void {
  if (!listeners.has(key)) listeners.set(key, new Set());
  listeners.get(key)!.add(callback);
  return () => listeners.get(key)!.delete(callback);
}

// 写缓存 + 通知所有订阅了该 key 的组件
function setCache<T>(key: string, data: T): void {
  cache.set(key, data);
  listeners.get(key)?.forEach((notify) => notify());
}
```

Hook 用 `useSyncExternalStore` 订阅这个外部 store——它是 React 官方为「订阅组件外状态」提供的 API，缓存变了就让用到它的组件重渲染：

```ts
function useQuery<T>(url: string, params: unknown): T | undefined {
  const key = url + JSON.stringify(params);

  // 订阅全局缓存里这个 key：变了就重渲染，读到的是同一份快照
  const data = useSyncExternalStore<T | undefined>(
    (notify) => subscribe(key, notify), // 怎么订阅
    () => cache.get(key) as T | undefined, // 怎么读当前值
  );

  useEffect(() => {
    if (cache.has(key)) return; // 已有缓存，直接复用，不再发请求
    fetch(url, { method: 'POST', body: JSON.stringify(params) })
      .then((res) => res.json() as Promise<T>)
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
