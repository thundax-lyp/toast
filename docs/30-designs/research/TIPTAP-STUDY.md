# Tiptap Study

## 1. Purpose

本文档研究 `Tiptap` 作为 `toast` 首期编辑器底座的能力边界。当前阶段先完成数据来源采集，后续 TODO 将继续补充数据模型、UI 操作和 AI Toolkit 分析。

## 2. Product Positioning

`Tiptap` 是基于 `ProseMirror` 的 headless rich text editor。它提供 schema、extension、command、selection、transaction、node view、React integration 和 UI components 等底层能力。`toast` 固定以 `Tiptap` / `ProseMirror` 作为首期运行时底座，但公开 SDK 不直接暴露 Tiptap `Editor` 作为唯一控制面。

## 3. Data Sources

- Official docs: https://tiptap.dev/docs/editor/core-concepts/schema，访问日期 2026-05-16，用于研究 Tiptap schema、node、mark 和 content expression。
- Official docs: https://tiptap.dev/docs/editor/core-concepts/extensions，访问日期 2026-05-16，用于研究 Tiptap extension 机制。
- Official docs: https://tiptap.dev/docs/editor/api/commands，访问日期 2026-05-16，用于研究 command 和 chain 操作。
- Official docs: https://tiptap.dev/docs/editor/extensions/custom-extensions/create-new/node，访问日期 2026-05-16，用于研究 custom node、group、content 和 node view。
- Official docs: https://tiptap.dev/docs/editor/extensions/nodes/document，访问日期 2026-05-16，用于研究 top node `Document`。
- Official docs: https://tiptap.dev/docs/ui-components/components/overview，访问日期 2026-05-16，用于研究 Tiptap UI components。
- Official docs: https://tiptap.dev/docs/editor/extensions/functionality/bubble-menu，访问日期 2026-05-16，用于研究 bubble menu 操作入口。
- Official docs: https://tiptap.dev/docs/content-ai/getting-started/overview，访问日期 2026-05-16，用于研究 Tiptap Content AI 总体能力。
- Official docs: https://tiptap.dev/docs/content-ai/capabilities/ai-toolkit，访问日期 2026-05-16，用于研究 AI Toolkit 能力边界。
- Official docs: https://tiptap.dev/docs/content-ai/capabilities/ai-toolkit/api-reference，访问日期 2026-05-16，用于研究 AI Toolkit 的 read、insert、patch、review、schema awareness、diff utility。
- Official docs: https://tiptap.dev/docs/content-ai/capabilities/ai-toolkit/guides/review-changes，访问日期 2026-05-16，用于研究 AI changes review 和 accept / reject 工作流。
- Official docs: https://tiptap.dev/docs/content-ai/capabilities/ai-toolkit/changelog/ai-toolkit，访问日期 2026-05-16，用于研究 AI Toolkit 的 tracked changes、document read 和 suggestion 变化。
- Official docs: https://tiptap.dev/docs/ui-components/getting-started，访问日期 2026-05-16，用于研究 Tiptap UI Components 的安装和组件使用方式。
- Official docs: https://tiptap.dev/docs/ui-components/components/overview，访问日期 2026-05-16，用于研究 toolbar、AI menu、drag context menu、slash dropdown menu、node components 等 UI 组件。
- Official docs: https://tiptap.dev/docs/ui-components/primitives/toolbar，访问日期 2026-05-16，用于研究 toolbar primitive。
- Official docs: https://tiptap.dev/docs/editor/getting-started/style-editor/custom-menus，访问日期 2026-05-16，用于研究自定义 menu、bubble menu 和 floating menu。
- Official docs: https://tiptap.dev/docs/examples/advanced/menus，访问日期 2026-05-16，用于研究 bubble menu 和 floating menu 示例。
- Source code: https://github.com/ueberdosis/tiptap，访问日期 2026-05-16，用于后续研究源码、类型定义、extension 实现和 license。
- npm: `@tiptap/core@3.23.4`，MIT，访问日期 2026-05-16，用于确认核心包版本、许可和 repository。
- npm: `@tiptap/react@3.23.4`，MIT，访问日期 2026-05-16，用于确认 React 集成版本、许可和 repository。
- npm: `@tiptap/starter-kit@3.23.4`，MIT，访问日期 2026-05-16，用于确认常用 extension 套件版本和许可。
- npm: `@tiptap/pm@3.23.4`，MIT，访问日期 2026-05-16，用于确认 Tiptap 的 ProseMirror wrapper package。
- Official docs: https://prosemirror.net/docs/ref/，访问日期 2026-05-16，用于研究 ProseMirror schema、state、transaction、transform、step 和 view API。
- npm: `prosemirror-model@1.25.6`，MIT，访问日期 2026-05-16，用于确认 ProseMirror document model package。
- npm: `prosemirror-state@1.4.4`，MIT，访问日期 2026-05-16，用于确认 ProseMirror editor state package。
- npm: `prosemirror-transform@1.12.0`，MIT，访问日期 2026-05-16，用于确认 ProseMirror transform / step package。
- npm: `prosemirror-view@1.41.8`，MIT，访问日期 2026-05-16，用于确认 ProseMirror view package。

