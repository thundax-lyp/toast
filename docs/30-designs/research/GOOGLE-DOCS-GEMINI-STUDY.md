# Google Docs Gemini Study

## 1. Purpose

本文档研究 Gemini in Google Docs 的 AI 文档编辑模式，重点关注 Help me write、空白态生成、选区改写、Workspace sources 和文档级摘要 / 问答。

## 2. Product Positioning

Google Docs Gemini 是协作文档中的 AI assistant。它更强调云端 Workspace 上下文：Docs、Drive、文件 sources、侧边栏 Gemini 和文档摘要。对 `toast` 的启发是：AI-native editor 需要同时处理文档内选区和文档外 sources。

## 3. Data Sources

- Google Docs Editors Help: https://support.google.com/docs/answer/13951448?hl=en-en，访问日期 2026-05-16，用于研究 Help me write、prompt、insert、refine selected text、formalize、shorten、elaborate、rephrase、custom prompt 和 feedback。
- Google Docs Editors Help: https://support.google.com/docs/answer/15123226?hl=en，访问日期 2026-05-16，用于研究 Gemini in Docs / Sheets / Slides / Vids / Forms 的总能力：draft、improve writing、summarize。
- Google Docs Editors Help: https://support.google.com/docs/answer/15627020?hl=en-en，访问日期 2026-05-16，用于研究 Docs summary、document tabs、summary generation 和隐私说明。
- Google Docs Editors Help: https://support.google.com/docs/answer/16813283?hl=en，访问日期 2026-05-16，用于研究 Workspace with Gemini sources：summarize documents、selected tables/ranges、source capacity、source citation limits。
- Google Docs Editors Help: https://support.google.com/docs/answer/14206696?hl=en-gb，访问日期 2026-05-16，用于研究 Gemini side panel、write/refine content in context、summarize text、document summary 和 web-only prompt。
- Google Workspace product page: https://workspace.google.com/，访问日期 2026-05-16，用于确认 Gemini in Workspace 的跨应用定位。
- Google Gemini product page: https://gemini.google/about/?hl=en-US，访问日期 2026-05-16，用于确认 Gemini 可用于 summarize text、generate drafts、upload files and get feedback、connect to Workspace apps。
- Community signal: Reddit Google Gemini / Google Docs threads，访问日期 2026-05-16，用于观察长文档上下文遗漏、格式错误和直接修改限制的用户反馈；仅作辅助，不作为事实主来源。

## 4. Core Data Model

Google Docs 是协作文档模型，不暴露编辑器 SDK 级 block data 协议。Gemini 操作面围绕 document、selected text、document tabs、side panel 和 Workspace sources。

对 `toast` 的结论：

- 不应学习 Google Docs 的封闭文档模型。
- 应学习其 sources 概念：AI 可引用外部文档、Drive 文件和当前文档。
- 长文档摘要需要明确 scope，不能让用户误以为 AI 已完整读取所有内容。

## 5. Editing Surface

| Feature | Scope | Entry | Trigger | Output | Review Model | Toast Baseline |
| --- | --- | --- | --- | --- | --- | --- |
| Help me write | blank / cursor | inline AI prompt | click Gemini / prompt | generated text | Insert / refine / discard | 必须支持 |
| Refine selected text | selection | selection menu / Gemini prompt | select text | rewritten selected text | insert / replace style flow | 必须支持 |
| Preset refinements | selection | Help me write menu | formalize, shorten, elaborate, rephrase | rewritten variation | user accepts result | 必须支持 |
| Custom refinement | selection | prompt box | custom instruction | rewritten variation | user accepts result | 必须支持 |
| Document summary | document / tabs | Gemini side panel / summary | open summary | summary of document text | read-only / optional insert | 必须支持 |
| Sources | external files | Gemini side panel | attach / reference source | grounded answer / summary | answer-only unless inserted | adapt |

## 6. Operation Walkthroughs

### 6.1 Help Me Write From Blank State

1. User opens a Google Doc and chooses Help me write.
2. User enters a prompt.
3. Gemini generates suggested text.
4. User inserts the result or refines with a follow-up prompt.
5. User can send feedback on suggestion quality.

Toast implication: empty document and empty block should expose a visible AI drafting affordance. The generated draft should remain a patch preview until inserted.

### 6.2 Refine Selected Text

