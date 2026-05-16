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
- Official docs: https://docs.cursor.com/tab/overview，访问日期 2026-05-16，用于研究 Cursor Tab、ghost text、diff popup、`Tab` accept、`Esc` reject、partial accept、jump in file、jump across files、auto-import 和 toggling。
- Official changelog mirror: https://cursordocs.com/en/changelog，访问日期 2026-05-16，用于追踪 Cursor changelog、new inline edits、Agent context、@docs / @git / @web / @folder 变化。非官方镜像，只作辅助索引。
- Official technical report: https://cursor.com/resources/Composer2.pdf，访问日期 2026-05-16，用于研究 Composer 2 agent、tool calls、file edit、shell、search、web search、prompt context 和 real-world coding agent 训练背景。
- Community signal: Reddit Cursor threads，访问日期 2026-05-16，用于观察用户对 accept / reject、restore checkpoint、plan mode 和 context rot 的实际反馈；仅作辅助，不作为事实主来源。

## 4. Core Data Model

待后续从 `toast` 角度补充：Cursor 的代码文件 / diff / checkpoint 模型如何映射到 block document。

## 5. Editing Surface

### 5.1 Inline Feature Inventory

| Feature | Scope | Entry | Trigger | Output | Review Model | Toast Baseline |
| --- | --- | --- | --- | --- | --- | --- |
| Tab completion | cursor / nearby text | inline ghost text | pause / type | suggested insertion or diff | `Tab` accept / `Esc` reject | adapt |
| Next edit jump | current file / cross-file | Tab portal / jump hint | after accepting edit | move cursor to predicted location | user confirms by Tab | adapt |
| Inline Edit | selection / cursor | inline input | `Ctrl/Cmd+K` | generated or rewritten content | follow-up / accept flow | 必须支持 |
| Quick Question | selection | inline input | `Alt+Enter` inside inline editor | answer before edit | convert by "do it" style instruction | 必须支持 |
| Full file edit | file | inline edit mode | `Ctrl+Shift+Enter` | file-wide edits | review required | adapt |
| Send to Chat | selection | inline edit handoff | `Ctrl+L` | selected context sent to chat | chat/agent review | adapt |

### 5.2 Inline UI State Matrix

| State | UI Signal | User Can Do | Next State |
| --- | --- | --- | --- |
| typing | editor text cursor | continue typing | tab-suggested / inline-open |
| tab-suggested | ghost text or diff popup | `Tab`, `Esc`, partial accept, keep typing | accepted / rejected / partial |
| inline-open | inline prompt input | enter instruction, add context, `Alt+Enter` quick question | generating / question-answer |
| generating | AI is editing selection or cursor target | wait, refine after result | result-shown |
| question-answer | answer shown without edit | ask follow-up or type "do it" | generating / closed |
| result-shown | inline edit applied or proposed | add follow-up instruction, send to chat, continue | generating / chat-handoff / closed |

## 6. Operation Walkthroughs

### 6.1 Cursor Tab Completion

1. User types normally.
2. Cursor predicts the next edit from cursor position, recent edits, linter errors and accepted suggestions.
3. If it is insertion-only, UI shows semi-transparent ghost text.
4. If it modifies existing content, UI shows a diff popup near the line.
5. User presses `Tab` to accept, `Esc` to reject, or `Ctrl+Arrow-Right` to accept the next word.
6. After accepting, user can press `Tab` again to jump to the next predicted location.

Toast implication: `toast` should support low-friction inline suggestions for writing, but suggestions must be visually non-destructive until accepted. For document editing, this maps to `ToastInlineSuggestion`, not full `ToastPatch`.

### 6.2 Inline Edit Selection

1. User selects content.
2. User presses `Ctrl/Cmd+K`.
3. Cursor opens an inline prompt input.
4. User enters an instruction.
5. AI edits selected content using selection plus default context.
6. User can add follow-up instructions and press `Enter` to refine.

Toast implication: selection-level AI must be one keystroke away. The resulting edit should be a `ToastPatch` scoped to selected block / inline range, with follow-up instructions modifying the same patch session.

### 6.3 Quick Question Before Editing

