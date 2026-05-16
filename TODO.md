# TODO List

## 说明

- `TODO.md` 是未关闭执行队列，不是完成清单。
- 宏观任务必须先讨论边界，再拆解为执行任务。
- `待审阅任务项` 需要人工确认后才能执行。
- 已完成任务必须删除、拆分或收窄，不长期打勾保留。
- 完成记录保留在 commit 或 PR 中。

## 当前任务项

## 待审阅任务项

- [ ] `research-rules`：新增研究文档治理规则
  - 范围文件：
    - docs/00-governance/RESEARCH-DOCUMENT-RULES.md
  - 处理动作：定义研究文档结构、数据来源格式、截图引用规则、walkthrough 格式和质量门禁。
  - 验收点：后续研究文档必须能按该规则检查数据来源、操作细节、截图来源和 toast 结论。
  - 重要度：10/10

- [ ] `research-runbook`：补齐 AI 编辑器研究 RUNBOOK
  - 范围文件：
    - docs/30-designs/RUNBOOK-AI-EDITOR-RESEARCH.md
  - 处理动作：固定本轮研究的批次顺序、每个产品的必查清单、最低 walkthrough 数量、最低数据来源要求和收口方式。
  - 验收点：RUNBOOK 能直接指导后续 Tiptap、BlockNote、Cursor 和 AI 文档产品研究，不依赖口头补充。
  - 重要度：10/10

- [ ] `research-assets`：建立研究截图资产目录约定
  - 范围文件：
    - docs/30-designs/research/assets/README.md
  - 处理动作：定义截图目录、命名规则、来源记录方式和截图缺失时的替代记录方式。
  - 验收点：每个产品后续截图都有固定存放位置和引用方式。
  - 重要度：8/10

- [ ] `research-tiptap-sources`：采集 Tiptap 数据来源清单
  - 范围文件：
    - docs/30-designs/research/TIPTAP-STUDY.md
  - 处理动作：收集 Tiptap 官方文档、GitHub 源码、npm package、license、AI Toolkit 文档和 ProseMirror 相关来源。
  - 验收点：`TIPTAP-STUDY.md` 的 `Data Sources` 完整列出来源、访问日期和用途。
  - 重要度：10/10

- [ ] `research-tiptap-data-model`：分析 Tiptap 数据模型和 block list 可行性
  - 范围文件：
    - docs/30-designs/research/TIPTAP-STUDY.md
  - 处理动作：分析 Tiptap / ProseMirror schema、`doc: block+`、node、mark、selection、transaction 和 history。
  - 验收点：明确 Tiptap 如何支持 toast 的 linear block list 控制，以及哪些内部树结构不能泄漏为公开 SDK。
  - 重要度：10/10

- [ ] `research-tiptap-ui`：分析 Tiptap UI 操作模式
  - 范围文件：
    - docs/30-designs/research/TIPTAP-STUDY.md
    - docs/30-designs/research/assets/tiptap/
  - 处理动作：分析 toolbar、bubble menu、floating menu、slash command、NodeView 和 React UI components。
  - 验收点：至少形成 3 个 UI walkthrough，并标明截图或替代来源。
  - 重要度：9/10

- [ ] `research-tiptap-ai`：分析 Tiptap AI Toolkit 和 toast 替代边界
  - 范围文件：
    - docs/30-designs/research/TIPTAP-STUDY.md
  - 处理动作：分析 Tiptap AI Toolkit 的公开能力、商业边界、AI changes / review 能力和 toast 可替代设计。
  - 验收点：明确 toast 不能低于的 AI 能力，以及哪些能力需要自研以避开商业封闭边界。
  - 重要度：10/10

- [ ] `research-blocknote-sources`：采集 BlockNote 数据来源清单
  - 范围文件：
    - docs/30-designs/research/BLOCKNOTE-STUDY.md
  - 处理动作：收集 BlockNote 官方文档、GitHub 源码、npm package、license、AI extension 和 block API 来源。
  - 验收点：`BLOCKNOTE-STUDY.md` 的 `Data Sources` 完整列出来源、访问日期和用途。
  - 重要度：10/10

