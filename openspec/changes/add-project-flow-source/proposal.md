# Change: Add project flow source selection and workspace schema

## Why
新建项目需要选择流程来源（默认模板或复制已有项目），并确保节点的字段定义与模板引用可被复制，而字段值与项目文档不被复制。

## What Changes
- Allow project creation to choose a flow source: default template or copy existing project.
- Persist node workspace schema (fields + template references) inside `flow_json`.
- Keep node field values and project documents out of `flow_json` to avoid copying values.

## Impact
- Affected specs: project-service, compose-frontend
- Affected code: services/project-service/app/*, services/compose-frontend/src/pages/ProjectListV6.jsx, services/compose-frontend/src/state/projects.jsx
