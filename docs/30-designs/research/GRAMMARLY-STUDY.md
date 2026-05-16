# Grammarly Study

## 1. Purpose

本文档研究 Grammarly 的 AI 写作辅助模式，重点关注局部建议、rewrite、tone、clarity、低打扰 UI、accept / dismiss 和可关闭 AI。

## 2. Product Positioning

Grammarly 是跨应用写作助手。它的强项不是完整文档结构，而是实时、局部、低摩擦的 writing assistance：拼写语法、clarity、tone、delivery、paragraph rewrite 和 generative compose/rewrite。对 `toast` 的启发是：AI 不一定每次都进入大型 patch，可以作为 inline suggestion 和 review card 存在。

## 3. Data Sources

- Grammarly Support: https://support.grammarly.com/hc/en-us/articles/14528857014285-Introducing-GrammarlyGO，访问日期 2026-05-16，用于研究 generative AI assistance、compose、rewrite、personalize voice、context awareness、tone/clarity/length。
- Grammarly Support: https://support.grammarly.com/hc/en-us/articles/10674801783309-How-do-Grammarly-s-tone-suggestions-work，访问日期 2026-05-16，用于研究 tone suggestions、sentence-level rewrite、personable / positive / confident。
- Grammarly product features: https://www.grammarly.com/features，访问日期 2026-05-16，用于研究 paragraph rewrites、clarity、tone suggestions、proofreading、AI agents。
- Grammarly Support: https://support.grammarly.com/hc/en-us/articles/42141090078861-AI-Rewriter-user-guide，访问日期 2026-05-16，用于研究 AI Rewriter agent、several options、accept / dismiss。
- Grammarly Support: https://support.grammarly.com/hc/en-us/articles/360003474732-Grammarly-Editor-user-guide，访问日期 2026-05-16，用于研究 suggestion cards、underlined phrase、Accept、Dismiss、right sidebar generative AI prompt。
- Grammarly Support: https://support.grammarly.com/hc/en-us/articles/30916398193037-Introducing-paragraph-level-rewrites，访问日期 2026-05-16，用于研究 paragraph-level rewrite、multiple suggestions、Accept / Insert、Show on text selection toggle。
- Grammarly: https://www.grammarly.com/how-grammarly-works，访问日期 2026-05-16，用于研究 context/goals、compose/ideate/rewrite/reply、revision-level feedback、accept/dismiss agency。
- Community signal: Reddit Grammarly threads，访问日期 2026-05-16，用于观察过度改写、声音同质化、建议错误、AI 可关闭诉求；仅作辅助，不作为事实主来源。

## 4. Core Data Model

Grammarly 不公开文档 block model。它围绕 text ranges、sentences、paragraphs 和 suggestion cards 工作。对 `toast` 来说，关键是引入低成本建议对象：

```ts
interface ToastSuggestion {
  id: string;
  range: ToastInlineRange | ToastBlockRange;
  kind: "grammar" | "clarity" | "tone" | "rewrite" | "generative";
  replacement?: ToastInlineContent[] | ToastBlock[];
  explanation?: string;
  state: "pending" | "accepted" | "dismissed";
}
```

`ToastSuggestion` 可比 `ToastPatch` 更轻，适合拼写、语法、tone 和短句 clarity。

## 5. Editing Surface

| Feature | Scope | Entry | Trigger | Output | Review Model | Toast Baseline |
| --- | --- | --- | --- | --- | --- | --- |
| Underline suggestion | word / phrase / sentence | inline underline | typing / analysis | correction or rewrite | Accept / Dismiss | 必须支持 |
| Suggestion card | range | click underline / sidebar card | select issue | explanation + replacement | Accept / Dismiss | 必须支持 |
| Tone suggestion | sentence | inline / card | tone issue detected | sentence rewrite | Accept / Dismiss | adapt |
| Paragraph rewrite | paragraph | selection / card | paragraph suggestion | rewritten paragraph | Accept / Insert | adapt |
| Generative compose | prompt | AI panel | prompt | draft text | Insert / discard | adapt |
| Feature customization | account / editor | settings | user toggles | disable AI / show on selection | preference | 必须支持 |

## 6. Operation Walkthroughs

### 6.1 Accept Or Dismiss A Local Suggestion

1. User types text.
2. Grammarly underlines a phrase or sentence.
3. User clicks the underline or opens the suggestion card.
4. Card shows suggestion type, explanation and replacement.
5. User clicks Accept to apply automatically or Dismiss to ignore.

Toast implication: `toast` needs lightweight suggestion cards separate from full AI patch. Dismissed suggestions should be remembered for the session.

### 6.2 Tone Rewrite

