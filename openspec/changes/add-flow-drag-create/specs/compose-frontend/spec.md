## ADDED Requirements
### Requirement: Drag-to-create flow node
系统 MUST 支持从已有节点拖出连线并在空白处创建新节点。

#### Scenario: 拖线到空白创建
- **WHEN** 用户从节点拖出连线并释放到空白处
- **THEN** 系统弹出创建节点的输入窗口

#### Scenario: 完成创建
- **WHEN** 用户在弹窗中确认创建
- **THEN** 系统创建节点并自动与拖出连线的源节点连接

#### Scenario: 取消创建
- **WHEN** 用户取消创建
- **THEN** 系统不创建节点且不新增连线
