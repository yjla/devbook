---
sidebar_position: 2
sidebar_label: 2 发布订阅
---

# 发布订阅

发布订阅模式： **订阅者注册事件回调，发布者触发事件时统一通知所有订阅者** 。本质就是维护一张「事件名 → 回调列表」的表。

记忆类比： **像微信公众号** 。你（订阅者）关注某个公众号（`on`），公众号推文（`emit`）时所有关注的人都收到推送；你取关（`off`）就不再收到；如果是「领一次性优惠券」那种只想要第一条就退订的，就是 `once` 。公众号后台只管维护一张「公众号 → 粉丝列表」的表，根本不认识每个粉丝是谁——这正是发布订阅解耦的精髓。

四个核心方法：

- `on` ：订阅，把回调加进对应事件的列表。
- `emit` ：发布，依次执行某事件下的所有回调。
- `off` ：取消订阅，从列表里移除指定回调。
- `once` ：只订阅一次，触发后自动解绑。

```js
class EventEmitter {
  // 第一步：用一张 Map 当「事件中心」，结构是 事件名 → 回调数组
  events = new Map();

  // 第二步：实现订阅。没有这个事件就先建一个空数组，再把回调推进去
  on(name, fn) {
    if (!this.events.has(name)) {
      this.events.set(name, []);
    }
    this.events.get(name).push(fn);
    return this; // 返回 this 支持链式调用
  }

  // 第三步：实现发布。取出该事件的所有回调，依次执行并透传参数
  emit(name, ...args) {
    const callbacks = this.events.get(name) || [];
    // 先复制一份再遍历：避免回调里 off 掉自己导致原数组边遍历边变短、漏执行
    const copy = [...callbacks];
    copy.forEach((fn) => fn(...args));
    return this;
  }

  // 第四步：实现退订。把目标回调从数组里过滤掉
  off(name, fn) {
    if (!this.events.has(name)) {
      return this;
    }
    const filtered = this.events.get(name).filter((f) => f !== fn);
    this.events.set(name, filtered);
    return this;
  }

  // 第五步：实现只订阅一次。包一层 wrapper，执行完原回调后立刻把自己解绑
  once(name, fn) {
    const wrapper = (...args) => {
      fn(...args);
      this.off(name, wrapper); // 注意解绑的是 wrapper，不是 fn
    };
    this.on(name, wrapper);
    return this;
  }
}
```

:::warning
两个易错点：

1. `once` 要解绑的是 **包装函数 `wrapper`** ，不是原始 `fn` ——因为真正加进数组的是 `wrapper` 。
2. `emit` 时先 **复制一份回调数组再遍历** ，否则 `once` 在遍历途中改动数组会漏掉后面的回调。
   :::

使用：

```js
const bus = new EventEmitter();
const onMsg = (data) => console.log('收到', data);

bus.on('msg', onMsg);
bus.emit('msg', 'hello'); // 收到 hello
bus.off('msg', onMsg);
bus.emit('msg', 'world'); // 无输出
```

:::info
发布订阅 vs 观察者模式：观察者模式里被观察者 **直接持有** 观察者列表、直接通知；发布订阅多了一个 **中间事件中心 (EventEmitter)** 解耦，发布者和订阅者互不知道对方存在。Vue 的事件总线、Node 的 `events` 模块都是这个模式。
:::
