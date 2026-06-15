---
sidebar_position: 1
sidebar_label: 响应式原理
---

# 响应式原理 (Vue 双版本)

响应式 = **数据一变，用到它的地方自动更新**。核心就一件事：**拦截对数据的「读」和「写」**——读的时候记下「谁用了我」（依赖收集），写的时候通知它们更新（派发更新）。Vue2 用 `Object.defineProperty` 拦截，Vue3 换成了 `Proxy`。

## Vue2：Object.defineProperty

给对象的**每个属性**单独装上 getter / setter：读走 getter、写走 setter，我们就有了拦截点。

```js
function defineReactive(obj, key, value) {
  observe(value); // 值本身可能是对象，递归处理

  Object.defineProperty(obj, key, {
    get() {
      // 依赖收集：记录"谁读了这个属性"
      console.log(`读取 ${key}`);
      return value;
    },
    set(newValue) {
      if (newValue === value) return;
      // 派发更新：通知所有用到它的地方
      console.log(`设置 ${key} = ${newValue}`);
      value = newValue;
      observe(newValue); // 新值也要递归处理
    },
  });
}

function observe(obj) {
  if (typeof obj !== 'object' || obj === null) return;
  Object.keys(obj).forEach((key) => defineReactive(obj, key, obj[key]));
}
```

:::warning
`Object.defineProperty` 的几个硬伤，也是 Vue2 一堆「奇怪 API」的由来：

- **新增 / 删除属性监听不到**：`obj.newProp = 1` 不会触发更新，必须用 `Vue.set` / `Vue.delete`。
- **数组下标和 `length` 监听不到**：`arr[0] = x`、`arr.length = 0` 都无效，Vue2 靠**重写数组的 7 个变异方法**（`push`/`pop`/`splice` 等）变相支持。
- **必须初始化时深度递归**整个对象，数据大时开销明显。
:::

## Vue3：Proxy

`Proxy` 直接代理**整个对象**，一次拦截读、写、删等所有操作，从根上解决了上面的问题。

```js
function reactive(obj) {
  if (typeof obj !== 'object' || obj === null) return obj;

  return new Proxy(obj, {
    get(target, key, receiver) {
      console.log(`读取 ${key}`); // 依赖收集
      const result = Reflect.get(target, key, receiver);
      // 惰性递归：读到嵌套对象时才代理它，比 Vue2 提前深递归更省
      return typeof result === 'object' && result !== null
        ? reactive(result)
        : result;
    },
    set(target, key, value, receiver) {
      console.log(`设置 ${key} = ${value}`); // 派发更新
      return Reflect.set(target, key, value, receiver);
    },
    deleteProperty(target, key) {
      console.log(`删除 ${key}`); // 删除也能拦截到
      return Reflect.deleteProperty(target, key);
    },
  });
}
```

## 两版对比

| 维度 | Vue2 `defineProperty` | Vue3 `Proxy` |
|------|----------------------|--------------|
| 新增 / 删除属性 | 监听不到，需 `Vue.set`/`Vue.delete` | 直接拦截 |
| 数组下标 / `length` | 监听不到，需重写数组方法 | 直接拦截 |
| 嵌套对象 | 初始化时**深度递归**（慢） | **读到才递归**（惰性，快） |
| 拦截粒度 | 每个属性单独定义 | 代理整个对象 |
| 兼容性 | 支持 IE | 不支持 IE11（Proxy 无法 polyfill） |

:::info
`Reflect` 在 Proxy 里几乎是标配：`Reflect.get(target, key, receiver)` 能正确处理 getter 里 `this` 的指向（传入 `receiver`），比直接 `target[key]` 更严谨。
:::

## 一句话口诀

> **响应式 = 拦截读写**：读时收集依赖、写时派发更新。
> **Vue2** 用 `defineProperty` 逐属性装 getter/setter，搞不定新增/删除/数组，靠 `Vue.set` 和重写数组方法打补丁。
> **Vue3** 用 `Proxy` 代理整个对象，读写删一网打尽，还惰性递归更快。