- [ ] `research-blocknote-data-model`：分析 BlockNote block tree 数据模型
  - 范围文件：
    - docs/30-designs/research/BLOCKNOTE-STUDY.md
  - 处理动作：分析 `Block` 类型、`children: Block[]`、inline content、table content、`blockGroup` / `blockContainer` / `blockContent`。
  - 验收点：明确 BlockNote 的 physical block tree 与 toast linear block list 的差异。
  - 重要度：10/10

- [ ] `research-blocknote-ui`：分析 BlockNote UI 操作模式
  - 范围文件：
    - docs/30-designs/research/BLOCKNOTE-STUDY.md
    - docs/30-designs/research/assets/blocknote/
  - 处理动作：分析 side menu、drag handle、slash menu、formatting toolbar、block type 转换和 block 移动。
  - 验收点：至少形成 4 个 UI walkthrough，并明确哪些操作是 toast 必须达到的开箱体验。
  - 重要度：10/10

- [ ] `research-blocknote-ai`：分析 BlockNote AI extension 和 review 机制
  - 范围文件：
    - docs/30-designs/research/BLOCKNOTE-STUDY.md
  - 处理动作：分析 AI menu、AI toolbar、AI extension、accept / reject changes、许可证边界。
  - 验收点：明确 toast 在 AI patch workflow 上必须达到或超过 BlockNote 的能力。
  - 重要度：10/10

- [ ] `research-plate-scope`：判断 Plate 是否进入深度研究
  - 范围文件：
    - docs/30-designs/research/PLATE-SCOPE.md
  - 处理动作：快速采集 Plate 文档、npm、license、AI 能力和 UI 组件信息，判断是否需要后续 `PLATE-STUDY.md`。
  - 验收点：明确 Plate 是进入深研、只作为参考，还是排除在本轮研究之外。
  - 重要度：7/10

- [ ] `research-open-source-baseline`：汇总开源编辑器能力基线
  - 范围文件：
    - docs/30-designs/research/OPEN-SOURCE-EDITOR-BASELINE.md
  - 处理动作：基于 Tiptap、BlockNote 和 Plate scope 文档汇总 toast 的开源最低能力线。
  - 验收点：明确 Tiptap 底座基线、BlockNote 开箱体验基线、AI 能力基线和 toast 差异点。
  - 重要度：9/10

- [ ] `research-cursor-sources`：采集 Cursor 数据来源清单
  - 范围文件：
    - docs/30-designs/research/CURSOR-STUDY.md
  - 处理动作：收集 Cursor 官方文档、changelog、inline edit、chat、agent、rules、context、diff、checkpoint 相关来源。
  - 验收点：`CURSOR-STUDY.md` 的 `Data Sources` 完整列出来源、访问日期和用途。
  - 重要度：9/10

- [ ] `research-cursor-inline`：分析 Cursor inline edit 和 quick question
  - 范围文件：
    - docs/30-designs/research/CURSOR-STUDY.md
    - docs/30-designs/research/assets/cursor/
  - 处理动作：分析 Tab completion、Inline Edit、Quick Question 的入口、步骤、状态、取消和应用方式。
  - 验收点：形成至少 2 个 walkthrough，并映射到 toast 的 cursor / selection 级 AI 能力。
  - 重要度：9/10

- [ ] `research-cursor-agent`：分析 Cursor chat / agent / context / checkpoint
  - 范围文件：
    - docs/30-designs/research/CURSOR-STUDY.md
    - docs/30-designs/research/assets/cursor/
  - 处理动作：分析 Chat、Agent、context picker、`@` symbols、rules、memories、diff apply、checkpoint rollback。
  - 验收点：形成至少 2 个 walkthrough，并映射到 toast 的 AI side panel、context chips、patch preview 和 checkpoint。
  - 重要度：9/10

- [ ] `research-word-copilot`：撰写 Word Copilot AI 文档编辑研究
  - 范围文件：
    - docs/30-designs/research/WORD-COPILOT-STUDY.md
    - docs/30-designs/research/assets/word-copilot/
  - 处理动作：研究 Word Copilot 的 draft、rewrite、summarize、selection edit、review / revision 相关操作。
  - 验收点：形成至少 3 个 walkthrough，并明确 toast 可学习的传统文档 AI 操作。
  - 重要度：8/10