1. User selects content or opens inline edit.
2. User presses `Alt+Enter` inside the inline editor.
3. Cursor answers the question without immediately editing.
4. User can inspect the answer.
5. User types "do it" or similar wording to convert the suggestion into an edit.

Toast implication: toast needs an ask-before-edit mode. This is different from patch preview: no patch is produced until the user explicitly converts the answer into an action.

### 6.4 Full File Edit / Send To Chat

1. User opens inline edit.
2. For file-wide change, user presses `Ctrl+Shift+Enter`.
3. For multi-file or advanced work, user presses `Ctrl+L` to send selected context to Chat.
4. Cursor moves from local inline operation to broader agent/chat workflow.

Toast implication: toast needs a clear escalation path from inline AI to document / section / workspace AI. For document editing, this maps to selection edit -> section edit -> document agent.

## 7. AI Entry Points

| Entry | Shortcut | Scope | User Intent | Toast Mapping |
| --- | --- | --- | --- | --- |
| Cursor Tab | `Tab` / `Esc` | cursor and nearby text | accept or reject predicted edit | `ToastInlineSuggestion` |
| Inline Edit | `Ctrl/Cmd+K` | selection or cursor | rewrite / generate | `ToastPatch` scoped to selection |
| Quick Question | `Alt+Enter` in inline editor | selection | ask before changing | `ToastAskResult` -> optional patch |
| Full File Edit | `Ctrl+Shift+Enter` | whole file | larger local edit | section / document patch |
| Send to Chat | `Ctrl+L` | selection to agent | multi-file / advanced edit | document agent handoff |

## 8. Context Model

待 `research-cursor-agent` 补充。

## 9. Patch / Review / Revision Model

待 `research-cursor-agent` 补充。

## 10. Keyboard And Shortcut Model

| Shortcut | Cursor Behavior | Toast Candidate |
| --- | --- | --- |
| `Tab` | accept inline suggestion; after accept, jump to next edit | accept inline writing suggestion |
| `Esc` | reject / hide suggestion | dismiss AI suggestion or menu |
| `Ctrl/Command+Arrow-Right` | partial accept next word | partial accept inline suggestion |
| `Ctrl/Command+K` | open Inline Edit | open selection / cursor AI command |
| `Alt+Enter` | Quick Question inside inline editor | ask without patch |
| `Ctrl+Shift+Enter` | full file edit | section / document edit |
| `Ctrl+L` | send selected code to Chat | escalate selection to AI side panel |

对 `toast` 的结论：快捷键不应照搬到所有宿主应用，但能力必须可绑定。默认 keymap 应区分 "ask"、"edit"、"accept suggestion"、"reject suggestion" 和 "escalate to agent"。

## 11. Extension / Customization Model

待 `research-cursor-agent` 补充。

## 12. Strengths

待后续综合补充。

## 13. Limits

待后续综合补充。

## 14. Required Baseline For Toast

| Capability | Decision | Phase | Notes |
| --- | --- | --- | --- |
| Inline ghost suggestion | adapt | Phase 2 | 适合低打扰写作补全 |
| Inline diff suggestion | adapt | Phase 2 | 适合短文本改写，必须先预览 |
| Selection inline edit | adopt | Phase 1 | 核心 AI 编辑入口 |
| Quick Question | adopt | Phase 1 | 支持 ask before edit |
| Follow-up refinement | adopt | Phase 1 | 同一 patch session 内继续修改 |
| Full-document escalation | adapt | Phase 1 | 从 selection 升级到 section / document |
| Partial accept | defer | Phase 2 | 适合长文本生成后的逐词接受 |

## 15. Lessons For Toast

- Cursor 的关键不是“有聊天框”，而是把 AI 分成预测、局部编辑、先问后改、升级到 agent 四个层级。
- `toast` 应为 cursor / selection 级 AI 提供轻入口，并为 document / agent 级 AI 提供明确升级路径。
- Quick Question 对文档编辑很重要：很多时候用户想先理解、比较或确认，不想直接生成 patch。
- Tab suggestion 的低打扰形态值得学习，但文档编辑里必须避免抢夺普通输入和缩进行为。

## 16. Open Items

- 补充 `research-cursor-agent`。
