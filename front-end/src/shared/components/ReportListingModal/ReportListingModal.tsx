import { useState } from 'react';
import axios from 'axios';
import './ReportListingModal.scss';

interface ReportListingModalProps {
  realestateId: number | string;
  onClose: () => void;
  onSuccess: () => void;
}

const REASONS = [
  { value: 'spam', label: 'Spam or misleading' },
  { value: 'fraud', label: 'Fraud or scam' },
  { value: 'inappropriate', label: 'Inappropriate content' },
  { value: 'wrong_info', label: 'Incorrect information' },
  { value: 'other', label: 'Other' },
];

export function ReportListingModal({ realestateId, onClose, onSuccess }: ReportListingModalProps) {
  const [reason, setReason] = useState('spam');
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function submit() {
    setSubmitting(true);
    setError('');
    try {
      await axios.post('https://localhost:7154/api/reports', {
        realestateId,
        reason,
        details,
      });
      onSuccess();
    } catch (err: any) {
      const status = err.response?.status;
      if (status === 422) {
        setError(err.response?.data?.errors?.[0]?.error ?? 'This report could not be submitted.');
      } else {
        setError('Could not submit the report. Please try again.');
      }
      setSubmitting(false);
    }
  }

  return (
    <div className="report-modal-backdrop" onClick={onClose}>
      <div className="report-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Report this listing</h2>
        <p className="report-modal-sub">Let us know what's wrong. Our team will review it.</p>

        <label>
          Reason
          <select value={reason} onChange={(e) => setReason(e.target.value)}>
            {REASONS.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </label>

        <label>
          Additional details (optional)
          <textarea
            rows={3}
            maxLength={1000}
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Describe the issue..."
          />
        </label>

        {error && <p className="report-modal-error">{error}</p>}

        <div className="report-modal-actions">
          <button className="btn-cancel" onClick={onClose} disabled={submitting}>
            Cancel
          </button>
          <button className="btn-submit" onClick={submit} disabled={submitting}>
            {submitting ? 'Sending...' : 'Send report'}
          </button>
        </div>
      </div>
    </div>
  );
}
