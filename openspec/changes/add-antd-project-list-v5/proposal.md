# Change: Add Ant Design based Project List V5

## Why
需要验证成熟 UI 组件库在项目管理页的表现与开发效率，特别是表格、筛选与操作区。

## What Changes
- 在 compose-frontend 引入 Ant Design 依赖
- 新增项目管理 V5 页面，基于 Ant Design 组件实现列表与操作
- 侧边栏新增 V5 入口并提供新路由

## Impact
- Affected specs: compose-frontend
- Affected code: services/compose-frontend/src/App.jsx, services/compose-frontend/src/pages/ProjectListV5.jsx, services/compose-frontend/src/App.css, services/compose-frontend/package.json
