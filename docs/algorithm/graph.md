---
sidebar_position: 7
sidebar_label: 图
---

# 图

图 (Graph) 由**顶点 (vertex)** 和**边 (edge)** 组成，是最通用的数据结构——[二叉树](./binary-tree.md) 其实就是一种特殊的图 (无环、连通、每个节点至多两个后继)。边有方向就是**有向图**，边带权重就是**带权图**。

图的题目看似复杂，但核心就两件事：**怎么把图存下来**，以及**怎么遍历它**。遍历方式还是熟悉的 DFS 和 BFS，只是多了一件必须做的事——**记录访问过的节点，避免成环时无限循环**。

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

**DFS (深度优先)**，用递归 (隐式栈):

```js
function dfs(adj, start) {
  const visited = new Set();
  const res = [];

  function traverse(node) {
    if (visited.has(node)) return; // 关键：访问过就返回
    visited.add(node);
    res.push(node);
    for (const next of adj[node]) {
      traverse(next);
    }
  }

  traverse(start);
  return res;
}
```

**BFS (广度优先)**，用队列，适合求**无权图的最短路径**：

```js
function bfs(adj, start) {
  const visited = new Set([start]);
  const queue = [start];
  const res = [];

  while (queue.length > 0) {
    const node = queue.shift();
    res.push(node);
    for (const next of adj[node]) {
      if (!visited.has(next)) {
        visited.add(next); // 入队时就标记，避免同一节点重复入队
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

针对**有向无环图 (DAG)**，把所有顶点排成一个线性序列，使得每条边 `u → v` 都满足 u 排在 v 前面。典型场景：课程安排 (先修课)、任务依赖、编译顺序。

常用 **Kahn 算法 (BFS + 入度)**：统计每个节点的入度，把入度为 0 的先入队，每处理一个就把它指向的节点入度减 1，减到 0 再入队：

```js
function topoSort(numNodes, edges) {
  const adj = Array.from({ length: numNodes }, () => []);
  const inDegree = new Array(numNodes).fill(0);

  for (const [u, v] of edges) { // u → v
    adj[u].push(v);
    inDegree[v]++;
  }

  const queue = [];
  for (let i = 0; i < numNodes; i++) {
    if (inDegree[i] === 0) queue.push(i); // 入度为 0 的起点
  }

  const res = [];
  while (queue.length > 0) {
    const node = queue.shift();
    res.push(node);
    for (const next of adj[node]) {
      if (--inDegree[next] === 0) queue.push(next); // 减到 0 才入队
    }
  }

  // 若结果数 < 节点数，说明有环，无法完成拓扑排序
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
