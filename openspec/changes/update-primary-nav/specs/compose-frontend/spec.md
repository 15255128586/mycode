## ADDED Requirements
### Requirement: Primary Navigation
系统 MUST 提供一级导航入口，包含“项目管理”“我的待办”“自动报告”。

#### Scenario: Show navigation entries
- **WHEN** 用户打开侧边栏
- **THEN** 系统展示上述三个入口且可进入对应页面

### Requirement: 我的待办页面框架
系统 MUST 提供“我的待办”页面，用于聚合展示待处理事项的页面框架。

#### Scenario: Open My Todo page
- **WHEN** 用户进入“我的待办”页面
- **THEN** 系统展示待办列表区域与空状态提示

### Requirement: 自动报告页面框架
系统 MUST 提供“自动报告”页面，用于展示周报/月报生成的页面框架。

#### Scenario: Open Auto Report page
- **WHEN** 用户进入“自动报告”页面
- **THEN** 系统展示周报与月报区域及生成入口占位
