import { useState } from 'react';
import './CompanyLogo.scss';

const MAX_MB = 5;
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp'];

interface CompanyLogoProps {
  onLogoSelected: (file: File | null) => void;
}

export function CompanyLogo({ onLogoSelected }: CompanyLogoProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState('');

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setError('');
    const file = e.target.files?.[0];
    if (!file) {
      setPreview(null);
      onLogoSelected(null);
      return;
    }

    if (!ALLOWED.includes(file.type)) {
      setError('Only JPEG, PNG and WebP images are allowed.');
      e.target.value = '';
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setError(`Logo must be smaller than ${MAX_MB} MB.`);
      e.target.value = '';
      return;
    }

    setPreview(URL.createObjectURL(file));
    onLogoSelected(file);
  }

  function remove() {
    setPreview(null);
    onLogoSelected(null);
    setError('');
  }

  return (
    <div className="company-logo-step">
      <h2>Company logo</h2>
      <p className="logo-hint">Optional — add your company logo (JPEG, PNG or WebP, up to {MAX_MB} MB).</p>

      {preview ? (
        <div className="logo-preview">
          <img src={preview} alt="Logo preview" />
          <button type="button" className="logo-remove" onClick={remove}>
            Remove
          </button>
        </div>
      ) : (
        <label className="logo-drop">
          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleChange} />
          <span>Choose an image</span>
        </label>
      )}

      {error && <span className="field-error">{error}</span>}
    </div>
  );
}
