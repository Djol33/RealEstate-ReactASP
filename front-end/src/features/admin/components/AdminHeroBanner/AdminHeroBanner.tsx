import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './AdminHeroBanner.scss';
import { formatPrice } from '../../../../shared/utils/format';
import { ConfirmDialog } from '../../../../shared/components/ConfirmDialog/ConfirmDialog';
import { API_URL } from '../../../../config';

interface HeroBannerRequest {
  id: number;
  realestateId: number;
  realestateTitle: string;
  companyName: string;
  requestedByEmail: string;
  days: number;
  pricePerDay: number;
  totalPrice: number;
  status: number;
  startsAt: string | null;
  endsAt: string | null;
  createdAt: string;
  revokedAt: string | null;
}

const STATUS_LABEL: Record<number, string> = { 0: 'Pending', 1: 'Approved', 2: 'Rejected' };
const STATUS_CLASS: Record<number, string> = { 0: 'pending', 1: 'approved', 2: 'rejected' };

function isCurrentlyActive(r: HeroBannerRequest): boolean {
  return r.status === 1 && !!r.endsAt && new Date(r.endsAt) > new Date();
}

export function AdminHeroBanner() {
  const [requests, setRequests] = useState<HeroBannerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState<number | null>(null);
  const [revokingId, setRevokingId] = useState<number | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    axios
      .get(`${API_URL}/api/admin/hero-banner-requests`)
      .then((res) => setRequests(res.data))
      .catch(() => setError('Failed to load hero banner requests.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function decide(id: number, approve: boolean) {
    setBusyId(id);
    try {
      await axios.post(`${API_URL}/api/admin/hero-banner-requests/${id}/${approve ? 'approve' : 'reject'}`);
      load();
    } catch {
      alert('Failed to update the request.');
    } finally {
      setBusyId(null);
    }
  }

  async function confirmRevoke() {
    if (revokingId == null) return;
    const id = revokingId;
    setRevokingId(null);
    setBusyId(id);
    try {
      await axios.post(`${API_URL}/api/admin/hero-banner-requests/${id}/revoke`);
      load();
    } catch {
      alert('Failed to remove the listing from the banner.');
    } finally {
      setBusyId(null);
    }
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="admin-hero-banner">
      <h1>Hero banner requests ({requests.length})</h1>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Listing</th>
              <th>Company</th>
              <th>Days</th>
              <th>Total</th>
              <th>Status</th>
              <th>Active until</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 && (
              <tr><td colSpan={7} className="empty">No requests yet.</td></tr>
            )}
            {requests.map((r) => (
              <tr key={r.id}>
                <td>
                  <Link to={`/realestate/${r.realestateId}`} className="listing-link">
                    {r.realestateTitle}
                  </Link>
                </td>
                <td>{r.companyName ?? r.requestedByEmail}</td>
                <td>{r.days}</td>
                <td>€ {formatPrice(r.totalPrice)}</td>
                <td>
                  <span className={`status-badge ${r.revokedAt ? 'revoked' : STATUS_CLASS[r.status]}`}>
                    {r.revokedAt ? 'Revoked' : STATUS_LABEL[r.status]}
                  </span>
                </td>
                <td>{r.endsAt ? new Date(r.endsAt).toLocaleDateString() : '-'}</td>
                <td className="actions">
                  {r.status === 0 ? (
                    <>
                      <button
                        className="btn-approve"
                        disabled={busyId === r.id}
                        onClick={() => decide(r.id, true)}
                      >
                        Approve
                      </button>
                      <button
                        className="btn-reject"
                        disabled={busyId === r.id}
                        onClick={() => decide(r.id, false)}
                      >
                        Reject
                      </button>
                    </>
                  ) : isCurrentlyActive(r) ? (
                    <button
                      className="btn-reject"
                      disabled={busyId === r.id}
                      onClick={() => setRevokingId(r.id)}
                    >
                      Remove from banner
                    </button>
                  ) : (
                    <span className="muted">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {revokingId != null && (
        <ConfirmDialog
          title="Remove from banner"
          message="Remove this listing from the hero banner? The owner will be notified."
          confirmLabel="Remove"
          danger
          onConfirm={confirmRevoke}
          onCancel={() => setRevokingId(null)}
        />
      )}
    </div>
  );
}
