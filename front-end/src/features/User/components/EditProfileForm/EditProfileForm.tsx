import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import axios from 'axios';
import './EditProfileForm.scss';

type Inputs = {
  firstName: string;
  lastName: string;
};

interface EditProfileFormProps {
  initialData: { firstName: string; lastName: string };
  onSaved: () => void;
  onCancel: () => void;
}

export function EditProfileForm({ initialData, onSaved, onCancel }: EditProfileFormProps) {
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    mode: 'onTouched',
    defaultValues: {
      firstName: initialData.firstName ?? '',
      lastName: initialData.lastName ?? '',
    },
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setServerError('');
    try {
      await axios.put('https://localhost:7154/api/Profile', data);
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
      <h2>Edit profile</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="epf-field">
          <label htmlFor="firstName">First name</label>
          <input
            id="firstName"
            className={errors.firstName ? 'has-error' : ''}
            {...register('firstName', {
              required: 'First name is required.',
              minLength: { value: 3, message: 'At least 3 characters.' },
            })}
          />
          {errors.firstName && <span className="epf-error">{errors.firstName.message}</span>}
        </div>

        <div className="epf-field">
          <label htmlFor="lastName">Last name</label>
          <input
            id="lastName"
            className={errors.lastName ? 'has-error' : ''}
            {...register('lastName', {
              required: 'Last name is required.',
              minLength: { value: 3, message: 'At least 3 characters.' },
            })}
          />
          {errors.lastName && <span className="epf-error">{errors.lastName.message}</span>}
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
