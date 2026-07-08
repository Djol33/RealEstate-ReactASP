import { useFormContext } from 'react-hook-form';
import { Validate } from '../../../../../../../shared/Validation/AuthValidate';

export function BasicData() {
  const { register, formState: { errors, touchedFields } } = useFormContext();

  return (
    <div>
      <h2>Create Account</h2>

      <div className="auth-field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          placeholder="your@email.com"
          className={touchedFields.email && errors.email ? 'has-error' : ''}
          {...register("email", { required: "Email is required.", pattern: Validate.email })}
        />
        {touchedFields.email && errors.email && (
          <span className="field-error">{String(errors.email.message)}</span>
        )}
      </div>

      <div className="auth-field">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          placeholder="Min. 8 characters, letter + number"
          className={touchedFields.password && errors.password ? 'has-error' : ''}
          {...register("password", { required: "Password is required.", pattern: Validate.password })}
        />
        {touchedFields.password && errors.password && (
          <span className="field-error">{String(errors.password.message)}</span>
        )}
      </div>
    </div>
  );
}
