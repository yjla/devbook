---
sidebar_position: 4
sidebar_label: "3.4 使用手册"
---

# Claude Code

Claude Code 是 Anthropic 官方出品的 AI 编程助手 CLI 工具，代表了 **AI 原生开发** 的新范式。

## AI 原生开发范式

### AI 1.0 vs AI 2.0

| 维度 | AI 1.0 (人机协作) | AI 2.0 (AI 原生) |
|------|------------------|-----------------|
| 核心理念 | AI 作为辅助工具 | AI 作为核心执行者 |
| 人的角色 | 执行者 + 决策者 | 架构师 + 审核者 |
| 工作流 | 人主导，AI 辅助 | AI 主导，人监督 |
| 典型场景 | Copilot 补全代码 | Agent 自主完成任务 |

### 三大摩擦

AI 编程助手的核心挑战在于消除三类摩擦：

1. **Context Friction（上下文摩擦）**
   - AI 不了解项目背景、技术栈、团队规范
   - 每次对话都要重复解释上下文

2. **Workflow Friction（工作流摩擦）**
   - AI 无法与现有工具链集成
   - 需要手动在 AI 和 IDE/终端之间切换

3. **Cognitive Friction（认知摩擦）**
   - AI 输出不可预测
   - 缺乏结构化的协作模式

### 三大支柱

Claude Code 通过三大支柱解决这些摩擦：

1. **Executable Specs（可执行规范）**
   - 用 Markdown 描述需求，AI 直接执行
   - spec.md → plan.md → tasks.md 工作流

2. **Persistent Context（持久化上下文）**
   - CLAUDE.md 分层配置系统
   - 上下文在会话间持久化

3. **Orchestratable Actions（可编排动作）**
   - Slash Commands 自定义指令
   - Hooks 事件驱动机制
   - MCP 外部系统集成

## 规范驱动开发 (SDD)

**Spec-Driven Development** 是 AI 原生开发的核心方法论：

```
spec.md (What) → plan.md (How) → tasks.md (Steps)
```

### spec.md - 需求规范

定义"做什么"，是与 AI 沟通的契约：

```markdown
# Feature: 用户认证模块

## 目标
实现基于 JWT 的用户认证系统

## 功能需求
- 用户注册（邮箱 + 密码）
- 用户登录（返回 JWT）
- Token 刷新机制

## 非功能需求
- Token 过期时间：15 分钟
- Refresh Token：7 天
```

### plan.md - 实现计划

定义"怎么做"，AI 生成的技术方案：

```markdown
# 实现计划

## 技术选型
- 认证：JWT + bcrypt
- 存储：PostgreSQL

## 模块划分
1. auth.service.ts - 核心认证逻辑
2. auth.controller.ts - API 路由
3. jwt.strategy.ts - Passport 策略
```

### tasks.md - 任务清单

定义"分几步"，可追踪的执行步骤：

```markdown
# 任务清单

- [x] 创建 User 实体
- [x] 实现注册接口
- [ ] 实现登录接口
- [ ] 添加 JWT 中间件
```

## 核心交互模型

Claude Code 的交互基于两个核心符号：

### @ - Context（上下文注入）

`@` 符号用于向 AI 注入上下文：

```bash
# 引用文件
@src/auth/auth.service.ts 分析这个认证逻辑

# 引用目录
@src/components/ 这些组件的设计模式是什么

# 引用网页
@https://nextjs.org/docs/app 根据这个文档实现

# 引用命令输出
@git diff 解释这次改动
```

### ! - Action（动作执行）

`!` 符号用于触发预定义动作：

```bash
# 执行 Slash Command
/commit    # 提交代码
/review    # 代码审查
/deploy    # 部署

# 自定义指令
/test @src/utils/  # 为指定目录生成测试
```

### 组合使用

```bash
# 上下文 + 动作
@spec.md @plan.md 根据规范和计划，/implement 实现功能

# 链式工作流
@requirements.md → /plan → /implement → /test → /review
```

## 上下文管理

### CLAUDE.md 层级

上下文配置文件按优先级从低到高：

```
企业级: ~/.claude/CLAUDE.md        # 全局配置
用户级: ~/projects/CLAUDE.md       # 个人偏好
项目级: ./CLAUDE.md                # 项目规范
目录级: ./src/CLAUDE.md            # 模块规范
```

典型 CLAUDE.md 内容：

```markdown
# 项目规范

## 技术栈
- Framework: Next.js 14 (App Router)
- Styling: Tailwind CSS
- State: Zustand

## 代码规范
- 使用函数式组件
- 文件名使用 kebab-case
- 组件名使用 PascalCase

## 禁止事项
- 不要使用 any 类型
- 不要在组件中直接调用 API
```

