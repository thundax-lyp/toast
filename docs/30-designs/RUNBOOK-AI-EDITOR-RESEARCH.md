# Runbook AI Editor Research

## 1. Purpose

本文档定义本轮 AI inside editor 研究任务的执行手册。目标是系统研究开源编辑器和高影响力 AI 编辑器产品，形成可追溯、可对比、可落到 `toast` 设计决策的研究文档。

## 2. Scope

当前范围：

- Tiptap、BlockNote、Plate 等开源编辑器基线研究
- Cursor、Word Copilot、Google Docs Gemini、Notion AI、飞书 / Lark Docs AI、Grammarly 等 AI 编辑器产品研究
- 操作细节、UI 入口、数据结构、上下文机制、patch / review / revision / checkpoint 机制
- 截图、官方文档、源码、npm、GitHub、实测记录等数据来源归档

不在范围内：

- 不实现编辑器代码
- 不提交最终架构结论
- 不把未验证的产品印象写成事实
- 不用泛泛竞品分析替代 operation walkthrough

## 3. Research Principles

- 每个事实判断必须标明数据来源。
- 优先使用官方文档、源码、npm registry、GitHub repository、官方 changelog 和实际操作截图。
- 第三方文章、论坛和视频只能作为辅助材料，不能单独作为关键结论来源。
- 同一关键能力至少使用两个来源交叉验证；如果只能找到一个来源，必须标记为 `单来源待复核`。
- 每篇研究文档必须记录采集日期。
- 每篇研究文档必须区分事实、推断和对 `toast` 的设计建议。
- 闭源产品的内部数据结构不得写成事实，只能写成公开 API、文档表现或 UI 行为推断。
- 截图必须服务于具体操作说明，不作为装饰。

## 4. Source Priority

数据来源优先级固定如下：

1. 官方源码、公开类型定义、schema 定义
2. 官方文档、帮助中心、API reference
3. npm registry、package metadata、license 文件、release notes
4. 官方 demo、官方截图、官方视频
5. 自己实测截图和操作记录
6. 第三方文章、论坛、视频、新闻

使用第 6 类来源时，必须说明它只用于补充观察，不作为关键事实唯一依据。

## 5. Execution Order

### 5.1 Establish Research Rules

产物：

- `docs/00-governance/RESEARCH-DOCUMENT-RULES.md`

目标：

- 固定研究文档结构
- 固定数据来源格式
- 固定截图命名和引用规则
- 固定 operation walkthrough 格式

完成后才能继续批量撰写研究文档。

### 5.2 Open Source Baseline

产物：

- `docs/30-designs/research/OPEN-SOURCE-EDITOR-BASELINE.md`
- `docs/30-designs/research/TIPTAP-STUDY.md`
- `docs/30-designs/research/BLOCKNOTE-STUDY.md`
- 后续按需补 `docs/30-designs/research/PLATE-STUDY.md`

目标：

- 明确 `toast` 不能低于的开源能力线
- 明确 Tiptap 的底座能力和商业 AI 边界
- 明确 BlockNote 的开箱 UI、block tree 模型和 AI extension 能力
- 明确 `toast` 的 linear block list 差异

### 5.3 AI Operation Baseline

产物：

- `docs/30-designs/research/CURSOR-STUDY.md`

目标：

- 拆解 Tab、Inline Edit、Quick Question、Chat、Agent、context picker、rules、diff review、checkpoint
- 映射到 `toast` 的 cursor、selection、block、section、document 五类操作作用域
- 提炼 AI action 到 patch review 的统一操作协议

### 5.4 AI Document Product Baseline

产物：

- `docs/30-designs/research/AI-DOCUMENT-PRODUCT-BASELINE.md`
- 后续按需拆分：
  - `WORD-COPILOT-STUDY.md`
  - `GOOGLE-DOCS-GEMINI-STUDY.md`
  - `NOTION-AI-STUDY.md`
  - `FEISHU-DOCS-AI-STUDY.md`
  - `GRAMMARLY-STUDY.md`

