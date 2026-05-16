# Word Copilot Study

## 1. Purpose

本文档研究 Microsoft Word Copilot 的文档 AI 操作模式，重点关注 draft、rewrite、summarize、selection edit、review / revision。目标是提炼传统文档编辑器中成熟的 AI 入口和结果控制方式。

## 2. Product Positioning

Word Copilot 是传统文档编辑器中的 AI assistant。它围绕页面文档、选区、空白行和侧边聊天面板工作，强调写作生成、改写、摘要、问答和内容转换。对 `toast` 的启发是：AI 不只属于 chat panel，也应该贴近空白态、选区态和文档级阅读态。

## 3. Data Sources

- Microsoft Support: https://support.microsoft.com/en-us/copilot-word，访问日期 2026-05-16，用于研究 Draft with Copilot、Keep、Regenerate、Discard、compose box、引用文件和选区操作。
- Microsoft Support: https://support.microsoft.com/en-us/accessibility/copilot/use-copilot-in-word-with-a-screen-reader，访问日期 2026-05-16，用于研究 keyboard/screen-reader 可访问流程：`Control+L` draft、Rewrite with Copilot、Next/Previous suggestions、Replace、Insert below、Regenerate、Visualize as table、Summarize、Ask questions。
- Microsoft Support: https://support.microsoft.com/en-gb/office/track-changes-in-word-197ba630-0f5f-4a8e-9a77-3712475e806a，访问日期 2026-05-16，用于研究 Word 原生 Track Changes、reviewing mode、accept/reject 和 card UI。
- Microsoft Support: https://support.microsoft.com/en-gb/office/summarize-your-files-with-copilot-10dcbe50-467d-4a61-9d5e-c98c77fd33a4，访问日期 2026-05-16，用于研究 Copilot panel、single/multiple file summary 和 file context。
- Microsoft Support: https://support.microsoft.com/en-gb/topic/copilot-tutorial-summarize-a-document-fb94a832-97b0-4467-ad86-a69680f036a0，访问日期 2026-05-16，用于研究 document summary、key takeaways 和 follow-up questions。
- Microsoft Word product page: https://word.cloud.microsoft/create/en/copilot-in-word/，访问日期 2026-05-16，用于研究 Copilot in Word 的 create / edit / summarize 定位、reference documents、tone/style/format refinement。
- Microsoft 365 Life Hacks: https://www.microsoft.com/en-us/microsoft-365-life-hacks/writing/getting-started-with-copilot-in-word，访问日期 2026-05-16，用于研究入门场景、rewrite selected text、review generated output 和 prompt examples。

## 4. Core Data Model

Word 是页面文档模型，不公开 AI 专用 block data API。对 `toast` 的可迁移点不是 Word 的内部格式，而是“结构化文档 + 原生 revision”的产品心智：

- 文档有标题、段落、表格、列表等稳定结构。
- AI 结果需要进入文档结构，而不是仅返回纯文本。
- 改写和插入动作必须保留原文上下文、样式和文档位置。
- revision / track changes 提供 accept / reject 传统基线。

## 5. Editing Surface

| Feature | Scope | Entry | Trigger | Output | Review Model | Toast Baseline |
| --- | --- | --- | --- | --- | --- | --- |
| Draft with Copilot | blank line / document | Copilot dialog | blank line, `Control+L`, prompt | new draft content | Keep / Regenerate / Discard | 必须支持 |
| Rewrite with Copilot | selected text | context menu / mini toolbar | select text, choose rewrite | multiple rewrite suggestions | Replace / Insert below / Regenerate | 必须支持 |
| Visualize as table | selected text | Copilot context menu | selected text | generated table | Keep / Regenerate / Discard | adapt |
| Summarize document | document / file | Copilot chat pane | open summary / ask summarize | summary, key points, follow-up questions | answer only / insert manually | 必须支持 |
| Ask questions | document | Copilot chat pane | user question | grounded answer | answer only | 必须支持 |
| Track Changes | document revisions | Review tab | reviewing mode | change cards / redlines | Accept / Reject | 必须支持 |

## 6. Operation Walkthroughs

### 6.1 Draft From Blank Line

1. User places cursor on a blank line.
2. User opens Draft with Copilot, for example with `Control+L`.
3. User enters a prompt, optionally referencing files or style requirements.
4. Copilot generates draft content.
5. User chooses Keep, Regenerate, Discard, or refines the prompt in the compose box.

Toast implication: empty block AI must be first-class. `toast` should create a patch containing generated blocks and offer keep / regenerate / discard before committing.

### 6.2 Rewrite Selected Text

1. User selects existing text.
2. User opens Rewrite with Copilot.
3. Copilot generates multiple rewrite suggestions.
4. User navigates Next / Previous suggestions.
5. User chooses Replace to overwrite selected content, Insert below to keep both, or Regenerate.

