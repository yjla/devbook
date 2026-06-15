---
sidebar_position: 1
sidebar_label: "4.1 代码补全"
---

# 代码补全

代码补全是最早落地、使用频率最高的 AI 编程能力。从 GitHub Copilot 开始，几乎所有 IDE 都集成了某种形式的 AI 补全。理解它的工作原理，能帮你更好地配合它输出高质量结果。

## 补全的本质

AI 代码补全的核心是**上下文预测**：给定光标前（有时也包括光标后）的代码，预测最可能的续写内容。

```
输入（上文）:
function getUserById(id: string) {
  const user = await db.users.findOne({ id })
  if (!user) {
    ↑ 光标在这里

输出（预测）:
    throw new Error(`User ${id} not found`)
  }
  return user
}
```

质量的关键在于**上下文窗口里装了什么**。

## 上下文构建策略

各家工具在「如何填充上下文」上投入了大量工程：

### 当前文件 + 光标周边
最基础的策略：光标前后若干行 + 当前文件内容。

### 跨文件检索（Repository-Level Context）
更高级的做法，从整个仓库里找相关代码：

**RepoFuse 的方案**：
1. 语义图分析——映射代码依赖关系
2. 类比检索——找相似的代码模式
3. 相关性过滤——只取最有价值的片段

**Cody 的四阶段流程**：
```
Planning → Retrieval → Generation → Post-processing
 确定策略    找相关代码    LLM 生成     过滤和精炼
```

### Jaccard 算法
GitHub Copilot 用它做快速相关性评估——通过词集合交集比来判断哪些文件和当前文件最相关，计算开销低。

## 补全类型

| 类型 | 场景 | 示例 |
|------|------|------|
| 单行补全 | 变量赋值、简单表达式 | `const result = arr.filter(` → `)` |
| 多行补全 | 函数体、条件块 | 自动补全整个 if-else |
| 整块生成 | 注释描述触发 | `// 实现二分查找` → 完整函数 |
| FIM（填空）| 光标在中间 | 根据上下文填充缺失部分 |

FIM（Fill-in-the-Middle）是近年的重要进展：同时利用光标前后的代码，比单纯续写更准确。

## 影响补全质量的因素

**让补全更好的习惯**：

1. **写描述性注释**——注释是最强的上下文信号
   ```typescript
   // 将时间戳转换为「刚刚/X分钟前/X小时前」格式
   function formatRelativeTime(timestamp: number) {
     // AI 从这里开始，已经知道要做什么
   ```

2. **命名要语义化**——`getUserById` 比 `getUser` 能触发更准确的补全

3. **保持文件专注**——一个文件做一件事，上下文更纯净

4. **先写函数签名**——参数类型和返回类型给 AI 强约束
   ```typescript
   async function fetchUserProfile(userId: string): Promise<UserProfile> {
     // AI 知道要返回 UserProfile，不会乱写
   ```

**补全容易出错的场景**：
- 业务逻辑高度定制（AI 不了解你的领域模型）
- 涉及全局状态（副作用不可预测）
- 需要跨多个抽象层的理解

## 主流工具的差异

| 工具 | 补全策略 | 特点 |
|------|---------|------|
| GitHub Copilot | 多级缓存 + Jaccard | 响应快，使用广 |
| Cursor Tab | FIM + 差异预测 | 预测你「下一步要改哪里」|
| Cody | RAG 四阶段 | 跨文件上下文更强 |
| Tabnine | 本地模型 + 云端 | 隐私友好，企业可私有部署 |
| Continue | 可配置模型 | 开源，支持本地模型 |

## 接受率与实际价值

Google 的数据：约 25% 的粘贴代码会被立即修改。这催生了「Smart Paste」——预测你粘贴后想做的修改，主动提示。

GitHub Copilot 报告的整体代码接受率约 30%，在重复性代码（CRUD、boilerplate）上更高，在复杂业务逻辑上偏低。

实际价值不只是打字速度，更在于**减少「查文档→切窗口→复制粘贴」的上下文切换**。
