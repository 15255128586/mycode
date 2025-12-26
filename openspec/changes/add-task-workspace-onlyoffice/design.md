## Context
任务工作区需要承载真实交付物编辑，现有 textarea 不满足在线文档编辑需求。系统已有 file-manager-service 与 OnlyOffice 服务，可提供编辑页面。

## Goals / Non-Goals
- Goals:
  - 在任务工作区内嵌 OnlyOffice 编辑器
  - 保持右侧材料栏不变
  - 支持基于文档标识加载对应文件
- Non-Goals:
  - 本次不新增文档上传/绑定流程
  - 不实现审批、版本管理或保存按钮

## Decisions
- Decision: 使用 file-manager-service 的 `/files/{id}/editor` HTML 页面，通过 iframe 嵌入。
  - Why: 可复用服务端现有 DocEditor 配置，前端无需自行拼装 DocsAPI。
- Decision: 文档标识来自任务工作区 URL 查询参数（`fileId`）。
  - Why: 便于后续由流程图或外部入口传递，无需立即改动数据模型。
- Decision: 当缺少 `fileId` 时显示空状态占位。
  - Why: 避免加载无效编辑器并给出明确指引。

## Risks / Trade-offs
- Cross-origin iframe 可能受限，需要保证 file-manager-service 与前端可互访。
- 若 fileId 未与任务绑定，用户需通过外部入口传入。

## Migration Plan
- 前端增加 iframe 与空状态。
- 运行时通过 URL 传入 fileId 测试。

## Open Questions
- 任务与文档的绑定来源后续由流程图/项目资料库补齐。
