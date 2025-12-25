# Change: Add Compose Frontend (MVP)

## Why
Current workflow is API-only and hard to validate end-to-end. A minimal React UI will enable upload, review, confirm, and draft generation from the browser.

## What Changes
- Add a React frontend in development mode (Docker)
- Provide UI for project/reference upload, item editing, confirmation, and compose generation
- Configure service base URLs via environment variables

## Impact
- Affected specs: compose-frontend
- Affected code: services/compose-frontend (new)
