---
sidebar_position: 4
sidebar_label: 4 并发调度
---

# 并发调度

并发调度器做的事一句话说清：**任意时刻最多 `limit` 个任务在跑，完成一个才补一个，全部跑完后结果按原顺序返回**。

为什么需要它？一批异步任务不能一股脑全发出去：批量上传会打满接口 QPS，并发爬虫会被封 IP，几百个请求同时挤还会拖垮浏览器。

```mermaid
flowchart LR
  Q[任务队列 0,1,2,3,4...] --> W1[worker 1]
  Q --> W2[worker 2]
  W1 -->|做完一个回来取下一个| Q
  W2 -->|做完一个回来取下一个| Q
  W1 --> R[结果按原下标写回]
  W2 --> R
```

形象例子：把整个机制想成**银行大厅排队取号办业务**。墙上一叠号票，号码就是任务下标 `0、1、2…`；大厅只开 `limit` 个**窗口**，每个窗口干的事一模一样——撕一张号、办完、回来再撕下一张、号撕光就关窗。没有经理派活，谁先办完手上的谁就先回来撕号，「空出来就补位」是自然发生的。`limit` 个窗口同时开工，所以任意时刻最多 `limit` 个任务在跑。

## 固定任务列表

任务开工前就定死在一个数组里，跑起来不再增减。单个任务失败不中断其余，结果按原顺序返回（对应 `Promise.allSettled` 语义）。

```js
async function asyncSchedule(tasks, limit) {
  // 第一步：准备好放结果的数组，和一个所有 worker 共用的「下一张号」计数器
  const results = new Array(tasks.length);
  let index = 0;

  // 第二步：定义单个 worker——不断撕号、办业务，直到号撕光
  async function worker() {
    while (index < tasks.length) {
      // 先记下当前要办的号
      const current = index;
      // 立刻把计数器推进，把这个号锁死。必须在 await 之前做：
      // 一旦 await 让出线程，别的 worker 进来才不会重复领到同一个号
      index++;
      try {
        const value = await tasks[current]();
        results[current] = { status: 'fulfilled', value };
      } catch (reason) {
        // 失败也只记一笔，绝不中断其他窗口
        results[current] = { status: 'rejected', reason };
      }
    }
  }

  // 第三步：一次开 limit 个窗口（worker 数不超过任务总数），并行消费同一个队列
  const workerCount = Math.min(limit, tasks.length);
  const workers = Array.from({ length: workerCount }, () => worker());

  // 第四步：等所有窗口都关窗，结果数组就填满了
  await Promise.all(workers);
  return results;
}
```

:::info
关键在 `index++` 是同步操作，且必须放在 `await` 之前：多个 worker 共享同一个计数器，谁先空闲谁在让出线程前就把号锁死，天然实现「完成即补位」、不会重复领号，也不需要手动管理任务池。每个任务用 `try/catch` 兜住，单个失败只记一笔 `rejected`，不会拖垮整批。
:::

验证：

```js
const sleep = (ms, val) =>
  new Promise((resolve) => setTimeout(() => resolve(val), ms));

const tasks = [
  () => sleep(1000, 'a'),
  () => sleep(500, 'b'),
  () => sleep(300, 'c'),
  () => sleep(400, 'd'),
];

asyncSchedule(tasks, 2).then(console.log);
// 任意时刻最多 2 个任务执行，按原顺序返回：
// [
//   { status: 'fulfilled', value: 'a' },
//   { status: 'fulfilled', value: 'b' },
//   { status: 'fulfilled', value: 'c' },
//   { status: 'fulfilled', value: 'd' },
// ]
// 若某个任务 reject，对应位置变成 { status: 'rejected', reason }，不影响其余
```

## 动态加任务

`asyncSchedule` 按 `index++` **下标**取任务，前提是 `tasks` 开工前就定死了，跑起来不能再加。

