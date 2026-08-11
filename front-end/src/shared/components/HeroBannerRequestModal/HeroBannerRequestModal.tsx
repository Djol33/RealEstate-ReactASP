import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../../config';
import './HeroBannerRequestModal.scss';

interface HeroBannerRequestModalProps {
  realestateId: number | string;
  onClose: () => void;
  onSuccess: () => void;
}

export function HeroBannerRequestModal({ realestateId, onClose, onSuccess }: HeroBannerRequestModalProps) {
  const [pricePerDay, setPricePerDay] = useState<number | null>(null);
  const [quoteFailed, setQuoteFailed] = useState(false);
  const [days, setDays] = useState(7);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  function loadQuote() {
    setQuoteFailed(false);
    axios.get(`${API_URL}/api/hero-banner/quote`).then((res) => {
      setPricePerDay(res.data.pricePerDay);
    }).catch(() => {
      setQuoteFailed(true);
    });
  }

  useEffect(() => {
    loadQuote();
  }, []);

  const total = pricePerDay != null ? (pricePerDay * days).toFixed(2) : null;

  async function submit() {
    setSubmitting(true);
    setError('');
    try {
      await axios.post(`${API_URL}/api/hero-banner/request`, {
        realestateId,
        days,
      });
      onSuccess();
    } catch (err: any) {
      const status = err.response?.status;
      if (status === 422) {
        setError(err.response?.data?.errors?.[0]?.error ?? 'This request is not valid.');
      } else if (status === 403) {
        setError('Only companies can request hero banner placement.');
      } else {
        setError('Could not submit the request. Please try again.');
      }
      setSubmitting(false);
    }
  }

  return (
    <div className="hero-modal-backdrop" onClick={onClose}>
      <div className="hero-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Request hero banner placement</h2>
        <p className="hero-modal-sub">
          Your listing will appear in the featured banner on the homepage with a link to it.
        </p>

        <label>
          Number of days
          <input
            type="number"
            min={1}
            max={90}
            value={days}
            onChange={(e) => setDays(Math.max(1, Math.min(90, Number(e.target.value))))}
          />
        </label>

        <div className="hero-modal-price">
          {pricePerDay != null ? (
            <>
              <span>{pricePerDay.toFixed(2)} € / day</span>
              <strong>Total: {total} €</strong>
            </>
          ) : quoteFailed ? (
            <span className="hero-modal-error">
              Could not load price.{' '}
              <button type="button" className="btn-retry" onClick={loadQuote}>
                Try again
              </button>
            </span>
          ) : (
            <span>Loading price...</span>
          )}
        </div>

        {error && <p className="hero-modal-error">{error}</p>}

        <div className="hero-modal-actions">
          <button className="btn-cancel" onClick={onClose} disabled={submitting}>
            Cancel
          </button>
          <button className="btn-submit" onClick={submit} disabled={submitting || pricePerDay == null}>
            {submitting ? 'Sending...' : 'Send request'}
          </button>
        </div>
      </div>
    </div>
  );
}
