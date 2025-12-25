## ADDED Requirements

### Requirement: LLM Service API
系统 MUST 提供独立的 LLM Service，并暴露 /chat 接口用于调用模型。

#### Scenario: 非流式请求
- **WHEN** 客户端发送非流式请求
- **THEN** 系统返回完整的模型响应

#### Scenario: 流式请求
- **WHEN** 客户端发送流式请求
- **THEN** 系统以流式方式返回增量响应

### Requirement: 模型接入配置
系统 MUST 通过环境变量配置 ModelScope 接口地址、API Key 和模型 ID。

#### Scenario: 配置缺失
- **WHEN** 必要环境变量缺失
- **THEN** 系统拒绝启动并返回明确错误

### Requirement: 容器化部署
系统 MUST 提供 Dockerfile 与 Docker Compose 配置以便容器化部署。

#### Scenario: Docker 启动
- **WHEN** 使用 Docker Compose 启动
- **THEN** LLM Service 可对外提供 /chat 接口
