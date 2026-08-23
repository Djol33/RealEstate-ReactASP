import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import axios from 'axios';
import { API_URL } from '../../../../config';
import '../EditProfileForm/EditProfileForm.scss';
import './EditCompanyForm.scss';
import { isValidPib } from '../../../../shared/Validation/pib';

const MAX_MB = 5;
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp'];

type Inputs = {
  name: string;
  bip: string;
};

interface EditCompanyFormProps {
  initialData: { name: string; bip: string; logo: string | null };
  onSaved: () => void;
  onCancel: () => void;
}

export function EditCompanyForm({ initialData, onSaved, onCancel }: EditCompanyFormProps) {
  const [serverError, setServerError] = useState('');
  const [logo, setLogo] = useState<File | null>(null);
  const [logoError, setLogoError] = useState('');
  const [preview, setPreview] = useState<string | null>(
    initialData.logo?.startsWith('images/') ? `${API_URL}/${initialData.logo}` : null
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    mode: 'onTouched',
    defaultValues: { name: initialData.name ?? '', bip: initialData.bip ?? '' },
  });

  function handleLogo(e: React.ChangeEvent<HTMLInputElement>) {
    setLogoError('');
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED.includes(file.type)) {
      setLogoError('Only JPEG, PNG and WebP images are allowed.');
      e.target.value = '';
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setLogoError(`Logo must be smaller than ${MAX_MB} MB.`);
      e.target.value = '';
      return;
    }

    setLogo(file);
    setPreview(URL.createObjectURL(file));
  }

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setServerError('');
    try {
      const payload = new FormData();
      payload.append('name', data.name);
      payload.append('bip', data.bip);
      if (logo) payload.append('logo', logo);

      await axios.put(`${API_URL}/api/Profile/company`, payload);
      onSaved();
    } catch (err: any) {
      if (err.response?.status === 422) {
        const first = err.response.data?.errors?.[0]?.error;
        setServerError(first ?? 'Invalid data.');
      } else if (err.response?.status === 401) {
        setServerError('You must be logged in.');
      } else {
        setServerError('Error saving. Please try again.');
      }
    }
  };

  return (
    <div className="edit-profile-card">
      <h2>Edit company details</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="epf-field">
          <label htmlFor="name">Company name</label>
          <input
            id="name"
            maxLength={50}
            className={errors.name ? 'has-error' : ''}
            {...register('name', {
              required: 'Name is required.',
              minLength: { value: 2, message: 'At least 2 characters.' },
              maxLength: { value: 50, message: 'Company name cannot exceed 50 characters.' },
            })}
          />
          {errors.name && <span className="epf-error">{errors.name.message}</span>}
        </div>

        <div className="epf-field">
          <label htmlFor="bip">Tax ID (PIB)</label>
          <input
            id="bip"
            maxLength={9}
            inputMode="numeric"
            placeholder="9 digits, e.g. 104052135"
            className={errors.bip ? 'has-error' : ''}
            {...register('bip', {
              required: 'Tax ID (PIB) cannot be empty.',
              validate: (v: string) =>
                isValidPib(v) || 'Tax ID (PIB) must be 9 digits and a valid Serbian PIB.',
            })}
          />
          {errors.bip && <span className="epf-error">{errors.bip.message}</span>}
        </div>

        <div className="epf-field">
          <label>Logo</label>
          <div className="ecf-logo-row">
            {preview ? (
              <img className="ecf-logo-preview" src={preview} alt="Logo" />
            ) : (
              <div className="ecf-logo-placeholder">No logo</div>
            )}
            <label className="ecf-logo-btn">
              Change logo
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleLogo} />
            </label>
          </div>
          {logoError && <span className="epf-error">{logoError}</span>}
        </div>

        {serverError && <div className="epf-server-error">{serverError}</div>}

        <div className="epf-actions">
          <button type="button" className="epf-btn-secondary" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </button>
          <button type="submit" className="epf-btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}
