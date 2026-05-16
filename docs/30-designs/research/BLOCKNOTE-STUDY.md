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

待 `research-blocknote-data-model` 补充。

## 5. Editing Surface

待 `research-blocknote-ui` 补充。

## 6. Operation Walkthroughs

待 `research-blocknote-ui` 补充。

## 7. AI Entry Points

待 `research-blocknote-ai` 补充。

## 8. Context Model

待 `research-blocknote-ai` 补充。

## 9. Patch / Review / Revision Model

待 `research-blocknote-ai` 补充。

## 10. Keyboard And Shortcut Model

待 `research-blocknote-ui` 补充。

## 11. Extension / Customization Model

待后续综合补充。

## 12. Strengths

待后续综合补充。

## 13. Limits

待后续综合补充。

## 14. Required Baseline For Toast

待后续综合补充。

## 15. Lessons For Toast

待后续综合补充。

## 16. Open Items

- 补充 `research-blocknote-data-model`。
- 补充 `research-blocknote-ui`。
- 补充 `research-blocknote-ai`。
