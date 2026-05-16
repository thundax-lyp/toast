# AI Document Product Baseline

## 1. Purpose

本文档汇总 Word Copilot、Google Docs Gemini、Notion AI、飞书 / Lark Docs AI、Grammarly 的 AI 文档产品能力基线，用于指导 `toast` 的首期需求和设计同步。

## 2. Data Sources

- `docs/30-designs/research/WORD-COPILOT-STUDY.md`，访问日期 2026-05-16，用于提炼传统文档 draft、rewrite、summarize、Track Changes 基线。
- `docs/30-designs/research/GOOGLE-DOCS-GEMINI-STUDY.md`，访问日期 2026-05-16，用于提炼 Help me write、Workspace sources 和 context coverage 基线。
- `docs/30-designs/research/NOTION-AI-STUDY.md`，访问日期 2026-05-16，用于提炼 block / slash AI、AI block、workspace search 和 database automation 基线。
- `docs/30-designs/research/FEISHU-DOCS-AI-STUDY.md`，访问日期 2026-05-16，用于提炼修订卡片、协作文档、翻译和行动项基线。
- `docs/30-designs/research/GRAMMARLY-STUDY.md`，访问日期 2026-05-16，用于提炼低打扰建议、tone / clarity、accept / dismiss 和 AI visibility 基线。

## 3. Entry Point Baseline

| Entry | Source Products | Toast Decision | Phase |
| --- | --- | --- | --- |
| Empty block / blank document draft | Word, Google Docs | adopt | 1 |
| Selection rewrite / polish | Word, Google Docs, Notion, Feishu | adopt | 1 |
| Slash AI command | Notion, BlockNote | adopt | 1 |
| Document side panel summary / Q&A | Word, Google Docs, Cursor | adopt | 1 |
| Block / page summary | Notion, Feishu | adopt | 1 |
| Inline suggestion underline/card | Grammarly | adopt | 1 |
| Revision-card review | Word, Feishu | adopt | 1 |
| Workspace / source context | Google Docs, Notion, Cursor | adapt | 2 |
| Database / field AI automation | Notion, Feishu | defer | 3 |

## 4. Output Model Baseline

`toast` should split AI output into three product objects:

| Object | Use Case | Review | Examples |
| --- | --- | --- | --- |
| `ToastAskResult` | read-only answer, summary, Q&A | insert only by explicit action | document summary, quick question |
| `ToastSuggestion` | local writing assistance | accept / dismiss | grammar, clarity, tone, short rewrite |
| `ToastPatch` | document mutation | preview / accept / reject / rollback | selection rewrite, block insert, structural transform |

This split prevents every AI response from becoming a heavy patch while still keeping real document edits reviewable.

## 5. Review Baseline

Phase 1 review must include:

- keep / regenerate / discard for generated drafts.
- replace / insert below for selection rewrite.
- accept / reject for patch review.
- accept / dismiss for lightweight suggestions.
- comment / modify / withdraw for revision-card style review.
- checkpoint / rollback for agent or document-level operations.

## 6. Context Baseline

| Context | Required Behavior |
| --- | --- |
| Empty block | AI action knows insertion point and surrounding section |
| Selection | AI action knows selected inline range / block range |
| Section | AI action can compute heading-based logical range from linear block list |
| Document | Summary/Q&A may use chunking and must show coverage |
| Sources | External files/docs must appear as context chips |
| Rules | Project/user/document rules must be visible and scoped |
| History | Accepted/rejected patches should be available to agent context |

## 7. Phase 1 Must-Haves

- Empty-state AI draft.
- Selection rewrite with variants.
- Preset rewrite actions: improve, shorten, expand, summarize, translate, change tone.
- Custom AI prompt on selection / block / document.
- Read-only document summary and Q&A.
- `ToastSuggestion` for low-disruption writing assistance.
- `ToastPatch` with block-level diff.
- Revision-card review UI with accept / reject / comment / modify.
- Context chips for selection, section, document and rules.
- AI visibility settings and suggestion category toggles.

## 8. Phase 2 Candidates

- External document/source providers.
- Workspace search context.
- Meeting transcript source and action-item extraction.
- Copilot ghost text / partial accept.
- Document translation clone.
- Collaboration notifications and owner awareness.
- Persistent style / voice profiles.

## 9. Deferred Items

- Database / field AI Autofill.
- Scheduled AI automation.
- AI prompt block as a persisted block type.
- Full workflow automation across tasks, calendars and CRM.
- Cross-document agent edits without conflict management.

## 10. Differentiation For Toast

Compared with existing products, `toast` should be more explicit:

- Word / Feishu have strong review mental models, but not a public patch protocol.
- Google / Notion have source and workspace context, but coverage can be unclear.
- Grammarly has excellent low-friction suggestions, but no block/document model.

`toast` should combine these into an SDK-level protocol: linear block list, explicit context chips, `ToastSuggestion`, `ToastPatch`, patch review, checkpoint and operation history.

## 11. Open Items

- Sync `ToastAskResult`, `ToastSuggestion`, `ToastPatch`, `ToastContextChip` and `ToastCheckpoint` into requirements.
- Sync UI surfaces into design: empty block prompt, selection bubble, slash menu, side panel, revision card, suggestion card.
