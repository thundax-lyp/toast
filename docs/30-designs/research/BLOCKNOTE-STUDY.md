# BlockNote Study

## 1. Purpose

本文档研究 `BlockNote` 作为 `toast` 对标对象的产品、数据模型、操作入口和 AI 能力。当前阶段先完成数据来源采集，后续 TODO 将分别补充数据模型、UI 操作和 AI extension 分析。

## 2. Product Positioning

`BlockNote` 是基于 `ProseMirror` 和 `Tiptap` 的 Notion-style block editor。它比 Tiptap 更产品化，开箱提供 block-based 数据结构、React UI components、drag handle、slash menu、formatting toolbar、collaboration 和 AI extension。`toast` 必须至少达到 BlockNote 的开箱编辑体验，但公开数据模型将坚持 linear block list，而不是 BlockNote 的 physical block tree。

## 3. Data Sources

- Official docs: https://www.blocknotejs.org/docs/foundations/document-structure，访问日期 2026-05-16，用于研究 `Block`、`InlineContent`、`TableContent`、`children` 和 document JSON。
- Official docs: https://www.blocknotejs.org/docs/reference/editor/manipulating-content，访问日期 2026-05-16，用于研究 block read / insert / update / remove / replace / move / nesting API。
- Official docs: https://www.blocknotejs.org/docs/features/blocks，访问日期 2026-05-16，用于研究 built-in blocks、default block props、inline content 和 default schema。
- Official docs: https://www.blocknotejs.org/docs/foundations/schemas，访问日期 2026-05-16，用于研究 custom schema 和 content type 定义。
- Official docs: https://www.blocknotejs.org/docs/react/components/side-menu，访问日期 2026-05-16，用于研究 block side menu、`+` button、drag handle 和 drag handle menu。
- Official docs: https://www.blocknotejs.org/docs/react/components/suggestion-menus，访问日期 2026-05-16，用于研究 slash menu、trigger character、item schema、grouping 和 ordering。
- Official docs: https://www.blocknotejs.org/docs/react/components/formatting-toolbar，访问日期 2026-05-16，用于研究 selection formatting toolbar、block type select 和 toolbar customization。
- Official docs: https://www.blocknotejs.org/docs/react/components/grid-suggestion-menus，访问日期 2026-05-16，用于研究 grid suggestion menu 作为更平铺 command surface 的参考。
- Official docs: https://www.blocknotejs.org/docs/react/components/link-toolbar，访问日期 2026-05-16，用于研究 link editing toolbar。
- Official docs: https://www.blocknotejs.org/docs/features/ai，访问日期 2026-05-16，用于研究 BlockNote AI 的定位、interactive suggestions、streaming、transparent operations、model agnostic 和 license 边界。
- Official docs: https://www.blocknotejs.org/docs/features/ai/reference，访问日期 2026-05-16，用于研究 `AIExtension`、`invokeAI`、AI menu state、agent cursor、transport、stream tools 和 document state builder。
- Official docs: https://www.blocknotejs.org/docs/features/ai/custom-commands，访问日期 2026-05-16，用于研究 custom AI commands。
- Official docs: https://www.blocknotejs.org/legal/blocknote-xl-commercial-license，访问日期 2026-05-16，用于研究 `xl-` package 商业许可。
- Source code: https://github.com/TypeCellOS/BlockNote，访问日期 2026-05-16，用于研究源码、monorepo 结构、tests、examples、license 和 package 边界。
- Source code: https://app.unpkg.com/%40blocknote/core%400.41.1/files/src/pm-nodes/README.md，访问日期 2026-05-16，用于研究 BlockNote 内部 ProseMirror node 结构：`blockGroup`、`blockContainer`、`blockContent`。
- npm: `@blocknote/core@0.51.0`，MPL-2.0，访问日期 2026-05-16，用于确认核心包版本、许可、描述和 repository。
- npm: `@blocknote/react@0.51.0`，MPL-2.0，访问日期 2026-05-16，用于确认 React UI package 版本、许可、描述和 repository。
- npm: `@blocknote/xl-ai@0.51.0`，`GPL-3.0 OR PROPRIETARY`，访问日期 2026-05-16，用于确认 AI package 版本、许可、描述和 repository。

## 4. Core Data Model

### 4.1 Public Block Model

