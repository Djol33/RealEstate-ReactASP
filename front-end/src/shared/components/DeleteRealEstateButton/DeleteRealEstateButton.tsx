import { useState } from 'react';
import axios from 'axios';
import { ConfirmDialog } from '../ConfirmDialog/ConfirmDialog';
import { API_URL } from '../../../config';
import './DeleteRealEstateButton.scss';

interface DeleteRealEstateButtonProps {
  realestateId: number | string;
  canDelete?: boolean;
  onDeleted?: () => void;
}

export function DeleteRealEstateButton({ realestateId, canDelete = false, onDeleted }: DeleteRealEstateButtonProps) {
  const [busy, setBusy] = useState(false);
  const [confirming, setConfirming] = useState(false);

  if (!canDelete) return null;

  function openConfirm(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (busy) return;
    setConfirming(true);
  }

  async function handleDelete() {
    setConfirming(false);
    setBusy(true);
    try {
      await axios.delete(`${API_URL}/api/RealEstateMain/${realestateId}`);
      onDeleted?.();
    } catch (err: any) {
      if (err.response?.status === 403) {
        alert('You do not have permission to delete this listing.');
      } else {
        alert('Error deleting. Please try again.');
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        type="button"
        className="delete-re-btn"
        onClick={openConfirm}
        disabled={busy}
        title="Obriši"
        aria-label="Obriši"
      >
        <i className="fa-solid fa-trash" />
      </button>

      {confirming && (
        <ConfirmDialog
          title="Delete listing"
          message="Are you sure you want to delete this listing? This action cannot be undone."
          confirmLabel="Delete"
          danger
          onConfirm={handleDelete}
          onCancel={() => setConfirming(false)}
        />
      )}
    </>
  );
}
