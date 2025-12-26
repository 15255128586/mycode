# Change: Task workspace OnlyOffice editor

## Why
任务工作区目前使用纯文本编辑，无法直接完成合同/请示等交付物的在线编辑需求。

## What Changes
- 任务工作区编辑区嵌入 OnlyOffice 编辑器。
- 编辑器通过文件管理服务的 `files/{id}/editor` 页面加载文档。
- 当缺少文档标识时显示空状态提示。
- 前端增加文件管理服务的可配置 base URL。

## Impact
- Affected specs: compose-frontend
- Affected code: services/compose-frontend/src/pages/TaskWorkspace.jsx, services/compose-frontend/src/App.css
