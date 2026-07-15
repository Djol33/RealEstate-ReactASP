import { useFormContext } from 'react-hook-form';

export function Location() {
  const { register, formState: { errors, touchedFields } } = useFormContext();

  return (
    <div>
      <h2>Location</h2>

      <div className="auth-field">
        <label htmlFor="address">Address</label>
        <input
          id="address"
          type="text"
          placeholder="e.g. Main Street 12, New York"
          className={touchedFields.address && errors.address ? 'has-error' : ''}
          {...register("address", { required: "Address is required." })}
        />
        {touchedFields.address && errors.address && (
          <span className="field-error">{String(errors.address.message)}</span>
        )}
      </div>
    </div>
  );
}
