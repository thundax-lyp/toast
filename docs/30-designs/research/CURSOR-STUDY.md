# Cursor Study

## 1. Purpose

本文档研究 Cursor 作为高影响力 AI inside editor 的操作模式。当前阶段先完成数据来源采集，后续 TODO 将分别补充 inline edit / quick question，以及 chat / agent / context / checkpoint 分析。

## 2. Product Positioning

Cursor 是 AI-native coding editor，不是文档编辑器，但它对 `toast` 有关键参考价值：AI 能理解选区、文件上下文、历史对话、规则和操作结果，并以 diff / checkpoint / accept-reject 的方式协助用户控制修改。`toast` 需要把这些能力转译到 block document editor。

## 3. Data Sources

- Official docs: https://cursor.com/docs，访问日期 2026-05-16，用于确认新版 Cursor docs 总入口：Agent、Rules、MCP、Skills、CLI。
- Official docs: https://docs.cursor.com/en/inline-edit/overview，访问日期 2026-05-16，用于研究 Inline Edit、`Ctrl/Cmd+K`、Edit Selection、Quick Question、Full File Edits、Send to Chat、follow-up instructions 和 default context。当前访问会重定向到新版 docs 首页，搜索索引保留页面内容。
- Official docs: https://docs.cursor.com/chat/overview，访问日期 2026-05-16，用于研究 Chat / Agent、tabs、history、model selection、checkpoints、rules 和 multi-file editing。当前访问会重定向到新版 docs 首页，搜索索引保留页面内容。
- Official docs: https://docs.cursor.com/en/context/%40-symbols/overview，访问日期 2026-05-16，用于研究 `@Files`、`@Folders`、`@Code`、`@Docs`、`@Git`、`@Past Chats`、`@Cursor Rules`、`@Web`、`@Recent Changes`、`@Lint Errors`、`@Definitions`、`# Files` 和 `/ Commands`。当前访问会重定向到新版 docs 首页，搜索索引保留页面内容。
- Official docs: https://docs.cursor.com/context/%40-symbols/%40-files-and-folders，访问日期 2026-05-16，用于研究 file / folder context、drag file into Agent、folder outline、full folder content 和 context condensation。
- Official docs: https://docs.cursor.com/en/guides/working-with-context，访问日期 2026-05-16，用于研究 context strategy、@ symbol、rules、MCP、team memory 和 context precision。
- Official docs: https://docs.cursor.com/context/rules，访问日期 2026-05-16，用于研究 Project Rules、User Rules、Memories、`.cursorrules` legacy、rule application 和 `/Generate Cursor Rules`。
- Official docs: https://docs.cursor.com/en/agent/chat/checkpoints，访问日期 2026-05-16，用于研究 Agent checkpoint、Restore Checkpoint、local storage、Agent-only changes 和 Git 边界。当前访问会重定向到新版 docs 首页，搜索索引保留页面内容。
- Official docs: https://docs.cursor.com/en/agent/review，访问日期 2026-05-16，用于研究 diff review、accept / reject changes 和 review UI。英文页面当前重定向，印尼语索引页面保留具体内容。
- Official docs: https://docs.cursor.com/en/tab/overview，访问日期 2026-05-16，用于研究 Cursor Tab completion。当前访问会重定向到新版 docs 首页。
- Official changelog mirror: https://cursordocs.com/en/changelog，访问日期 2026-05-16，用于追踪 Cursor changelog、new inline edits、Agent context、@docs / @git / @web / @folder 变化。非官方镜像，只作辅助索引。
- Official technical report: https://cursor.com/resources/Composer2.pdf，访问日期 2026-05-16，用于研究 Composer 2 agent、tool calls、file edit、shell、search、web search、prompt context 和 real-world coding agent 训练背景。
- Community signal: Reddit Cursor threads，访问日期 2026-05-16，用于观察用户对 accept / reject、restore checkpoint、plan mode 和 context rot 的实际反馈；仅作辅助，不作为事实主来源。

## 4. Core Data Model

待后续从 `toast` 角度补充：Cursor 的代码文件 / diff / checkpoint 模型如何映射到 block document。

## 5. Editing Surface

待 `research-cursor-inline` 和 `research-cursor-agent` 补充。

## 6. Operation Walkthroughs

待 `research-cursor-inline` 和 `research-cursor-agent` 补充。

## 7. AI Entry Points

待 `research-cursor-inline` 和 `research-cursor-agent` 补充。

## 8. Context Model

待 `research-cursor-agent` 补充。

## 9. Patch / Review / Revision Model

待 `research-cursor-agent` 补充。

## 10. Keyboard And Shortcut Model

待 `research-cursor-inline` 补充。

## 11. Extension / Customization Model

待 `research-cursor-agent` 补充。

## 12. Strengths

待后续综合补充。

## 13. Limits

待后续综合补充。

## 14. Required Baseline For Toast

待后续综合补充。

## 15. Lessons For Toast

待后续综合补充。

## 16. Open Items

- 补充 `research-cursor-inline`。
- 补充 `research-cursor-agent`。
