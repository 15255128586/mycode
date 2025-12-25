# Change: Add File Storage Service (MinIO)

## Why
需要独立的文件存储服务，用于保存项目资料与参考写法文件，供解析与编辑服务复用。

## What Changes
- 新增 MinIO 存储服务（Docker 部署）
- 提供基础桶配置用于文档存储
- 服务默认不启用鉴权（内网使用）

## Impact
- Affected specs: file-storage-service
- Affected code: docker compose/service definitions (新增)
