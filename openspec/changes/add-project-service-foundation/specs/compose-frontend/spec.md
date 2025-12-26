## ADDED Requirements
### Requirement: 任务工作区资料持久化
系统 MUST 通过 project-service 持久化任务工作区上传资料，并在刷新后恢复显示。

#### Scenario: 上传资料持久化
- **WHEN** 用户在任务工作区上传文件
- **THEN** 系统创建节点资料绑定并在刷新后仍可展示

#### Scenario: 读取节点资料
- **WHEN** 用户进入任务工作区
- **THEN** 系统从 project-service 拉取该节点绑定的资料列表
