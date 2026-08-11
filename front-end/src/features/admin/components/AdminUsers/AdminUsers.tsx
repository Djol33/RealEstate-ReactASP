import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../../../../AuthStore';
import { UsersTable } from './UsersTable';
import { EditUserModal } from './EditUserModal';
import { UserSearchBar } from './UserSearchBar';
import { Pagination } from '../../../../shared/components/Pagination/Pagination';
import { ConfirmDialog } from '../../../../shared/components/ConfirmDialog/ConfirmDialog';
import { API_URL } from '../../../../config';
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

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [form, setForm] = useState<EditState>({ firstName: '', lastName: '', email: '', isActive: true });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [deletingUser, setDeletingUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const load = useCallback(() => {
    setLoading(true);
    axios
      .get(`${API_URL}/api/admin/users`, { params: { search: debouncedSearch, page } })
      .then((res) => {
        setUsers(res.data.data ?? []);
        setTotalPages(res.data.totalPages ?? 1);
        setTotalCount(res.data.totalCount ?? 0);
      })
      .catch(() => setError('Failed to load users.'))
      .finally(() => setLoading(false));
  }, [debouncedSearch, page]);

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

  function validateForm(): string | null {
    if (!form.firstName.trim() || form.firstName.trim().length < 3) {
      return 'First name must be at least 3 characters.';
    }
    if (!form.lastName.trim() || form.lastName.trim().length < 3) {
      return 'Last name must be at least 3 characters.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      return 'Please enter a valid email address.';
    }
    return null;
  }

  async function saveEdit() {
    if (!editing) return;
    const clientError = validateForm();
    if (clientError) {
      setFormError(clientError);
      return;
    }
    setSaving(true);
    setFormError('');
    try {
      await axios.put(`${API_URL}/api/admin/users/${editing.id}`, form);
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
      await axios.post(`${API_URL}/api/admin/users/${u.id}/role`, { role: newRole });
      load();
    } catch (err: any) {
      alert(err.response?.status === 403 ? 'You do not have permission.' : 'Failed to change role.');
    }
  }

  async function confirmDeleteUser() {
    if (!deletingUser) return;
    const u = deletingUser;
    setDeletingUser(null);
    try {
      await axios.delete(`${API_URL}/api/admin/users/${u.id}`);
      load();
    } catch (err: any) {
      alert(err.response?.status === 403 ? 'You cannot delete this user.' : 'Failed to delete.');
    }
  }

  return (
    <div className="admin-users">
      <h1>Users ({totalCount})</h1>

      <UserSearchBar value={search} onChange={setSearch} />

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <UsersTable
            users={users}
            currentUserId={user?.id}
            onEdit={openEdit}
            onToggleRole={toggleRole}
            onDelete={setDeletingUser}
          />

          <div className="admin-users-pagination">
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </>
      )}

      {editing && (
        <EditUserModal
          userId={editing.id}
          form={form}
          setForm={setForm}
          saving={saving}
          formError={formError}
          onCancel={closeEdit}
          onSave={saveEdit}
        />
      )}

      {deletingUser && (
        <ConfirmDialog
          title="Delete user"
          message={`Delete user ${deletingUser.email}? This also removes all their listings and messages.`}
          confirmLabel="Delete"
          danger
          onConfirm={confirmDeleteUser}
          onCancel={() => setDeletingUser(null)}
        />
      )}
    </div>
  );
}
