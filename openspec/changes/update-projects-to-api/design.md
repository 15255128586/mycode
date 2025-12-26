## Context
项目列表与详情目前依赖前端本地数据，无法持久化。项目服务已存在但字段与接口不足。

## Goals / Non-Goals
- Goals:
  - 项目数据统一通过 project-service 持久化
  - 保持前端现有 UI 行为（如归档、删除、编辑）
- Non-Goals:
  - 不引入复杂的权限或审批流程
  - 不实现完整项目模板与流程定义

## Decisions
- Decision: 使用项目编号作为 project.id（前端 code 字段），避免引入额外映射字段。
- Decision: project-service 新增字段 `due/department/desc/health/progress/archived/archived_at`。
- Decision: 采用启动时补齐缺失列的轻量迁移方案，避免引入迁移框架。

## Risks / Trade-offs
- 项目数据依赖 API 可用性；当服务不可用时列表为空。
- 轻量迁移仅补列，不处理历史数据清洗。

## Migration Plan
1. 服务启动时检测缺失列并执行 `ALTER TABLE ADD COLUMN`。
2. 前端使用 API 读取/写入项目数据，移除本地种子数据。

## Open Questions
- 是否需要在后端生成项目编号（当前由前端生成）。
