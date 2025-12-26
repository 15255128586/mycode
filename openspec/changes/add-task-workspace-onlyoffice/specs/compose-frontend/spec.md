## ADDED Requirements
### Requirement: 任务工作区 OnlyOffice 编辑器
系统 MUST 在任务工作区的编辑区嵌入 OnlyOffice 编辑器，并通过文件管理服务提供的编辑页面加载文档。

#### Scenario: 工作区加载编辑器
- **WHEN** 用户进入任务工作区且提供文档标识
- **THEN** 编辑区显示 OnlyOffice 编辑器并加载对应文件

#### Scenario: 缺少文档标识
- **WHEN** 用户进入任务工作区且未提供文档标识
- **THEN** 编辑区显示空状态提示需要绑定文档
