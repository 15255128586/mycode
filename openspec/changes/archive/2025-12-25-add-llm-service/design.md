## Context
需要一个独立服务统一调用 ModelScope OpenAI 兼容接口，提供标准化的 HTTP API，供其他服务调用。

## Goals / Non-Goals
- Goals:
  - 提供 /chat API 代理到 ModelScope
  - 支持流式与非流式输出
  - 支持 Docker 部署与环境变量配置
- Non-Goals:
  - 鉴权、限流、缓存（后续再加）
  - Prompt 管理或多模型路由

## Decisions
- Decision: 使用 FastAPI 作为服务框架，OpenAI SDK 调用 ModelScope 接口
- Decision: API Key 通过环境变量注入，不落地到代码/镜像

## Risks / Trade-offs
- 依赖外部 API 的稳定性 → 需明确错误返回与超时策略

## Migration Plan
- 新增服务并独立部署，不影响现有 Compose Service

## Open Questions
- 暂无
