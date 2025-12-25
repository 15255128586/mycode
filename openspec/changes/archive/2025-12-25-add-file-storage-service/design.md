## Context
需要一个独立的文件存储服务，供解析与编辑服务共享文档。

## Goals / Non-Goals
- Goals:
  - 提供 MinIO 服务
  - 预置基础 bucket
  - Docker 容器化部署
- Non-Goals:
  - 权限管理与审计

## Decisions
- Decision: 使用 MinIO 容器
- Decision: 默认不开启鉴权（内网）

## Risks / Trade-offs
- 默认无鉴权 → 仅适合内网环境

## Migration Plan
- 新增服务，不影响现有系统

## Open Questions
- 暂无
