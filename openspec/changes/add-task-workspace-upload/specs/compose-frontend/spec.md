## ADDED Requirements
### Requirement: 任务工作区上传资料
系统 MUST 在任务工作区提供上传资料入口，并通过 file-manager-service 上传文件后加入材料列表。

#### Scenario: 上传资料成功
- **WHEN** 用户在任务工作区上传文件
- **THEN** 系统将文件上传并在材料列表中显示新条目

#### Scenario: 上传资料失败
- **WHEN** 上传文件失败
- **THEN** 系统提示失败并允许用户重试
