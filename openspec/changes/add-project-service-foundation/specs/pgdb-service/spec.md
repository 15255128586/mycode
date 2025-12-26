## ADDED Requirements
### Requirement: PostgreSQL 服务
系统 MUST 提供 PostgreSQL 数据库服务用于持久化项目数据。

#### Scenario: 服务启动
- **WHEN** 使用 Docker Compose 启动 pgdb
- **THEN** PostgreSQL 服务可被依赖服务连接

#### Scenario: 数据持久化
- **WHEN** 数据库容器重启
- **THEN** 已写入数据仍可被读取
