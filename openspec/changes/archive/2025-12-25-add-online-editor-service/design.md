## Context
需要一个在线编辑服务用于 Office 文档编辑，作为独立服务部署。

## Goals / Non-Goals
- Goals:
  - 提供 OnlyOffice DocumentServer 容器
  - 通过外部 URL 打开并编辑文档
- Non-Goals:
  - 鉴权/审计
  - 文件存储（由 MinIO 提供）

## Decisions
- Decision: 使用 OnlyOffice DocumentServer 容器
- Decision: 默认不开启鉴权（内网）

## Risks / Trade-offs
- 默认无鉴权 → 仅适合内网环境

## Migration Plan
- 新增服务，不影响现有系统

## Open Questions
- 暂无