目标：

- 比较文档级 AI、选区级 AI、修订模式、协作上下文、写作建议和低打扰交互
- 明确 `toast` 需要学习的文档编辑体验

### 5.5 Synthesis

产物：

- 更新 `docs/30-designs/AI-EDITOR-OPERATION-COMPARISON.md`
- 更新 `docs/30-designs/EDITOR-SDK-PRODUCTIZATION-DESIGN.md`
- 必要时更新 `docs/10-requirements/EDITOR-SDK-REQUIREMENTS.md`

目标：

- 把研究结论收敛成 `toast` 的能力基线、操作协议和架构约束
- 删除、拆分或收窄 `TODO.md` 中已经完成的研究任务

## 6. Per-Product Research Checklist

### 6.1 Tiptap

必须覆盖：

- schema、node、mark、extension、command、transaction、selection、history
- `doc: block+` 以及限制顶层 block list 的实现可能性
- UI components、toolbar、bubble menu、floating menu、slash command
- NodeView 和 React component 嵌入方式
- AI Toolkit 的公开能力、商业边界和可替代设计
- ProseMirror step / transaction 是否适合承载 `ToastPatch`

至少 walkthrough：

- 配置 toolbar / bubble menu
- 使用 slash command 插入内容
- 自定义 extension 或 node view
- AI Toolkit 或 AI menu 的公开操作路径

### 6.2 BlockNote

必须覆盖：

- `Block` 类型、`children: Block[]`、inline content、table content
- `blockGroup` / `blockContainer` / `blockContent` 等内部 ProseMirror 包装
- side menu、drag handle、slash menu、formatting toolbar
- block API：insert、update、remove、replace、move、nest
- AI extension、accept / reject changes、许可证边界
- 与 `toast` linear block list 的差异

至少 walkthrough：

- hover block 出现 side menu
- slash menu 插入 block
- 修改 block type 或 formatting
- AI 修改并 accept / reject

### 6.3 Cursor

必须覆盖：

- Tab completion
- Inline Edit
- Quick Question
- Full file edit
- Chat / Agent
- context picker / `@` symbols
- rules、memories、checkpoints、diff apply

至少 walkthrough：

- selection inline edit
- ask before edit
- chat / agent 生成多处改动
- diff review 和 checkpoint rollback

### 6.4 AI Document Products

每个闭源文档产品至少覆盖：

- 空白态 AI 入口
- 选区 AI 入口
- 文档级 AI 入口
- review / revision / suggestion / undo 机制
- 是否有上下文选择、规则或知识库引用
- 是否支持结构化输出，例如 table、outline、summary、FAQ

优先研究：

1. Word Copilot
2. Google Docs Gemini
3. Notion AI
4. 飞书 / Lark Docs AI
5. Grammarly

## 7. Required Document Structure

每篇产品研究文档固定包含：

```markdown
# Xxx Study

## 1. Purpose
## 2. Product Positioning
## 3. Data Sources
## 4. Core Data Model
## 5. Editing Surface
## 6. Operation Walkthroughs
## 7. AI Entry Points
## 8. Context Model
## 9. Patch / Review / Revision Model
## 10. Keyboard And Shortcut Model
## 11. Extension / Customization Model
## 12. Strengths
## 13. Limits
## 14. Required Baseline For Toast
## 15. Lessons For Toast
## 16. Open Items
```

如某一节不适用，必须写 `无` 或说明原因，不得直接省略核心判断。

## 8. Deliverable Detail Requirements

研究交付物必须达到功能点和按钮级别，不得只写模块概述。

每篇单项研究文档必须包含以下细颗粒度产物：

### 8.1 Feature Inventory

按功能点列出产品能力：

```markdown
| Feature | Scope | Entry | Trigger | Output | Review Model | Toast Baseline |
| --- | --- | --- | --- | --- | --- | --- |
| Rewrite Selection | selection | bubble menu / shortcut | selected text | replacement suggestion | accept / reject | 必须支持 |
```

