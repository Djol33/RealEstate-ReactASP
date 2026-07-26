import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../../../AuthStore';
import './AdminLayout.scss';

const items = [
  { to: '/admin', end: true, icon: 'fa-gauge-high', label: 'Dashboard' },
  { to: '/admin/users', end: false, icon: 'fa-users', label: 'Users' },
  { to: '/admin/realestates', end: false, icon: 'fa-building', label: 'Listings' },
];

export function AdminLayout() {
  const { user } = useAuth();

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <i className="fa-solid fa-shield-halved" />
          <span>Admin panel</span>
        </div>

        <nav className="admin-nav">
          {items.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              end={it.end}
              className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
            >
              <i className={`fa-solid ${it.icon}`} />
              <span>{it.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <NavLink to="/" className="admin-back">
            <i className="fa-solid fa-arrow-left" />
            <span>Back to site</span>
          </NavLink>
          {user && (
            <div className="admin-who">
              <i className="fa-solid fa-user-shield" />
              <span>{user.fname} {user.lname}</span>
            </div>
          )}
        </div>
      </aside>

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}
