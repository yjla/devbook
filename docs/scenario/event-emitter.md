---
sidebar_position: 6
sidebar_label: 发布订阅 EventEmitter
---

# 发布订阅 EventEmitter

发布订阅模式：**订阅者注册事件回调，发布者触发事件时统一通知所有订阅者**。本质就是维护一张「事件名 → 回调列表」的表。

四个核心方法：

- `on`：订阅，把回调加进对应事件的列表。
- `emit`：发布，依次执行某事件下的所有回调。
- `off`：取消订阅，从列表里移除指定回调。
- `once`：只订阅一次，触发后自动解绑。

```ts
type Listener = (...args: any[]) => void;

class EventEmitter {
  private events = new Map<string, Listener[]>(); // 事件名 → 回调数组

  on(name: string, fn: Listener): this {
    if (!this.events.has(name)) {
      this.events.set(name, []);
    }
    this.events.get(name)!.push(fn);
    return this; // 返回 this 支持链式调用
  }

  emit(name: string, ...args: any[]): this {
    const callbacks = this.events.get(name) || [];
    // 复制一份再遍历，避免回调里 off 自己导致遍历错乱
    [...callbacks].forEach((fn) => fn(...args));
    return this;
  }

  off(name: string, fn: Listener): this {
    if (!this.events.has(name)) return this;
    const filtered = this.events.get(name)!.filter((f) => f !== fn);
    this.events.set(name, filtered);
    return this;
  }

  once(name: string, fn: Listener): this {
    // 包一层：执行原回调后立刻解绑
    const wrapper: Listener = (...args) => {
      fn(...args);
      this.off(name, wrapper);
    };
    this.on(name, wrapper);
    return this;
  }
}
```

:::warning
`once` 要解绑的是**包装函数 `wrapper`**，不是原始 `fn`，所以 `off` 里移除的也得是 `wrapper`。`emit` 时先复制一份回调数组再遍历，否则 `once` 在遍历途中改动数组会出错。
:::

使用：

```ts
const bus = new EventEmitter();
const onMsg = (data: string) => console.log('收到', data);

bus.on('msg', onMsg);
bus.emit('msg', 'hello'); // 收到 hello
bus.off('msg', onMsg);
bus.emit('msg', 'world'); // 无输出
```

:::info
发布订阅 vs 观察者模式：观察者模式里被观察者**直接持有**观察者列表、直接通知；发布订阅多了一个**中间事件中心 (EventEmitter)** 解耦，发布者和订阅者互不知道对方存在。Vue 的事件总线、Node 的 `events` 模块都是这个模式。
:::

## 一句话口诀

> **发布订阅 = 一张「事件名 → 回调数组」的表。on 加回调、emit 遍历执行、off 过滤移除、once 用包装函数执行完自删。**
