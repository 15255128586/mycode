# Change: Add LLM Service

## Why
需要一个独立的 LLM 服务，用于统一接入模型能力并容器化运行，便于与 Compose Service 解耦与后续扩展。

## What Changes
- 新增 LLM Service（HTTP API）封装对 ModelScope OpenAI 兼容接口的调用
- 支持流式与非流式输出
- 通过环境变量配置模型与 API Key
- Docker 化部署与 Compose 编排

## Impact
- Affected specs: llm-service
- Affected code: services/llm-service (新增)
