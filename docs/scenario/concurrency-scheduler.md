---
sidebar_position: 4
sidebar_label: 4 并发调度
---

# 并发调度

一批异步任务不能一次全发出去：批量上传会打满接口 QPS，并发爬虫会被封 IP，几百个请求同时挤还会拖垮浏览器。并发调度器做的事——**限制任意时刻最多 `limit` 个任务在跑，前面完成一个才补一个**，直到全部跑完，结果按原顺序返回。

## 固定任务列表

任务开工前就定死了一个数组，跑起来不再增减。思路是「开 `limit` 个 worker 并行消费**同一个任务队列**，谁先空闲谁取下一个」。单个任务失败不中断其余，结果按原顺序返回（`Promise.allSettled` 语义）。

```ts
type Task<T = unknown> = () => Promise<T>;

async function asyncPool<T>(
  tasks: Task<T>[],
  limit: number,
): Promise<PromiseSettledResult<T>[]> {
  const results = new Array<PromiseSettledResult<T>>(tasks.length);
  let nextIndex = 0;

  // 单个 worker：不断从队列取任务执行，直到取完
  async function worker(): Promise<void> {
    while (nextIndex < tasks.length) {
      const current = nextIndex++; // 锁定当前下标，保证结果按原顺序写回
      try {
        results[current] = { status: 'fulfilled', value: await tasks[current]() };
      } catch (reason) {
        results[current] = { status: 'rejected', reason }; // 失败也记下，不中断其他
      }
    }
  }

  // 启动 limit 个 worker 并行消费同一个队列
  const workers = Array.from({ length: Math.min(limit, tasks.length) }, worker);

  return Promise.all(workers).then(() => results);
}
```

:::info
关键在 `nextIndex++` 是同步操作，多个 worker 共享同一个计数器，谁先空闲谁取下一个，天然实现了「完成即补位」，不需要手动管理任务池。每个任务用 `try/catch` 兜住，单个失败只记一笔 `rejected`，不会拖垮整批。
:::

把这套机制想成**排队取号办业务**：

- 大厅里一叠号票，号码就是任务下标 `0、1、2…`，`nextIndex` 是「下一张要被撕走的号」。
- 开 `limit` 个**窗口**（worker），每个窗口干的事一模一样：撕一张号 → 办完 → 回来再撕下一张 → 号撕光就关窗。
- 没有经理派活，谁先办完手上的，谁就先回来撕下一张——「空出来就补位」是自然发生的，不用调度。

`limit` 个窗口同时开工，所以**任意时刻最多 `limit` 个任务在跑**。

验证：

```ts
const sleep = <T>(ms: number, val: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(val), ms));

const tasks: Task<string>[] = [
  () => sleep(1000, 'a'),
  () => sleep(500, 'b'),
  () => sleep(300, 'c'),
  () => sleep(400, 'd'),
];

asyncPool(tasks, 2).then(console.log);
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

`asyncPool` 按 `nextIndex++` **下标**取任务，前提是 `tasks` 开工前就定死了，跑起来不能再加。改成**检查队列**——worker 每次从队列头 `shift()` 一个，队列随时能 `push()` 新任务进去，就支持「边跑边加」：

```ts
class TaskPool {
  private limit: number; // 最大并发数
  private queue: Array<() => Promise<void>> = []; // 待执行的 job（已包好 resolve/reject）
  private running = 0; // 当前在跑的 worker 数

  constructor(limit: number) {
    this.limit = limit;
  }

  // 加任务，返回这个任务专属的 Promise——谁加谁 await 自己的结果
  add<T>(task: Task<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      // 把 task 连同它的 resolve/reject 包成一个 job 入队
      this.queue.push(async () => {
        try {
          resolve(await task()); // 结果透传给上面返回的那个 Promise
        } catch (e) {
          reject(e); // 失败只通知「加这个任务的人」，不影响别人
        }
      });
      this.schedule(); // 有空位就立刻开跑，没空位就排队等
    });
  }

  // 有空槽位且队列里有货，就拉起新 worker 补上
  private schedule(): void {
    while (this.running < this.limit && this.queue.length) {
      this.running++;
      this.worker();
    }
  }

  private async worker(): Promise<void> {
    // 不再看下标，而是不断从队列头取 job，直到队列空
    while (this.queue.length) {
      const job = this.queue.shift()!;
      await job(); // job 内部已 try/catch，结果各自透传，绝不抛到这里
    }
    this.running--; // 队列空了，这个 worker 退场，腾出一个槽位
  }
}
```

用起来，任何时刻都能继续加，哪怕前面的还没跑完；`add` 会返回该任务专属的 Promise，谁加谁 `await` 自己的结果：

```ts
const pool = new TaskPool(2); // 最多 2 个并发

// 谁加的任务，谁拿自己的结果
pool.add(() => fetch('/a').then((r) => r.json())).then((data) => {
  console.log('a 完成', data);
});

pool.add(() => fetch('/b')); // 不关心结果也行，照常跑
pool.add(() => fetch('/c')); // 槽位满了，进队列排队

// 也能直接 await 单个任务的结果
const d = await pool.add(() => fetch('/d').then((r) => r.json()));
console.log('d 完成', d);
```

想等「这一批」全部完成，就把这些 `add()` 的返回值收进数组一起 `Promise.all`：

```ts
const results = await Promise.all([
  pool.add(() => fetch('/a').then((r) => r.json())),
  pool.add(() => fetch('/b').then((r) => r.json())),
  pool.add(() => fetch('/c').then((r) => r.json())),
]); // 仍然最多 2 个并发，但能一次拿齐三个结果
```

:::info
worker 见队列空就 `running--` 退场；之后再 `add()`，`schedule()` 发现 `running < limit` 又会重新拉起 worker。所以池子能「空了又满、满了又空」地长期运转，适合任务陆续到达的场景——流式上传、滚动加载、消息消费。
:::

:::tip
两种写法的并发模型完全一样，区别在两点：**取任务**——固定列表看**下标**、动态队列看**队头**；**拿结果**——固定版全部跑完一次性返回 `PromiseSettledResult[]`，动态版没有统一终点，靠每个 `add` 返回各自的 Promise。真实场景里大文件分片上传就是用它并发传几十个分片、限制同时上传数。
:::
