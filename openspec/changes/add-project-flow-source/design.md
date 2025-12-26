## Context
节点工作台的字段和模板需要可配置并可被复制，但字段值与项目文档不应随复制迁移。

## Goals / Non-Goals
- Goals: 新建项目选择流程来源；复制时只带 schema 与模板引用；保持数据清晰可追溯。
- Non-Goals: 不实现字段值的跨项目复制；不实现模板编辑器。

## Decisions
- Decision: `flow_json` 中每个节点新增 `workspace`，仅包含 `fields` 与 `templates` 引用。
- Decision: 复制项目仅复制 `flow_json`；字段值与文档绑定保持独立存储。
- Decision: 默认模板以轻量内置 JSON 提供，确保创建流程无额外依赖。

## Risks / Trade-offs
- `flow_json` 体积增大 → 可接受；后续可拆分为专用表。
- 模板引用失效 → 在展示端提示缺失文件。

## Migration Plan
- 新项目创建时写入 `flow_json`（默认模板或复制来源）。
- 前端表单新增“流程来源”选择。

## Open Questions
- 暂无