BlockNote 的公开文档结构是 `Block[]`。每个 `Block` 包含稳定 `id`、`type`、`props`、`content` 和 `children`：

```ts
type Block = {
  id: string;
  type: string;
  props: Record<string, boolean | number | string>;
  content: InlineContent[] | TableContent | undefined;
  children: Block[];
};
```

关键点：

- `editor.document` 返回 top-level blocks，不直接返回整棵树的 flat traversal。
- `children` 是物理嵌套结构，nested blocks 仍然是完整 `Block`。
- `content` 不包含 nested blocks；正文内容和子块结构分离。
- `id` 是 block 级身份，inline content 没有独立 id。

### 4.2 Inline And Table Content

普通文本 block 的 `content` 是 `InlineContent[]`，主要包括 `StyledText`、`Link` 和 custom inline content。`StyledText` 通过 `styles` 记录 bold、italic、color 等 rich text 信息。

表格是特殊情况：`table` block 的 `content` 是 `TableContent`，cell 内容是 `InlineContent[][]`，行列和 cell 不作为 block，也没有 block id。这个设计对 `toast` 有参考价值：复杂结构可以封装在一个 block 内部，而不是全部提升为全局 block。

### 4.3 Internal ProseMirror Node Structure

BlockNote 内部并不是直接把 API block 映射成一个简单 ProseMirror node。源码说明中有三个关键层：

- `blockGroup`：包含多个 block；既作为 root，也作为 nested children 的容器。
- `blockContainer`：大多数普通 block 的 wrapper，内容为 `blockContent blockGroup?`。
- `blockContent`：真正表达 paragraph、heading、list item、image 等 block 主体。

对应关系是：`blockContainer`、`column`、`columnList` 等属于 `bnBlock`，可以直接映射到 BlockNote API 的 `Block`。`blockGroup`、`column` 等属于 `childContainer`，可承载 `block.children`。

### 4.4 Data Model Evidence

| Evidence | Source | Key Fields / API | Meaning | Toast Decision |
| --- | --- | --- | --- | --- |
| Public block type | Official docs: Document Structure | `id`, `type`, `props`, `content`, `children` | BlockNote 是 block tree，不是 linear list | reject public `children` |
| Top-level document | Official docs: Manipulating Content | `editor.document` | 返回 top-level blocks snapshot | adapt with flattening |
| Traversal | Official docs: Manipulating Content | `forEachBlock` depth-first | 需要遍历才能覆盖 nested blocks | adapt internally |
| Nested API | Official docs: Manipulating Content | `nestBlock`, `unnestBlock`, `getParentBlock` | 缩进会改变物理父子关系 | reject as public model |
| Table content | Official docs: Document Structure | `TableContent.rows.cells` | table cell 不是 block | adopt for block-internal data |
| PM structure | Source: `pm-nodes/README.md` | `blockGroup`, `blockContainer`, `blockContent` | 内部用 ProseMirror tree 支撑 block tree | adapt only as runtime |

### 4.5 Difference From Toast Linear Block List

BlockNote 的结构适合 Notion-style outliner：Tab / Shift+Tab 会改变 block 的物理 parent / children。`toast` 的目标不同：heading、list、collapse 和 outline 应由 linear block list 计算，而不是由 block tree 直接表达。

`toast` 首期公开结构应坚持：

```ts
interface ToastDocument {
  version: string;
  blocks: ToastBlock[];
}

interface ToastBlock {
  id: string;
  type: string;
  attrs?: Record<string, unknown>;
  content?: ToastInlineContent[] | ToastTableContent | ToastMediaContent;
}
```

设计约束：

- `ToastBlock` 不暴露 `children`。
- heading level、list indent、collapse state、section range 都是 block list 上的派生结果。
- ProseMirror / BlockNote-like nested runtime 可在 adapter 内部存在，但 SDK 输出必须可序列化为 flat block list。
- AI patch 默认以 block id / block range / inline range 定位，不以 ProseMirror position 或 nested child path 作为主协议。

## 5. Editing Surface

### 5.1 Feature Inventory

