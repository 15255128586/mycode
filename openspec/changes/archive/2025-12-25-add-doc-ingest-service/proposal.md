# Change: Add Document Ingest Service

## Why
需要一个独立的解析服务，将项目资料与参考写法文件分别转化为 facts 与 references，并保持可追溯引用。该服务可复用现有 LLM Service 能力，便于后续扩展。

## What Changes
- 新增 Document Ingest Service（独立部署）
- 提供两个上传入口：项目资料 → facts，参考写法 → references
- 支持 PDF/Word/Markdown/Excel 文件解析
- 解析过程调用现有 LLM Service
- 保存可追溯原文片段（页码/段落/行号或等价定位）
- 解析结果支持人工确认/编辑后入库

## Impact
- Affected specs: doc-ingest-service
- Affected code: services/doc-ingest-service (新增)
- Dependencies: llm-service (调用)