### AGENTS.md

定义 AI Agent 的人格和行为：

```markdown
# Agent: Code Reviewer

## 角色
资深代码审查者，关注代码质量和最佳实践

## 审查重点
1. 类型安全
2. 错误处理
3. 性能影响
4. 安全漏洞

## 输出格式
- 问题等级：Critical / Warning / Suggestion
- 给出具体修复建议
```

## Slash Commands

自定义指令系统，封装常用工作流：

### 定义指令

在 `.claude/commands/` 目录下创建 `.md` 文件：

```markdown
<!-- .claude/commands/review.md -->
---
description: 代码审查
---

请对以下代码进行审查：

$ARGUMENTS

审查要点：
1. 代码可读性
2. 潜在 Bug
3. 性能问题
4. 安全漏洞
```

### 使用指令

```bash
/review @src/auth/auth.service.ts
```

### 参数占位符

- `$ARGUMENTS` - 用户传入的参数
- 支持 `@` 引用文件作为参数

## Hooks 机制

事件驱动的自动化系统：

### 四种钩子类型

| 钩子 | 触发时机 | 用途 |
|------|---------|------|
| PreToolUse | 工具执行前 | 拦截/修改/取消操作 |
| PostToolUse | 工具执行后 | 记录/通知/后处理 |
| Notification | 需要通知时 | 桌面提醒/Slack 通知 |
| Stop | 任务完成时 | 清理/报告/触发下游 |

### 配置示例

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit",
        "command": "node scripts/lint-check.js"
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Bash",
        "command": "node scripts/log-command.js"
      }
    ]
  }
}
```

### 典型场景

- **PreToolUse**: 编辑前运行 lint，阻止不规范代码
- **PostToolUse**: 命令执行后记录日志
- **Notification**: 长任务完成时发送通知
- **Stop**: 任务结束时生成报告

## MCP 服务器

**Model Context Protocol** 是连接外部系统的标准协议：

### 架构

```
Claude Code ←→ MCP Client ←→ MCP Server ←→ External System
                                              (Database/API/Files)
```

### 配置 MCP 服务器

```json
{
  "mcpServers": {
    "database": {
      "command": "node",
      "args": ["./mcp/database-server.js"],
      "env": {
        "DATABASE_URL": "postgresql://..."
      }
    },
    "github": {
      "command": "npx",
      "args": ["@anthropic/mcp-server-github"],
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
```

### 典型场景

- 数据库查询和修改
- GitHub Issue/PR 操作
- Slack 消息发送
- 第三方 API 调用

## Subagent 模式

任务分解与并行执行：

### 工作原理

```
主 Agent
   ├── Subagent 1: 前端组件开发
   ├── Subagent 2: API 接口开发
   └── Subagent 3: 测试用例编写
```

### 适用场景

1. **并行开发**: 前后端同时进行
2. **专业分工**: 不同 Agent 有不同专长
3. **大型重构**: 分解成独立子任务

### 编排模式

```markdown
# 任务: 实现用户模块

## 阶段 1: 并行开发
- @frontend-agent: 实现用户列表页面
- @backend-agent: 实现用户 CRUD API

## 阶段 2: 集成
- @qa-agent: 编写集成测试
```

## 面试要点

### 为什么选择 Claude Code？

1. **官方出品**: Anthropic 官方工具，与 Claude 模型深度集成
2. **终端优先**: 不依赖 IDE，与任何工作流兼容
3. **上下文持久化**: CLAUDE.md 系统解决"每次都要重复解释"的问题
4. **可扩展**: Hooks + MCP 可对接任何外部系统

### 与 Cursor/Copilot 的区别？

| 维度 | Claude Code | Cursor | Copilot |
|------|-------------|--------|---------|
| 形态 | CLI | IDE | IDE 插件 |
| 上下文 | CLAUDE.md 分层 | .cursorrules | 无 |
| 扩展性 | MCP + Hooks | 内置功能 | 有限 |
| 自主性 | Agent 模式 | 对话模式 | 补全模式 |

### 实际工作流分享

```bash
# 1. 启动新功能开发
claude "根据 @spec.md 创建实现计划"

# 2. 执行计划
claude "/implement 用户认证模块"

# 3. 代码审查
claude "/review @src/auth/"

# 4. 提交代码
claude "/commit"
```

### 踩坑经验

1. **上下文过大**: CLAUDE.md 不要写太长，影响响应速度
2. **Hooks 阻塞**: PreToolUse 脚本要快，否则影响体验
3. **MCP 连接**: 首次连接可能超时，需要预热
