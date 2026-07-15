import { useState } from 'react';
import axios from 'axios';
import { useForm, FormProvider } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { BasicData } from './components/BasicData/BasicData';
import { PersonalData } from './components/PersonalData/PersonalData';
import { Location } from '../../../RegisterCompany/components/Location/components/Location/Location';
import '../../../auth.scss';

const TOTAL_STEPS = 3;

const stepFields: Record<number, string[]> = {
  0: ['email', 'password'],
  1: ['firstName', 'lastName'],
  2: ['address'],
};

export function RegisterUser() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [serverError, setServerError] = useState('');

  const methods = useForm({
    defaultValues: { email: '', password: '', firstName: '', lastName: '', address: '' },
    mode: 'onTouched',
    reValidateMode: 'onChange',
  });

  const next = async () => {
    const valid = await methods.trigger(stepFields[step] as any);
    if (valid) setStep(s => s + 1);
  };

  const back = () => setStep(s => s - 1);

  const onSubmit = async (data: any) => {
    setServerError('');
    try {
      await axios.post('https://localhost:7154/api/RegisterUser', data);
      navigate('/auth/login');
    } catch (err: any) {
      if (err.response?.status === 400) {
        setServerError('Invalid data. Please check your inputs.');
      } else {
        setServerError('Registration failed. Please try again.');
      }
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-header">
        <h2>Sign Up</h2>
        <p>Create your account</p>
      </div>

      <div className="auth-steps">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <span
            key={i}
            className={`step-dot ${i === step ? 'active' : i < step ? 'done' : ''}`}
          />
        ))}
      </div>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div className="auth-body">
            {step === 0 && <BasicData />}
            {step === 1 && <PersonalData />}
            {step === 2 && <Location />}

            {serverError && <div className="server-error">{serverError}</div>}

            <div className="auth-actions">
              {step > 0 && (
                <button type="button" className="btn-secondary" onClick={back}>
                  Back
                </button>
              )}
              {step < TOTAL_STEPS - 1 && (
                <button type="button" className="btn-primary" onClick={next}>
                  Next
                </button>
              )}
              {step === TOTAL_STEPS - 1 && (
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={methods.formState.isSubmitting}
                >
                  {methods.formState.isSubmitting ? 'Submitting...' : 'Create account'}
                </button>
              )}
            </div>
          </div>

          <div className="auth-footer">
            Already have an account?
            <Link to="/auth/login">Log in</Link>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