1. User selects existing text.
2. User opens Gemini / Help me write refinement.
3. User chooses formalize, shorten, elaborate, rephrase, or enters a custom prompt.
4. Gemini generates a revised version.
5. User accepts or continues refining.

Toast implication: selection AI actions need preset action buttons plus custom instruction. Presets should be first-class `ToastAIAction` entries, not hardcoded UI labels.

### 6.3 Summarize Current Document

1. User opens Gemini side panel or document summary.
2. Gemini summarizes the document, including text across document tabs where supported.
3. Summary is presented as read-only assistant output.
4. User can ask follow-up questions or manually use the result.

Toast implication: summary should be read-only by default. For long documents, `toast` must show whether summary used all blocks, a section, or summarized chunks.

### 6.4 Use Workspace Sources

1. User asks Gemini a question or requests a summary with sources.
2. User attaches or references Docs / Drive files as sources.
3. Gemini focuses on selected sources within capacity.
4. Gemini answers or summarizes based on those sources.
5. Some source attribution may be imperfect, so user must review.

Toast implication: external context must be explicit. `ToastContextChip` should show source files, selected sections and whether content is full text or summarized.

## 7. AI Entry Points

| Entry | Scope | User Intent | Toast Mapping |
| --- | --- | --- | --- |
| Help me write | cursor / empty block | create draft | empty block `ToastPatch` |
| Preset refine | selected text | formalize / shorten / elaborate / rephrase | scoped `ToastPatch` |
| Custom prompt | selected text / document | user-defined rewrite | custom AI action |
| Gemini side panel | document / sources | summarize / ask | `ToastAskResult` |
| Sources | external files | grounded answer / synthesis | `ToastContextChip[]` |

## 8. Context Model

Gemini in Docs has three visible context layers:

- Current document or selected text.
- Document tabs / current document content.
- Workspace sources such as Docs, Drive files and selected data ranges.

对 `toast` 的结论：

- Context chips are mandatory for sources.
- Long-document handling needs chunking and coverage indicators.
- External sources should be immutable snapshots within a patch / answer session.
- Summary/Q&A should not silently mutate content.

## 9. Patch / Review / Revision Model

Google Docs Gemini commonly presents generated text as a suggestion that users insert or refine. It does not expose a reusable patch protocol. Collaborative Docs has comments/suggestions, but Gemini output is not clearly unified with a block-level AI patch object.

对 `toast` 的结论：

- Generated text must become a `ToastPatch` if it changes content.
- Refinement presets should produce patch variants.
- Source-grounded answers remain `ToastAskResult` until inserted.
- Patch metadata should include source ids and source coverage.

## 10. Keyboard And Shortcut Model

公开资料重点描述 UI entry rather than stable keyboard shortcuts. `toast` 不应从 Google Docs 复制快捷键，而应复制 scope model：empty block、selection、side panel、sources。

## 11. Extension / Customization Model

Google Workspace sources are the relevant customization pattern. `toast` should expose source providers for files, documents, knowledge bases and workspace objects.

## 12. Strengths

- Help me write is visible in blank and writing contexts.
- Preset refinements make common writing operations fast.
- Side panel supports document-level summary and Q&A.
- Workspace sources show the value of cross-document context.

## 13. Limits

- Source attribution and full-document coverage can be unclear.
- Long document users report context gaps; `toast` needs explicit coverage indicators.
- Generated output review is less precise than a dedicated patch diff.
- Google Docs is closed and not SDK-shaped.

## 14. Required Baseline For Toast

| Capability | Decision | Phase | Notes |
| --- | --- | --- | --- |
| Help me write empty state | adopt | Phase 1 | empty document/block AI drafting |
| Preset refinement actions | adopt | Phase 1 | formalize / shorten / elaborate / rephrase equivalents |
| Custom selected-text prompt | adopt | Phase 1 | user-defined AI action |
| Document summary side panel | adopt | Phase 1 | read-only summary |
| Workspace sources | adapt | Phase 2 | source providers and context chips |
| Context coverage indicator | adopt | Phase 1 | show section/all-doc/chunk coverage |
| Patch source metadata | adopt | Phase 1 | source ids and coverage in patch |

## 15. Lessons For Toast

- Google Docs shows that AI sources are a product feature, not just backend retrieval.
- Preset rewrite buttons reduce prompt friction and should live beside custom prompts.
- Summary/Q&A needs a separate read-only lane.
- `toast` can surpass Docs by making patch, sources and coverage explicit.

## 16. Open Items

无
