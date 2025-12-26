# Change: Persist project flow as flow_json

## Why
当前项目流程图只在前端内存中存在，刷新会丢失编辑结果。需要将流程节点与连线持久化到项目数据中，支撑项目详情页的可编辑与可恢复。

## What Changes
- Add a `flow_json` field to project data for storing nodes and edges.
- Project service exposes create/update/read support for `flow_json`.
- Frontend loads/saves `flow_json` for the project detail flow editor.

## Impact
- Affected specs: project-service, compose-frontend
- Affected code: services/project-service/app/*, services/compose-frontend/src/pages/ProjectDetail.jsx, services/compose-frontend/src/state/projects.jsx
