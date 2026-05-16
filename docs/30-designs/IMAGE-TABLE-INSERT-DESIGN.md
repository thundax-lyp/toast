# Image And Table Insert Design

## 1. Purpose

本文档设计 `toast` 的图片和表格插入、编辑、AI patch 和数据模型。目标是继承 `../wechat-tiptap` 中已经验证的好体验，同时保持 `toast` 的 linear block list 数据模型。

## 2. Design Principle

图片和表格都必须是顶层 `ToastBlock`。它们可以拥有内部结构，但不能让全局文档变成 tree。

```ts
interface ToastDocument {
  blocks: ToastBlock[];
}

type ToastBlock =
  | ToastParagraphBlock
  | ToastImageBlock
  | ToastTableBlock;
```

原则：

- 图片是单个 block，图片裁剪和尺寸是 block attrs。
- 表格是单个 block，行、列、单元格是 block-internal content。
- 插入和编辑必须通过 `ToastCommand`，不能直接暴露 Tiptap command。
- AI 修改图片和表格必须生成 `ToastPatch`。

## 3. Sources

- Local reference: `../wechat-tiptap/src/pages/wechat-editor/toolbar/components/toolbar-insert-image/toolbar-insert-image.tsx`，访问日期 2026-05-16，用于研究图片上传、读取尺寸和插入流程。
- Local reference: `../wechat-tiptap/src/pages/wechat-editor/extensions/extension-resizable-image/resizable-image.ts`，访问日期 2026-05-16，用于研究 `src`、`width`、`height`、`viewTop`、`viewLeft`、`viewWidth`、`viewHeight`、`rotate` attrs。
- Local reference: `../wechat-tiptap/src/pages/wechat-editor/components/image-resizer/image-resizer.tsx`，访问日期 2026-05-16，用于研究选中图片后的 resize handle 和 commit attrs。
- Local reference: `../wechat-tiptap/src/pages/wechat-editor/components/image-clipper/image-clipper.tsx`，访问日期 2026-05-16，用于研究裁剪 viewport、mask 和 clip commit。
- Local reference: `../wechat-tiptap/src/pages/wechat-editor/toolbar/components/toolbar-insert-table/toolbar-insert-table.tsx`，访问日期 2026-05-16，用于研究工具栏插入表格、网格选择和自定义行列数。
- Local reference: `../wechat-tiptap/src/pages/wechat-editor/extensions/extension-table/table.ts`，访问日期 2026-05-16，用于研究 table command、row/column、merge/split、keyboard 和 table editing。
- Local reference: `../wechat-tiptap/src/pages/wechat-editor/extensions/extension-table/table-view.ts`，访问日期 2026-05-16，用于研究表格 NodeView、列/行控制、选择和插入控制。
- Local reference: `../wechat-tiptap/src/pages/wechat-editor/bubble-menu/text-content-bubble-menu/text-content-bubble-menu.tsx`，访问日期 2026-05-16，用于研究 table selection bubble menu、merge/split、delete row/column、cell background。
- Tiptap docs: https://tiptap.dev/docs/editor/api/resizable-nodeviews，访问日期 2026-05-16，用于研究 resizable NodeView 的 resize callbacks、commit 和 constraints。
- Tiptap docs: https://tiptap.dev/docs/editor/extensions/nodes/table，访问日期 2026-05-16，用于研究 Tiptap TableKit、resizable 和 table extension。
- BlockNote docs: https://www.blocknotejs.org/docs/react/components/image-toolbar，访问日期 2026-05-16，用于研究 image block uploadFile 注入方式。
- Notion docs: https://www.notion.com/help/guides/using-slash-commands，访问日期 2026-05-16，用于研究 `/image` 等 slash 插入入口。
- Google Docs help: https://support.google.com/docs/answer/1696711，访问日期 2026-05-16，用于研究表格插入网格、row/column 操作、resize、style、merge/split、move row/column。

## 4. Image Block Model

`ToastImageBlock` 保留 `wechat-tiptap` 的裁剪能力，但字段命名产品化：

```ts
interface ToastImageBlock extends ToastBlockBase {
  type: "image";
  attrs: {
    src: string;
    alt?: string;
    title?: string;
    width?: number;
    height?: number;
    viewport?: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    rotate?: number;
    align?: "left" | "center" | "right";
    caption?: string;
    assetId?: string;
    uploadState?: "local" | "uploading" | "uploaded" | "failed";
  };
}
```

