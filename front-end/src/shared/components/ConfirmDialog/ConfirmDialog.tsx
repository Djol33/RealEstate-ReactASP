import './ConfirmDialog.scss';

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  danger,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <div className="confirm-dialog-backdrop" onClick={onCancel}>
      <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="confirm-dialog-actions">
          <button type="button" className="btn-cancel" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button type="button" className={`btn-confirm ${danger ? 'danger' : ''}`} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
