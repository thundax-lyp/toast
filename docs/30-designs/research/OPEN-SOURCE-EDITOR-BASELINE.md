# Open Source Editor Baseline

## 1. Purpose

本文档汇总 Tiptap、BlockNote、Plate scope 对 `toast` 的开源最低能力线。结论用于后续需求和设计同步。

## 2. Data Sources

- `docs/30-designs/research/TIPTAP-STUDY.md`，访问日期 2026-05-16，用于确认 Tiptap / ProseMirror runtime、schema、transaction、UI 和 AI Toolkit 基线。
- `docs/30-designs/research/BLOCKNOTE-STUDY.md`，访问日期 2026-05-16，用于确认 productized block editor、block API、UI 操作和 AI extension 基线。
- `docs/30-designs/research/PLATE-SCOPE.md`，访问日期 2026-05-16，用于确认 Plate 的 AI UI、Copilot、suggestion/comment、MCP-ready 和 shadcn/open-code 参考价值。

## 3. Positioning Baseline

| Project | Role For Toast | What To Learn | What Not To Copy |
| --- | --- | --- | --- |
| Tiptap | 首期 runtime 底座 | ProseMirror schema、selection、transaction、extension、NodeView | 不直接暴露 Tiptap `Editor` 作为 SDK 主控制面 |
| BlockNote | 开箱产品体验基线 | block id、block API、side menu、drag handle、slash menu、selection toolbar、AI accept/reject | 不复制 `children: Block[]` 物理树；不依赖 `xl-ai` |
| Plate | AI / UI 参考 | AI menu、Copilot ghost text、preview streaming、suggestion/comment diff、open-code UI 分发 | 不切换到 Slate runtime；不引入 Slate path 作为主协议 |

## 4. Phase 1 Must-Haves

### 4.1 Runtime And Data

- 基于 Tiptap / ProseMirror 运行时。
- 公开数据模型是 `ToastDocument.blocks: ToastBlock[]`。
- `ToastBlock` 必须有稳定 `id`、`type`、`attrs` 和结构化 `content`。
- `ToastBlock` 不得暴露 `children`。
- heading、outline、collapse、section range 必须通过 linear block list 计算。
- table、media 等复杂结构可作为 block-internal content。

### 4.2 Editing Surface

- Persistent toolbar：基础样式、block type、list、link、undo/redo。
- Selection toolbar / bubble menu：选区格式化和 selection-level AI。
- Slash menu：普通命令和 AI 命令共用 command provider。
- Block side menu：hover block 时显示 `+`、drag handle、block action menu。
- Drag handle：支持 block move、delete、duplicate、transform。
- Command registry：UI 不直接调用底层 Tiptap command，应封装为 `ToastCommand`。

### 4.3 AI Baseline

- AI entry points：toolbar AI、slash AI、selection AI、block AI。
- AI context：必须包含 selected blocks、cursor block、surrounding blocks、section range、document state。
- AI tool permissions：每个 action 声明可 add / update / delete 的范围。
- AI output：必须生成 `ToastPatch`，不得默认直接写文档。
- Review flow：preview -> accept / reject / retry / abort。
- Operation history：accept 后记录 action、scope、context、before / after、model metadata。

## 5. Adopt / Adapt / Reject

| Capability | Source | Decision | Phase | Notes |
| --- | --- | --- | --- | --- |
| ProseMirror transaction | Tiptap | adapt | 1 | 作为 patch apply backend，不作为产品 patch |
| ProseMirror steps | Tiptap | investigate | 1 | 可用于内部 diff / collaboration |
| Tiptap extension / NodeView | Tiptap | adopt | 1 | 支撑自定义 block 和 React rendering |
| Block id / props / content object | BlockNote | adopt | 1 | 是 AI patch 的定位基础 |
| Physical block children | BlockNote | reject | 1 | 与 toast linear block list 冲突 |
| Side menu / drag handle / slash / toolbar | BlockNote | adopt | 1 | 开箱体验不能低于 BlockNote |
| Accept / reject AI changes | BlockNote | adopt | 1 | AI 修改必须可审阅 |
| BlockNote `xl-ai` dependency | BlockNote | reject | 1 | GPL / proprietary 不进入核心 |
| Copilot ghost text | Plate | adapt | 2 | 适合低打扰写作建议 |
| Suggestion / comment diff | Plate | adapt | 2 | 进入协作和 review 讨论 |
| shadcn/open-code UI distribution | Plate | investigate | 1 | 可影响组件包交付方式 |
| MCP-ready editor context | Plate | investigate | 2 | 保留 Agent SDK 接口空间 |

## 6. Differentiation For Toast

`toast` 的创新点不在重新做一个富文本编辑器，而在把编辑器控制面变成 AI-native SDK：

- 数据优先：输出是 linear block list，而不是 HTML DOM tree 或物理 block tree。
- AI 可理解：selection、context、operation history、section range 都是稳定协议。
- Patch 优先：AI 修改以 `ToastPatch` 进入 review，不直接改文档。
- 组件化：Editor SDK / Editor Component 可拆解为 runtime、data adapter、UI shell、AI action layer。
- 开放许可：核心 AI 能力不依赖商业封闭包。

## 7. Open Items

- 在需求文档中固化 `ToastDocument`、`ToastBlock`、`ToastSelection`、`ToastPatch` 的最低字段。
- 在设计文档中拆分 package 边界：runtime adapter、block model、UI components、AI action / patch engine。
- 后续 Cursor / Word / Google Docs / Notion / 飞书 / Grammarly 研究后，再补产品级 AI 操作基线。
