# Editor SDK Productization Design

## 1. Purpose

本文档基于 `../wechat-tiptap` 第一代编辑器，定义 `toast` 产品化、组件化和可拆解化的设计方向。目标不是复制第一代 demo，而是把其中可复用能力抽象成 AI 原生 Editor SDK 和 Editor Component。

## 2. First Generation Baseline

`wechat-tiptap` 已经验证的能力：

- 基于 `Tiptap` / `ProseMirror` 的结构化富文本编辑。
- `WechatEditor` 主编辑器组件。
- `Toolbar`、`BubbleMenu`、`Outline`、`Statusbar` 等 UI 部件。
- 自定义 extensions：字体大小、缩进、链接、表格、可裁剪图片、blockquote highlight、slash command。
- `Magic` AI 节点：支持 `++`、toolbar 和 slash command 触发 AI。
- AI prompt actions：续写、总结、缩短、扩写、润色、翻译、整理笔记等。

第一代主要耦合点：

- 编辑器核心、微信样式、demo 页面和业务文案混在 `src/pages/wechat-editor/`。
- AI provider 直接在浏览器 hook 中初始化 OpenAI client，且包含固定 baseURL、model 和 `dangerouslyAllowBrowser`。
- AI 生成结果直接插入或替换内容，没有独立 patch 模型。
- selection 上下文只保存 `selectionFrom`、`selectionTo`、`selectionText`、`selectionJSON`、`prevText`，缺少结构节点路径、操作历史和可审查变更。
- toolbar、bubble menu、slash command 直接调用 Tiptap command，缺少可配置 command registry。

## 3. Productization Direction

`toast` 固定拆成四类能力：

- Editor Core：线性 block list 文档模型、selection、transaction、command、history、patch。
- Editor React：可嵌入 React component、toolbar、bubble menu、outline、statusbar。
- AI Editing：上下文提取、AI action、provider adapter、streaming result、patch generation。
- Extensions：基础富文本、表格、图片、链接、slash command、AI trigger 等可插拔能力。

Playground 只用于演示和测试接入方式，不承载核心逻辑。

## 4. Proposed Package Boundaries

未来包边界优先按能力拆分：

- `@toast-editor/core`：非 UI 编辑器核心类型、command registry、patch model、context extraction。
- `@toast-editor/react`：React Editor Component 和 UI 部件。
- `@toast-editor/tiptap`：Tiptap adapter、extensions 组合、ProseMirror patch adapter。
- `@toast-editor/ai`：AI action、prompt builder、provider adapter、streaming protocol。
- `@toast-editor/extensions`：通用 extensions 和节点能力。
- `playground`：本地 demo 和集成验证。

首期可以先在单仓库内用目录模拟包边界，等 API 稳定后再拆 package。

首期模块应按以下内部边界组织：

| Module | Responsibility |
| --- | --- |
| `block-model` | `ToastDocument`、`ToastBlock`、linear block list、section range |
| `selection` | block range、inline range、cursor block、selection text |
| `command` | `ToastCommand` registry、toolbar/slash/block action 统一入口 |
| `context` | `ToastContext`、context chips、coverage、rules/history/source |
| `ai-action` | action registry、tool permissions、provider-neutral request |
| `patch` | `ToastPatch`、diff、preview、accept/reject/rollback |
| `suggestion` | `ToastSuggestion`、inline card、accept/dismiss |
| `checkpoint` | AI operation checkpoint and restore |

## 5. SDK Interface Direction

Editor SDK 应提供稳定入口：

```ts
interface ToastEditor {
  getDocument(): ToastDocument;
  setDocument(document: ToastDocument): void;
  getSelection(): ToastSelection;
  getContext(options: ContextOptions): ToastContext;
  runCommand(command: ToastCommand): void;
  ask(input: AiActionInput): Promise<ToastAskResult>;
  suggest(input: SuggestionInput): Promise<ToastSuggestion[]>;
  proposePatch(input: AiActionInput): Promise<ToastPatch>;
  applyPatch(patch: ToastPatch): void;
  rejectPatch(patchId: string): void;
  rollbackPatch(patchId: string): void;
  createCheckpoint(input: CheckpointInput): ToastCheckpoint;
  restoreCheckpoint(checkpointId: string): void;
}
```

React Component 不直接暴露 Tiptap `Editor` 作为唯一 API。可以提供 escape hatch，但主接口必须是 `ToastEditor`。

`ToastDocument` 的公开数据模型固定是线性 block list：

```ts
interface ToastDocument {
  version: string;
  blocks: ToastBlock[];
  metadata?: Record<string, unknown>;
}

interface ToastBlock {
  id: string;
  type: string;
  attrs?: Record<string, unknown>;
  content?: ToastInline[];
}
```

