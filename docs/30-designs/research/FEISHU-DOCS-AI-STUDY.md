# Feishu / Lark Docs AI Study

## 1. Purpose

本文档研究飞书 / Lark Docs AI 与飞书协作文档生态中的 AI 操作模式，重点关注写作、润色、总结、翻译、修订模式、协作上下文和多维表格 AI 字段。

## 2. Product Positioning

飞书是协同办公套件，AI 能力分布在云文档、多维表格、智能纪要、搜索问答和业务流程中。对 `toast` 的价值不只是文档写作，而是“协作上下文 + 修订建议 + 结构化字段自动化”的组合。

## 3. Data Sources

- 飞书官网: https://www.aafeishu.com.cn/，访问日期 2026-05-16，用于确认文档智能写作 AI：扩写、总结、翻译、转换风格，以及千人千面的 AI 助手定位。
- 飞书官网: https://www.feishu.cn/content/feishu-documents-new-revision-mode-meet-professional-needs-boost-collaboration-efficiency，访问日期 2026-05-16，用于研究飞书文档修订模式、修订建议卡片、接受、拒绝、评论、修改、撤回修订和通知。
- 飞书官网: https://www.feishu.cn/content/383321056779，访问日期 2026-05-16，用于研究飞书云文档连接器和开放能力：创建文档、获取纯文本、获取所有块、删除块等。
- 飞书官网: https://www.feishu.cn/content/AsLfwRvl2iUT8lkDYuZcNvQenae，访问日期 2026-05-16，用于研究多维表格 AI 浮窗工具栏：填充、润色、翻译、智能标签、总结、信息提取、提问、替换、插入。
- 飞书官网: https://www.feishu.cn/content/ai-powered-multidimensional-tables-easy-shortcuts-for-beginners，访问日期 2026-05-16，用于研究 AI 字段捷径：翻译、总结、分类、提取信息、打标。
- 飞书官网: https://www.feishu.cn/content/article/7588041688380165052，访问日期 2026-05-16，用于研究智能纪要的多语言同步转写、翻译和决策要点提炼。
- 飞书官网: https://www.feishu.cn/content/article/7600354912756681687，访问日期 2026-05-16，用于研究 AI 会议总结、行动项拆解和任务/日历/文档联动。
- Lark product page: https://www.larksuite.com/en_us/product/messenger，访问日期 2026-05-16，用于确认 Lark ecosystem 中消息翻译和 Docs / AI Meeting Notes 入口。
- Community / third-party signal: Feishu/Lark AI articles and user discussions，访问日期 2026-05-16，仅用于观察场景覆盖，非主事实来源。

## 4. Core Data Model

飞书云文档开放能力显示其服务端可获取纯文本和“所有块”的富文本内容，说明飞书文档具备 block-oriented internal model。AI 能力同时作用于：

- 文档正文内容。
- 修订建议卡片。
- 多维表格字段 / 单元格。
- 智能纪要转写、摘要、行动项。
- 企业知识和业务系统。

对 `toast` 的结论：飞书验证了 block API + AI + 协作修订是同一产品域，不应把文档编辑器和工作流自动化完全割裂。

## 5. Editing Surface

| Feature | Scope | Entry | Trigger | Output | Review Model | Toast Baseline |
| --- | --- | --- | --- | --- | --- | --- |
| AI writing | cursor / selection | document AI action | write / expand / style convert | generated text | insert / replace | 必须支持 |
| Polish | selected text | AI action | select content | polished text | replace / insert | 必须支持 |
| Translate | selected text / document | AI action | select or document translate | translated text / new document | replace / save as new doc | adapt |
| Summarize | document / selected content | AI action | summarize | summary / insight | read-only or insert | 必须支持 |
| Revision mode | document edits | top-right edit mode | switch to revision | suggestion card | accept / reject / comment / modify / withdraw | 必须支持 |
| AI field shortcut | table field / cell | floating toolbar | click cell / field | filled / translated / summarized property | replace / insert | defer |
| Meeting summary | transcript / doc | smart meeting notes | meeting recording | summary / action items | task/doc linkage | adapt |

## 6. Operation Walkthroughs

### 6.1 Document AI Writing / Polish

1. User selects text or places cursor in a document.
2. User invokes AI writing or polish.
3. AI expands, summarizes, translates, polishes or changes style.
4. User chooses whether to replace existing text or insert generated result.

Toast implication: toast needs the same common writing actions, but each result should be a `ToastPatch` with explicit scope and placement.

### 6.2 Revision Mode Review

1. User switches document editing mode from Edit to Revision.
2. User edits the document.
3. Each change appears as a revision suggestion card on the right side.
4. Reviewer can accept, reject, comment, modify or withdraw the suggestion.
5. Accepted revisions overwrite original content and disappear from review UI.