| Feature | Scope | Entry | Trigger | Output | Review Model | Toast Baseline |
| --- | --- | --- | --- | --- | --- | --- |
| Block side menu | block | left-side hover menu | hover block | `+` insert or drag handle menu | undo / redo | 必须支持 |
| Drag handle menu | block | drag handle | click handle | delete, color, reset / transform custom items | undo / redo | 必须支持 |
| Slash menu | cursor / block | `/` or side-menu `+` | type trigger or click `+` | insert / transform block | undo / redo | 必须支持 |
| Formatting toolbar | selection | floating toolbar | select text | block type, styles, align, link, nest / unnest | undo / redo | 必须支持 |
| Grid suggestion menu | cursor | trigger character | type `:` / custom trigger | emoji / mention / command grid | undo / redo | adapt |
| Cursor / block selection API | cursor / block range | editor API | selection change | block-aware selection state | none | 必须支持 |

### 5.2 Button And Entry Inventory

| UI Area | Button / Item | Visible When | Action | Opens | Final Effect | Source |
| --- | --- | --- | --- | --- | --- | --- |
| Block side menu | `+` | block hover | opens block insertion surface | slash menu | insert block near hovered block | Official docs: Side Menu / Suggestion Menus |
| Block side menu | drag handle | block hover | starts drag or opens menu | drag handle menu | move block or choose block command | Official docs: Side Menu |
| Drag handle menu | Delete | drag handle menu open | removes hovered block | none | `removeBlocks` style operation | Official docs: Side Menu example |
| Drag handle menu | Colors | drag handle menu open | changes block colors | color menu | updates block props | Official docs: Side Menu example |
| Drag handle menu | Reset Type | custom menu item | updates block type | none | `updateBlock(..., { type: "paragraph" })` | Official docs: Side Menu example |
| Slash menu | command item | `/` query active | runs `onItemClick` | none | insert / transform block | Official docs: Suggestion Menus |
| Formatting toolbar | Block Type Select | text selected | changes selected block type | dropdown | updates block type / props | Official docs: Formatting Toolbar |
| Formatting toolbar | Bold / Italic / Underline / Strike / Code | text selected | toggles inline style | none | updates inline styles | Official docs: Formatting Toolbar |
| Formatting toolbar | Text Align | text selected | changes alignment | menu or button | updates block props | Official docs: Formatting Toolbar |
| Formatting toolbar | Nest / Unnest | text selected | indents / outdents block | none | changes block physical parent | Official docs: Formatting Toolbar |
| Formatting toolbar | Create Link | text selected | creates link | link input | updates inline content | Official docs: Formatting Toolbar |

### 5.3 UI State Matrix

| State | UI Signal | User Can Do | Next State |
| --- | --- | --- | --- |
| idle | editor body only | type, select, hover block, type trigger | typing / selecting / block-hover / suggestion |
| block-hover | side menu visible | click `+`, drag handle, drag block | suggestion / drag-menu / dragging |
| suggestion | slash menu visible | filter query, choose item, escape | applied / idle |
| selecting | formatting toolbar visible | choose style, block type, link, align, nest | applied / idle |
| drag-menu | drag handle menu visible | delete, color, transform, custom item | applied / idle |
| dragging | block follows pointer | drop before / after block | applied / idle |
| applied | document transaction completed | continue editing or undo | idle |

## 6. Operation Walkthroughs

### 6.1 Insert Block From Side Menu

1. User hovers a block.
2. Block side menu appears on the left.
3. User clicks `+`.
4. Slash menu opens at the hovered block context.
5. User selects a command item.
6. BlockNote inserts or transforms content near the current block.

Toast baseline: block hover affordance and `+` insertion are required, but insertion target must resolve to a `ToastBlock` id / placement, not a nested child path.

### 6.2 Move Or Transform Block From Drag Handle

1. User hovers a block.
2. Drag handle appears in the side menu.
3. User drags the handle to move the block, or clicks the handle to open the drag handle menu.
4. Menu items such as Delete, Colors, Reset Type run block-level commands.
5. The editor applies a block transaction.

Toast baseline: drag handle is required for block-level ergonomics. If toast exposes nesting-like UI, it should write list indent / block attrs, not `children`.

### 6.3 Use Slash Menu

1. User types `/` in a block, or clicks side-menu `+`.
2. Suggestion menu opens.
3. Text after the trigger filters menu items.
4. Items are grouped and ordered by the command provider.
5. Selecting an item runs `onItemClick`.

Toast baseline: slash commands must be command-provider based. AI commands should share the same entry system but return `ToastPatch` when modifying existing content.

### 6.4 Format Selection

