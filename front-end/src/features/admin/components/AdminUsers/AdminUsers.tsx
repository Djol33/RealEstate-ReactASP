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
  realEstateCount: number;
}

export function AdminUsers() {
  const { user } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
                <td>{u.realEstateCount}</td>
                <td className="actions">
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
    </div>
  );
}
