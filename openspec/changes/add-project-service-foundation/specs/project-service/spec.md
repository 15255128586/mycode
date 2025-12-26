## ADDED Requirements
### Requirement: 项目定义存储
系统 MUST 提供项目定义的持久化存储，并支持记录流程节点模板。

#### Scenario: 创建项目定义
- **WHEN** 客户端提交项目定义（含 nodes_json）
- **THEN** 系统持久化并返回项目定义 ID

#### Scenario: 查询项目定义
- **WHEN** 客户端查询项目定义列表或详情
- **THEN** 系统返回已保存的项目定义数据

### Requirement: 项目实例存储
系统 MUST 提供项目实例的持久化存储，并与项目定义关联。

#### Scenario: 创建项目实例
- **WHEN** 客户端以项目定义 ID 创建项目
- **THEN** 系统保存项目实例并返回项目 ID

#### Scenario: 查询项目实例
- **WHEN** 客户端查询项目列表或详情
- **THEN** 系统返回项目实例数据（含 definition_id）

### Requirement: 节点资料绑定
系统 MUST 提供项目节点资料绑定能力，记录 file_id 与节点关系。

#### Scenario: 绑定资料到节点
- **WHEN** 客户端提交 project_id、node_key、file_id 与 role
- **THEN** 系统保存绑定记录

#### Scenario: 查询节点资料
- **WHEN** 客户端按 project_id 与 node_key 查询资料
- **THEN** 系统返回对应绑定列表
