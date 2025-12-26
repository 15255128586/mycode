## ADDED Requirements
### Requirement: Project flow source on create
项目服务 MUST 支持在创建项目时保存流程来源生成的 `flow_json`。

#### Scenario: Create with default template
- **WHEN** 客户端创建项目并选择默认模板
- **THEN** 系统保存默认模板的 `flow_json`

#### Scenario: Create by copying project
- **WHEN** 客户端创建项目并选择复制已有项目
- **THEN** 系统保存来源项目的 `flow_json`

### Requirement: Flow workspace schema
项目服务 MUST 支持在 `flow_json` 中存储节点工作台 schema（字段定义与模板引用）。

#### Scenario: Workspace schema stored
- **WHEN** 客户端提交节点工作台 schema
- **THEN** 系统保存到 `flow_json` 中并在读取时返回
