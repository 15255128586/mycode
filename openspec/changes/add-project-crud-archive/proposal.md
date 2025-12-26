# Change: Add project CRUD, archive, and delete

## Why
当前项目管理页面为静态展示，无法在系统内维护项目，误建项目也无法处理。

## What Changes
- 新增项目创建、查看、编辑、归档、恢复与删除的 UI 交互
- 归档项目默认从列表隐藏，可切换查看
- 删除操作需要二次确认

## Impact
- Affected specs: compose-frontend
- Affected code: services/compose-frontend/src/pages/ProjectList.jsx, services/compose-frontend/src/pages/ProjectDetail.jsx, services/compose-frontend/src/data/projects.js
