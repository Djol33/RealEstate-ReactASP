import { useFormContext } from 'react-hook-form';
import { isValidPib } from '../../../../shared/Validation/pib';

export function CompanyInfo() {
  const { register, formState: { errors, touchedFields } } = useFormContext();

  return (
    <div>
      <h2>Company Information</h2>

      <div className="auth-field">
        <label htmlFor="companyName">Company name</label>
        <input
          id="companyName"
          type="text"
          maxLength={50}
          placeholder="Your company name"
          className={touchedFields.companyName && errors.companyName ? 'has-error' : ''}
          {...register("companyName", {
            required: "Company name is required.",
            maxLength: { value: 50, message: "Company name cannot exceed 50 characters." },
          })}
        />
        {touchedFields.companyName && errors.companyName && (
          <span className="field-error">{String(errors.companyName.message)}</span>
        )}
      </div>

      <div className="auth-field">
        <label htmlFor="bip">Tax ID (PIB)</label>
        <input
          id="bip"
          type="text"
          maxLength={9}
          inputMode="numeric"
          placeholder="9 digits, e.g. 104052135"
          className={touchedFields.bip && errors.bip ? 'has-error' : ''}
          {...register("bip", {
            required: "Tax ID (PIB) cannot be empty.",
            validate: (v: string) =>
              isValidPib(v) || "Tax ID (PIB) must be 9 digits and a valid Serbian PIB.",
          })}
        />
        {touchedFields.bip && errors.bip && (
          <span className="field-error">{String(errors.bip.message)}</span>
        )}
      </div>
    </div>
  );
}
