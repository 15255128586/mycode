# Change: Move projects to API-backed storage

## Why
当前项目列表依赖前端本地种子数据，刷新后无法与服务端一致，也无法在多端共享。需要统一走 project-service 持久化接口，避免本地数据源。

## What Changes
- 前端项目列表/详情改为从 project-service 拉取与写入，不再使用本地 seed 数据。
- project-service 扩展项目元数据字段，并提供更新、归档与删除接口。
- 轻量迁移现有数据库表以支持新增字段（无破坏性）。

## Impact
- Affected specs: compose-frontend, project-service
- Affected code: services/compose-frontend/src/state/projects.jsx, services/compose-frontend/src/pages/ProjectListV6.jsx, services/compose-frontend/src/pages/ProjectDetail.jsx, services/project-service/app
