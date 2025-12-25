# Change: File Manager MVP for OnlyOffice Editing

## Why
当前前端缺少文件库与编辑入口，无法上传文件并跳转到 OnlyOffice 编辑页面，导致文档编辑流程中断。

## What Changes
- 新增 File Manager Service，负责文件上传、列表、下载以及 OnlyOffice 编辑配置输出。
- 前端新增文件列表页面，支持上传文件并跳转到 OnlyOffice 编辑页面。
- MinIO 新增 documents 桶用于存放可编辑文件。

## Impact
- Affected specs: file-manager-service (new), compose-frontend, file-storage-service, online-editor-service
- Affected code: new service under services/file-manager-service, updates to services/compose-frontend
