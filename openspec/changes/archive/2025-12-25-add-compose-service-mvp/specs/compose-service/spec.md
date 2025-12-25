## ADDED Requirements

### Requirement: 输入契约（强约束）
系统 MUST 要求受控生成具备明确输入契约：
- target_doc_kind（可为空；未知状态必须可表达，细节 TBD）
- references[]（写法参考；至少 1 条；当 target_doc_kind 已知时必须一致，未知时 references 必须标记为未知或自带 doc_kind）
- facts[]（项目事实清单或等价说明；至少 1 条）
- output_format（模板或章节清单；默认与覆盖规则 TBD）

#### Scenario: 输入齐全
- **WHEN** 提交满足契约的输入
- **THEN** 系统进入生成流程并记录本次输入快照

#### Scenario: 输入缺失
- **WHEN** 输入契约缺失关键字段或 references 与 target_doc_kind 不一致
- **THEN** 系统拒绝生成并返回缺失/不一致项清单（至少包含字段名）

### Requirement: 初稿生成
系统 MUST 在明确的写法参考与项目事实输入下生成可编辑初稿（格式规则 TBD）。

#### Scenario: 生成初稿
- **WHEN** 输入契约满足
- **THEN** 输出一份可编辑初稿并可被后续版本迭代

### Requirement: 引用记录（文档级）
系统 MUST 记录每次生成使用的 references 与 facts，并可追溯到本次初稿版本。

#### Scenario: 记录引用
- **WHEN** 生成完成
- **THEN** 系统保存 references 与 facts 的文档级引用关系

### Requirement: 版本管理
系统 MUST 支持对同一过程文件的多版本迭代（draft_v1 / v2 / v3）。

#### Scenario: 新版本生成
- **WHEN** 用户发起再次生成或修订
- **THEN** 系统创建新版本并保留历史版本

### Requirement: 失败与不确定提示
系统 MUST 在生成失败或不确定时返回明确提示（返回字段与判定规则 TBD）。

#### Scenario: 生成失败
- **WHEN** 生成失败或输入不足以支撑稳定输出
- **THEN** 系统返回失败原因或缺失信息提示（格式 TBD）