1. User highlights text.
2. Formatting toolbar appears near the selection.
3. User chooses block type, inline style, color, align, link, nest or unnest.
4. The command updates selected text or current block.
5. Toolbar disappears or remains while selection stays active.

Toast baseline: selection toolbar must be block-aware. Nest / unnest should be reinterpreted carefully because BlockNote changes physical tree structure while toast keeps a flat list.

## 7. AI Entry Points

待 `research-blocknote-ai` 补充。

## 8. Context Model

待 `research-blocknote-ai` 补充。

## 9. Patch / Review / Revision Model

待 `research-blocknote-ai` 补充。

## 10. Keyboard And Shortcut Model

BlockNote 的 UI 文档明确 `⌘K` 作为文档搜索入口，slash menu 使用 `/` 触发，emoji grid suggestion 使用 `:` 触发。GitHub README 还展示 Tab / Shift+Tab 用于 nesting / indentation。

对 `toast` 的结论：

- `/` 必须作为首期 command palette 入口。
- `:` / `@` 这类 trigger 应作为可扩展 suggestion controller，不绑定具体业务。
- Tab / Shift+Tab 可以用于 list indent 或 block indent attrs，但不得把公开文档改成 physical tree。
- `⌘K` 可作为全局 command / AI action palette 候选，后续需要和 Cursor-style command palette 一起比较。

## 11. Extension / Customization Model

待后续综合补充。

## 12. Strengths

- 开箱 UI 完整，覆盖 hover block、selection、slash command、drag handle 和 toolbar。
- block 操作入口平铺，不需要业务方自己从 headless editor 拼装基础体验。
- UI components 可替换，适合 SDK / component 产品形态。
- command item schema 简单，适合扩展自定义 blocks、mentions、emoji 和 AI commands。

## 13. Limits

- Nest / unnest 与 `children` 绑定，和 toast linear block list 冲突。
- 默认操作以直接 transaction 为主，没有 AI patch preview 语义。
- React UI 组件强产品化，但如果直接复用会继承 BlockNote 的 block tree 心智。

## 14. Required Baseline For Toast

| Capability | Decision | Phase | Notes |
| --- | --- | --- | --- |
| Stable block id | adopt | Phase 1 | AI patch、selection、history 都需要 block identity |
| Block props | adopt | Phase 1 | 用于 heading level、alignment、colors、list attrs |
| Inline content object model | adopt | Phase 1 | 比 HTML string 更适合 AI context 和 patch |
| Table as block-internal content | adopt | Phase 1 | cell 不进入全局 block list |
| Physical `children: Block[]` | reject | Phase 1 | 与 toast linear block list 冲突 |
| Depth-first block traversal | adapt | Phase 1 | adapter 可用，但公开输出需要 flatten |
| `blockGroup` / `blockContainer` / `blockContent` | adapt | Phase 1 | 可借鉴内部 runtime 分层 |
| Block side menu | adopt | Phase 1 | hover block 时必须有清晰块级入口 |
| Slash menu | adopt | Phase 1 | command provider 化，支持普通命令和 AI 命令 |
| Formatting toolbar | adopt | Phase 1 | selection-aware，覆盖 inline style 和 block type |
| Drag handle menu | adopt | Phase 1 | block move / delete / transform 是开箱基线 |
| Physical nest / unnest | adapt | Phase 1 | UI 可保留，数据层改为 flat attrs |
| Grid suggestion menu | adapt | Phase 2 | 适合 mention / emoji / block picker / AI action grid |

## 15. Lessons For Toast

- BlockNote 证明 block id、block props、inline content object 和 block-level API 是产品化编辑器的最低数据能力。
- BlockNote 的 `children` 是强 outliner 取向，能带来直觉缩进体验，但会把章节、缩进和文档结构绑定为物理树。
- `toast` 应学习 BlockNote 的 block API 清晰度，但不能继承它的公开 block tree。
- 对 AI 来说，flat block list 更适合生成可审阅 patch；tree path 会让 heading section、collapse range 和批量 patch 更复杂。
- UI 上，BlockNote 是 toast 的最低开箱水位：hover side menu、drag handle、slash menu、selection toolbar 都应首期具备。
- 操作上，toast 要把同一套入口从 direct command 扩展为 AI patch command，而不是另做一套割裂的 AI UI。

## 16. Open Items

- 补充 `research-blocknote-ai`。
