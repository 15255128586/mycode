# Change: Add Online Editor Service (OnlyOffice)

## Why
需要独立的在线编辑服务，提供 Office 文档在线编辑能力，并与文件存储服务集成。

## What Changes
- 新增 OnlyOffice DocumentServer 容器
- 与 MinIO 存储服务协同使用（由前端或业务服务提供文件 URL）
- 服务默认不启用鉴权（内网使用）

## Impact
- Affected specs: online-editor-service
- Affected code: docker compose/service definitions (新增)