思路是**看队列 + 完成即叫号**：任务先丢进一个队列，用一个 `run()` 方法统一派活——只要「还有空窗口」且「队列里有人排队」就取一个出来办；**每个任务办完后，自己把窗口腾出来再喊一声 `run()` 叫下一位**。这样不管是新加任务、还是有任务办完，都只要调一次 `run()`，空位自然被填上。

形象例子：还是那个银行大厅，号票筒可以随时塞新号。每个客户办完业务，顺手按一下桌上「叫下一位」的铃（就是 `run()`），下一个号就被叫进空出来的窗口。

```js
class TaskPool {
  constructor(limit) {
    this.limit = limit; // 最多同时开几个窗口
    this.queue = []; // 排队中的任务（还没轮到）
    this.running = 0; // 正在办理的窗口数
  }

  // add：加一个任务，返回它专属的 Promise——谁加谁 await 自己的结果
  add(task) {
    return new Promise((resolve, reject) => {
      // 第一步：把任务连同它自己的 resolve/reject 一起排进队列
      this.queue.push({ task, resolve, reject });
      // 第二步：塞完就叫一次号，看看有没有空窗口能马上办
      this.run();
    });
  }

  // run：派活的唯一入口——有空窗口且有人排队，就取出来执行
  run() {
    // 第三步：还有空位 且 还有人排队，就开窗办理
    while (this.running < this.limit && this.queue.length > 0) {
      this.running++; // 占用一个窗口
      const { task, resolve, reject } = this.queue.shift(); // 叫队头那个号

      // 第四步：执行任务，结果透传给「加它的人」拿到的那个 Promise
      Promise.resolve(task())
        .then(resolve, reject) // 成功失败都只通知本任务，不影响别人
        .finally(() => {
          // 第五步：办完了，腾出窗口，顺手再叫一次号——这就是「完成即补位」
          this.running--;
          this.run();
        });
    }
  }
}
```

:::tip
理解关键：**派活只有 `run()` 一处，补位就是任务自己在 `finally` 里喊一次 `run()`**。`run()` 里的 `while` 只负责「一次把当前空窗口填满」，没有常驻循环——窗口空出来全靠任务办完后主动叫号。
:::

用起来，任何时刻都能继续加，哪怕前面的还没跑完。`add` 返回该任务专属的 Promise，谁加谁拿自己的结果：

```js
const pool = new TaskPool(2); // 最多 2 个并发

// 谁加的任务，谁拿自己的结果
pool.add(() => fetch('/a').then((r) => r.json())).then((data) => {
  console.log('a 完成', data);
});

pool.add(() => fetch('/b')); // 不关心结果也行，照常跑
pool.add(() => fetch('/c')); // 窗口满了，进筒里排队

// 也能直接 await 单个任务的结果
const d = await pool.add(() => fetch('/d').then((r) => r.json()));
console.log('d 完成', d);
```

想等「这一批」全部完成，就把这些 `add()` 的返回值收进数组一起 `Promise.all`：

```js
const results = await Promise.all([
  pool.add(() => fetch('/a').then((r) => r.json())),
  pool.add(() => fetch('/b').then((r) => r.json())),
  pool.add(() => fetch('/c').then((r) => r.json())),
]); // 仍然最多 2 个并发，但能一次拿齐三个结果
```

:::info
任务办完在 `finally` 里 `running--` 腾出名额并再调 `run()`；之后即使队列暂时空了也没关系，下次 `add()` 又会调 `run()` 重新派活。所以池子能「空了又满、满了又空」地长期运转，适合任务陆续到达的场景——流式上传、滚动加载、消息消费。
:::

:::tip
两种写法的并发模型完全一样，区别在两点：**取任务**——固定列表看**下标**、动态队列看**队头**；**拿结果**——固定版全部跑完一次性返回 `PromiseSettledResult[]`，动态版没有统一终点，靠每个 `add` 返回各自的 Promise。真实场景里大文件分片上传就是用它并发传几十个分片、限制同时上传数。
:::
