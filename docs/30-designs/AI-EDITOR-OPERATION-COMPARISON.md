# AI Editor Operation Comparison

## 1. Purpose

本文档比较 `Cursor`、`Tiptap native`、`BlockNote` 和 `toast` 的 UI 表现与操作模式。目标是为 `toast` 形成更细致的 AI inside 编辑体验，而不是停留在“选中文本后调用 AI”的粗粒度能力。

## 2. Comparison Targets

- `Cursor`：AI-first IDE，重点参考 inline edit、chat / agent、上下文选择、diff review、checkpoint。
- `Tiptap native`：headless editor toolkit，重点参考 selection、command、menu、extension 和 node view。
- `BlockNote`：Notion-style block editor，重点参考 block side menu、slash menu、formatting toolbar 和 block manipulation。
- `toast`：基于 `Tiptap` 的 AI-native document editor SDK，固定采用线性 block list 控制模型。

## 3. Cursor Operation Model

Cursor 的核心操作不是单一 AI 按钮，而是一组分层入口：

- `Tab`：低摩擦的 inline completion，用于当前位置的快速补全。
- `Inline Edit`：选中代码或停在光标处，用自然语言生成局部修改。
- `Quick Question`：对选区先问问题，确认后再转成编辑。
- `Full File Edit`：针对单文件做较完整修改。
- `Chat / Agent`：处理跨文件、多步骤、需要解释或计划的任务。
- Context picker / `@` symbols：显式指定文件、符号、文档、最近变化或错误。
- Rules / Memories：长期、可复用的项目或用户规则。
- Apply / diff review：AI 修改先呈现变更，再由用户接受。
- Checkpoints：在 agent 执行前后形成可回退状态。

Cursor 的特色是：同一任务可以从轻到重升级。

```text
Tab -> Inline Edit -> Chat -> Agent
```

## 4. Tiptap Native Operation Model

Tiptap native 是 headless 能力集合，不提供固定产品 UI。

已有操作原语：

- selection-based command
- toolbar button
- bubble menu
- floating menu
- slash command
- node view
- extension command
- transaction / history

Tiptap 的优势是底层表达力强；不足是它不定义 block list 操作、AI 上下文、patch review 或产品级工作流。

## 5. BlockNote Operation Model

BlockNote 是产品化 block editor。

典型操作：

- block hover 时显示左侧 side menu。
- `+` 插入 block。
- drag handle 移动 block。
- slash menu 插入或转换内容。
- formatting toolbar 处理选区格式。
- block API 处理 insert、update、remove、replace、move、nest。

BlockNote 的体验中心是 physical block tree。`toast` 可以参考其显性 block 控制，但不采用 `children: Block[]` 作为公开文档模型。

## 6. Toast Target Operation Model

`toast` 应采用 “linear block list + explicit controls + AI patch workflow”。

核心入口：

- `Inline AI`：类似 Cursor Inline Edit，作用于 selection、cursor 或当前 block。
- `Block Gutter`：每个 block 的左侧控制区，处理添加、移动、删除、复制、block AI。
- `Persistent Toolbar`：平铺常用格式、结构、插入和 AI action。
- `Selection Bubble`：处理选区格式和选区 AI。
- `Slash Command`：快速插入 block、转换结构或触发 AI。
- `Outline / Section Panel`：基于 heading 扫描 block list 得到逻辑章节。
- `AI Side Panel`：处理多步骤任务、上下文检查和 patch list。
- `Patch Preview`：逐项接受、拒绝、回滚。
- `Operation History`：记录用户编辑、AI patch、接受/拒绝/回滚。

## 7. Detailed Mapping

| Cursor 操作 | Cursor 语义 | toast 对应能力 | toast 约束 |
| --- | --- | --- | --- |
| `Tab` completion | 低摩擦续写 | `Continue Inline` / `Continue Block` | 只生成 suggestion，不直接提交 |
| Inline Edit | 对选区或光标局部修改 | `Inline AI Edit` | 输出 `ToastPatch` |
| Quick Question | 先理解再修改 | `Ask About Selection` | 问答不改变文档 |
| Full File Edit | 单文件整体修改 | `Section Edit` / `Document Edit` | 生成 patch list |
| Chat | 解释、讨论、上下文任务 | `AI Side Panel` | 默认不修改内容 |
| Agent | 多步骤执行 | `Document Agent` | 必须有 plan、patch preview、checkpoint |
| `@` context | 显式上下文选择 | context chips | 可选 selection、block range、section、whole doc、host context |
| Rules | 长期行为约束 | editor rules / action policy | 由宿主或项目注入 |
| Apply diff | 审查变更 | `PatchPreview` | 支持 block-level accept / reject |
| Checkpoint | 回退状态 | document checkpoint | AI 执行前创建 |

