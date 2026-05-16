# TODO List

## 说明

- `TODO.md` 是未关闭执行队列，不是完成清单。
- 宏观任务必须先讨论边界，再拆解为执行任务。
- `待审阅任务项` 需要人工确认后才能执行。
- 已完成任务必须删除、拆分或收窄，不长期打勾保留。
- 完成记录保留在 commit 或 PR 中。

## 当前任务项

## 待审阅任务项

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
