interface FormState {
  name: string;
  isFilterable: boolean;
}

interface AmenityFormModalProps {
  isCreating: boolean;
  form: FormState;
  setForm: (form: FormState) => void;
  saving: boolean;
  formError: string;
  onCancel: () => void;
  onSave: () => void;
}

export function AmenityFormModal({
  isCreating,
  form,
  setForm,
  saving,
  formError,
  onCancel,
  onSave,
}: AmenityFormModalProps) {
  return (
    <div className="admin-modal-backdrop" onClick={onCancel}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <h2>{isCreating ? 'Add amenity' : 'Edit amenity'}</h2>

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
          <button className="btn-cancel" onClick={onCancel} disabled={saving}>Cancel</button>
          <button className="btn-save" onClick={onSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
