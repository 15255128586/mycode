## ADDED Requirements
### Requirement: Task Workspace Page
系统 MUST 提供任务节点的工作空间页面，用于合同等文档的起草与处理。

#### Scenario: Open task workspace
- **WHEN** 用户在项目流程图中选择任务节点
- **THEN** 系统打开该任务的工作空间页面

### Requirement: Workspace Layout
系统 MUST 在工作空间页面展示编辑区、参考材料区与节点信息区。

#### Scenario: Render workspace sections
- **WHEN** 用户打开任务工作空间
- **THEN** 页面显示编辑区域、参考材料列表与节点状态/下一步提示

### Requirement: Cross-Project Reference Materials
系统 MUST 在参考材料中展示跨项目材料，并标识为只读引用。

#### Scenario: View cross-project materials
- **WHEN** 用户查看项目资料库
- **THEN** 系统展示其他项目材料且标记为只读

### Requirement: Material Preview Panel
系统 MUST 在参考材料区域提供材料预览摘要与关键字段提示。

#### Scenario: Preview selected material
- **WHEN** 用户选择一条材料
- **THEN** 系统展示该材料的摘要与关键字段

### Requirement: Field Insertion
系统 MUST 支持将材料字段插入到合同编辑内容中，并附带引用标记。

#### Scenario: Insert material field
- **WHEN** 用户在材料预览中点击字段插入
- **THEN** 系统将字段内容插入编辑区并标记引用来源
