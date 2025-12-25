## ADDED Requirements

### Requirement: Upload UI
System MUST provide a UI to upload project and reference files.

#### Scenario: Upload project file
- **WHEN** user uploads a project file
- **THEN** system sends it to the doc-ingest project endpoint

#### Scenario: Upload reference file
- **WHEN** user uploads a reference file
- **THEN** system sends it to the doc-ingest reference endpoint

### Requirement: Confirm UI
System MUST allow users to review, edit, and confirm extracted items.

#### Scenario: Confirm items
- **WHEN** user edits items and confirms
- **THEN** system sends the updated items to the confirm endpoint

### Requirement: Compose UI
System MUST allow users to trigger compose generation and view the draft.

#### Scenario: Generate draft
- **WHEN** user triggers compose
- **THEN** system calls compose service and renders the draft content

### Requirement: Configurable Service URLs
System MUST allow configuring backend base URLs via environment variables.

#### Scenario: Custom base URLs
- **WHEN** env variables are set
- **THEN** UI uses them for API calls
