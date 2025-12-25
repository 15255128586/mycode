# doc-ingest-service Specification

## Purpose
TBD - created by archiving change add-doc-ingest-service. Update Purpose after archive.
## Requirements
### Requirement: 项目资料入口
系统 MUST 提供项目资料上传入口，仅用于生成 facts。

#### Scenario: 项目资料解析
- **WHEN** 用户上传项目资料文件
- **THEN** 系统解析并生成 facts 供后续写作使用

### Requirement: 参考写法入口
系统 MUST 提供参考写法上传入口，仅用于生成 references。

#### Scenario: 参考写法解析
- **WHEN** 用户上传参考写法文件
- **THEN** 系统解析并生成 references 供后续写作使用

### Requirement: 多格式支持
系统 MUST 支持 PDF/Word/Markdown/Excel 文件解析。

#### Scenario: 多格式输入
- **WHEN** 用户上传上述任一格式文件
- **THEN** 系统可提取文本内容并进入抽取流程

### Requirement: LLM 抽取
系统 MUST 调用 LLM Service 进行 facts/references 抽取。

#### Scenario: LLM 抽取调用
- **WHEN** 解析得到文本内容
- **THEN** 系统调用 LLM Service 并返回结构化结果

### Requirement: 可追溯引用
系统 MUST 保存每条 fact/reference 的原文定位信息（页码/段落/行号或等价定位）。

#### Scenario: 原文定位
- **WHEN** 生成 facts/references
- **THEN** 系统保存对应的原文定位信息

### Requirement: 人工确认
系统 MUST 支持在入库前对解析结果进行人工确认与编辑。

#### Scenario: 人工确认流程
- **WHEN** 解析完成
- **THEN** 用户可编辑并确认结果后再写入存储

