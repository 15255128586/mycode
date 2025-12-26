## ADDED Requirements
### Requirement: 项目列表使用服务端数据源
系统 MUST 使用 project-service 提供的 API 作为项目列表与详情的数据源，不再依赖本地种子数据。

#### Scenario: 加载项目列表
- **WHEN** 用户进入项目列表
- **THEN** 前端从 project-service 拉取项目列表并渲染

#### Scenario: 新建项目
- **WHEN** 用户提交新建项目表单
- **THEN** 前端调用 project-service 创建项目并刷新列表

#### Scenario: 归档或删除项目
- **WHEN** 用户归档、恢复或删除项目
- **THEN** 前端调用 project-service 并更新 UI
