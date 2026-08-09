import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import './AdminAmenities.scss';

interface Amenity {
  id: number;
  name: string;
  isFilterable: boolean;
}

interface FormState {
  name: string;
  isFilterable: boolean;
}

const EMPTY_FORM: FormState = { name: '', isFilterable: false };

export function AdminAmenities() {
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [editing, setEditing] = useState<Amenity | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    axios
      .get('https://localhost:7154/api/admin/amenities')
      .then((res) => setAmenities(res.data))
      .catch(() => setError('Failed to load amenities.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function openCreate() {
    setCreating(true);
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormError('');
  }

  function openEdit(a: Amenity) {
    setEditing(a);
    setCreating(false);
    setForm({ name: a.name, isFilterable: a.isFilterable });
    setFormError('');
  }

  function closeModal() {
    setEditing(null);
    setCreating(false);
    setSaving(false);
    setFormError('');
  }

  async function save() {
    if (!form.name.trim()) {
      setFormError('Name is required.');
      return;
    }
    setSaving(true);
    setFormError('');
    try {
      if (creating) {
        await axios.post('https://localhost:7154/api/admin/amenities', form);
      } else if (editing) {
        await axios.put(`https://localhost:7154/api/admin/amenities/${editing.id}`, form);
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

  async function remove(a: Amenity) {
    if (!window.confirm(`Delete amenity "${a.name}"? This removes it from all listings.`)) return;
    try {
      await axios.delete(`https://localhost:7154/api/admin/amenities/${a.id}`);
      load();
    } catch {
      alert('Failed to delete.');
    }
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="admin-amenities">
      <div className="admin-amenities-header">
        <h1>Amenities ({amenities.length})</h1>
        <button className="btn-add" onClick={openCreate}>
          <i className="fa-solid fa-plus" /> Add amenity
        </button>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Filterable</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {amenities.length === 0 && (
              <tr><td colSpan={3} className="empty">No amenities yet.</td></tr>
            )}
            {amenities.map((a) => (
              <tr key={a.id}>
                <td>{a.name}</td>
                <td>
                  <span className={`filter-badge ${a.isFilterable ? 'yes' : 'no'}`}>
                    {a.isFilterable ? 'Yes' : 'No'}
                  </span>
                </td>
                <td className="actions">
                  <button className="btn-edit" onClick={() => openEdit(a)}>Edit</button>
                  <button className="btn-del" onClick={() => remove(a)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(creating || editing) && (
        <div className="admin-modal-backdrop" onClick={closeModal}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h2>{creating ? 'Add amenity' : `Edit amenity`}</h2>

            <label>
              Name
              <input
                value={form.name}
                maxLength={50}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </label>
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={form.isFilterable}
                onChange={(e) => setForm({ ...form, isFilterable: e.target.checked })}
              />
              Show as a search filter
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
    </div>
  );
}
