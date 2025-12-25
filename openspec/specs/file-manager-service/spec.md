# file-manager-service Specification

## Purpose
TBD - created by archiving change add-file-manager-mvp. Update Purpose after archive.
## Requirements
### Requirement: 文件列表与上传
系统 MUST 提供文件列表与上传接口，用于管理可编辑文档。

#### Scenario: 列表查询
- **WHEN** 客户端请求文件列表
- **THEN** 系统返回文件条目集合（含文件名、大小、更新时间、文件 ID）

#### Scenario: 上传文件
- **WHEN** 客户端上传 Office 文件
- **THEN** 系统存储文件并返回对应文件 ID 与元数据

### Requirement: 文件下载
系统 MUST 提供文件下载接口供编辑器读取。

#### Scenario: 下载文件
- **WHEN** 编辑器请求文件下载
- **THEN** 系统返回文件内容

### Requirement: OnlyOffice 编辑配置
系统 MUST 提供 OnlyOffice DocEditor 所需的配置数据。

#### Scenario: 获取编辑配置
- **WHEN** 客户端请求编辑配置
- **THEN** 系统返回包含 document.url 与 editorConfig 的配置 JSON

### Requirement: 容器化部署
系统 MUST 提供 Dockerfile 与 Docker Compose 配置以便容器化部署。

#### Scenario: Docker 启动
- **WHEN** 使用 Docker Compose 启动
- **THEN** File Manager Service 可对外提供服务

