## ADDED Requirements

### Requirement: 文件列表页面
系统 MUST 提供文件列表页面，展示可编辑文件并支持上传。

#### Scenario: 文件列表展示
- **WHEN** 用户进入文件列表页面
- **THEN** 系统展示文件条目与上传入口

#### Scenario: 文件上传
- **WHEN** 用户上传文件
- **THEN** 列表刷新并显示新文件

### Requirement: 打开编辑器
系统 MUST 提供打开 OnlyOffice 编辑器的入口。

#### Scenario: 跳转编辑
- **WHEN** 用户点击文件条目
- **THEN** 系统跳转到 OnlyOffice 编辑页面
