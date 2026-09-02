interface AdminUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  companyName: string | null;
  isCompany: boolean;
  userRole: number;
  isActive: boolean;
  realEstateCount: number;
}

interface UsersTableProps {
  users: AdminUser[];
  currentUserId?: number;
  onEdit: (u: AdminUser) => void;
  onToggleRole: (u: AdminUser) => void;
  onDelete: (u: AdminUser) => void;
}

export function UsersTable({ users, currentUserId, onEdit, onToggleRole, onDelete }: UsersTableProps) {
  return (
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
              <td>{u.isCompany ? u.companyName : `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim()}</td>
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
                <button className="btn-edit" onClick={() => onEdit(u)}>
                  Edit
                </button>
                {u.id !== currentUserId && (
                  <>
                    {(u.userRole === 2 || !u.isCompany) && (
                      <button className="btn-role" onClick={() => onToggleRole(u)}>
                        {u.userRole === 2 ? 'Remove admin' : 'Make admin'}
                      </button>
                    )}
                    <button className="btn-del" onClick={() => onDelete(u)}>
                      Delete
                    </button>
                  </>
                )}
                {u.id === currentUserId && <span className="you">(you)</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