映射关系：

| Wechat Attr | Toast Attr | Meaning |
| --- | --- | --- |
| `src` | `src` | image URL or local data URL |
| `width` / `height` | `width` / `height` | original or rendered image size |
| `viewLeft` / `viewTop` | `viewport.x` / `viewport.y` | crop offset |
| `viewWidth` / `viewHeight` | `viewport.width` / `viewport.height` | visible crop area |
| `rotate` | `rotate` | rotation |

## 5. Image Insert UX

### 5.1 Entry Points

| Entry | Trigger | Output |
| --- | --- | --- |
| Toolbar image button | click image icon | file picker / upload |
| Slash command | `/image` | image placeholder block |
| Paste | paste image or URL | image block |
| Drag drop | drop local image | image block with upload state |
| AI action | generate or replace image | `ToastPatch` |

### 5.2 Operation Flow

```text
Trigger Insert Image
-> Select File / Paste URL / Drop File
-> Create Image Block Placeholder
-> Read Image Metadata
-> Upload via Host Adapter
-> Commit src / assetId / width / height
-> Select Image Block
-> Show Image Toolbar
```

上传能力由 core 定义 `ToastUploadAdapter` 接口，React 组件只负责调用：

```ts
interface ToastUploadAdapter {
  uploadImage(file: File): Promise<{
    src: string;
    assetId?: string;
    width?: number;
    height?: number;
  }>;
}
```

这样 React-only UI 不会把上传协议锁死在 React package 内，后续非 React adapter 也能复用同一协议。

插入后立即选中图片，并显示图片 toolbar：

- crop
- resize
- reset
- replace
- align left / center / right
- caption
- delete

### 5.3 Inherit From Wechat Tiptap

应继承：

- 插入时读取图片真实尺寸。
- 选中图片后出现 bubble toolbar。
- resize handle 直接作用在图片上。
- crop mode 使用遮罩和裁剪 viewport。
- reset 恢复原图尺寸和 viewport。

需要改进：

- 不直接用 `dataURL` 作为最终 `src`，应通过宿主 `uploadFile` adapter 生成 `assetId` / URL。
- resize / crop 过程只在 UI 中 live update，结束后 commit block attrs。
- 裁剪不修改原图，保存 viewport。
- 图片替换保留 block id，避免破坏 patch/history。

## 6. Table Block Model

表格是单个 block，内部是二维结构：

```ts
interface ToastTableBlock extends ToastBlockBase {
  type: "table";
  attrs?: {
    headerRows?: number;
    headerCols?: number;
    width?: number;
    caption?: string;
  };
  content: ToastTableContent;
}

interface ToastTableContent {
  rows: ToastTableRow[];
}

interface ToastTableRow {
  id: string;
  cells: ToastTableCell[];
}

interface ToastTableCell {
  id: string;
  colspan?: number;
  rowspan?: number;
  attrs?: {
    background?: string;
    align?: "left" | "center" | "right";
    verticalAlign?: "top" | "middle" | "bottom";
  };
  content: ToastInlineContent[];
}
```

表格内部可以是 row/cell tree，但它只存在于 `table` block content 内部，不参与全局 `blocks[]`。

## 7. Table Insert UX

### 7.1 Entry Points

| Entry | Trigger | Output |
| --- | --- | --- |
| Toolbar table button | click table icon | size grid |
| Slash command | `/table` | size grid or default 3x3 |
| Markdown shortcut | optional | default table |
| AI action | convert selection to table | `ToastPatch` |

### 7.2 Size Grid

继承 `wechat-tiptap` 的 8 x 10 网格选择模式：

```text
Insert Table

□ □ □ □ □ □ □ □ □ □
□ □ □ □ □ □ □ □ □ □
□ □ □ □ □ □ □ □ □ □

3 x 4 table
[Custom rows / cols]
```

行为：

- hover 显示当前 `rows x cols`。
- click 插入表格。
- custom 打开行列数输入。
- 首期默认 `withHeaderRow = false`，后续在 toolbar 支持切换 header row。

## 8. Table Editing UX

### 8.1 Direct Controls

继承 `wechat-tiptap` 的 table NodeView 思路：

