# TODO List

## 说明

- `TODO.md` 是未关闭执行队列，不是完成清单。
- 宏观任务必须先讨论边界，再拆解为执行任务。
- `待审阅任务项` 需要人工确认后才能执行。
- 已完成任务必须删除、拆分或收窄，不长期打勾保留。
- 完成记录保留在 commit 或 PR 中。

## 当前任务项

## 待审阅任务项

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