## 4. Core Data Model

### 4.1 Runtime Model

Tiptap 的运行时文档模型来自 ProseMirror。Tiptap schema 是严格 schema：未定义的 HTML element 或 attribute 不会作为有效结构进入编辑器。官方 schema 文档给出的基础模型中，`doc` 使用 `content: 'block+'`，`paragraph` 属于 `group: 'block'`，并允许 `inline*` 内容。

对 `toast` 的结论：

- Tiptap 可以作为 linear block list 的运行时基础，因为 top node 可以限制为 `block+`。
- Tiptap / ProseMirror 内部仍然是树形 node model，例如 paragraph 下有 text，table 下有 row / cell。
- `toast` 的公开控制面必须是 `ToastDocument.blocks`，不能把 ProseMirror JSON 原样作为主 SDK 数据协议。

### 4.2 Block List Feasibility

Tiptap `Document` extension 是 top node，文档说明它定义 `doc`、`topNode: true`，并允许包含多个 block。Tiptap schema 文档还展示了 `Document = Node.create({ name: 'doc', topNode: true, content: 'block+' })` 的模型。

这与 `toast` 的公开线性 block list 兼容：

```ts
interface ToastDocument {
  version: string;
  blocks: ToastBlock[];
}
```

但兼容不等于等同。Tiptap 运行时允许扩展声明更复杂的 content expression，例如 list、table、details 或自定义 node。`toast` 需要在 adapter 层做约束：

- 顶层只允许映射为 `ToastBlock[]`。
- heading、paragraph、image、table 等顶层 block 都需要稳定 block id。
- heading 的 `level` 只用于计算逻辑章节，不产生 `children`。
- table 可以作为单个 block 持有内部 table data，但不参与 heading 章节树。
- list 建议在公开模型中转换为 flat list item block 或 block attrs，不直接暴露 ProseMirror nested list tree。

### 4.3 Selection And Transaction

ProseMirror `EditorState` 持有当前 `doc`、`selection`、`schema` 和 plugins。`Transaction` 用于从当前 state 生成新 state，并能同时记录文档变化、selection 变化和 transaction metadata。

对 `toast` 的结论：

- Tiptap / ProseMirror selection 适合做内部 selection runtime。
- `ToastSelection` 应该从 ProseMirror selection 派生，但对外表达 block id、block range、inline range 和 selected text。
- ProseMirror transaction 适合做 patch apply 的内部执行方式。
- `ToastPatch` 不应直接等同于 transaction，因为产品层需要 review、accept、reject、rollback 和 AI operation metadata。

### 4.4 History And Collaboration

ProseMirror history plugin 提供 undo / redo，并允许通过 transaction metadata 设置 `addToHistory: false`。collab 模块以 steps 和 version 表达协作同步。

对 `toast` 的结论：

- 普通用户编辑可以走 ProseMirror history。
- AI patch 的 preview、accept、reject、rollback 需要独立于普通 undo history 建模。
- ProseMirror steps 可以作为 `ToastPatch` 的内部实现候选，但公开 patch 必须保留 AI action、scope、before / after、review state 和 source context。

### 4.5 Data Model Evidence

| Evidence | Source | Key Fields / API | Meaning | Toast Decision |
| --- | --- | --- | --- | --- |
| Tiptap schema | Official docs: schema | `doc.content = 'block+'`, `paragraph.group = 'block'`, `paragraph.content = 'inline*'` | Tiptap 可把 top document 限制为 block 序列 | adopt as runtime constraint |
| Tiptap Document extension | Official docs: Document extension | `name: 'doc'`, `topNode: true`, `content: 'block+'` | top node 是所有 block 的容器 | adopt internally |
| ProseMirror EditorState | Official docs: ProseMirror ref | `doc`, `selection`, `schema`, `plugins` | 编辑器状态包含文档和选区 | adapt into `ToastEditor` |
| ProseMirror Transaction | Official docs: ProseMirror ref | document changes, selection updates, metadata | transaction 是运行时变更载体 | adapt as patch apply backend |
| ProseMirror history | Official docs: ProseMirror ref | `undo`, `redo`, `addToHistory` | 普通编辑可撤销 | adopt for user edits, separate AI review |
| ProseMirror collab | Official docs: ProseMirror ref | `steps`, `version`, `clientID` | steps 可表达同步变更 | investigate for `ToastPatch` internals |

