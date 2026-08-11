import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { ConfirmDialog } from '../../../../shared/components/ConfirmDialog/ConfirmDialog';
import { API_URL } from '../../../../config';
import './AdminContactReasons.scss';

interface Reason {
  id: number;
  name: string;
}

export function AdminContactReasons() {
  const [reasons, setReasons] = useState<Reason[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [editing, setEditing] = useState<Reason | null>(null);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [deleting, setDeleting] = useState<Reason | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    axios
      .get(`${API_URL}/api/admin/contact-reasons`)
      .then((res) => setReasons(res.data))
      .catch(() => setError('Failed to load reasons.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function openCreate() {
    setCreating(true);
    setEditing(null);
    setName('');
    setFormError('');
  }

  function openEdit(r: Reason) {
    setEditing(r);
    setCreating(false);
    setName(r.name);
    setFormError('');
  }

  function closeModal() {
    setEditing(null);
    setCreating(false);
    setSaving(false);
    setFormError('');
  }

  async function save() {
    if (!name.trim()) {
      setFormError('Name is required.');
      return;
    }
    setSaving(true);
    setFormError('');
    try {
      if (creating) {
        await axios.post(`${API_URL}/api/admin/contact-reasons`, { name });
      } else if (editing) {
        await axios.put(`${API_URL}/api/admin/contact-reasons/${editing.id}`, { name });
      }
      closeModal();
      load();
    } catch (err: any) {
      const status = err.response?.status;
      if (status === 422) {
        setFormError(err.response?.data?.errors?.[0]?.error ?? 'Validation failed.');
      } else if (status === 403) {
        setFormError('You do not have permission for this change.');
      } else {
        setFormError('Failed to save.');
      }
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleting) return;
    const r = deleting;
    setDeleting(null);
    try {
      await axios.delete(`${API_URL}/api/admin/contact-reasons/${r.id}`);
      load();
    } catch (err: any) {
      const msg = err.response?.data?.errors?.[0]?.error ?? 'Failed to delete.';
      alert(msg);
    }
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="admin-contact-reasons">
      <div className="admin-contact-reasons-header">
        <h1>Contact reasons ({reasons.length})</h1>
        <button className="btn-add" onClick={openCreate}>
          <i className="fa-solid fa-plus" /> Add reason
        </button>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reasons.length === 0 && (
              <tr><td colSpan={2} className="empty">No reasons yet.</td></tr>
            )}
            {reasons.map((r) => (
              <tr key={r.id}>
                <td>{r.name}</td>
                <td className="actions">
                  <button className="btn-edit" onClick={() => openEdit(r)}>Edit</button>
                  <button className="btn-del" onClick={() => setDeleting(r)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(creating || editing) && (
        <div className="admin-modal-backdrop" onClick={closeModal}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h2>{creating ? 'Add reason' : 'Edit reason'}</h2>

            <label>
              Name
              <input
                value={name}
                maxLength={80}
                onChange={(e) => setName(e.target.value)}
              />
            </label>

            {formError && <p className="form-error">{formError}</p>}

            <div className="modal-actions">
              <button className="btn-cancel" onClick={closeModal} disabled={saving}>Cancel</button>
              <button className="btn-save" onClick={save} disabled={saving}>
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleting && (
        <ConfirmDialog
          title="Delete reason"
          message={`Delete reason "${deleting.name}"?`}
          confirmLabel="Delete"
          danger
          onConfirm={confirmDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  );
}
