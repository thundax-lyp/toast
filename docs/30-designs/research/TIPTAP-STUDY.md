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

待补充。

## 5. Editing Surface

待补充。

## 6. Operation Walkthroughs

待补充。

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

待补充。

## 15. Lessons For Toast

待补充。

## 16. Open Items

- 补充 `research-tiptap-data-model`。
- 补充 `research-tiptap-ui`。
- 补充 `research-tiptap-ai`。
