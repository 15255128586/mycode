# Change: Task workspace material uploads

## Why
任务工作区当前只能查看参考材料，缺少直接上传资料的能力，导致用户需要离开上下文完成上传。

## What Changes
- 任务工作区提供上传资料入口，并将上传文件加入当前列表。
- 上传通过 file-manager-service 完成，记录文件 ID 以便后续打开编辑。
- 上传失败时给出轻量提示。

## Impact
- Affected specs: compose-frontend
- Affected code: services/compose-frontend/src/pages/TaskWorkspace.jsx, services/compose-frontend/src/App.css