要求：

- 每个 AI 能力单独成行。
- `Scope` 固定使用 `cursor`、`selection`、`block`、`blockRange`、`section`、`document`、`workspace`。
- `Entry` 必须写清 UI 入口，例如 toolbar、bubble menu、side menu、slash menu、command palette、side panel、快捷键。
- `Output` 必须写清生成的是 suggestion、inline text、block、patch、diff、comment、summary 还是 structured data。

### 8.2 Button And Entry Inventory

按按钮、菜单项和入口列出操作：

```markdown
| UI Area | Button / Item | Visible When | Action | Opens | Final Effect | Source |
| --- | --- | --- | --- | --- | --- | --- |
| Bubble menu | Improve writing | text selected | starts AI rewrite | inline popover | patch proposal | Official docs |
```

要求：

- toolbar、bubble menu、side menu、slash menu、AI panel、context picker 中出现的关键按钮必须逐项列出。
- `Visible When` 必须说明出现条件，例如 empty document、text selected、block hover、heading selected、AI running、diff pending。
- `Final Effect` 必须说明是否直接修改内容、生成建议、打开面板、进入 diff review 或只是提问。

### 8.3 UI State Matrix

关键操作必须记录状态变化：

```markdown
| State | UI Signal | User Can Do | Next State |
| --- | --- | --- | --- |
| idle | AI button visible | click action | prompt |
| generating | spinner / streaming text | stop | preview |
| preview | diff shown | accept / reject | applied / rejected |
```

至少覆盖：

- idle
- prompt
- generating
- preview
- accepted
- rejected
- cancelled
- error

如某产品没有某个状态，必须写 `无` 并说明原因。

### 8.4 Operation Walkthroughs

walkthrough 必须是按钮级步骤，不得只写“用户选择 AI 改写”。

每一步必须包含：

- 用户动作
- 所在 UI 区域
- 点击的按钮或菜单项名称
- 当前上下文
- 系统反馈
- 是否产生内容修改

### 8.5 Data Model Evidence

开源项目必须提供源码或类型级证据：

- 类型名
- 文件路径或 URL
- 关键字段
- 字段含义
- 与 `toast` 的差异

闭源产品必须明确只能记录公开行为或推断：

- 可观察 UI 行为
- 公开 API 或文档说明
- 不能确认的内部模型标记为 `待验证`

### 8.6 Toast Baseline Decisions

每篇研究文档必须输出按钮级结论：

```markdown
| Product Feature | Toast Decision | Phase | Reason |
| --- | --- | --- | --- |
| Accept / Reject AI changes | adopt | Phase 1 | AI patch workflow 核心闭环 |
| Physical block children | reject | Never | toast 采用 linear block list |
```

`Toast Decision` 固定使用：

- `adopt`
- `adapt`
- `reject`
- `defer`
- `investigate`

## 9. Operation Walkthrough Format

每个关键操作必须使用以下结构：

```markdown
### Operation: Name

- Entry:
- Preconditions:
- Steps:
  1. UI Area:
     - User Action:
     - Button / Item:
     - System Feedback:
     - Data / Context Used:
     - Content Mutation:
- UI States:
- Result:
- Cancel / Undo / Rollback:
- Screenshot References:
- Data Sources:
- Toast Implication:
```

每篇研究文档至少包含：

- 开源编辑器：4 个 walkthrough
- Cursor：4 个 walkthrough
- AI 文档产品：3 个 walkthrough
- 总表文档：不要求 walkthrough，但必须链接到单项研究文档

## 10. Screenshot Rules

截图目录：

```text
docs/30-designs/research/assets/
  tiptap/
  blocknote/
  cursor/
  word-copilot/
  google-docs-gemini/
  notion-ai/
  feishu-docs-ai/
  grammarly/
```

截图命名：

```text
PRODUCT-OPERATION-STATE.png
```

示例：

