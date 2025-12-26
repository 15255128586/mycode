## Context
项目详情页的流程图目前只在前端内存中维护，缺少持久化存储。后端已有项目服务与数据库，适合将流程数据作为项目字段保存。

## Goals / Non-Goals
- Goals: 持久化节点与连线；前端可恢复编辑状态；保持接口兼容。
- Non-Goals: 不引入复杂版本控制或节点级关系表。

## Decisions
- Decision: 在 `projects` 表新增 `flow_json` 字段，用 JSON 字符串保存节点与连线。
- Decision: 前端以 `flow_json` 作为单一来源，缺失时回退到默认 seed。

## Risks / Trade-offs
- 大 JSON 字段不便于查询 → 作为 MVP 可接受，后续可迁移到专用表。
- 并发覆盖风险 → 初期使用整表覆盖更新，后续可加版本或增量更新。

## Migration Plan
- 启动时自动补充 `flow_json` 列。
- API 支持读写 `flow_json` 并保持兼容旧字段。

## Open Questions
- 是否需要自动保存（节流）或手动保存按钮？
