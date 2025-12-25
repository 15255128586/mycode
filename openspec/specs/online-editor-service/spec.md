# online-editor-service Specification

## Purpose
TBD - created by archiving change add-online-editor-service. Update Purpose after archive.
## Requirements
### Requirement: OnlyOffice 编辑服务
系统 MUST 提供 OnlyOffice DocumentServer 用于 Office 文档在线编辑，并支持由集成服务提供配置与文件读取。

#### Scenario: 编辑服务可用
- **WHEN** 系统启动
- **THEN** OnlyOffice 服务对外提供编辑能力

#### Scenario: 集成服务配置
- **WHEN** 集成服务提供 DocEditor 配置并可访问文件下载地址
- **THEN** 编辑器可加载并编辑文档

### Requirement: 内网无鉴权
系统 MUST 默认不启用鉴权（仅限内网环境）。

#### Scenario: 默认访问
- **WHEN** 内网客户端访问编辑服务
- **THEN** 可直接访问编辑能力而无需鉴权

