# Change: Project service foundation for persistent materials

## Why
任务工作区的上传资料目前只保存在前端内存中，刷新即丢失。需要引入项目与项目定义模型，并在服务端持久化项目节点与资料绑定关系。

## What Changes
- 新增 project-service，提供项目定义与项目的持久化模型与 API。
- 新增 pgdb 微服务（PostgreSQL），为 project-service 提供持久化数据库。
- 在 project-service 中存储项目节点资料绑定（file_id + node_key）。
- 任务工作区通过 project-service 读取/写入节点资料绑定，实现上传持久化。

## Impact
- Affected specs: project-service, pgdb-service, compose-frontend
- Affected code: new services/project-service; new services/pgdb; services/compose-frontend/src/pages/TaskWorkspace.jsx
