## ADDED Requirements

### Requirement: OnlyOffice 编辑服务
系统 MUST 提供 OnlyOffice DocumentServer 用于 Office 文档在线编辑。

#### Scenario: 编辑服务可用
- **WHEN** 系统启动
- **THEN** OnlyOffice 服务对外提供编辑能力

### Requirement: 内网无鉴权
系统 MUST 默认不启用鉴权（仅限内网环境）。

#### Scenario: 默认访问
- **WHEN** 内网客户端访问编辑服务
- **THEN** 可直接访问编辑能力而无需鉴权
