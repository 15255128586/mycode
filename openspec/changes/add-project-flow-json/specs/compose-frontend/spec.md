## ADDED Requirements
### Requirement: Load and save project flow JSON
前端 MUST 从项目数据中读取 `flow_json` 并用于流程图渲染与编辑。

#### Scenario: Initial load
- **WHEN** 用户进入项目详情页
- **THEN** 系统使用 `flow_json` 初始化流程图（若缺失则使用默认模板）

#### Scenario: Persist changes
- **WHEN** 用户编辑流程图并触发保存
- **THEN** 系统更新项目的 `flow_json`
