# compose-frontend Specification

## Purpose
TBD - created by archiving change add-compose-frontend. Update Purpose after archive.
## Requirements
### Requirement: Upload UI
System MUST provide a UI to upload project and reference files.

#### Scenario: Upload project file
- **WHEN** user uploads a project file
- **THEN** system sends it to the doc-ingest project endpoint

#### Scenario: Upload reference file
- **WHEN** user uploads a reference file
- **THEN** system sends it to the doc-ingest reference endpoint

### Requirement: Confirm UI
System MUST allow users to review, edit, and confirm extracted items.

#### Scenario: Confirm items
- **WHEN** user edits items and confirms
- **THEN** system sends the updated items to the confirm endpoint

### Requirement: Compose UI
System MUST allow users to trigger compose generation and view the draft.

#### Scenario: Generate draft
- **WHEN** user triggers compose
- **THEN** system calls compose service and renders the draft content

### Requirement: Configurable Service URLs
System MUST allow configuring backend base URLs via environment variables.

#### Scenario: Custom base URLs
- **WHEN** env variables are set
- **THEN** UI uses them for API calls

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