heading block 只表达逻辑层级，不拥有物理 children。章节、目录、折叠和 AI 结构上下文都通过 block list 扫描计算得到。该模型与 `docx` 和 Markdown 的顺序文档表达一致，不采用 BlockNote 的 `children: Block[]` 物理嵌套模型。

示例：

```text
[h1, paragraph, paragraph, h2, paragraph, h3, paragraph, h2, paragraph]
```

上例可以计算出逻辑章节树，但存储和 patch 的目标仍然是稳定 block id 与线性 block range。

AI 输出对象分三类：

- `ToastAskResult`：摘要、问答、解释、先问后改，只读展示。
- `ToastSuggestion`：拼写、clarity、tone、短句改写，轻量 accept / dismiss。
- `ToastPatch`：真实文档变更，必须 preview / accept / reject / rollback。

## 6. AI Editing Direction

第一代 `Magic` 能力应拆成：

- AI trigger：`++`、toolbar、slash command、bubble menu。
- Context extractor：从 selection、线性 block list、heading 逻辑章节、邻近 block 和操作历史生成最小上下文。
- AI action registry：续写、改写、总结、扩写、翻译、结构化整理。
- AI provider adapter：由宿主注入，SDK 不内置固定 baseURL、apiKey 或 model。
- Patch generator：把 AI 输出转换成结构化 patch。
- Patch UI：预览、接受、拒绝、回滚。

AI 不直接写入编辑器正文。所有 AI 结果必须先形成 patch。

patch 优先基于 block id 和 block range 表达。只有行内文字变更才使用 inline range。HTML diff 不作为核心 patch 模型。

AI action 固定声明 scope 和 tool permissions：

```ts
type ToastActionScope =
  | "cursor"
  | "selection"
  | "block"
  | "blockRange"
  | "section"
  | "document";

interface ToastAIAction {
  id: string;
  label: string;
  scope: ToastActionScope[];
  output: "ask" | "suggestion" | "patch";
  permissions: {
    add: boolean;
    update: boolean;
    delete: boolean;
    transform: boolean;
  };
}
```

首期内置 action：

- Empty block draft
- Rewrite selection
- Polish selection
- Translate selection
- Summarize selection / section / document
- Ask about selection / document
- Convert selection to table/list
- Improve block

暂缓 action：

- database / field autofill
- scheduled automation
- cross-document agent edit
- persisted AI prompt block

## 7. Componentization Direction

第一代 UI 部件保留为可选组件：

- `ToastEditorRoot`
- `ToastToolbar`
- `ToastBubbleMenu`
- `ToastOutline`
- `ToastStatusbar`
- `ToastSlashCommand`
- `ToastAiPanel`
- `ToastPatchPreview`
- `ToastSuggestionCard`
- `ToastRevisionCard`
- `ToastContextChips`
- `ToastBlockSideMenu`
- `ToastDragHandle`

每个组件通过 SDK context 获取 editor state，不直接依赖 demo 页面布局。

首期 UI surface：

| Surface | Responsibilities |
| --- | --- |
| Persistent toolbar | formatting、block type、insert、common AI action |
| Selection bubble | inline formatting、selection AI、Ask / Rewrite |
| Slash command | insert block、transform block、AI command |
| Block side menu | add、move、delete、duplicate、block AI |
| AI side panel | document Q&A、agent session、context chips、patch list |
| Suggestion card | local suggestion accept / dismiss |
| Revision card | patch accept / reject / comment / modify / withdraw |
| Patch preview | block-level diff and rollback |

## 8. Review And Checkpoint Design

AI 修改遵循统一流程：

```text
Trigger
-> Select Scope
-> Build Context
-> Run AI Action
-> Generate ToastAskResult / ToastSuggestion / ToastPatch
-> Review
-> Accept / Reject / Dismiss / Rollback
-> Record Operation
```

`ToastPatch` review 默认使用 revision-card mental model。每个 patch 必须保留：

- action id
- actor and model metadata
- scope
- context chips and coverage
- before / after
- review state
- operation history id

Document-level 或 agent-level action 在执行前创建 checkpoint。Checkpoint 不是版本管理系统，只负责 AI operation rollback。

## 9. Phase Decisions

Phase 1:

- Tiptap / ProseMirror runtime adapter
- linear `ToastDocument.blocks`
- toolbar / selection bubble / slash / block side menu / drag handle
- `ToastAskResult` / `ToastSuggestion` / `ToastPatch`
- AI patch preview and revision card
- context chips for selection / section / document / rules

Phase 2:

- external source provider
- workspace search context
- meeting transcript source
- ghost text / partial accept
- document translation clone
- collaboration notifications

Defer:

- field/database AI autofill
- scheduled automation
- cross-document agent edits
- full workflow automation

## 10. Open Items

- 是否首期只支持 React。
- `ToastPatch` 采用 ProseMirror step、JSON patch、自定义结构 patch，还是组合模型。
- 第一代微信样式作为默认主题、可选主题，还是独立 theme package。
