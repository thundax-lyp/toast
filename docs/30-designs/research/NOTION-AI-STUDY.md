# Notion AI Study

## 1. Purpose

本文档研究 Notion AI 的 page / block / database workspace 操作模式，重点关注 Ask AI、slash AI、选区 AI、block 上下文、页面级 AI 和 database Autofill。

## 2. Product Positioning

Notion AI 嵌入 Notion 的 block editor 和 workspace。它既是文档写作助手，也是 workspace search / database automation / meeting notes / page summarization 工具。对 `toast` 的参考价值在于：AI entry 可以直接嵌在 block 操作面里，但也容易变得过于侵入，需要明确 scope 和 review。

## 3. Data Sources

- Notion Help Center: https://www.notion.com/help/notion-ai-faqs，访问日期 2026-05-16，用于研究 Notion AI 总能力：highlight text、space in page、AI block、Generate、Ask AI、formulas、meeting notes。
- Notion Help Center guide: https://www.notion.com/help/guides/notion-ai-for-docs，访问日期 2026-05-16，用于研究 `/AI` blocks、summarize / extract insights、highlight text then Ask AI、edit documents。
- Notion Academy: https://www.notion.com/help/notion-academy/lesson/ai-improve-writing，访问日期 2026-05-16，用于研究选区 Ask AI、improve writing。
- Notion Help Center: https://www.notion.com/help/autofill，访问日期 2026-05-16，用于研究 database AI Autofill、Basic / Custom Agent Autofill、summary、translation、key info、workspace search、web search、manual / on create / on edit / schedule。
- Notion Help Center guide: https://www.notion.com/help/guides/using-notion-ai，访问日期 2026-05-16，用于研究 summarize existing content、brainstorm、rough draft。
- Notion Help Center: https://www.notion.com/help/search，访问日期 2026-05-16，用于研究 Command Search、Ask Notion AI、workspace / connected apps / web search。
- Notion Help Center: https://www.notion.com/help/ai-meeting-notes，访问日期 2026-05-16，用于研究 AI Meeting Notes、agenda/context、custom instructions、summary structure。
- Community signal: Reddit Notion threads，访问日期 2026-05-16，用于观察 AI block context ambiguity、formatting disruption、large request limits 和 intrusive AI UI 反馈；仅作辅助，不作为事实主来源。

## 4. Core Data Model

Notion 的公开产品心智是 block page + database。AI 可以作用于 selected text、current page、AI block、database row/page content 和 workspace search。

对 `toast` 的结论：

- block-level AI entry 是必须学习的核心。
- database Autofill 不属于首期编辑器核心，但它证明 AI action 可以被绑定到结构化字段和触发器。
- `toast` 的 `ToastBlock` / `ToastPatch` 必须保留 scope，避免 “AI block 使用整页上下文” 这类歧义。

## 5. Editing Surface

| Feature | Scope | Entry | Trigger | Output | Review Model | Toast Baseline |
| --- | --- | --- | --- | --- | --- | --- |
| Ask AI on selected text | selection | highlight menu | select text, Ask AI | rewrite / summarize / improve | insert / replace style flow | 必须支持 |
| Space / page AI | cursor / page | space in page | keyboard entry | generate content | generated block result | adapt |
| `/AI` block | block / page | slash command | type `/AI` | AI block with prompt / generated content | Done -> Generate | 必须支持 |
| Summarize page | page | AI command / AI block | ask summarize | summary / insights | answer or block output | 必须支持 |
| Workspace Ask AI | workspace | search / AI | question | workspace-grounded answer | answer with sources | adapt |
| Database Autofill | database row/page | AI property | manual / create / edit / schedule | filled property | property update | defer |

## 6. Operation Walkthroughs

### 6.1 Selection Ask AI

1. User highlights text on a Notion page.
2. User selects Ask AI.
3. User chooses or types an instruction such as improve writing, simplify, summarize, translate, continue writing.
4. Notion AI generates a result using selected text and page context.
5. User inserts/replaces or continues refining.

Toast implication: selection AI should appear in the same surface as formatting. Scope must be explicit: selected inline range, selected blocks, or surrounding page.

### 6.2 `/AI` Block Generation

1. User types `/AI` in a page.
2. Notion displays AI blocks / actions.
3. User selects an AI block or writes instructions.
4. User selects Done -> Generate on an AI block.
5. Generated content appears in the page.

Toast implication: AI block is a reusable pattern for templates and structured prompts. `toast` should support `aiPrompt` blocks only if their scope and generated output are explicit patch sessions.

