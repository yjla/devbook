---
sidebar_position: 1
sidebar_label: "5.1 Token 计量与成本控制"
---

# Token 计量与成本控制

Token 是 LLM 的计费和限制单位。理解 token 的计算方式、监控方法和节省策略，是控制 AI 项目成本的基础工程知识。

## Token 是什么

Token 不等于字，也不等于词。它是 tokenizer（分词器）将原始文本切分后的最小单元，可能是一个完整的单词、一个词根，也可能是一个汉字或几个字节。

主流 LLM 使用 **BPE（Byte Pair Encoding，字节对编码）** 算法构建 tokenizer：

1. 从字符（或字节）级别出发，每个字符作为一个初始 token
2. 统计语料中出现频率最高的相邻 token 对
3. 将该对合并为一个新 token，加入词表
4. 重复步骤 2-3，直到词表达到预设大小（通常数万到十几万）

结果是常见词（如 `the`、`and`）变成单个 token，罕见词被拆成多个子词（如 `unhappiness` → `un` + `happi` + `ness`）。

:::info[Byte-level BPE]
现代模型（GPT-4、Claude、LLaMA 等）普遍使用 **Byte-level BPE**：从 256 个 UTF-8 字节出发，而非字符。这样任意语言、任意符号（包括 emoji）都能被正确处理，不会出现「词表外词汇」。
:::

### 各模型 tokenizer

