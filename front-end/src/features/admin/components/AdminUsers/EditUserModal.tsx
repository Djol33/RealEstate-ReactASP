import { validatePersonName } from '../../../../shared/Validation/personName';

interface EditState {
  firstName: string;
  lastName: string;
  companyName: string;
  isCompany: boolean;
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
  const nameError = form.isCompany
    ? null
    : validatePersonName(form.firstName, 'First name')
      ?? validatePersonName(form.lastName, 'Last name');

  return (
    <div className="admin-modal-backdrop" onClick={onCancel}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Edit user #{userId}</h2>

        {form.isCompany ? (
          <label>
            Company name
            <input
              value={form.companyName}
              maxLength={50}
              onChange={(e) => setForm({ ...form, companyName: e.target.value })}
            />
          </label>
        ) : (
          <>
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
          </>
        )}
        <label>
          Email
          <input
            type="email"
            value={form.email}
            maxLength={100}
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

        {nameError && <p className="form-error">{nameError}</p>}
        {formError && <p className="form-error">{formError}</p>}

        <div className="modal-actions">
          <button className="btn-cancel" onClick={onCancel} disabled={saving}>
            Cancel
          </button>
          <button className="btn-save" onClick={onSave} disabled={saving || !!nameError}>
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
