## MODIFIED Requirements

### Requirement: 默认桶
系统 MUST 预置项目资料、参考写法与可编辑文件的存储桶。

#### Scenario: 桶初始化
- **WHEN** MinIO 启动完成
- **THEN** 存在 `projects`、`references` 与 `documents` 三个桶
