# Notes - 个人知识库

## 项目简介

基于 Docusaurus 3 构建的个人笔记站点，用于记录日常学习中的知识沉淀。

前身是 2022 年面试备战时积累的前端笔记，现重构为个人长期知识体系，不再以「面试导向」为目标，而是以「真实理解、长期积累」为目标。

## 技术栈

- Docusaurus 3.9.2（React 19）
- TypeScript
- 支持 KaTeX 数学公式（remark-math + rehype-katex）
- Prettier 格式化

官方文档：https://www.docusaurus.cn/ —— 遇到 Docusaurus 相关问题优先查阅。

## 工作原则

- 遇到不熟悉的工具、名词、事件，先用 WebSearch 搜索，再作答或写入文档，不要凭印象猜测
- 重命名目录或文件时，必须同步更新所有引用该路径的链接（包括 `_category_.json`、frontmatter、markdown 内链、`docusaurus.config.ts`、`sidebars.ts`）
- 每次完成操作后，自动执行 git commit，提交本次变更

## 目录结构

```
docs/
├── ai-coding/    # AI Coding
├── css/          # CSS 布局、效果、预处理器
├── html/
├── javascript/   # ES5、ES6+、DOM、BOM、TypeScript、设计模式
├── react/        # React.js、React Router、Redux、React Native
├── node.js/
├── network/      # HTTP、TCP、DNS、安全、跨域、鉴权
├── performance/  # 性能优化、监控、埋点
├── algorithm/    # 算法
├── polyfill/     # API 实现
├── scenario/     # 场景设计手写题
└── convention/   # 代码规范
```

## 内容方向

- 内容不以「面试八股」为导向，侧重真实理解和工程实践
- 旧有的面试导向内容（如「面试大纲」「quiz」等）待逐步重构或归档
- 新笔记应体现个人思考，而不只是知识点罗列
- 这是完整的知识体系，不是速记，内容应系统、完整

## 图表

项目已配置 Mermaid，流程、关系、时序等内容尽量用 Mermaid 图表代替纯文字描述。

## 行文风格

- 简单明了，一针见血，避免废话
- 结论先行，先给答案再解释原因
- 不写「本文将介绍……」「综上所述……」之类的套话
- 举例要具体，避免抽象描述
- 代码示例尽量使用 JavaScript 书写
- 括号使用英文括号 `()`，不使用中文括号 `（）`
- 中文行内加粗 `**文字**` 前后需加空格，否则无法正确渲染
- 合理使用 Docusaurus Admonitions（`:::note`、`:::info`、`:::tip` 等）补充解释性内容，避免打断正文叙述节奏。背景知识、名词解释用 `:::info`，注意事项用 `:::warning`，实用建议用 `:::tip`
- 文件名、目录名、代码、命令等使用反引号包裹，如 `spec.md`、`npm start`
- 引用外部参考资料（论文、文档、工具等）时需附上 URL

## 命名规范

- 所有目录名、文件名、URL 路径全部使用小写，不允许大写字母

## 目录编号规范

目录和文章使用层级编号，体现知识体系的结构：

- 一级目录（如 `docs/AI/tools/`）对应章，编号如 `1`、`2`
- 二级目录或文章对应节，编号如 `1.1`、`1.2`
- 更深层文章对应小节，编号如 `1.1.1`、`1.1.2`
- 编号体现在 `_category_.json` 的 `label` 和文章的 `sidebar_label` 中，例如：
  ```json
  { "label": "1 工具与环境" }
  ```
- `sidebar_position` 用于控制排序，编号用于显示

## 常用命令

```bash
npm start        # 本地开发
npm run build    # 构建
npm run serve    # 预览构建结果
```
