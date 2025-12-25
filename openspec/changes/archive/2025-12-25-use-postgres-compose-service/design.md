## Context
Compose Service 当前使用 SQLite 文件存储，目标是切换到容器化 PostgreSQL，并通过 SQLAlchemy 统一访问层。

## Goals / Non-Goals
- Goals:
  - 使用 PostgreSQL 作为主存储
  - 通过 SQLAlchemy 管理模型与会话
  - Docker Compose 默认暴露 5432 端口便于代理/调试
- Non-Goals:
  - 数据迁移（旧 compose.db 可删除）
  - 复杂权限管理或多租户

## Decisions
- Decision: 使用 SQLAlchemy（同步）+ PostgreSQL 驱动（psycopg）
- Alternatives considered: 继续手写 SQL（耦合高、迁移成本大）

## Risks / Trade-offs
- 新增依赖与运行时服务增加部署复杂度 → 用 Docker Compose 管理

## Migration Plan
- 删除 SQLite 文件与相关逻辑
- 新增 PostgreSQL 服务与环境变量配置

## Open Questions
- 暂无
