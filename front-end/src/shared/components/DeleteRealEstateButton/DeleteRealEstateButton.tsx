import { useState } from 'react';
import axios from 'axios';
import './DeleteRealEstateButton.scss';

interface DeleteRealEstateButtonProps {
  realestateId: number | string;
  canDelete?: boolean;
  onDeleted?: () => void;
}

export function DeleteRealEstateButton({ realestateId, canDelete = false, onDeleted }: DeleteRealEstateButtonProps) {
  const [busy, setBusy] = useState(false);

  if (!canDelete) return null;

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (busy) return;

    const ok = window.confirm('Are you sure you want to delete this listing? This action cannot be undone.');
    if (!ok) return;

    setBusy(true);
    try {
      await axios.delete(`https://localhost:7154/api/RealEstateMain/${realestateId}`);
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
    <button
      type="button"
      className="delete-re-btn"
      onClick={handleDelete}
      disabled={busy}
      title="Obriši"
      aria-label="Obriši"
    >
      <i className="fa-solid fa-trash" />
    </button>
  );
}
