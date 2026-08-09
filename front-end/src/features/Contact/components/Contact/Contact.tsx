import { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import axios from 'axios';
import { useAuth } from '../../../../AuthStore';
import { SEO } from '../../../../shared/components/SEO/SEO';
import { Validate } from '../../../../shared/Validation/AuthValidate';
import './Contact.scss';

interface Reason {
  id: number;
  name: string;
}

type Inputs = {
  firstName: string;
  lastName: string;
  email: string;
  reasonId: string;
  message: string;
};

export function Contact() {
  const { user } = useAuth();
  const loggedIn = !!user;

  const [reasons, setReasons] = useState<Reason[]>([]);
  const [serverError, setServerError] = useState('');
  const [sent, setSent] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors, touchedFields, isValid, isSubmitting },
  } = useForm<Inputs>({
    mode: 'onTouched',
    reValidateMode: 'onChange',
  });

  useEffect(() => {
    axios.get('https://localhost:7154/api/contact/reasons').then((res) => setReasons(res.data));
  }, []);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setServerError('');
    try {
      await axios.post('https://localhost:7154/api/contact', {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        reasonId: Number(data.reasonId),
        message: data.message,
      });
      setSent(true);
    } catch (err: any) {
      const first = err.response?.data?.errors?.[0];
      setServerError(first?.error ?? 'Could not send your message. Please try again.');
    }
  };

  if (sent) {
    return (
      <div className="auth-card contact-card">
        <SEO title="Contact us" noIndex />
        <div className="auth-header">
          <h2>Message sent</h2>
          <p>Thank you — we'll get back to you as soon as possible.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-card contact-card">
      <SEO title="Contact us" description="Get in touch with the Nekretnine team." />
      <div className="auth-header">
        <h2>Contact us</h2>
        <p>Have a question or an issue? Send us a message.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="auth-body">
          {!loggedIn && (
            <>
              <div className="auth-field">
                <label htmlFor="firstName">First name</label>
                <input
                  id="firstName"
                  type="text"
                  placeholder="Your first name"
                  className={touchedFields.firstName && errors.firstName ? 'has-error' : ''}
                  {...register('firstName', {
                    required: 'First name is required.',
                    pattern: Validate.firstName,
                    maxLength: { value: 30, message: 'First name cannot exceed 30 characters.' },
                  })}
                />
                {touchedFields.firstName && errors.firstName && (
                  <span className="field-error">{String(errors.firstName.message)}</span>
                )}
              </div>

              <div className="auth-field">
                <label htmlFor="lastName">Last name</label>
                <input
                  id="lastName"
                  type="text"
                  placeholder="Your last name"
                  className={touchedFields.lastName && errors.lastName ? 'has-error' : ''}
                  {...register('lastName', {
                    required: 'Last name is required.',
                    pattern: Validate.lastName,
                    maxLength: { value: 30, message: 'Last name cannot exceed 30 characters.' },
                  })}
                />
                {touchedFields.lastName && errors.lastName && (
                  <span className="field-error">{String(errors.lastName.message)}</span>
                )}
              </div>

              <div className="auth-field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  className={touchedFields.email && errors.email ? 'has-error' : ''}
                  {...register('email', {
                    required: 'Email is required.',
                    pattern: Validate.email,
                  })}
                />
                {touchedFields.email && errors.email && (
                  <span className="field-error">{String(errors.email.message)}</span>
                )}
              </div>
            </>
          )}

          <div className="auth-field">
            <label htmlFor="reasonId">Reason</label>
            <select
              id="reasonId"
              className={touchedFields.reasonId && errors.reasonId ? 'has-error' : ''}
              {...register('reasonId', { required: 'Please select a reason.' })}
              defaultValue=""
            >
              <option value="" disabled>Select a reason</option>
              {reasons.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
            {touchedFields.reasonId && errors.reasonId && (
              <span className="field-error">{String(errors.reasonId.message)}</span>
            )}
          </div>

          <div className="auth-field">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              rows={5}
              placeholder="Describe your question or issue..."
              maxLength={2000}
              className={touchedFields.message && errors.message ? 'has-error' : ''}
              {...register('message', {
                required: 'Message is required.',
                minLength: { value: 10, message: 'Message must be at least 10 characters.' },
                maxLength: { value: 2000, message: 'Message cannot exceed 2000 characters.' },
              })}
            />
            {touchedFields.message && errors.message && (
              <span className="field-error">{String(errors.message.message)}</span>
            )}
          </div>

          {serverError && <div className="server-error">{serverError}</div>}

          <div className="auth-actions">
            <button type="submit" className="btn-primary" disabled={!isValid || isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send message'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