- 表格左上角 handle：select table。
- 顶部 column controls：select column / insert column before / after。
- 左侧 row controls：select row / insert row before / after。
- 列宽拖拽 resize。
- Tab 跳到下一个 cell；末尾自动新增 row。

### 8.2 Bubble Menu

选中 cell / row / column / table 时显示 table bubble menu：

- merge cells
- split cells
- cell background
- delete row
- delete column
- delete table
- align
- AI summarize table
- AI transform table

对比 Google Docs，toast 首期必须覆盖：插入行列、删除行列、resize、cell background、merge/split。移动行列可以 Phase 2。

## 9. AI For Image And Table

### 9.1 Image AI Actions

| Action | Scope | Output |
| --- | --- | --- |
| Describe image | image block | `ToastAskResult` |
| Generate alt text | image block | `ToastPatch` update attrs |
| Create caption | image block | `ToastPatch` update attrs |
| Replace image | image block | `ToastPatch` replace attrs |
| Crop suggestion | image block | `ToastPatch` update viewport |

### 9.2 Table AI Actions

| Action | Scope | Output |
| --- | --- | --- |
| Convert selection to table | selection | `ToastPatch` insert table block |
| Summarize table | table block | `ToastAskResult` |
| Extract action items | table block | `ToastAskResult` or patch |
| Normalize table | table block | `ToastPatch` |
| Add row from prompt | table block | `ToastPatch` |
| Fill empty cells | cell range | `ToastPatch` |

首期 AI 只做：

- convert selection to table
- summarize table
- generate image alt text / caption

## 10. Patch Semantics

图片 patch：

```ts
{
  op: "replace",
  path: "/blocks/4/attrs/viewport",
  value: { x: 40, y: 20, width: 720, height: 420 }
}
```

表格 patch：

```ts
{
  op: "replace",
  path: "/blocks/8/content/rows/1/cells/2/content",
  value: [{ type: "text", text: "Updated cell" }]
}
```

所有表格结构操作都以 table block 为根，并映射为 JSON Patch：

- `insertTableRow`
- `deleteTableRow`
- `insertTableColumn`
- `deleteTableColumn`
- `mergeTableCells`
- `splitTableCell`
- `updateTableCellAttrs`

## 11. Runtime Mapping

Tiptap / ProseMirror 中：

- image runtime 可用 custom NodeView 或 Tiptap Resizable NodeView 思路。
- table runtime 可基于 Tiptap TableKit / ProseMirror tables。
- runtime 内部允许 table row / cell node tree。
- adapter 输出时必须转换成 `ToastTableBlock.content`。

```text
ProseMirror table node
  -> ToastBlock { type: "table", content: ToastTableContent }
```

## 12. Product Comparison

| Product | Image Lesson | Table Lesson | Toast Decision |
| --- | --- | --- | --- |
| `wechat-tiptap` | resize / crop / reset 体验完整 | 网格选尺寸、行列 controls、cell bubble menu | adopt and productize |
| Tiptap | Resizable NodeView and TableKit are strong runtime primitives | table extension supports resizable and commands | use as runtime adapter |
| BlockNote | upload adapter is clean; image block can start empty | block API productized | adopt upload adapter pattern |
| Notion | `/image` lowers insertion friction | slash-based insert is fast | adopt slash image/table |
| Google Docs | image/table are classic document objects | table edit surface is deep: resize, style, merge, move | cover core table controls first |

## 13. Phase Plan

Phase 1:

- image block insert by toolbar / slash / paste / drop
- host-provided upload adapter
- image resize / crop / reset / replace / delete
- table insert grid and custom rows/cols
- table row/column insert/delete
- cell background
- merge / split cells
- table keyboard navigation
- image alt/caption AI
- convert selection to table

Phase 2:

- row/column drag move
- table header pin / repeat behavior
- table sort
- image annotation / focal point
- table AI fill empty cells
- document translation clone with images/tables preserved

Defer:

- spreadsheet formulas
- nested blocks inside table cells
- arbitrary image drawing editor
- layout-floating images around text

## 14. Open Items

- 表格 cell content 首期是否只允许 inline content，还是允许 paragraph-like mini blocks。
- 图片 crop UI 是否继续使用 `react-moveable`，还是用自研轻量 handles。
- 是否允许 paste HTML table 直接转换为 `ToastTableBlock`。
