import { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../../../AuthStore';
import { SEO } from '../../../../shared/components/SEO/SEO';
import { Validate } from '../../../../shared/Validation/AuthValidate';
import { GuestContactFields } from './GuestContactFields';
import { API_URL } from '../../../../config';
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
    shouldUnregister: true,
  });

  useEffect(() => {
    axios.get(`${API_URL}/api/contact/reasons`).then((res) => setReasons(res.data));
  }, []);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setServerError('');
    try {
      await axios.post(`${API_URL}/api/contact`, {
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
      <div className="contact-page-wrap">
        <div className="auth-card contact-card">
          <SEO title="Contact us" noIndex />
          <div className="auth-header">
            <h2>Message sent</h2>
            <p>Thank you — we'll get back to you as soon as possible.</p>
          </div>
          <div className="contact-back-home">
            <Link to="/" className="btn-primary">Back to home</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="contact-page-wrap">
    <div className="auth-card contact-card">
      <SEO title="Contact us" description="Get in touch with the Nekretnine team." />
      <div className="auth-header">
        <h2>Contact us</h2>
        <p>Have a question or an issue? Send us a message.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="auth-body">
          {!loggedIn && (
            <GuestContactFields register={register} errors={errors} touchedFields={touchedFields} />
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
    </div>
  );
}
