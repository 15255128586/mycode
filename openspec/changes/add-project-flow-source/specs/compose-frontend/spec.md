## ADDED Requirements
### Requirement: Flow source selection
前端 MUST 在新建项目时提供流程来源选择（默认模板或复制已有项目）。

#### Scenario: Choose default template
- **WHEN** 用户选择默认模板并提交
- **THEN** 新项目使用默认模板的 `flow_json`

#### Scenario: Choose copy source
- **WHEN** 用户选择复制已有项目并提交
- **THEN** 新项目使用来源项目的 `flow_json`

### Requirement: Workspace schema persistence
前端 MUST 在项目流程中保存节点工作台 schema（字段定义与模板引用）。

#### Scenario: Save workspace schema
- **WHEN** 项目流程保存 `flow_json`
- **THEN** 系统保留节点的字段定义与模板引用
