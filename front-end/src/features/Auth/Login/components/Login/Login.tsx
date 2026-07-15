import { useState } from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../../AuthStore';
import { Validate } from '../../../../../shared/Validation/AuthValidate';
import '../../../../../features/Auth/auth.scss';

type Inputs = {
  Email: string;
  Password: string;
}

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [serverError, setServerError] = useState('');

  const {
    handleSubmit,
    register,
    formState: { errors, touchedFields, isValid, isSubmitting },
  } = useForm<Inputs>({
    mode: "onTouched",
    reValidateMode: "onChange",
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setServerError('');
    try {
      const res = await login(data);
      if (res?.code === 401) {
        setServerError('Invalid email or password.');
      } else if (res?.code === 200) {
        navigate('/');
      }
    } catch {
      setServerError('Login failed. Please try again.');
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-header">
        <h2>Login</h2>
        <p>Welcome back</p>
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
              {...register("Email", {
                required: "Email is required.",
                pattern: Validate.email,
              })}
            />
            {touchedFields.Email && errors.Email && (
              <span className="field-error">{errors.Email.message}</span>
            )}
          </div>

          <div className="auth-field">
            <label htmlFor="Password">Password</label>
            <input
              id="Password"
              type="password"
              placeholder="Enter your password"
              className={touchedFields.Password && errors.Password ? 'has-error' : ''}
              {...register("Password", {
                required: "Password is required.",
                pattern: Validate.password,
              })}
            />
            {touchedFields.Password && errors.Password && (
              <span className="field-error">{errors.Password.message}</span>
            )}
          </div>

          {serverError && <div className="server-error">{serverError}</div>}

          <div className="auth-actions">
            <button
              type="submit"
              className="btn-primary"
              disabled={!isValid || isSubmitting}
            >
              {isSubmitting ? 'Logging in...' : 'Log in'}
            </button>
          </div>
        </div>

        <div className="auth-footer">
          Don't have an account?
          <Link to="/auth/registerUser">Sign up</Link>
        </div>
      </form>
    </div>
  );
}