## 5. Editing Surface

### 5.1 Feature Inventory

| Feature | Scope | Entry | Trigger | Output | Review Model | Toast Baseline |
| --- | --- | --- | --- | --- | --- | --- |
| Toolbar command | selection / block | persistent toolbar | click button | Tiptap command / transaction | undo / redo | 必须支持 |
| Bubble menu | selection | selection floating menu | text selected | command menu near selection | undo / redo | 必须支持 |
| Floating menu | cursor / block | empty paragraph menu | cursor in empty block | insertion / transform commands | undo / redo | 必须支持 |
| Slash command | cursor / block | `/` suggestion menu | user types `/` | insert or transform block | undo / redo | 必须支持 |
| NodeView | block | custom node rendering | node rendered / selected | embedded React UI inside document | command-specific | 必须支持 |
| Drag context menu | block | drag handle / context menu | block hover / drag | block transform / copy / delete | undo / redo | adapt |
| AI menu | selection / block | AI UI component | selected text / AI trigger | AI generation or edit action | review if AI Toolkit used | investigate |

### 5.2 Button And Entry Inventory

| UI Area | Button / Item | Visible When | Action | Opens | Final Effect | Source |
| --- | --- | --- | --- | --- | --- | --- |
| Toolbar | Bold / Italic / Heading / List buttons | editor mounted | run formatting command | none | direct transaction | Official docs: UI components overview |
| Toolbar | Slash Command Trigger Button | editor focused | inserts slash command trigger | suggestion menu | command selection | Official docs: UI components overview |
| Bubble menu | Mark / link / color items | text selected | run selection command | popover if needed | direct transaction | Official docs: bubble menu |
| Floating menu | Insert / transform items | empty block or configured condition | run block command | floating menu | direct transaction | Official docs: custom menus |
| Slash menu | command item | `/` typed | insert or transform block | suggestion menu | direct transaction | Official docs: UI components overview |
| Drag context menu | copy / duplicate / delete / transform | block drag handle visible | block-level command | context menu | direct transaction | Official docs: UI components overview |
| AI menu | AI ask / improve items | selected text or AI component mounted | starts AI action | AI menu / panel | suggestion / change proposal | Official docs: UI components overview |

### 5.3 UI State Matrix

| State | UI Signal | User Can Do | Next State |
| --- | --- | --- | --- |
| idle | toolbar visible, editor focused | click toolbar button or type trigger | command-running / menu-open |
| menu-open | bubble / floating / slash menu visible | choose item, navigate keyboard, dismiss | command-running / cancelled |
| command-running | selected command executes | wait for transaction | applied |
| applied | content or selection changed | undo / redo | idle |
| cancelled | menu dismissed | continue editing | idle |
| error | invalid command or schema mismatch | retry or inspect content error | idle |

Tiptap native UI command 通常没有 preview / accepted / rejected 状态。AI Toolkit 可能提供 review states，单独在 `research-tiptap-ai` 中分析。

## 6. Operation Walkthroughs

### Operation: Toolbar Formatting

- Entry: persistent toolbar
- Preconditions: editor mounted, selection or cursor active
- Steps:
  1. UI Area: Toolbar
     - User Action: click formatting button
     - Button / Item: Bold / Italic / Heading / List
     - System Feedback: command applies and editor state updates
     - Data / Context Used: current selection and active marks / nodes
     - Content Mutation: yes, direct transaction
- UI States: idle -> command-running -> applied
- Result: selected text or current block changes format
- Cancel / Undo / Rollback: ProseMirror history undo / redo
- Screenshot References: `docs/30-designs/research/assets/tiptap/SOURCES.md`，截图待补，当前以官方 UI components 文档替代
- Data Sources: Official docs: UI components overview, toolbar primitive, commands
- Toast Implication: `toast` 应支持 persistent toolbar，但 toolbar action 必须通过 `ToastCommand` registry 包装，不直接作为宿主主 API 暴露 Tiptap command。

### Operation: Bubble Menu On Selection

