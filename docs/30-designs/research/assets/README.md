# Research Assets

## 1. Purpose

本文档定义研究截图和视觉证据的存放、命名和引用规则。截图用于说明具体操作入口、按钮、菜单、状态和 review 流程，不作为装饰材料。

## 2. Directory Layout

产品截图固定放在对应产品目录：

```text
docs/30-designs/research/assets/
  tiptap/
  blocknote/
  cursor/
  word-copilot/
  google-docs-gemini/
  notion-ai/
  feishu-docs-ai/
  grammarly/
```

目录只有在存在真实截图或截图说明文件时才创建，不为了占位创建空目录。

## 3. File Naming

截图文件名固定使用：

```text
PRODUCT-OPERATION-STATE.png
```

示例：

```text
CURSOR-INLINE-EDIT-PROMPT.png
BLOCKNOTE-SIDE-MENU-HOVER.png
TIPTAP-BUBBLE-MENU-SELECTION.png
WORD-COPILOT-REWRITE-SUGGESTIONS.png
```

规则：

- `PRODUCT` 使用大写英文产品名。
- `OPERATION` 写具体操作。
- `STATE` 写截图呈现的状态。
- 文件名不得使用中文或空格。

## 4. Source Notes

每个产品目录中可以新增 `SOURCES.md` 记录截图来源。格式固定为：

```markdown
| Asset | Source Type | Source | Captured At | Related Operation | Notes |
| --- | --- | --- | --- | --- | --- |
| CURSOR-INLINE-EDIT-PROMPT.png | hands-on | local Cursor app | 2026-05-16 | Inline Edit | Shows prompt state |
```

`Source Type` 固定使用：

- `official-docs`
- `official-demo`
- `official-video`
- `hands-on`
- `third-party`

第三方来源只能作为补充观察，不作为关键事实唯一来源。

## 5. Missing Screenshot Rule

无法取得截图时，不阻塞研究，但必须在研究文档中标记 `截图待补`，并提供替代证据：

- 官方文档图片链接
- 官方视频时间点
- 文字操作步骤
- 实测环境说明

缺少截图的操作仍必须写清入口、按钮、状态和结果。

## 6. Reference Rule

研究文档引用截图时必须说明：

- 相对路径
- 来源
- 采集日期
- 对应操作
- 该截图证明的 UI 状态

## 7. Open Items

无
