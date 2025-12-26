## ADDED Requirements
### Requirement: Persist project flow JSON
项目服务 MUST 支持在项目数据中存储与返回 `flow_json`。

#### Scenario: Create with flow
- **WHEN** 客户端创建项目并提供 `flow_json`
- **THEN** 系统保存并在返回项目数据中包含 `flow_json`

#### Scenario: Update flow
- **WHEN** 客户端更新项目的 `flow_json`
- **THEN** 系统保存更新并返回最新 `flow_json`

#### Scenario: Load flow
- **WHEN** 客户端获取项目列表或详情
- **THEN** 返回的项目数据包含 `flow_json`（若存在）