## 8. Toast AI Inside Ability Set

### 8.1 Output Layers

`toast` 不把所有 AI 输出都当成 patch。操作层分为：

| Layer | Object | Review | Use Case |
| --- | --- | --- | --- |
| Ask | `ToastAskResult` | read-only / insert explicitly | summary, Q&A, quick question |
| Suggest | `ToastSuggestion` | accept / dismiss | grammar, clarity, tone, ghost text |
| Patch | `ToastPatch` | preview / accept / reject / rollback | rewrite, insert, transform, agent edit |

### 8.2 Cursor-Level

- `Continue Here`：从光标处续写。
- `Insert From Prompt`：在当前位置插入用户描述的内容。
- `Ask Here`：解释当前位置上下文，不修改文档。

### 8.3 Selection-Level

- `Rewrite Selection`
- `Polish Selection`
- `Shorten Selection`
- `Expand Selection`
- `Translate Selection`
- `Explain Selection`
- `Fix Writing`
- `Change Tone`

### 8.4 Block-Level

- `Improve Block`
- `Continue After Block`
- `Split Block`
- `Merge Blocks`
- `Convert To List`
- `Convert To Table`
- `Generate Variants`
- `Add Examples`

### 8.5 Section-Level

Section 由 heading 和 block range 计算得到。

- `Summarize Section`
- `Rewrite Section`
- `Expand Section`
- `Compress Section`
- `Generate Subheadings`
- `Restructure Section`
- `Check Consistency`
- `Extract Action Items`

### 8.6 Document-Level

- `Generate Outline`
- `Review Document`
- `Find Gaps`
- `Generate Abstract`
- `Terminology Check`
- `Style Consistency Check`

文档级 AI 固定只生成 patch list，不直接覆盖全文。

### 8.7 Product-Level Baseline

- Empty block draft: patch preview, keep / regenerate / discard.
- Selection rewrite: variants, replace / insert below.
- Document summary / Q&A: `ToastAskResult` by default.
- Inline suggestion: `ToastSuggestion` with accept / dismiss.
- Revision review: right-side card with accept / reject / comment / modify / withdraw.
- Context: visible chips for selection, section, document, source, rule and history.

## 9. Interaction Rules

所有会修改内容的 AI action 固定走同一流程：

```text
Trigger
-> Select Scope
-> Build Context
-> Run AI Action
-> Generate ToastPatch
-> Preview
-> Accept / Reject / Rollback
-> Record Operation
```

作用域固定分层：

- `cursor`
- `selection`
- `block`
- `blockRange`
- `section`
- `document`

AI action 不得直接调用 Tiptap `insertContent` 或 `deleteSelection` 作为最终修改路径。Tiptap transaction 只作为 `ToastPatch` apply 阶段的运行时实现。

Suggestion action 可以走轻量路径：

```text
Detect
-> Show ToastSuggestion
-> Accept / Dismiss
-> Record Suggestion State
```

Ask action 固定不改文档：

```text
Trigger
-> Build Context
-> Return ToastAskResult
-> Optional Insert As Patch
```

## 10. What Not To Copy

- 不复制 Cursor 的代码文件心智模型；`toast` 的最小单位是 block。
- 不复制 BlockNote 的 physical children tree；`toast` 的公开模型是 linear block list。
- 不把 Tiptap native command 直接暴露给宿主作为主 SDK。
- 不让 AI 自动修改正文而绕过 patch review。
- 不把 AI 能力藏在单个菜单里；AI 必须在 toolbar、bubble、block gutter、section panel 和 side panel 中成为一等入口。

## 11. Open Items

- `Continue Here` 进入 Phase 2 ghost text / partial accept，不作为首期主闭环。
- `Document Agent` 首期只做 side panel + patch list，不做跨文档 agent。
- patch preview 首期采用 side panel / revision-card，inline diff 作为补充。
- checkpoint 粒度首期按 AI operation 创建。
- context chips 首期由 SDK 提供默认组件，宿主可替换。
