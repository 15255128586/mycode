## Context
需要一个独立的文档解析服务，将项目资料与参考写法分开处理，支持多格式文件输入，并通过 LLM Service 抽取结构化结果。

## Goals / Non-Goals
- Goals:
  - 独立部署文档解析服务
  - 分离项目资料与参考写法入口
  - 支持 PDF/Word/Markdown/Excel
  - 输出 facts / references，保留可追溯定位
  - 解析结果可人工确认/编辑后入库
- Non-Goals:
  - OCR
  - 在线编辑
  - 文件存储（由独立服务提供）

## Decisions
- Decision: 解析服务通过 HTTP 调用现有 LLM Service
- Decision: 文件类型统一为文本+位置信息，再做抽取

## Risks / Trade-offs
- 多格式解析复杂度 → 可能分阶段实现

## Migration Plan
- 新增服务独立部署，不影响现有 Compose/LLM Service

## Open Questions
- 暂无
