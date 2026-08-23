import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Validate } from '../../shared/Validation/AuthValidate';

type Inputs = {
  firstName: string;
  lastName: string;
  email: string;
  reasonId: string;
  message: string;
};

interface GuestContactFieldsProps {
  register: UseFormRegister<Inputs>;
  errors: FieldErrors<Inputs>;
  touchedFields: Partial<Record<keyof Inputs, boolean>>;
}

export function GuestContactFields({ register, errors, touchedFields }: GuestContactFieldsProps) {
  return (
    <>
      <div className="auth-field">
        <label htmlFor="firstName">First name</label>
        <input
          id="firstName"
          type="text"
          maxLength={30}
          placeholder="Your first name"
          className={touchedFields.firstName && errors.firstName ? 'has-error' : ''}
          {...register('firstName', {
            required: 'First name is required.',
            pattern: Validate.firstName,
            maxLength: { value: 30, message: 'First name cannot exceed 30 characters.' },
          })}
        />
        {touchedFields.firstName && errors.firstName && (
          <span className="field-error">{String(errors.firstName.message)}</span>
        )}
      </div>

      <div className="auth-field">
        <label htmlFor="lastName">Last name</label>
        <input
          id="lastName"
          type="text"
          maxLength={30}
          placeholder="Your last name"
          className={touchedFields.lastName && errors.lastName ? 'has-error' : ''}
          {...register('lastName', {
            required: 'Last name is required.',
            pattern: Validate.lastName,
            maxLength: { value: 30, message: 'Last name cannot exceed 30 characters.' },
          })}
        />
        {touchedFields.lastName && errors.lastName && (
          <span className="field-error">{String(errors.lastName.message)}</span>
        )}
      </div>

      <div className="auth-field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          maxLength={100}
          placeholder="your@email.com"
          className={touchedFields.email && errors.email ? 'has-error' : ''}
          {...register('email', {
            required: 'Email is required.',
            pattern: Validate.email,
            maxLength: { value: 100, message: 'Email cannot exceed 100 characters.' },
          })}
        />
        {touchedFields.email && errors.email && (
          <span className="field-error">{String(errors.email.message)}</span>
        )}
      </div>
    </>
  );
}
