## ADDED Requirements
### Requirement: Project flow auto layout
系统 MUST 在项目流程图页面提供自动排布能力。

#### Scenario: 初始布局
- **WHEN** 用户进入项目流程图页面
- **THEN** 系统按流程方向自动计算节点位置并渲染

#### Scenario: 用户触发重排
- **WHEN** 用户触发流程图重排操作
- **THEN** 系统重新计算节点位置并更新连线布局

### Requirement: Project flow grid snapping
系统 MUST 将流程图节点限制在固定网格位置，并在拖动后自动对齐。

#### Scenario: 拖动对齐
- **WHEN** 用户拖动节点并释放
- **THEN** 节点自动吸附到最近的网格位置

#### Scenario: 自动排布对齐
- **WHEN** 系统完成自动排布
- **THEN** 节点位置对齐到网格并保持均匀间距
