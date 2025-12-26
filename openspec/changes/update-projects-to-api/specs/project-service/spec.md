## ADDED Requirements
### Requirement: 项目元数据持久化
系统 MUST 持久化项目元数据（负责人、截止日期、部门、描述、健康度、进度、归档状态）。

#### Scenario: 创建项目包含元数据
- **WHEN** 客户端创建项目并提交元数据字段
- **THEN** 系统保存并在响应中返回这些字段

#### Scenario: 查询项目返回元数据
- **WHEN** 客户端查询项目列表或详情
- **THEN** 系统返回项目元数据字段

### Requirement: 项目更新与归档
系统 MUST 支持更新项目字段、归档/恢复以及删除项目。

#### Scenario: 更新项目
- **WHEN** 客户端提交项目更新
- **THEN** 系统持久化并返回更新后的项目

#### Scenario: 归档项目
- **WHEN** 客户端将 archived 设为 true
- **THEN** 系统设置 archived_at 并在响应中返回

#### Scenario: 删除项目
- **WHEN** 客户端请求删除项目
- **THEN** 系统删除并在列表中不再返回该项目
