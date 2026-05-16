# Research Document Rules

## 1. Purpose

本文档定义 `toast` 竞品、开源项目和 AI 编辑器产品研究文档的写作规则。目标是让研究产物可追溯、可复核、可比较，并能落到 `toast` 的需求、架构和交互决策。

## 2. Scope

当前范围：

- `docs/30-designs/research/` 下的研究文档
- 开源编辑器研究，例如 `Tiptap`、`BlockNote`、`Plate`
- AI 编辑器产品研究，例如 `Cursor`、Word Copilot、Google Docs Gemini、Notion AI、飞书 / Lark Docs AI、Grammarly
- 研究截图、官方文档、源码、npm、GitHub、实测记录等数据来源

不在范围内：

- 不替代需求文档
- 不替代架构设计文档
- 不记录未经验证的产品印象
- 不允许用泛泛竞品分析替代按钮级操作研究

## 3. Source Rules

每个事实判断必须标明数据来源。数据来源优先级固定如下：

1. 官方源码、公开类型定义、schema 定义
2. 官方文档、帮助中心、API reference
3. npm registry、package metadata、license 文件、release notes
4. 官方 demo、官方截图、官方视频
5. 自己实测截图和操作记录
6. 第三方文章、论坛、视频、新闻

第三方来源只能作为辅助观察，不得作为关键结论的唯一依据。同一关键能力至少使用两个来源交叉验证；如果只能找到一个来源，必须标记为 `单来源待复核`。

闭源产品的内部数据结构不得写成事实，只能写成公开 API、文档表现或 UI 行为推断。无法验证的数据必须标记为 `待验证`。

## 4. Required Structure

每篇单项研究文档固定包含：

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

## 5. Detail Requirements

研究交付物必须达到功能点和按钮级别。每篇单项研究文档必须包含：

- `Feature Inventory`
- `Button And Entry Inventory`
- `UI State Matrix`
- 按钮级 `Operation Walkthroughs`
- `Data Model Evidence`
- `Toast Baseline Decisions`

不得只写“支持 AI 改写”“有 slash menu”“支持 review”这类模块级描述。

## 6. Feature Inventory

功能清单固定使用以下格式：

```markdown
| Feature | Scope | Entry | Trigger | Output | Review Model | Toast Baseline |
| --- | --- | --- | --- | --- | --- | --- |
| Rewrite Selection | selection | bubble menu / shortcut | selected text | replacement suggestion | accept / reject | 必须支持 |
```

规则：

- 每个 AI 能力单独成行。
- `Scope` 固定使用 `cursor`、`selection`、`block`、`blockRange`、`section`、`document`、`workspace`。
- `Entry` 必须写清 UI 入口，例如 toolbar、bubble menu、side menu、slash menu、command palette、side panel、快捷键。
- `Output` 必须写清生成的是 suggestion、inline text、block、patch、diff、comment、summary 还是 structured data。

## 7. Button And Entry Inventory

按钮和入口清单固定使用以下格式：

```markdown
| UI Area | Button / Item | Visible When | Action | Opens | Final Effect | Source |
| --- | --- | --- | --- | --- | --- | --- |
| Bubble menu | Improve writing | text selected | starts AI rewrite | inline popover | patch proposal | Official docs |
```

规则：

- toolbar、bubble menu、side menu、slash menu、AI panel、context picker 中出现的关键按钮必须逐项列出。
- `Visible When` 必须说明出现条件，例如 empty document、text selected、block hover、heading selected、AI running、diff pending。
- `Final Effect` 必须说明是否直接修改内容、生成建议、打开面板、进入 diff review 或只是提问。

## 8. UI State Matrix

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

## 9. Operation Walkthrough Rules

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

每一步必须包含用户动作、UI 区域、按钮或菜单项名称、当前上下文、系统反馈和是否产生内容修改。

最低数量：

- 开源编辑器：4 个 walkthrough
- Cursor：4 个 walkthrough
- AI 文档产品：3 个 walkthrough
- 总表文档：不要求 walkthrough，但必须链接到单项研究文档

## 10. Screenshot Rules

截图目录固定放在：

```text
docs/30-designs/research/assets/
```

产品子目录使用小写短横线，例如：

```text
tiptap/
blocknote/
cursor/
word-copilot/
google-docs-gemini/
notion-ai/
feishu-docs-ai/
grammarly/
```

截图命名固定为：

```text
PRODUCT-OPERATION-STATE.png
```

每张截图必须在文档中说明来源、采集日期、对应操作和说明的 UI 状态。如果无法取得截图，必须写明原因，并使用官方文档图片链接、文字步骤或公开视频时间点替代。缺少截图不得阻塞研究，但必须标记为 `截图待补`。

## 11. Data Source Format

`Data Sources` 固定使用列表：

```markdown
- Official docs: URL，访问日期 YYYY-MM-DD，用途说明
- Source code: URL / commit / path，用途说明
- npm: package@version，访问日期 YYYY-MM-DD，用途说明
- Screenshot: relative/path.png，采集日期 YYYY-MM-DD，用途说明
- Hands-on note: 操作环境、日期、观察结论
```

每篇文档的 `Data Sources` 至少包含：

- 开源项目：官方文档、源码或类型定义、npm 或 license 信息
- 闭源产品：官方帮助文档、官方产品页或 changelog、至少一个操作截图或官方图片来源
- Cursor / IDE 类：官方文档、操作说明、diff / checkpoint / context 相关来源

## 12. Data Model Evidence

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

## 13. Toast Baseline Decisions

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

## 14. Verification

每篇研究文档完成前必须检查：

1. 是否标明数据来源。
2. 是否包含 `Feature Inventory`。
3. 是否包含 `Button And Entry Inventory`。
4. 是否包含 `UI State Matrix`。
5. 是否包含最低数量的按钮级 operation walkthrough。
6. 是否有 data model evidence。
7. 是否包含 toast baseline decisions。
8. 是否区分事实、推断和 `toast` 设计建议。
9. 是否明确不能复制的设计。
10. 是否有未验证项并写入 `Open Items`。

## 15. Open Items

无
