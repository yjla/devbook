---
sidebar_position: 7
sidebar_label: 图
---

# 图

**图的题目核心只有两件事：怎么把图存下来、怎么遍历它。** 遍历方式还是熟悉的 DFS 和 BFS，唯一的新增动作是必须用 `visited` 记录访问过的节点，否则成环时会无限循环。

图 (Graph) 由**顶点 (vertex)** 和**边 (edge)** 组成，是最通用的数据结构——[二叉树](./binary-tree.md) 其实就是一种特殊的图 (无环、连通、每个节点至多两个后继)。边有方向就是**有向图**，边带权重就是**带权图**。

:::tip 形象记忆
把图想成**地铁线路图**：站点是顶点，轨道是边。遍历一张地铁图，你必须随身带个本子记下「哪些站已经去过」 (`visited`)，不然环线会让你绕着圈一直坐下去，永远下不了车。
:::

## 两种存储方式

| 方式 | 结构 | 适合 | 空间 |
|------|------|------|------|
| **邻接矩阵** | 二维数组 `matrix[i][j]` 表示 i→j 有无边 | 稠密图、需快速判断两点是否相连 | `O(V^2)` |
| **邻接表** | 数组 + 链表/数组，`adj[i]` 存 i 的所有邻居 | 稀疏图 (大多数实际场景) | `O(V + E)` |

实际刷题里**邻接表用得最多**，因为现实中的图大都是稀疏的：

```js
// 邻接表：adj[i] 是顶点 i 的邻居列表
const adj = [[1, 2], [2], [0, 3], [3]];
// 顶点 0 → 1, 0 → 2; 顶点 1 → 2; 顶点 2 → 0, 2 → 3; ...
```

## 图的遍历

和树遍历唯一的区别：图可能有环，所以必须用一个 `visited` 标记**已访问的节点，防止重复访问导致死循环**。

**DFS (深度优先)**，用递归 (隐式栈)。生活类比：走迷宫时**一条路走到黑**，撞墙了才退回上一个岔路口换条路：

```js
function dfs(adj, start) {
  // 第一步：准备「去过的站」本子和结果数组
  const visited = new Set();
  const res = [];

  // 第二步：定义「访问一个节点」的递归动作
  function traverse(node) {
    // 第三步：进门先查本子，去过就掉头
    if (visited.has(node)) return;

    // 第四步：登记 + 处理当前节点
    visited.add(node);
    res.push(node);

    // 第五步：顺着每条边继续往深处走
    for (const next of adj[node]) {
      traverse(next);
    }
  }

  traverse(start);
  return res;
}
```

**BFS (广度优先)**，用队列，适合求**无权图的最短路径**。生活类比：往水里扔一颗石子，**波纹一圈一圈向外扩散**，离起点越近的节点越先被访问到：

```js
function bfs(adj, start) {
  // 第一步：起点先登记进本子，再放进队列排队
  const visited = new Set([start]);
  const queue = [start];
  const res = [];

  // 第二步：队列没空就一直处理
  while (queue.length > 0) {
    // 第三步：取出队首，处理它
    const node = queue.shift();
    res.push(node);

    // 第四步：把没去过的邻居登记后排进队尾
    for (const next of adj[node]) {
      if (!visited.has(next)) {
        visited.add(next); // 入队时就登记，避免同一节点重复排队
        queue.push(next);
      }
    }
  }

  return res;
}
```

:::warning
BFS 里要在**入队时**就把节点加入 `visited`，而不是出队时。否则同一个节点可能被多个邻居重复加进队列，导致重复处理甚至超时。
:::

## 拓扑排序

针对**有向无环图 (DAG)**，把所有顶点排成一个线性序列，使得每条边 `u → v` 都满足 u 排在 v 前面。

:::tip 形象记忆
拓扑排序就是**穿衣服的顺序**：必须先穿袜子才能穿鞋，先穿内衣才能穿外套。「入度」就是「这件衣服还有几件没穿的前置衣服」——入度为 0 表示没有任何前置，可以马上穿。
:::

常用 **Kahn 算法 (BFS + 入度)**：统计每个节点的入度，把入度为 0 的先入队，每处理一个就把它指向的节点入度减 1，减到 0 再入队：

```js
function topoSort(numNodes, edges) {
  // 第一步：建邻接表，同时统计每个节点的入度
  const adj = Array.from({ length: numNodes }, () => []);
  const inDegree = new Array(numNodes).fill(0);
  for (const [u, v] of edges) { // u → v
    adj[u].push(v);
    inDegree[v]++;
  }

  // 第二步：把所有「没有前置」的节点 (入度为 0) 先入队
  const queue = [];
  for (let i = 0; i < numNodes; i++) {
    if (inDegree[i] === 0) queue.push(i);
  }

  // 第三步：逐个出队，把它的后继入度减 1，减到 0 就能入队
  const res = [];
  while (queue.length > 0) {
    const node = queue.shift();
    res.push(node);
    for (const next of adj[node]) {
      inDegree[next]--;
      if (inDegree[next] === 0) queue.push(next);
    }
  }

  // 第四步：排进结果的数量 < 总数，说明有环排不完
  return res.length === numNodes ? res : [];
}
```

:::info
拓扑排序还能**检测有向图是否有环**：如果最终排进结果的节点数少于总节点数，说明剩下的节点互相依赖成环，排不进去。「课程表能否修完」这类题就是用它判环。
:::

## 其他常见图算法

刷题中还会遇到几类，知道用什么算法即可：

- **并查集 (Union-Find)**：处理「连通性」和「分组」问题 (判断两点是否连通、统计连通分量数)，近乎 `O(1)` 合并与查询。
- **最短路径**：无权图用 BFS；带正权用 **Dijkstra**；有负权用 **Bellman-Ford**；多源最短路用 **Floyd-Warshall**。
- **最小生成树**：连通所有点且总权重最小，用 **Kruskal** (并查集) 或 **Prim**。

## 小结

- 图 = 顶点 + 边，树是图的特例；有向/带权是常见变体。
- 存储优先用**邻接表** (`O(V+E)`，适合稀疏图)，稠密或需快速判边用邻接矩阵。
- 遍历就是 DFS (递归/栈) + BFS (队列)，**务必用 `visited` 防止成环死循环**，BFS 在入队时标记。
- **拓扑排序** (Kahn 入度法) 处理依赖排序，并能检测有向图是否有环。
- 进阶算法按场景记：连通性用并查集，最短路按权重选 BFS/Dijkstra/Bellman-Ford，最小生成树用 Kruskal/Prim。

> ## 一句话口诀
>
> **遍历图带个本子记去过的站，深搜走到黑、广搜扩波纹；拓扑排序就是按穿衣顺序，入度为 0 的先穿。**