```text
CURSOR-INLINE-EDIT-PROMPT.png
BLOCKNOTE-SIDE-MENU-HOVER.png
WORD-COPILOT-REWRITE-SUGGESTIONS.png
```

每张截图必须在文档中说明：

- 来源
- 采集日期
- 对应操作
- 说明了哪个 UI 状态

如果无法取得截图，必须写明原因，并使用官方文档图片链接、文字步骤或公开视频时间点替代。缺少截图不得阻塞研究，但必须标记为 `截图待补`。

## 11. Data Source Format

`Data Sources` 固定使用列表：

```markdown
- Official docs: URL，访问日期 YYYY-MM-DD，用途说明
- Source code: URL / commit / path，用途说明
- npm: package@version，访问日期 YYYY-MM-DD，用途说明
- Screenshot: relative/path.png，采集日期 YYYY-MM-DD，用途说明
- Hands-on note: 操作环境、日期、观察结论
```

无法验证的数据必须标记为 `待验证`。

每篇文档的 `Data Sources` 必须至少包含：

- 开源项目：官方文档、源码或类型定义、npm 或 license 信息
- 闭源产品：官方帮助文档、官方产品页或 changelog、至少一个操作截图或官方图片来源
- Cursor / IDE 类：官方文档、操作说明、diff / checkpoint / context 相关来源

## 12. Batch Plan

本轮研究按批次执行：

### Batch 1: Rules And Baseline

- `RESEARCH-DOCUMENT-RULES.md`
- `OPEN-SOURCE-EDITOR-BASELINE.md`

### Batch 2: Open Source Deep Dives

- `TIPTAP-STUDY.md`
- `BLOCKNOTE-STUDY.md`
- `PLATE-STUDY.md` 如确认为必要

### Batch 3: AI Operation Deep Dive

- `CURSOR-STUDY.md`

### Batch 4: Document Product Deep Dives

- `AI-DOCUMENT-PRODUCT-BASELINE.md`
- 按优先级拆分单项研究文档

### Batch 5: Synthesis

- 更新现有需求和设计文档
- 收窄或删除已完成 TODO
- 判断是否清理本 RUNBOOK

每个 batch 完成后必须先收口，再进入下一批。

## 13. Verification

每篇研究文档完成前必须检查：

1. 是否标明数据来源。
2. 是否包含 feature inventory。
3. 是否包含 button and entry inventory。
4. 是否包含 UI state matrix。
5. 是否包含最低数量的按钮级 operation walkthrough。
6. 是否有 data model evidence。
7. 是否包含 toast baseline decisions。
8. 是否满足最低数据来源数量。
9. 是否区分事实、推断和 `toast` 设计建议。
10. 是否明确 `Required Baseline For Toast`。
11. 是否明确不能复制的设计。
12. 是否有未验证项并写入 `Open Items`。
13. 是否把结论落到 `toast` 的能力、交互或架构决策。

每个 batch 完成前必须检查：

1. 对应 TODO 是否已经完成、拆分或收窄。
2. 研究结论是否需要同步到需求文档或设计文档。
3. 是否存在截图待补、来源待验证或关键疑问。
4. 当前产物是否可以支持下一批研究。

## 14. Risk Controls

- 遇到闭源产品无法直接实测时，先使用官方文档和公开视频，不臆测内部实现。
- 遇到官方文档与实测不一致时，必须同时记录，并标记实测环境和日期。
- 遇到产品版本快速变化时，必须记录访问日期和版本号。
- 遇到许可证不清晰时，不得把代码或设计作为可复用依据，只记录能力观察。
- 遇到截图版权或来源不明时，不纳入资产目录，只保留链接和文字说明。

## 15. Closeout

本轮研究完成后：

- 已完成 TODO 必须删除、拆分或收窄。
- 长期稳定结论必须同步到需求或设计文档。
- 临时研究执行手册可以删除，或保留到全部研究任务完成后再清理。
- 完成记录保留在 commit 或 PR 中，不写入 `TODO.md`。

## 16. Open Items

无
