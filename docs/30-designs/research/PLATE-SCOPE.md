# Plate Scope

## 1. Purpose

本文档快速判断 `Plate` 是否进入本轮深度研究。结论用于后续 `OPEN-SOURCE-EDITOR-BASELINE.md`，不替代 Tiptap 和 BlockNote 的主研究。

## 2. Data Sources

- Official docs: https://platejs.org/docs，访问日期 2026-05-16，用于确认 Plate 定位：React rich-text framework with AI, MCP, shadcn/ui。
- Official docs: https://platejs.org/docs/plugins，访问日期 2026-05-16，用于确认插件范围：AI、Copilot、Suggestion、Slash Command、Block Menu、Drag & Drop、Toolbar、Yjs、Markdown、DOCX 等。
- Official docs: https://platejs.org/docs/ai，访问日期 2026-05-16，用于确认 AI menu、streaming insertion、preview / direct insert、undo-safe batching、suggestion / comment utilities。
- Official docs: https://platejs.org/docs/copilot，访问日期 2026-05-16，用于确认 ghost text / copilot suggestion 能力。
- Official docs: https://platejs.org/docs/installation/plate-ui，访问日期 2026-05-16，用于确认 Plate UI 通过 shadcn CLI 分发、组件代码可复制可修改。
- Official docs: https://platejs.org/docs/api/core/plate，访问日期 2026-05-16，用于确认 `Plate` 的 `editor`、`onChange`、`onValueChange`、`onSelectionChange` 控制面。
- Official docs: https://platejs.org/docs/html，访问日期 2026-05-16，用于确认 Plate 使用 `editor.children` / `Descendant[]` 作为序列化输入。
- Source code: https://github.com/udecode/plate，访问日期 2026-05-16，用于确认项目定位、stars、license、examples 和 monorepo。
- npm: `platejs@53.0.3`，MIT，访问日期 2026-05-16，用于确认新版主包版本、许可和 repository。
- npm: `@platejs/core@53.0.0`，MIT，访问日期 2026-05-16，用于确认 Plate core 是 Slate plugin system。
- npm: `@platejs/ai@53.0.4`，MIT，访问日期 2026-05-16，用于确认新版 AI plugin 版本、许可和 repository。
- npm: `@udecode/plate@49.0.0`，MIT，访问日期 2026-05-16，用于确认旧包线仍存在。
- npm: `@udecode/plate-ai@49.0.0`，MIT，访问日期 2026-05-16，npm 标注已迁移到 `@platejs/ai`。
- npm: `slate@0.124.1`，MIT，访问日期 2026-05-16，用于确认底层 Slate 版本和许可。

## 3. Quick Findings

| Dimension | Finding | Toast Impact |
| --- | --- | --- |
| Runtime | Plate 基于 Slate，不基于 Tiptap / ProseMirror | 不适合作为首期底座候选 |
| Data model | Slate / Plate 以 `editor.children`、`Descendant[]`、path / selection 为核心 | 可参考 AST 操作，不作为 toast 主协议 |
| License | Plate core、AI、Slate 均为 MIT | 许可友好，优于部分商业 AI add-on |
| UI | Plate UI 基于 shadcn/open-code，组件可复制修改 | 值得学习组件分发和可定制方式 |
| AI | 支持 AI menu、Copilot ghost text、streaming、preview/direct insert、undo-safe batching、suggestion/comment diff | AI 交互值得纳入基线参考 |
| Ecosystem | GitHub stars 高，插件面非常广 | 可作为“开源高级能力库”观察对象 |

## 4. Scope Decision

本轮不创建 `PLATE-STUDY.md`，Plate 作为参考对象进入 `OPEN-SOURCE-EDITOR-BASELINE.md`。

原因：

- `toast` 已确定基于 Tiptap，Plate 的 Slate runtime 不应稀释底座判断。
- 本轮最关键对标是 Tiptap runtime 和 BlockNote productized block editor。
- Plate 的价值主要在 AI UI、Copilot、suggestion/comment、MCP-ready、shadcn open-code 分发，而不是数据模型。
- 深研 Plate 会引入 Slate path、normalization、controlled value 等另一套复杂度，当前阶段投入产出不高。

## 5. Items To Carry Forward

- AI menu 必须区分 cursor、text selection、block selection。
- Copilot ghost text 可作为低打扰 AI 写作建议模式的参考。
- AI streaming 应支持 preview 插入，而不是只能直接写入。
- AI patch 应有 undo-safe batching 或等价事务分组。
- Suggestion / comment diff 能力应进入 toast 二期 review / collaboration 讨论。
- shadcn/open-code 风格可作为 toast UI 组件分发方式备选。
- MCP-ready 组件/编辑器上下文值得在 Agent SDK 设计时保留接口位置。

## 6. Open Items

无
