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

## 5. SDK Interface Direction

Editor SDK 应提供稳定入口：

```ts
interface ToastEditor {
  getDocument(): ToastDocument;
  setDocument(document: ToastDocument): void;
  getSelection(): ToastSelection;
  getContext(options: ContextOptions): ToastContext;
  runCommand(command: ToastCommand): void;
  proposePatch(input: AiActionInput): Promise<ToastPatch>;
  applyPatch(patch: ToastPatch): void;
  rejectPatch(patchId: string): void;
  rollbackPatch(patchId: string): void;
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

每个组件通过 SDK context 获取 editor state，不直接依赖 demo 页面布局。

## 8. Open Items

- 是否首期只支持 React。
- `ToastPatch` 采用 ProseMirror step、JSON patch、自定义结构 patch，还是组合模型。
- 第一阶段 AI action 是否以“选区改写 + patch 预览”为最小闭环。
- 第一代微信样式作为默认主题、可选主题，还是独立 theme package。
