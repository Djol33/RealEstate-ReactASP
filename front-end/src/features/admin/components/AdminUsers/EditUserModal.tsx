interface EditState {
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
}

interface EditUserModalProps {
  userId: number;
  form: EditState;
  setForm: (form: EditState) => void;
  saving: boolean;
  formError: string;
  onCancel: () => void;
  onSave: () => void;
}

export function EditUserModal({ userId, form, setForm, saving, formError, onCancel, onSave }: EditUserModalProps) {
  return (
    <div className="admin-modal-backdrop" onClick={onCancel}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Edit user #{userId}</h2>

        <label>
          First name
          <input
            value={form.firstName}
            maxLength={30}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          />
        </label>
        <label>
          Last name
          <input
            value={form.lastName}
            maxLength={30}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          />
        </label>
        <label>
          Email
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </label>
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
          />
          Account active
        </label>

        {formError && <p className="form-error">{formError}</p>}

        <div className="modal-actions">
          <button className="btn-cancel" onClick={onCancel} disabled={saving}>
            Cancel
          </button>
          <button className="btn-save" onClick={onSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
