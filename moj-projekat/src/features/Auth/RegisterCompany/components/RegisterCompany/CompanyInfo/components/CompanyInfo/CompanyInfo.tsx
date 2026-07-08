import { useFormContext } from 'react-hook-form';

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
          placeholder="Your company name"
          className={touchedFields.companyName && errors.companyName ? 'has-error' : ''}
          {...register("companyName", { required: "Company name is required." })}
        />
        {touchedFields.companyName && errors.companyName && (
          <span className="field-error">{String(errors.companyName.message)}</span>
        )}
      </div>

      <div className="auth-field">
        <label htmlFor="bip">BIP number</label>
        <input
          id="bip"
          type="text"
          placeholder="Enter BIP number"
          className={touchedFields.bip && errors.bip ? 'has-error' : ''}
          {...register("bip", { required: "BIP number is required." })}
        />
        {touchedFields.bip && errors.bip && (
          <span className="field-error">{String(errors.bip.message)}</span>
        )}
      </div>
    </div>
  );
}