- Entry: selection bubble menu
- Preconditions: user selects text
- Steps:
  1. UI Area: Editor selection
     - User Action: select text
     - Button / Item: none
     - System Feedback: bubble menu appears near selection
     - Data / Context Used: current selection
     - Content Mutation: no
  2. UI Area: Bubble menu
     - User Action: click mark / link / color item
     - Button / Item: mark or link command
     - System Feedback: command applies
     - Data / Context Used: selected text range
     - Content Mutation: yes, direct transaction
- UI States: idle -> menu-open -> command-running -> applied
- Result: selected text receives mark or link attrs
- Cancel / Undo / Rollback: dismiss bubble menu or undo transaction
- Screenshot References: `docs/30-designs/research/assets/tiptap/SOURCES.md`，截图待补，当前以官方 bubble menu 文档替代
- Data Sources: Official docs: BubbleMenu extension, custom menus
- Toast Implication: `toast` 的 selection bubble 必须同时承载 formatting 和 selection-level AI，但所有 AI 修改必须走 `ToastPatch` preview。

### Operation: Slash Command Insert

- Entry: slash command
- Preconditions: cursor in editable text block
- Steps:
  1. UI Area: Editor content
     - User Action: type `/`
     - Button / Item: slash trigger
     - System Feedback: suggestion menu opens
     - Data / Context Used: cursor position and query text
     - Content Mutation: no
  2. UI Area: Slash menu
     - User Action: choose command item
     - Button / Item: heading / list / image / AI command
     - System Feedback: command executes
     - Data / Context Used: cursor block and command payload
     - Content Mutation: yes, direct transaction
- UI States: idle -> menu-open -> command-running -> applied
- Result: block is inserted or transformed
- Cancel / Undo / Rollback: Escape / click outside / undo
- Screenshot References: `docs/30-designs/research/assets/tiptap/SOURCES.md`，截图待补，当前以官方 UI components overview 替代
- Data Sources: Official docs: UI components overview, suggestion menu
- Toast Implication: `toast` 应支持 slash command，但 command items 必须映射到 `ToastCommand`，AI command 必须进入 AI action -> patch workflow。

### Operation: Custom NodeView

- Entry: rendered custom node
- Preconditions: schema includes custom node and node view
- Steps:
  1. UI Area: Editor content
     - User Action: insert or select custom node
     - Button / Item: node-specific UI
     - System Feedback: custom React / DOM UI renders inside editor
     - Data / Context Used: node attrs and node position
     - Content Mutation: optional, via node commands
- UI States: idle -> node-rendered -> command-running -> applied
- Result: custom block can show embedded UI and node-specific controls
- Cancel / Undo / Rollback: command-specific undo / redo
- Screenshot References: `docs/30-designs/research/assets/tiptap/SOURCES.md`，截图待补，当前以 node API 文档替代
- Data Sources: Official docs: Node API, UI node components
- Toast Implication: `toast` 可用 NodeView 实现 table、image、AI patch preview 等复杂 block UI，但公开数据仍保持 linear block list。

## 7. AI Entry Points

待补充。

## 8. Context Model

待补充。

## 9. Patch / Review / Revision Model

待补充。

## 10. Keyboard And Shortcut Model

待补充。

## 11. Extension / Customization Model

待补充。

## 12. Strengths

待补充。

## 13. Limits

待补充。

## 14. Required Baseline For Toast

| Product Feature | Toast Decision | Phase | Reason |
| --- | --- | --- | --- |
| Strict schema | adopt | Phase 1 | 需要限制文档结构和 AI patch 合法性 |
| Top node `block+` | adopt | Phase 1 | 支撑 linear block list 运行时约束 |
| ProseMirror JSON as public document | reject | Phase 1 | 公开模型固定为 `ToastDocument.blocks` |
| ProseMirror transaction | adapt | Phase 1 | 适合作为 patch apply backend，不适合作为唯一产品 patch |
| ProseMirror steps | investigate | Phase 1 | 可能承载内部 patch，但需要产品 metadata |
| Nested list / table runtime tree | adapt | Phase 1 | table 可作为 block 内部结构，list 需要公开模型打平策略 |

## 15. Lessons For Toast

- Tiptap 适合作为运行时底座，但不应成为公开文档协议。
- `toast` 可以用 Tiptap schema 限制顶层结构为 block 序列。
- `ToastDocument` 必须是 adapter 层产物，稳定表达 linear block list。
- `ToastSelection` 必须基于 block id / block range / inline range，而不是只暴露 ProseMirror positions。
- `ToastPatch` 可以借助 ProseMirror transaction / steps 执行，但必须保留产品级 review metadata。

## 16. Open Items

- 补充 `research-tiptap-ai`。
