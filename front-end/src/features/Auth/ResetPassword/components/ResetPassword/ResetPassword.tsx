import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Validate } from '../../../../../shared/Validation/AuthValidate';
import { SEO } from '../../../../../shared/components/SEO/SEO';
import { API_URL } from '../../../../../config';
import '../../../../../features/Auth/auth.scss';

type Inputs = {
  Password: string;
  Confirm: string;
};

export default function ResetPassword() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get('token') ?? '';
  const [serverError, setServerError] = useState('');
  const [done, setDone] = useState(false);

  const {
    handleSubmit,
    register,
    watch,
    formState: { errors, touchedFields, isValid, isSubmitting },
  } = useForm<Inputs>({
    mode: 'onTouched',
    reValidateMode: 'onChange',
  });

  const password = watch('Password');

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setServerError('');
    try {
      await axios.post(`${API_URL}/api/password/reset`, {
        token,
        newPassword: data.Password,
      });
      setDone(true);
      setTimeout(() => navigate('/auth/login'), 2000);
    } catch (err: any) {
      const first = err.response?.data?.errors?.[0];
      setServerError(first?.error ?? 'Could not reset password. The link may have expired.');
    }
  };

  if (!token) {
    return (
      <div className="auth-card">
        <SEO title="Invalid link" noIndex />
        <div className="auth-header">
          <h2>Invalid link</h2>
          <p>This reset link is missing or malformed.</p>
        </div>
        <div className="auth-footer standalone">
          <Link to="/auth/forgot-password">Request a new link</Link>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="auth-card">
        <SEO title="Password updated" noIndex />
        <div className="auth-header">
          <h2>Password updated</h2>
          <p>You can now log in with your new password. Redirecting...</p>
        </div>
        <div className="auth-footer standalone">
          <Link to="/auth/login">Go to login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-card">
      <SEO title="Set a new password" noIndex />
      <div className="auth-header">
        <h2>Set a new password</h2>
        <p>Choose a strong password</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="auth-body">
          <div className="auth-field">
            <label htmlFor="Password">New password</label>
            <input
              id="Password"
              type="password"
              placeholder="Min. 8 characters, letter + number"
              className={touchedFields.Password && errors.Password ? 'has-error' : ''}
              {...register('Password', {
                required: 'Password is required.',
                pattern: Validate.password,
              })}
            />
            {touchedFields.Password && errors.Password && (
              <span className="field-error">{errors.Password.message}</span>
            )}
          </div>

          <div className="auth-field">
            <label htmlFor="Confirm">Confirm password</label>
            <input
              id="Confirm"
              type="password"
              placeholder="Repeat password"
              className={touchedFields.Confirm && errors.Confirm ? 'has-error' : ''}
              {...register('Confirm', {
                required: 'Please confirm your password.',
                validate: (v) => v === password || 'Passwords do not match.',
              })}
            />
            {touchedFields.Confirm && errors.Confirm && (
              <span className="field-error">{errors.Confirm.message}</span>
            )}
          </div>

          {serverError && <div className="server-error">{serverError}</div>}

          <div className="auth-actions">
            <button type="submit" className="btn-primary" disabled={!isValid || isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Reset password'}
            </button>
          </div>
        </div>

        <div className="auth-footer">
          <Link to="/auth/login">Back to login</Link>
        </div>
      </form>
    </div>
  );
}
