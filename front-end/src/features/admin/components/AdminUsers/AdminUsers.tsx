import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../../../../AuthStore';
import './AdminUsers.scss';

interface AdminUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  userRole: number;
  isActive: boolean;
  realEstateCount: number;
}

interface EditState {
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
}

export function AdminUsers() {
  const { user } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [form, setForm] = useState<EditState>({ firstName: '', lastName: '', email: '', isActive: true });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    axios
      .get('https://localhost:7154/api/admin/users')
      .then((res) => setUsers(res.data))
      .catch(() => setError('Failed to load users.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function openEdit(u: AdminUser) {
    setEditing(u);
    setForm({ firstName: u.firstName ?? '', lastName: u.lastName ?? '', email: u.email, isActive: u.isActive });
    setFormError('');
  }

  function closeEdit() {
    setEditing(null);
    setSaving(false);
    setFormError('');
  }

  async function saveEdit() {
    if (!editing) return;
    setSaving(true);
    setFormError('');
    try {
      await axios.put(`https://localhost:7154/api/admin/users/${editing.id}`, form);
      closeEdit();
      load();
    } catch (err: any) {
      const status = err.response?.status;
      if (status === 422) {
        const first = err.response?.data?.errors?.[0];
        setFormError(first?.error ?? 'Validation failed.');
      } else if (status === 403) {
        setFormError('You do not have permission for this change.');
      } else {
        setFormError('Failed to save changes.');
      }
      setSaving(false);
    }
  }

  async function toggleRole(u: AdminUser) {
    const newRole = u.userRole === 2 ? 0 : 2;
    try {
      await axios.post(`https://localhost:7154/api/admin/users/${u.id}/role`, { role: newRole });
      load();
    } catch (err: any) {
      alert(err.response?.status === 403 ? 'You do not have permission.' : 'Failed to change role.');
    }
  }

  async function deleteUser(u: AdminUser) {
    if (!window.confirm(`Delete user ${u.email}? This also removes all their listings and messages.`)) return;
    try {
      await axios.delete(`https://localhost:7154/api/admin/users/${u.id}`);
      load();
    } catch (err: any) {
      alert(err.response?.status === 403 ? 'You cannot delete this user.' : 'Failed to delete.');
    }
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="admin-users">
      <h1>Users ({users.length})</h1>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Listings</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.firstName} {u.lastName}</td>
                <td>{u.email}</td>
                <td>
                  <span className={`role-badge ${u.userRole === 2 ? 'admin' : ''}`}>
                    {u.userRole === 2 ? 'Admin' : 'User'}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${u.isActive ? 'active' : 'inactive'}`}>
                    {u.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>{u.realEstateCount}</td>
                <td className="actions">
                  <button className="btn-edit" onClick={() => openEdit(u)}>
                    Edit
                  </button>
                  {u.id !== user?.id && (
                    <>
                      <button className="btn-role" onClick={() => toggleRole(u)}>
                        {u.userRole === 2 ? 'Remove admin' : 'Make admin'}
                      </button>
                      <button className="btn-del" onClick={() => deleteUser(u)}>
                        Delete
                      </button>
                    </>
                  )}
                  {u.id === user?.id && <span className="you">(you)</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="admin-modal-backdrop" onClick={closeEdit}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Edit user #{editing.id}</h2>

            <label>
              First name
              <input
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              />
            </label>
            <label>
              Last name
              <input
                value={form.lastName}
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
              <button className="btn-cancel" onClick={closeEdit} disabled={saving}>
                Cancel
              </button>
              <button className="btn-save" onClick={saveEdit} disabled={saving}>
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
