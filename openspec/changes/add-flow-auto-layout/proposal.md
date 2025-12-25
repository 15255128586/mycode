# Change: Add auto layout for project flow charts

## Why
当前流程图页面需要手工摆放节点，影响阅读效率与流程可维护性。自动排布可以提升初始呈现质量，并为用户提供一键整理的能力。

## What Changes
- Add automatic layout computation for project flow charts on initial render.
- Provide a user-triggered re-layout action to tidy nodes after edits.
- Add a lightweight layout dependency to support DAG-style layout.
- Snap nodes to a fixed grid after drag and layout so positions align like app icons.

## Impact
- Affected specs: compose-frontend
- Affected code: services/compose-frontend/src/pages/ProjectFlowApple.jsx, services/compose-frontend/package.json
