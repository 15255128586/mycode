# Change: Update primary navigation for project owner workflow

## Why
项目负责人/办理人员需要更聚焦的入口，当前时间线/资源/报告/设置与实际使用路径不匹配，导致导航噪音偏高。

## What Changes
- 更新一级导航为：项目管理、我的待办、自动报告
- 新增“我的待办”页面框架（聚合待处理事项的展示骨架）
- 新增“自动报告”页面框架（周报/月报生成的页面骨架）
- 移除时间线/资源/报告/设置页面入口

## Impact
- Affected specs: compose-frontend
- Affected code: src/App.jsx, src/pages/*, src/App.css
