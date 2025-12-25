## Context
Need a minimal UI to exercise the existing doc-ingest and compose services.

## Goals / Non-Goals
- Goals:
  - React UI in dev mode
  - Upload project/reference files
  - Review/edit extracted items and confirm
  - Trigger compose and preview output
- Non-Goals:
  - Auth, multi-user, or persistence in the UI
  - Full OnlyOffice/MinIO integration

## Decisions
- Decision: Use Vite React for fast dev
- Decision: Configure service URLs via env

## Risks / Trade-offs
- Dev-mode only: not optimized for production deployment

## Migration Plan
- Add as separate service; no changes to backend services

## Open Questions
- None
