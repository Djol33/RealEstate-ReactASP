import { useState } from 'react';
import axios from 'axios';
import { useForm, FormProvider } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { BasicData } from './../../../Register/components/Register/components/BasicData/BasicData';
import { CompanyInfo } from './CompanyInfo/components/CompanyInfo/CompanyInfo';
import { Location } from './../Location/components/Location/Location';
import { CompanyLogo } from './CompanyLogo/CompanyLogo';
import { SEO } from '../../../../../shared/components/SEO/SEO';
import { API_URL } from '../../../../../config';
import '../../../../Auth/auth.scss';

const TOTAL_STEPS = 4;

const stepFields: Record<number, string[]> = {
  0: ['email', 'password'],
  1: ['companyName', 'bip'],
  2: ['address'],
  3: [],
};

const fieldStepMap: Record<string, number> = {
  email: 0, password: 0,
  companyname: 1, name: 1, bip: 1,
  address: 2,
  logo: 3,
};

const serverFieldToFormField: Record<string, string> = {
  name: 'companyName',
};

export function RegisterCompany() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [serverError, setServerError] = useState('');
  const [logo, setLogo] = useState<File | null>(null);
  const [logoError, setLogoError] = useState('');

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
    if (serverErrors.length === 0) return;

    const steps = serverErrors
      .map(err => fieldStepMap[err.propertyName.toLowerCase()])
      .filter((s): s is number => s !== undefined);
    if (steps.length > 0) setStep(Math.min(...steps));

    setTimeout(() => {
      serverErrors.forEach(err => {
        const key = err.propertyName.toLowerCase();
        if (key === 'logo') {
          setLogoError(err.errorMessage);
          return;
        }
        const formField = serverFieldToFormField[key] ?? key;
        methods.setError(formField as any, {
          type: 'server',
          message: err.errorMessage,
        });
      });
    }, 0);
  };

  const onSubmit = async (data: any) => {
    setServerError('');
    setLogoError('');
    try {
      const payload = new FormData();
      payload.append('email', data.email);
      payload.append('password', data.password);
      payload.append('companyName', data.companyName);
      payload.append('bip', data.bip);
      payload.append('address', data.address);
      if (logo) payload.append('logo', logo);

      await axios.post(`${API_URL}/api/RegisterCompany`, payload);
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
      <SEO title="Company Sign Up" description="Register your company on Nekretnine to list properties and reach more buyers and renters." />
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
            {step === 3 && <CompanyLogo onLogoSelected={setLogo} serverError={logoError} />}

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