- [ ] `research-google-docs-gemini`：撰写 Google Docs Gemini 研究
  - 范围文件：
    - docs/30-designs/research/GOOGLE-DOCS-GEMINI-STUDY.md
    - docs/30-designs/research/assets/google-docs-gemini/
  - 处理动作：研究 Help me write、空白态生成、选区改写、Workspace 上下文和文档级 AI。
  - 验收点：形成至少 3 个 walkthrough，并明确 toast 的空白态和文档级 AI 启发。
  - 重要度：8/10

- [ ] `research-notion-ai`：撰写 Notion AI 研究
  - 范围文件：
    - docs/30-designs/research/NOTION-AI-STUDY.md
    - docs/30-designs/research/assets/notion-ai/
  - 处理动作：研究 Ask AI、slash AI、选区 AI、block 上下文和页面级 AI。
  - 验收点：形成至少 3 个 walkthrough，并明确 Notion-style AI 操作中 toast 应学习和避免的点。
  - 重要度：8/10

- [ ] `research-feishu-docs-ai`：撰写飞书 / Lark Docs AI 研究
  - 范围文件：
    - docs/30-designs/research/FEISHU-DOCS-AI-STUDY.md
    - docs/30-designs/research/assets/feishu-docs-ai/
  - 处理动作：研究飞书文档 AI 写作、润色、总结、翻译、修订模式和协作上下文。
  - 验收点：形成至少 3 个 walkthrough，并明确国内协作文档 AI 的操作基线。
  - 重要度：8/10

- [ ] `research-grammarly`：撰写 Grammarly AI 写作辅助研究
  - 范围文件：
    - docs/30-designs/research/GRAMMARLY-STUDY.md
    - docs/30-designs/research/assets/grammarly/
  - 处理动作：研究 Grammarly 的局部建议、rewrite、tone、clarity、低打扰 UI 和 accept / dismiss 机制。
  - 验收点：形成至少 3 个 walkthrough，并明确 toast 的低打扰写作建议模式。
  - 重要度：7/10

- [ ] `research-ai-doc-products-baseline`：汇总 AI 文档产品能力基线
  - 范围文件：
    - docs/30-designs/research/AI-DOCUMENT-PRODUCT-BASELINE.md
  - 处理动作：基于 Word、Google Docs、Notion、飞书、Grammarly 单项研究汇总 AI 文档产品基线。
  - 验收点：明确 toast 在空白态、选区态、文档级、修订/建议/undo、上下文引用上的产品水位。
  - 重要度：8/10

- [ ] `research-synthesis-requirements`：同步研究结论到需求文档
  - 范围文件：
    - docs/10-requirements/EDITOR-SDK-REQUIREMENTS.md
  - 处理动作：将研究中稳定下来的能力边界、数据模型和 AI 操作要求同步到需求文档。
  - 验收点：需求文档中的 open items 被删除、拆分或收窄。
  - 重要度：9/10

- [ ] `research-synthesis-design`：同步研究结论到设计文档
  - 范围文件：
    - docs/30-designs/EDITOR-SDK-PRODUCTIZATION-DESIGN.md
    - docs/30-designs/AI-EDITOR-OPERATION-COMPARISON.md
  - 处理动作：将研究结论同步为 toast 的包边界、UI 操作模式、AI action 分层、patch review 和 checkpoint 设计。
  - 验收点：设计文档不再停留在泛泛比较，明确首期、二期和不做项。
  - 重要度：9/10

- [ ] `research-closeout`：收口研究 TODO 和 RUNBOOK
  - 范围文件：
    - TODO.md
    - docs/30-designs/RUNBOOK-AI-EDITOR-RESEARCH.md
  - 处理动作：删除、拆分或收窄已完成研究 TODO，并判断 RUNBOOK 是保留到后续批次还是清理。
  - 验收点：TODO 只保留未关闭任务，完成记录不留在 TODO 中。
  - 重要度：8/10

## 待讨论项