### 6.3 Page Summary / Insights

1. User asks Notion AI to summarize a page or extract insights.
2. AI uses page content.
3. AI returns a high-level summary, action items, key info or simplified version.
4. User may insert the result into the page.

Toast implication: page summary should default to read-only answer, with explicit insert-as-block action.

### 6.4 Database Autofill

1. User opens a database property.
2. User selects AI Autofill.
3. User chooses Basic or Custom Agent Autofill.
4. User selects a preset such as Summary, Translate, Key info, or writes custom instructions.
5. User chooses trigger: manual, on page create, on page edits, or schedule.
6. AI fills the property using page content, workspace search or web search depending on configuration.

Toast implication: this is beyond basic editor UI, but it informs future structured document automation: AI actions can be bound to fields, triggers and source permissions.

## 7. AI Entry Points

| Entry | Scope | User Intent | Toast Mapping |
| --- | --- | --- | --- |
| Highlight -> Ask AI | selection | improve / rewrite / summarize | selection `ToastPatch` |
| `/AI` | cursor / block | insert AI-generated block | slash AI command |
| AI block | block | reusable prompt block | `ToastAIPromptBlock` candidate |
| Page summary | page | summarize / extract insights | `ToastAskResult` / insert block |
| Workspace search | workspace | answer from pages/apps/web | context provider |
| AI Autofill | database | fill structured fields | future automation layer |

## 8. Context Model

Notion AI context varies by entry:

- Selection Ask AI uses highlighted text and page context.
- AI block may use page context, selected sources or configured instructions.
- Workspace search can use pages, connected apps and web.
- Basic Autofill uses content in a row/page, while Custom Agent Autofill can use workspace or web search.

对 `toast` 的结论：

- 每个 AI entry 必须 declare scope。
- Context source labels are required: selected text, page blocks, workspace search, web search, database row.
- AI prompt blocks must not silently use the whole document unless visible.

## 9. Patch / Review / Revision Model

Notion AI is fast and embedded, but user feedback shows format disruption and unclear replacement behavior can hurt trust. It does not expose a durable patch protocol to users.

对 `toast` 的结论：

- AI block output must become reviewable `ToastPatch` before mutating content.
- Reorganize / rewrite operations need structural diff, not just final output.
- Database-style automation needs operation logs and rerun history.

## 10. Keyboard And Shortcut Model

| Control | Notion Behavior | Toast Candidate |
| --- | --- | --- |
| Highlight text | opens contextual actions including Ask AI | selection bubble AI |
| Space in page | AI writing entry | empty block AI shortcut |
| `/AI` | AI block / command insertion | slash AI command |
| Command Search | ask/search without switching context | global AI command palette |

## 11. Extension / Customization Model

Notion AI extends from docs into databases, meeting notes, search and connected sources. `toast` should separate editor SDK from automation:

- Editor layer: selection, block, page AI.
- Context layer: workspace / source providers.
- Automation layer: field autofill, scheduled AI, page-create triggers.

## 12. Strengths

- AI is deeply embedded in block editing and slash commands.
- Workspace search and database Autofill extend AI beyond prose writing.
- AI block pattern can make AI prompts reusable inside templates.
- Preset actions reduce prompt friction.

## 13. Limits

- AI UI can feel intrusive if it blocks formatting controls.
- Context scope can be unclear, especially AI blocks and "all sources" language.
- Large requests and page formatting operations can fail or disrupt layout.
- No visible durable patch protocol.

## 14. Required Baseline For Toast

| Capability | Decision | Phase | Notes |
| --- | --- | --- | --- |
| Selection Ask AI | adopt | Phase 1 | selection bubble / toolbar AI |
| Slash AI | adopt | Phase 1 | command provider includes AI actions |
| AI prompt block | investigate | Phase 2 | useful for templates but risky for scope |
| Page summary / insights | adopt | Phase 1 | read-only by default |
| Workspace search context | adapt | Phase 2 | context provider |
| Database Autofill | defer | Phase 3 | structured automation, not core editor |
| Scope labels | adopt | Phase 1 | prevent ambiguous AI context |

## 15. Lessons For Toast

- Notion proves AI should live inside block operations, not only in a side panel.
- But AI entry points must not crowd out normal formatting and block controls.
- Slash AI and selection AI are must-have; AI block should be treated carefully.
- Structured automation is valuable later, but core editor must first get patch review and scope clarity right.

## 16. Open Items

无
