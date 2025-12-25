# Change: Add drag-to-create nodes in project flow

## Why
当前流程图新增节点需要独立操作，拖线到空白处创建节点可以减少步骤，提高建图效率。

## What Changes
- Allow creating a node by dragging a connection from an existing node to an empty area.
- Show a lightweight creation prompt to select node type and title.
- Auto-connect the new node and snap to grid.

## Impact
- Affected specs: compose-frontend
- Affected code: services/compose-frontend/src/pages/ProjectFlowApple.jsx
