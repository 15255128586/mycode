## Context
当前项目与节点信息只存在前端种子数据中，任务工作区上传资料无法跨刷新保留。需要服务端持久化项目定义、项目实例及节点资料绑定。

## Goals / Non-Goals
- Goals:
  - 提供项目定义与项目实例的持久化模型
  - 持久化节点资料绑定并供任务工作区查询
  - 以最少 API 满足“上传后不丢失”的核心需求
- Non-Goals:
  - 本次不实现完整流程审批、权限体系
  - 不做跨服务复杂同步（仅记录 file_id）

## Decisions
- Decision: 新增 project-service，默认连接 pgdb 微服务（PostgreSQL），可通过 DATABASE_URL 覆盖。
  - Why: 项目与节点是核心域对象，不应附着在文件管理服务上，且需要持久化数据库。
- Decision: pgdb 微服务使用独立 Docker Compose，提供固定端口与持久化卷。
  - Why: 便于本地开发启动与复用，避免与业务服务耦合。
- Decision: 项目定义使用 nodes_json 保存流程节点模板。
  - Why: 初期简化结构，避免过早拆分为多表。
- Decision: 节点资料绑定表记录 project_id、node_key、file_id 与 role。
  - Why: 满足“节点级资料库”与“项目资料库”区分，并可支持模板/参考等角色。

## Risks / Trade-offs
- nodes_json 变更缺乏约束，后续若需更细粒度查询可能要引入 definition_nodes 表。
- file_id 只存引用，文件元数据需从 file-manager-service 获取。

## Migration Plan
- 初始化 project-service 并创建数据库表。
- 前端任务工作区改为读取/写入 project-service 的资料绑定。

## Open Questions
- 项目定义与项目的创建由哪个入口触发（后续补充）
- node_key 命名规则是否直接复用现有流程图节点 id