Toast implication: selection rewrite should support variants, not only one answer. `ToastPatch` should preserve the original selection and allow replace or insert-after placement.

### 6.3 Summarize And Ask About Document

1. User opens the Copilot chat pane.
2. Copilot summarizes the current document or selected file.
3. Summary can include key takeaways and follow-up questions.
4. User asks questions about the document.
5. Copilot answers without directly modifying the document.

Toast implication: document-level AI must separate read-only answers from edit actions. Summary / Q&A should produce `ToastAskResult`; insertion requires explicit user action.

### 6.4 Transform Selection Into Table

1. User selects list-like or prose content.
2. User chooses Visualize as table.
3. Copilot generates a table from selected content.
4. User keeps, regenerates, or discards the result.

Toast implication: AI actions should support structural transforms, not only prose rewrite. Patch review must show type changes, e.g. paragraph/list blocks becoming a table block.

## 7. AI Entry Points

| Entry | Scope | User Intent | Toast Mapping |
| --- | --- | --- | --- |
| Blank-line Copilot | cursor / empty block | generate first draft | empty block `ToastPatch` |
| Selection rewrite | inline / block range | improve existing text | scoped `ToastPatch` with variants |
| Chat pane summarize | document / file | understand content | `ToastAskResult` |
| Chat pane Q&A | document / file | ask without edit | `ToastAskResult` |
| Visualize as table | selected text | structural transform | block type transform patch |
| Track Changes review | document revisions | inspect proposed changes | `ToastPatchReview` |

## 8. Context Model

Word Copilot uses current document, selected text and optional referenced files. Its user-facing context model is simple: the user mostly sees document/selection scope and chat pane context rather than explicit context chips.

对 `toast` 的结论：

- 首期必须有 empty block、selection、document 三种 scope。
- 引用文件 / 外部文档可作为后续 context provider。
- 需要比 Word 更透明：用 context chips 显示 selected blocks、document sections、referenced files。

## 9. Patch / Review / Revision Model

Word Copilot uses immediate result controls such as Keep, Regenerate, Discard, Replace and Insert below. Word also has mature Track Changes with accept/reject review cards, but Copilot results are not always exposed as native tracked changes.

对 `toast` 的结论：

- AI 结果控制至少要覆盖 keep / regenerate / discard。
- 选区改写至少要覆盖 replace / insert below。
- `ToastPatchReview` 应统一 AI patch 和 revision review，而不是让生成结果和修订模式割裂。
- Word 的 Track Changes 是传统文档 review 基线，toast 需要 block-level equivalent。

## 10. Keyboard And Shortcut Model

| Shortcut / Control | Word Behavior | Toast Candidate |
| --- | --- | --- |
| `Control+L` | open Draft with Copilot / Rewrite context | open AI action at cursor / selection |
| Next / Previous | navigate rewrite suggestions | navigate patch variants |
| Replace | replace selected content | accept replace patch |
| Insert below | insert suggestion after selection | accept insert-after patch |
| Regenerate | create new AI result | rerun action in same patch session |
| Discard | remove generated result | reject patch |

## 11. Extension / Customization Model

Word Copilot is product-integrated rather than SDK-oriented. `toast` should copy the user-facing operation model, not the closed integration model.

## 12. Strengths

- AI entry points match document workflow: blank line, selection, document pane.
- Rewrite suggestions provide variants and explicit placement choices.
- Summary / Q&A are read-only by default, reducing accidental edits.
- Track Changes provides a familiar accept/reject mental model.

## 13. Limits

- Context transparency is limited compared with Cursor-style context chips.
- Copilot result review and Word Track Changes are not always the same flow.
- The integration is closed and not a reusable editor SDK model.
- Operation metadata is not exposed as a persistent patch protocol.

## 14. Required Baseline For Toast

| Capability | Decision | Phase | Notes |
| --- | --- | --- | --- |
| Empty block draft | adopt | Phase 1 | blank document and blank block must invite AI drafting |
| Selection rewrite variants | adopt | Phase 1 | support multiple alternatives |
| Replace / insert below | adopt | Phase 1 | placement matters for review |
| Summarize / ask without edit | adopt | Phase 1 | separate answer from patch |
| Structural transform | adapt | Phase 1 | text to table / list / outline |
| Track-changes-like review | adapt | Phase 1 | block-level patch review |
| Reference documents | adapt | Phase 2 | external context provider |

## 15. Lessons For Toast

- Word shows that document AI needs three surfaces: blank-state generation, selection rewrite and document-level chat.
- A good AI editor must offer result controls in the same place where the result appears.
- Variants matter for writing; `toast` should let a patch session carry alternatives.
- Read-only summary / Q&A should not be forced into patch workflow until the user asks to insert or rewrite.

## 16. Open Items

无
