import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Validate } from '../../../../../shared/Validation/AuthValidate';
import '../../../../../features/Auth/auth.scss';

type Inputs = {
  Email: string;
};

export default function ForgotPassword() {
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    handleSubmit,
    register,
    formState: { errors, touchedFields, isValid, isSubmitting },
  } = useForm<Inputs>({
    mode: 'onTouched',
    reValidateMode: 'onChange',
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setServerError('');
    try {
      await axios.post('https://localhost:7154/api/password/forgot', {
        email: data.Email,
        resetUrlBase: `${window.location.origin}/reset-password`,
      });
      setSent(true);
    } catch {
      setServerError('Something went wrong. Please try again.');
    }
  };

  if (sent) {
    return (
      <div className="auth-card">
        <div className="auth-header">
          <h2>Check your email</h2>
          <p>If an account exists for that address, we've sent a reset link.</p>
        </div>
        <div className="auth-footer">
          <Link to="/login">Back to login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-card">
      <div className="auth-header">
        <h2>Forgot password</h2>
        <p>Enter your email and we'll send a reset link</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="auth-body">
          <div className="auth-field">
            <label htmlFor="Email">Email</label>
            <input
              id="Email"
              type="email"
              placeholder="your@email.com"
              className={touchedFields.Email && errors.Email ? 'has-error' : ''}
              {...register('Email', {
                required: 'Email is required.',
                pattern: Validate.email,
              })}
            />
            {touchedFields.Email && errors.Email && (
              <span className="field-error">{errors.Email.message}</span>
            )}
          </div>

          {serverError && <div className="server-error">{serverError}</div>}

          <div className="auth-actions">
            <button type="submit" className="btn-primary" disabled={!isValid || isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send reset link'}
            </button>
          </div>
        </div>

        <div className="auth-footer">
          Remember your password?
          <Link to="/login">Log in</Link>
        </div>
      </form>
    </div>
  );
}
