import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { AmenitiesTable } from './AmenitiesTable';
import { AmenityFormModal } from './AmenityFormModal';
import { ConfirmDialog } from '../../../../shared/components/ConfirmDialog/ConfirmDialog';
import { API_URL } from '../../../../config';
import './AdminAmenities.scss';

interface Amenity {
  id: number;
  name: string;
  isFilterable: boolean;
  isActive: boolean;
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
  const [deleting, setDeleting] = useState<Amenity | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    axios
      .get(`${API_URL}/api/admin/amenities`)
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
        await axios.post(`${API_URL}/api/admin/amenities`, form);
      } else if (editing) {
        await axios.put(`${API_URL}/api/admin/amenities/${editing.id}`, form);
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
    try {
      await axios.delete(`${API_URL}/api/admin/amenities/${deleting.id}`);
      setDeleting(null);
      load();
    } catch {
      alert('Failed to delete.');
    }
  }

  async function restore(a: Amenity) {
    try {
      await axios.post(`${API_URL}/api/admin/amenities/${a.id}/restore`);
      load();
    } catch {
      alert('Failed to restore.');
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

      <AmenitiesTable amenities={amenities} onEdit={openEdit} onDelete={setDeleting} onRestore={restore} />

      {(creating || editing) && (
        <AmenityFormModal
          isCreating={creating}
          form={form}
          setForm={setForm}
          saving={saving}
          formError={formError}
          onCancel={closeModal}
          onSave={save}
        />
      )}

      {deleting && (
        <ConfirmDialog
          title="Delete amenity"
          message={`Delete amenity "${deleting.name}"? It will be hidden from filters and forms, but listings that already have it keep it, and you can restore it later.`}
          confirmLabel="Delete"
          danger
          onConfirm={confirmDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  );
}