| 模型家族 | Tokenizer | 词表大小 | 工具 |
|----------|-----------|----------|------|
| GPT-4o / GPT-4 | cl100k_base (tiktoken) | ~100k | [tiktoken](https://github.com/openai/tiktoken) |
| GPT-3.5 | cl100k_base (tiktoken) | ~100k | tiktoken |
| Claude 全系 | 自有 tokenizer | ~100k+ | Anthropic API / SDK |
| Gemini | SentencePiece | — | `countTokens` API |
| LLaMA 3 | tiktoken 变体 | 128k | transformers |

:::warning[tiktoken 不能直接用于 Claude]
tiktoken 的 `p50k_base` 对 Claude 的计数只能做粗估，实际计费以 Anthropic API 返回的 `usage` 字段为准。精确预估请用 Anthropic SDK 的 `client.messages.count_tokens()` 方法。
:::

### 中英文 token 差异

英文的经验值：**1 token ≈ 4 字符 ≈ 0.75 个单词**，即 100 个英文单词约 133 tokens。

中文情况复杂，与 tokenizer 训练语料直接相关：

| 语言 | 每词大约 tokens | 说明 |
|------|---------------|------|
| 英文 | 1–2 | 常用词多为 1 token |
| 中文 | 1.5–2.5 | 现代 tokenizer 常见汉字 ≈ 1 token |
| 阿拉伯语 | ~4 | 词形变化复杂 |
| 印地语 | ~6.4 | 历史训练语料较少 |

对 Claude 来说，官方上下文窗口的字符换算如下（来自模型文档）：

- Claude Sonnet 4.6（1M tokens）≈ **75 万英文单词** ≈ **340 万 Unicode 字符**
- Claude Haiku 4.5（200k tokens）≈ **15 万英文单词** ≈ **68 万 Unicode 字符**

同等信息量的中文文本，消耗 tokens 通常**比英文少 20–40%**，因为汉字信息密度更高。

### 代码 vs 自然语言的 token 密度

代码的 token 密度因语言而异，差异显著：

| 类型 | 约 tokens / 100 行 | 特点 |
|------|-------------------|------|
| SQL | ~1150 | 关键字密集 |
| Python | ~1000 | 语法简洁 |
| JavaScript | ~700 | 中等冗余 |
| 自然语言（英文段落） | ~500–700 / 100 句 | 取决于句长 |

**增加 token 消耗的情况：**

- 多余空格、缩进（每个空格可能独立计 token）
- Base64 / 二进制编码内容（极低效率）
- 数字（`9.11` 可能被拆成 3 个 token：`9`、`.`、`11`）
- Emoji（通常 2–4 tokens 每个）
- 重复文本（不被压缩）

### 预估工具

| 工具 | 用途 |
|------|------|
| [OpenAI Tokenizer](https://platform.openai.com/tokenizer) | GPT 系列可视化分词 |
| [tiktoken](https://github.com/openai/tiktoken) | Python 库，支持 GPT 系列 |
| Anthropic SDK `count_tokens()` | Claude 精确计数 |
| Gemini `countTokens` API | Gemini 精确计数 |

---

## 监控 token 用量

### API 响应中的 usage 字段

每次 API 调用的响应都包含 token 用量，这是成本追踪的第一手数据。

**Anthropic Claude 响应结构：**

```json
{
  "usage": {
    "input_tokens": 50,
    "cache_read_input_tokens": 100000,
    "cache_creation_input_tokens": 0,
    "output_tokens": 503,
    "cache_creation": {
      "ephemeral_5m_input_tokens": 456,
      "ephemeral_1h_input_tokens": 100
    }
  }
}
```

- `input_tokens`：最后一个缓存断点之后的普通输入 token（按原价计费）
- `cache_read_input_tokens`：从缓存读取的 token（按 0.1× 价格计费）
- `cache_creation_input_tokens`：写入缓存的 token（按 1.25× 或 2× 计费）
- `output_tokens`：模型生成的输出 token

:::warning[input_tokens 的含义]
`input_tokens` **不是**本次请求的全部输入 token 数，而是最后一个 `cache_control` 断点之后的未缓存部分。总输入 = `cache_read_input_tokens` + `cache_creation_input_tokens` + `input_tokens`。
:::

**OpenAI 响应结构：**

```json
{
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 4,
    "total_tokens": 14,
    "prompt_tokens_details": {
      "cached_tokens": 8
    }
  }
}
```

OpenAI 的缓存命中体现在 `prompt_tokens_details.cached_tokens`，缓存 token 享受约 50% 折扣。

### 管理后台

- **Anthropic Console**：`console.anthropic.com` → Usage 页面，按模型、API Key、时间段查看用量和费用
- **OpenAI Platform**：`platform.openai.com` → Usage，支持按模型和时间筛选，可导出 CSV

### 第三方监控工具

| 工具 | 定位 | 特点 |
|------|------|------|
| [LangSmith](https://smith.langchain.com/) | LangChain 官方 | 深度集成 LangChain/LangGraph，追踪、评估、调试一体 |
| [Helicone](https://helicone.ai/) | AI Gateway | 单行代理接入，实时成本看板，内置缓存和限流 |
| [Braintrust](https://braintrust.dev/) | 评估驱动 | 生产追踪一键转为测试集，适合评估质量的团队 |
| [Langfuse](https://langfuse.com/) | 开源 | 可自托管，多轮对话追踪，自动 token 计数 |
| [LiteLLM](https://github.com/BerriAI/litellm) | 开源代理 | 统一多 provider，内置费用归因和预算限额 |
| [Datadog LLM Observability](https://www.datadoghq.com/product/llm-observability/) | 企业级 | 与基础设施监控联动 |

---

## 节省 token 的策略

### 1. Prompt Caching（最高效）

Anthropic 的 Prompt Caching 是目前减少重复 token 消耗最直接的手段。

**工作原理：** 在 prompt 中标记 `cache_control` 断点，API 将该断点之前的内容以哈希缓存。后续请求若前缀相同，直接读取缓存，跳过重新处理。

**价格倍率（相对于基础输入价格）：**

| 类型 | 倍率 | 说明 |
|------|------|------|
| 5 分钟缓存写入 | 1.25× | 默认 TTL，不活跃 5 分钟后过期 |
| 1 小时缓存写入 | 2× | 显式指定 `"ttl": "1h"` |
| 缓存读取 | **0.1×** | **节省 90%** |

**触发缓存的最小 token 数：**

| 模型 | 最小可缓存 tokens |
|------|----------------|
| Claude Opus 4.7/4.6/4.5 | 4096 |
| Claude Sonnet 4.6 | 2048 |
| Claude Sonnet 4.5 / Opus 4.1 / Opus 4 | 1024 |
| Claude Haiku 4.5 | 4096 |
| Claude Haiku 3.5 | 2048 |

**适合缓存的内容：** 固定的 system prompt、工具定义、长文档、代码库上下文。

**代码示例（Node.js）：**

```javascript
const response = await client.messages.create({
  model: "claude-sonnet-4-6",
  max_tokens: 1024,
  system: [
    {
      type: "text",
      text: "你是一个代码审查助手。以下是项目规范文档：\n\n..." // 长文档
    },
    {
      type: "text",
      text: "请根据以上规范审查用户提交的代码。",
      cache_control: { type: "ephemeral" }  // 断点标记
    }
  ],
  messages: [{ role: "user", content: userCode }]
})

// 检查是否命中缓存
const { usage } = response
console.log('缓存读取 tokens:', usage.cache_read_input_tokens)
console.log('缓存写入 tokens:', usage.cache_creation_input_tokens)
console.log('普通输入 tokens:', usage.input_tokens)
```

:::tip[判断缓存是否生效]
如果 `cache_read_input_tokens` 和 `cache_creation_input_tokens` 均为 0，说明 prompt 未达到最小长度阈值，缓存未生效。
:::

### 2. Prompt 压缩与精简

**直接删减：**

- 去掉礼貌性开场（"你好，请帮我..."）
- 用列表代替长段落描述
- 删除重复说明同一件事的内容
- 用代码/伪代码代替自然语言描述逻辑

**结构化输出约定：** 在 prompt 中指定输出格式，避免模型生成冗余的解释性文字。

**LLMLingua（自动压缩）：** Microsoft Research 开发的开源框架，用小模型（GPT-2 / LLaMA-7B 规模）识别并删除 prompt 中的非关键 token，可实现 **最高 20× 压缩**，准确率损失极小。适合 RAG 场景中对检索到的文档进行压缩后再送入大模型。

- GitHub: [microsoft/LLMLingua](https://github.com/microsoft/LLMLingua)
- 已集成至 LlamaIndex

### 3. 上下文窗口管理

多轮对话随轮数增长，历史消息会持续消耗 context window。常见策略：

**截断（Truncation）：** 超出上限时从最旧的消息开始丢弃。实现简单，但会丢失早期关键信息。

**滚动窗口（Sliding Window）：** 保留最近 N 轮对话，舍弃更早的内容。适合对话连贯性要求高但历史依赖不深的场景。

**摘要压缩（Summarization）：** 将超出阈值的旧消息用 LLM 压缩成摘要，再拼入上下文。保留语义，但引入额外 API 调用。

**混合策略（Summary Buffer）：** 最近 K 轮保留原文，更早的内容替换为滚动摘要，兼顾效率和连贯性。

**RAG（检索增强）：** 将知识库外置，按需检索相关片段送入 context，而不是把整个知识库塞入 prompt。适合大规模文档问答。

```javascript
// 简单的摘要压缩示例
async function compressHistory(messages, threshold = 4000) {
  const tokenCount = estimateTokens(messages)
  if (tokenCount < threshold) return messages

  const oldMessages = messages.slice(0, -4)  // 保留最近 2 轮
  const recentMessages = messages.slice(-4)

  const summary = await summarize(oldMessages)  // 调用 LLM 压缩

  return [
    { role: "user", content: `[历史摘要] ${summary}` },
    ...recentMessages
  ]
}
```

### 4. 控制输出长度

输出 token 的价格通常是输入的 3–5 倍，控制输出是直接降本的手段：

- 在 prompt 中明确说明期望的输出长度或格式（"用一句话回答"、"只输出 JSON，不要解释"）
- 设置 `max_tokens` 参数作为硬上限
- 避免让模型重复输入内容（"请先复述问题，然后..."）

### 5. 模型选择

不同规模的模型价格差异显著，简单任务用轻量模型是最粗暴的降本方式：

| 模型 | 输入价格 | 输出价格 | 适用场景 |
|------|---------|---------|---------|
| Claude Haiku 4.5 | $1 / MTok | $5 / MTok | 分类、抽取、简单 QA |
| Claude Sonnet 4.6 | $3 / MTok | $15 / MTok | 通用代码、分析任务 |
| Claude Opus 4.7 | $5 / MTok | $25 / MTok | 复杂推理、Agentic 编码 |

同时，所有模型支持 **Batch API**（Message Batches API），异步批量处理享受 **5折优惠**，适合不要求实时响应的离线任务。

:::info[旧 Opus 定价]
Claude Opus 4.1 及更早版本定价为 $15 / $75 MTok，是当前 Opus 4.7 的 3 倍。注意不要用旧定价做估算。
:::

---

## 快速参考

```
英文经验值：1 token ≈ 4 字符 ≈ 0.75 词
中文经验值：1 汉字 ≈ 1–1.5 tokens（现代 tokenizer）

降本优先级：
1. Prompt Caching（缓存读取节省 90%）
2. 模型降级（Haiku vs Opus 差 5×）
3. Batch API（5 折）
4. 压缩 context（减少输入量）
5. 控制输出长度（输出比输入贵 3–5×）
```

---

## 参考资料

- Anthropic 官方文档 - Prompt Caching: https://platform.claude.com/docs/en/docs/build-with-claude/prompt-caching
- Anthropic 模型列表与定价: https://platform.claude.com/docs/en/about-claude/models/overview
- OpenAI tiktoken: https://github.com/openai/tiktoken
- Microsoft LLMLingua: https://github.com/microsoft/LLMLingua
- Helicone: https://helicone.ai/
- LangSmith: https://smith.langchain.com/
- Langfuse: https://langfuse.com/