Toast implication: this is the strongest direct baseline for AI patch review. AI patches should reuse the same mental model: right-side suggestion cards, accept/reject/comment/modify.

### 6.3 AI Translation / Save As New Document

1. User invokes document translation.
2. AI translates content.
3. User can share or save translated content as a new document.
4. Original and translated versions can support cross-language collaboration.

Toast implication: translation is a structural document operation, not just inline text replacement. `toast` should support clone-as-translated-document in later phases.

### 6.4 Multidimensional Table AI Field Shortcut

1. User selects a cell or field.
2. Floating AI toolbar appears.
3. User chooses Fill, Polish, Translate, Tag, Summary, Extract info or Ask.
4. AI generates output from the current record/field.
5. User replaces current content or inserts output at the end.

Toast implication: structured blocks and tables need field-level AI eventually. First phase can borrow replace/insert controls; later automation can bind AI actions to fields.

## 7. AI Entry Points

| Entry | Scope | User Intent | Toast Mapping |
| --- | --- | --- | --- |
| Document AI writing | cursor / selection | draft / expand / style convert | `ToastPatch` |
| Polish / Translate / Summarize | selection / document | transform existing text | scoped patch or ask result |
| Revision card | document change | review proposed change | `ToastPatchReviewCard` |
| Floating AI toolbar | field / table cell | structured transform | future field action |
| Smart meeting notes | transcript / document | summarize / action items | source provider + action extraction |

## 8. Context Model

飞书 AI 的上下文来自协同套件：文档、会议纪要、多维表格、任务、日历、业务系统和企业知识。公开资料强调“会议讨论 -> 行动项拆解 -> 任务跟进 -> 结果反馈”的闭环。

对 `toast` 的结论：

- `ToastContextChip` 应支持 document、meeting transcript、task、calendar 和 structured table source。
- AI action 可以输出 action items，而不只是文本。
- 企业文档里 review / notification / owner awareness 是必需能力。

## 9. Patch / Review / Revision Model

飞书修订模式提供成熟协作 review 心智：每个变更是右侧建议卡片，可接受、拒绝、评论、修改、撤回，并通知文档所有者。AI 写作资料未明确说明是否统一接入修订模式。

对 `toast` 的结论：

- AI patch review 应优先采用 revision-card mental model。
- Patch review card 至少支持 accept、reject、comment、modify、withdraw。
- AI patch 与人类修订应该共用 review UI，但保留 actor/model metadata。

## 10. Keyboard And Shortcut Model

公开资料主要描述 UI entry。`toast` 的可迁移点是模式而非快捷键：

- Edit / Revision mode switch.
- Selection AI action.
- Right-side review cards.
- Floating toolbar for structured cell/field actions.

## 11. Extension / Customization Model

飞书的 AI 能力与 aPaaS、多维表格、智能伙伴创建平台和云文档 API 结合。`toast` 后续应保留：

- document block API provider。
- field/table action provider。
- meeting/transcript source provider。
- workflow/action-item provider。

## 12. Strengths

- 修订模式非常适合严肃文档协作。
- AI 能力进入文档、会议、表格和任务闭环。
- 翻译、总结、行动项适合跨国和协作场景。
- 开放平台说明了 block/document API 对自动化的重要性。

## 13. Limits

- 公开文档 AI 操作细节不如 Microsoft / Google 透明。
- AI 写作结果是否能直接进入修订模式不明确。
- 套件闭环强，单独抽象为 editor SDK 时需要拆分边界。

## 14. Required Baseline For Toast

| Capability | Decision | Phase | Notes |
| --- | --- | --- | --- |
| Writing / polish / translate / summarize | adopt | Phase 1 | 常见文档 AI 动作 |
| Revision-card patch review | adopt | Phase 1 | accept / reject / comment / modify / withdraw |
| AI actor metadata | adopt | Phase 1 | 区分 human revision and AI patch |
| Document translation clone | adapt | Phase 2 | save as translated document |
| Meeting transcript source | adapt | Phase 2 | source provider |
| Field/table AI shortcut | defer | Phase 3 | structured automation |
| Notification / owner awareness | adapt | Phase 2 | collaboration review |

## 15. Lessons For Toast

- 飞书修订模式是 AI patch review 的重要参考：右侧卡片比纯 inline diff 更适合严肃协作。
- 国内协作文档重视翻译、总结、行动项和任务闭环，toast 的 AI output 不应只限于正文。
- Block/document API 是 AI editor 产品化的基础能力。
- AI 写作必须和修订 / 评论 / 通知体系打通，否则协作场景很难可信。

## 16. Open Items

无
