# Change: Use PostgreSQL for Compose Service

## Why
当前 Compose Service 使用本地 SQLite，难以满足后续多服务/代理接入与持久化治理需求；需要统一到容器化 PostgreSQL。

## What Changes
- Compose Service 数据存储切换为 PostgreSQL（SQLAlchemy 管理连接与模型）
- Docker Compose 增加 PostgreSQL 服务并默认暴露 5432 端口
- 删除本地 SQLite 依赖与文件
- 更新运行文档与配置参数

## Impact
- Affected specs: compose-service
- Affected code: services/compose-service (db 层、模型、启动、测试)、docker-compose 配置
