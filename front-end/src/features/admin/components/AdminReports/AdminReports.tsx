import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ConfirmDialog } from '../../../../shared/components/ConfirmDialog/ConfirmDialog';
import { Pagination } from '../../../../shared/components/Pagination/Pagination';
import { API_URL } from '../../../../config';
import './AdminReports.scss';
import { useToast } from '../../../../shared/components/Toast/ToastProvider';

interface Report {
  id: number;
  realestateId: number;
  realestateTitle: string | null;
  realestateStillExists: boolean;
  reportedByEmail: string;
  reason: string;
  details: string | null;
  status: number;
  createdAt: string;
}

const REASON_LABEL: Record<string, string> = {
  spam: 'Spam or misleading',
  fraud: 'Fraud or scam',
  inappropriate: 'Inappropriate content',
  wrong_info: 'Incorrect information',
  other: 'Other',
};

const STATUS_LABEL: Record<number, string> = { 0: 'Pending', 1: 'Dismissed', 2: 'Listing deleted' };
const STATUS_CLASS: Record<number, string> = { 0: 'pending', 1: 'dismissed', 2: 'actioned' };

export function AdminReports() {
  const toast = useToast();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const load = useCallback(() => {
    setLoading(true);
    axios
      .get(`${API_URL}/api/admin/reports`, { params: { page } })
      .then((res) => {
        setReports(res.data.data ?? []);
        setTotalPages(res.data.totalPages ?? 1);
        setTotalCount(res.data.totalCount ?? 0);
      })
      .catch(() => setError('Failed to load reports.'))
      .finally(() => setLoading(false));
  }, [page]);

  useEffect(() => {
    load();
  }, [load]);

  async function dismiss(id: number) {
    setBusyId(id);
    try {
      await axios.post(`${API_URL}/api/admin/reports/${id}/dismiss`);
      load();
    } catch {
      toast.error('Failed to dismiss the report.');
    } finally {
      setBusyId(null);
    }
  }

  async function confirmDeleteListing() {
    if (deletingId == null) return;
    const id = deletingId;
    setDeletingId(null);
    setBusyId(id);
    try {
      await axios.post(`${API_URL}/api/admin/reports/${id}/delete-listing`);
      load();
    } catch {
      toast.error('Failed to delete the listing.');
    } finally {
      setBusyId(null);
    }
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="admin-reports">
      <h1>Reported listings ({reports.length})</h1>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Listing</th>
              <th>Reported by</th>
              <th>Reason</th>
              <th>Details</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.length === 0 && (
              <tr><td colSpan={6} className="empty">No reports yet.</td></tr>
            )}
            {reports.map((r) => (
              <tr key={r.id}>
                <td>
                  {r.realestateStillExists ? (
                    <Link to={`/realestate/${r.realestateId}`} className="listing-link">
                      {r.realestateTitle}
                    </Link>
                  ) : (
                    <span className="muted">{r.realestateTitle ?? 'Listing removed'}</span>
                  )}
                </td>
                <td>{r.reportedByEmail}</td>
                <td>{REASON_LABEL[r.reason] ?? r.reason}</td>
                <td className="details">{r.details ?? '-'}</td>
                <td>
                  <span className={`status-badge ${STATUS_CLASS[r.status]}`}>
                    {STATUS_LABEL[r.status]}
                  </span>
                </td>
                <td className="actions">
                  {r.status === 0 && r.realestateStillExists ? (
                    <>
                      <button
                        className="btn-dismiss"
                        disabled={busyId === r.id}
                        onClick={() => dismiss(r.id)}
                      >
                        Dismiss
                      </button>
                      <button
                        className="btn-delete"
                        disabled={busyId === r.id}
                        onClick={() => setDeletingId(r.id)}
                      >
                        Delete listing
                      </button>
                    </>
                  ) : (
                    <span className="muted">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {deletingId != null && (
        <ConfirmDialog
          title="Delete listing"
          message="Delete the reported listing? This cannot be undone."
          confirmLabel="Delete"
          danger
          onConfirm={confirmDeleteListing}
          onCancel={() => setDeletingId(null)}
        />
      )}

      {!loading && totalCount > 0 && (
        <div className="admin-pagination">
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}
