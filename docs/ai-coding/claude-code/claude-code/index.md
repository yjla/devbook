---
sidebar_position: 1
sidebar_label: "3.1 Agentic Coding 工具"
---

# Agentic Coding 工具

Agentic Coding CLI 工具在终端中运行，没有图形界面，直接操作文件系统、执行命令、调用 Git——相比 IDE 插件，更易嵌入自动化流水线，也更接近真实的工程环境。

## 主流 CLI 工具

| 工具 | 出品方 | 模型 | 特点 |
|------|--------|------|------|
| Claude Code | Anthropic | Claude | 超大上下文，CLAUDE.md 持久化配置，Hooks + MCP 可扩展 |
| Codex CLI | OpenAI | GPT | 轻量，云端沙箱执行，可直接推送 GitHub |
| Gemini CLI | Google | Gemini | 开源，免费额度大 (1000 次/天，1M token 上下文) |
| OpenCode | 社区 | 75+ LLM | 开源，模型无关，高度可定制 |

## 本章主线

本章以 Claude Code 为主线，原因是它与本系列的方法论 (SRDD) 配合最紧密，`CLAUDE.md` 分层配置和 Hooks + MCP 扩展机制是实践 SRDD 的理想载体。

并不是说 Claude Code 在所有场景下都是最优解——Codex CLI 在部分 benchmark 里表现更好，Gemini CLI 免费额度更大，OpenCode 更适合需要模型灵活性或数据隐私的场景。选哪个取决于你的工作流和预算。

接下来的文章将逐步介绍 Claude Code 的核心机制、源码架构和使用手册。
