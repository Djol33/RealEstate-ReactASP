import { useState } from 'react';
import axios from 'axios';
import { useForm, FormProvider } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { BasicData } from './../../../Register/components/Register/components/BasicData/BasicData';
import { CompanyInfo } from './CompanyInfo/components/CompanyInfo/CompanyInfo';
import { Location } from './../Location/components/Location/Location';
import '../../../../Auth/auth.scss';

const TOTAL_STEPS = 3;

const stepFields: Record<number, string[]> = {
  0: ['email', 'password'],
  1: ['companyName', 'bip'],
  2: ['address'],
};

const fieldStepMap: Record<string, number> = {
  email: 0, password: 0,
  companyname: 1, bip: 1,
  address: 2,
};

export function RegisterCompany() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [serverError, setServerError] = useState('');

  const methods = useForm({
    defaultValues: { email: '', password: '', companyName: '', bip: '', address: '' },
    mode: 'onTouched',
    reValidateMode: 'onChange',
  });

  const next = async () => {
    const valid = await methods.trigger(stepFields[step] as any);
    if (valid) setStep(s => s + 1);
  };

  const back = () => setStep(s => s - 1);

  const handleServerErrors = (serverErrors: { propertyName: string; errorMessage: string }[]) => {
    const firstField = serverErrors[0].propertyName.toLowerCase();
    const targetStep = fieldStepMap[firstField];
    if (targetStep !== undefined) setStep(targetStep);

    setTimeout(() => {
      serverErrors.forEach(err => {
        methods.setError(err.propertyName.toLowerCase() as any, {
          type: 'server',
          message: err.errorMessage,
        });
      });
    }, 0);
  };

  const onSubmit = async (data: any) => {
    setServerError('');
    try {
      await axios.post('https://localhost:7154/api/RegisterCompany', data);
      navigate('/auth/login');
    } catch (err: any) {
      if (err.response?.status === 400 && Array.isArray(err.response.data)) {
        handleServerErrors(err.response.data);
      } else {
        setServerError('Registration failed. Please try again.');
      }
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-header">
        <h2>Company Sign Up</h2>
        <p>Create your business account</p>
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
            {step === 1 && <CompanyInfo />}
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
                  {methods.formState.isSubmitting ? 'Submitting...' : 'Register company'}
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
