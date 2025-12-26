export default function ConfirmDialog({
  title,
  message,
  confirmLabel = "确认",
  cancelLabel = "取消",
  onConfirm,
  onCancel,
}) {
  return (
    <div className="project-modal" role="dialog" aria-modal="true" onClick={onCancel}>
      <div
        className="project-modal-card"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="project-modal-title">{title}</div>
        {message ? <div className="project-modal-message">{message}</div> : null}
        <div className="project-modal-actions">
          <button type="button" className="ghost-button" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button type="button" className="danger-button" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
