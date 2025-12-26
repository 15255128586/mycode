# Change: Add task workspace page for contract drafting

## Why
项目负责人/办理人员需要在任务节点内完成合同撰写并基于模板与参考材料编辑，当前缺少专门的工作空间承接这一步。

## What Changes
- 新增任务节点“工作空间”页面（全新页面布局）
- 支持从项目流程图的任务节点进入该页面
- 页面包含编辑区、参考材料区、节点信息与下一步提示
- 编辑区先用占位布局，为后续接入 Nimio/OnlyOffice 预留位置

## Impact
- Affected specs: compose-frontend
- Affected code: src/App.jsx, src/pages/ProjectDetail.jsx, src/pages/TaskWorkspace.jsx, src/App.css
