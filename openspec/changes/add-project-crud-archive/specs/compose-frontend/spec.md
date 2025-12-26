## ADDED Requirements
### Requirement: 项目管理 CRUD
系统 MUST 提供项目的创建、查看与编辑能力。

#### Scenario: 创建项目
- **WHEN** 用户在项目管理页提交新项目
- **THEN** 系统创建项目并展示在列表中

#### Scenario: 编辑项目
- **WHEN** 用户在项目详情页编辑并保存
- **THEN** 系统更新项目并在列表与详情同步展示

#### Scenario: 查看项目
- **WHEN** 用户进入项目列表或详情
- **THEN** 系统展示对应项目数据

### Requirement: 项目归档与删除
系统 MUST 支持项目归档、恢复与删除。

#### Scenario: 归档项目
- **WHEN** 用户归档项目
- **THEN** 项目从默认列表隐藏且可在已归档列表中查看

#### Scenario: 恢复项目
- **WHEN** 用户恢复已归档项目
- **THEN** 项目回到默认列表

#### Scenario: 删除项目
- **WHEN** 用户确认删除项目
- **THEN** 系统永久移除该项目
