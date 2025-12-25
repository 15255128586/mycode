## ADDED Requirements

### Requirement: PostgreSQL 持久化
系统 MUST 使用 PostgreSQL 作为 Compose Service 的持久化存储，并通过 SQLAlchemy 进行访问。

#### Scenario: 草稿写入
- **WHEN** 生成草稿并持久化
- **THEN** 草稿、引用与事实记录写入 PostgreSQL

### Requirement: Docker Compose 数据库服务
系统 MUST 在 Docker Compose 中提供 PostgreSQL 服务，且默认暴露 5432 端口。

#### Scenario: 容器化运行
- **WHEN** 使用 Docker Compose 启动
- **THEN** Compose Service 可连接 PostgreSQL 且外部可访问 5432 端口
