import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../../AuthStore';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Profile.scss';

export function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen((prev) => !prev);
  const close = () => setIsOpen(false);

  useEffect(() => {
    if (user == null) setIsOpen(false);
  }, [user]);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false);
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen]);

  if (!user) return null;

  return (
    <div className="profile-menu" ref={rootRef}>
      <button
        type="button"
        className={`profile-trigger ${isOpen ? 'is-open' : ''}`}
        onClick={toggleDropdown}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span className="profile-name">
          {user.company
            ? user.company
            : (user.fname || user.lname)
              ? `${user.fname ?? ''} ${user.lname ?? ''}`.trim()
              : user.email}
        </span>
        <i className="fa-solid fa-chevron-down profile-caret" />
      </button>

      <div className={`profile-dropdown ${isOpen ? 'is-open' : ''}`}>
        <Link to="/user/profile" className="profile-item" onClick={close}>
          <i className="fa-solid fa-user" /> Profil
        </Link>
        <button
          type="button"
          className="profile-item"
          onClick={() => {
            close();
            logout();
            navigate('/');
          }}
        >
          <i className="fa-solid fa-right-from-bracket" /> Log out
        </button>
      </div>
    </div>
  );
}
