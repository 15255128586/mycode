# file-storage-service Specification

## Purpose
TBD - created by archiving change add-file-storage-service. Update Purpose after archive.
## Requirements
### Requirement: MinIO 存储服务
系统 MUST 提供 MinIO 存储服务用于文档保存。

#### Scenario: 存储服务可用
- **WHEN** 系统启动
- **THEN** MinIO 服务可用并支持对象存取

### Requirement: 默认桶
系统 MUST 预置项目资料、参考写法与可编辑文件的存储桶。

#### Scenario: 桶初始化
- **WHEN** MinIO 启动完成
- **THEN** 存在 `projects`、`references` 与 `documents` 三个桶

### Requirement: 内网无鉴权
系统 MUST 默认不启用鉴权（仅限内网环境）。

#### Scenario: 默认访问
- **WHEN** 内网服务访问 MinIO
- **THEN** 可直接读写对象而无需鉴权

