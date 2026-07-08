import { useFormContext } from 'react-hook-form';
import { Validate } from '../../../../../../../shared/Validation/AuthValidate';

export function PersonalData() {
  const { register, formState: { errors, touchedFields } } = useFormContext();

  return (
    <div>
      <h2>Personal Data</h2>

      <div className="auth-field">
        <label htmlFor="firstName">First name</label>
        <input
          id="firstName"
          type="text"
          placeholder="Your first name"
          className={touchedFields.firstName && errors.firstName ? 'has-error' : ''}
          {...register("firstName", { required: "First name is required.", pattern: Validate.firstName })}
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
          placeholder="Your last name"
          className={touchedFields.lastName && errors.lastName ? 'has-error' : ''}
          {...register("lastName", { required: "Last name is required.", pattern: Validate.lastName })}
        />
        {touchedFields.lastName && errors.lastName && (
          <span className="field-error">{String(errors.lastName.message)}</span>
        )}
      </div>
    </div>
  );
}
