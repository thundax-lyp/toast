# Editor SDK Requirements

## 1. Purpose

`toast` 是 AI 原生编辑器 SDK 和 Editor Component，不是按业务页面组织的应用。目标是让宿主产品可以嵌入一个能理解文档、选区、上下文和操作历史的编辑器，并让 AI 以可审查的 patch 方式修改内容。

## 2. Scope

当前范围：

- Editor SDK 的核心能力边界
- Editor Component 的嵌入形态
- AI 对文档结构、选区、上下文和操作历史的理解能力
- AI patch 的生成、预览、应用和回滚能力

不在范围内：

- 不设计业务页面、后台管理页面或内容站页面
- 不绑定具体宿主业务
- 不把 playground 或 demo 作为产品主体

## 3. Product Positioning

`toast` 固定面向可嵌入编辑场景：

- `Editor SDK` 提供稳定 API、事件、命令和扩展点。
- `Editor Component` 提供可直接挂载的编辑器 UI。
- `AI Editing Layer` 负责理解编辑上下文并生成内容修改。
- `Plugin System` 支撑未来新增 block、mark、command 和 AI action。

宿主应用负责业务数据、权限、持久化和页面路由。`toast` 负责编辑器模型、交互、AI 编辑能力和变更表达。

## 4. First Generation Reference

`../wechat-tiptap` 是第一代编辑器参考实现。`toast` 继承其已验证方向：

- 基于 `Tiptap` / `ProseMirror` 的结构化编辑能力
- `Toolbar`、`BubbleMenu`、`Outline`、`Statusbar` 等编辑器 UI 部件
- 表格、图片、链接、字体、缩进、slash command 等 extension 能力
- `Magic` AI 触发和续写、总结、缩短、扩写、润色、翻译等 AI action

`toast` 不直接复制第一代目录结构。第一代中的 demo 页面、微信样式、AI provider、prompt actions 和编辑器核心必须拆分成可配置模块。

## 5. Core Requirements

### 5.1 Document Structure Awareness

编辑器必须维护结构化文档模型，而不是只处理纯字符串。公开输出物固定是线性的 block list，不是 HTML DOM tree，也不是物理嵌套的 block tree。

文档物理结构固定类似 `docx` 和 Markdown 的顺序文档。Markdown 源文档也是按行和 block 顺序表达，heading 只影响后续内容的逻辑分段，不形成物理 children 树。

```text
H1
Content
H2
Content
H3
Content
H2
Content
```

`H1`、`H2` 到 `Hn` 只形成逻辑树。目录、折叠、章节范围、AI 上下文和结构导航都必须通过 block list 计算得到，不依赖物理 children 嵌套。公开 `ToastBlock` 不包含 `children` 字段。

AI 必须能读取 block、inline、mark、heading、list、table 等结构信息。heading block 必须能参与逻辑层级计算。

### 5.2 Selection Awareness

AI action 必须接收当前 selection。selection 至少表达：

- 当前选区范围
- 选区文本
- 选区所在结构节点
- 选区前后邻近上下文

### 5.3 Context Awareness

AI 必须能获取当前任务所需的最小上下文。上下文应包含：

- 文档标题或摘要
- 当前 selection
- selection 邻近内容
- 相关结构节点
- 可选的宿主业务上下文

上下文提取必须可控，不默认把完整文档发送给 AI。

### 5.4 Operation History Awareness

编辑器必须记录可供 AI 理解的操作历史。历史至少表达：

- 用户最近编辑动作
- AI 最近生成或应用的 patch
- patch 是否被接受、拒绝或回滚

历史用于辅助 AI 判断当前编辑意图，不作为永久审计系统。

### 5.5 Patch-Based Editing

AI 不直接覆盖编辑器内容，必须生成 patch。patch 必须支持：

- 描述目标范围
- 展示变更前后内容
- 预览
- 应用
- 拒绝
- 回滚

patch 应优先作用于结构化节点，只有在必要时才退化为文本范围替换。

## 6. Open Items

- 确认首个组件形态是否只支持 React。
- 确认 `ToastDocument` 的 block list JSON 协议和 Markdown / HTML / ProseMirror 之间的转换边界。
- 确认 patch 模型采用 ProseMirror step、JSON patch、自定义结构 patch，还是组合模型。
- 确认首个 AI action：选区改写、续写、总结、结构化整理或多步 agent 编辑。