1. Grammarly detects tone that may not land well.
2. User opens the tone suggestion.
3. Card offers a sentence-level rewrite, e.g. more personable, positive or confident.
4. User accepts or dismisses.

Toast implication: tone rewrite should be opt-in and sentence-scoped. It must not silently alter meaning or voice.

### 6.3 Paragraph-Level Rewrite

1. User selects or focuses a paragraph.
2. Grammarly offers paragraph rewrite or generative rewrite.
3. User reviews one or more alternatives.
4. User chooses Accept or Insert.
5. User can disable showing generative AI on text selection.

Toast implication: paragraph rewrite belongs between inline suggestion and full patch. `toast` should represent it as block-scoped `ToastSuggestion` or small `ToastPatch` depending on size.

### 6.4 Generative Compose / Rewrite

1. User opens Grammarly AI.
2. User enters a prompt or selects text to rewrite.
3. Grammarly generates a draft or rewrite customized for tone, clarity or length.
4. User inserts accepted output into the writing surface.

Toast implication: generative compose should remain user-controlled. Preferences must allow disabling intrusive selection popups.

## 7. AI Entry Points

| Entry | Scope | User Intent | Toast Mapping |
| --- | --- | --- | --- |
| Inline underline | word / phrase | fix small issue | `ToastSuggestion` |
| Suggestion sidebar/card | range | inspect issue | suggestion review card |
| Tone suggestion | sentence | adjust reception | tone action |
| Paragraph rewrite | paragraph | improve clarity/structure | block suggestion / patch |
| Generative AI panel | prompt / selection | compose / rewrite | `ToastPatch` or insert |
| Feature settings | user/editor | reduce AI presence | AI preference config |

## 8. Context Model

Grammarly uses current text, user goals, tone, context and personal voice settings. Unlike Cursor/Docs, it usually does not expose source chips; context is local writing surface plus user preferences.

对 `toast` 的结论：

- Suggestion engine context can be local and lightweight.
- Personal voice / style rules should be part of `ToastRuleSet`.
- Users need controls for suggestion aggressiveness and AI visibility.

## 9. Patch / Review / Revision Model

Grammarly's default model is suggestion-level review. Each suggestion has a local replacement and accept/dismiss action. Larger generative rewrites can insert or replace content.

对 `toast` 的结论：

- Not every AI output should be a heavy patch.
- `ToastSuggestion` and `ToastPatch` should coexist.
- Accept/dismiss is the minimum review model for local writing assistance.
- Dismiss must be recorded to avoid repeatedly interrupting the same range.

## 10. Keyboard And Shortcut Model

公开资料强调 click-based cards rather than keyboard-first editing. `toast` should support keyboard navigation through suggestions, but the product lesson is UI state:

- underline / subtle marker for pending suggestion.
- card with accept / dismiss.
- sidebar list for all suggestions.
- feature toggles to disable intrusive AI.

## 11. Extension / Customization Model

Grammarly Business includes tone/brand voice concepts. `toast` should support:

- style rule providers.
- project / user writing voice.
- per-document AI visibility settings.
- suggestion categories that can be enabled/disabled.

## 12. Strengths

- Low-disruption inline suggestions.
- Accept/dismiss is clear and fast.
- Tone and clarity are framed as suggestions, not commands.
- AI can be customized or disabled.

## 13. Limits

- Over-aggressive rewrites can homogenize voice.
- Suggestion correctness varies; users need fast dismiss and memory.
- Product is text-range oriented, not block/document-structure oriented.
- Generated rewrites can blur authorship boundaries in academic/work contexts.

## 14. Required Baseline For Toast

| Capability | Decision | Phase | Notes |
| --- | --- | --- | --- |
| Inline suggestion object | adopt | Phase 1 | lighter than patch |
| Accept / dismiss suggestion | adopt | Phase 1 | local review |
| Suggestion sidebar/card | adopt | Phase 1 | inspect all pending issues |
| Tone / clarity rewrite | adapt | Phase 2 | style rules and sentence-level rewrite |
| Paragraph rewrite | adapt | Phase 1 | block-scoped patch or suggestion |
| Dismiss memory | adopt | Phase 1 | avoid repeated interruption |
| AI visibility toggles | adopt | Phase 1 | user agency |

## 15. Lessons For Toast

- Grammarly's biggest lesson is restraint: small suggestions should stay small.
- `toast` needs both `ToastSuggestion` for local writing assistance and `ToastPatch` for structural AI edits.
- Accept/dismiss speed is as important as generation quality.
- Users must be able to reduce or disable AI surfaces when they interfere with writing.

## 16. Open Items

无
