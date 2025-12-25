## 1. Spec Updates
- [x] Define file-manager-service requirements and scenarios
- [x] Update file-storage-service to add documents bucket
- [x] Update online-editor-service integration requirements
- [x] Update compose-frontend requirements for file list + editor launch

## 2. File Manager Service
- [x] Add FastAPI service with MinIO integration
- [x] Implement endpoints: list, upload, download, editor config
- [x] Provide Dockerfile and docker-compose.yml

## 3. Frontend Updates
- [x] Add File Library page with list + upload
- [x] Add action to open OnlyOffice editor for a file
- [x] Wire to file-manager-service endpoints

## 4. Validation
- [ ] Verify file upload & list
- [ ] Verify OnlyOffice editor opens with selected file
