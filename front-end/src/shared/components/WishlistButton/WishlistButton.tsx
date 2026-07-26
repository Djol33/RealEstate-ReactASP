import { useState } from 'react';
import axios from 'axios';
import './WishlistButton.scss';

interface WishlistButtonProps {
  realestateId: number | string;
  initialSaved?: boolean;
}

function isLoggedIn() {
  return !!localStorage.getItem('user');
}

export function WishlistButton({ realestateId, initialSaved = false }: WishlistButtonProps) {
  const [saved, setSaved] = useState(initialSaved);
  const [busy, setBusy] = useState(false);

  if (!isLoggedIn()) return null;

  async function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (busy) return;

    setBusy(true);
    const next = !saved;
    setSaved(next);
    try {
      await axios.post(`https://localhost:7154/api/Wishlist/${realestateId}`);
    } catch {
      setSaved(!next);
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      className={`wishlist-btn ${saved ? 'is-saved' : ''}`}
      onClick={toggle}
      title={saved ? 'Remove from saved' : 'Save'}
      aria-label={saved ? 'Remove from saved' : 'Save'}
    >
      <i className={saved ? 'fa-solid fa-heart' : 'fa-regular fa-heart'} />
    </button>
  );
}
