import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../../AuthStore';
import './Header.scss';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Profile } from '../Profile/components/Profile/Profile';

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  const close = () => setMenuOpen(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  useEffect(() => {
    if (!menuOpen) return;
    function handleOutside(e: Event) {
      const target = e.target as Node;
      const insideNav = navRef.current?.contains(target);
      const insideHamburger = hamburgerRef.current?.contains(target);
      if (!insideNav && !insideHamburger) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('touchstart', handleOutside);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('touchstart', handleOutside);
    };
  }, [menuOpen]);

  return (
    <header>
      <h1>
        <Link to="/" onClick={close}>
          <img src="/src/assets/images/logonekretnine.png" alt="logonekretnine" />
        </Link>
      </h1>

      <button
        ref={hamburgerRef}
        type="button"
        className={`hamburger ${menuOpen ? 'is-open' : ''}`}
        onClick={() => setMenuOpen((p) => !p)}
        aria-label="Meni"
        aria-expanded={menuOpen}
      >
        <span />
        <span />
        <span />
      </button>

      <nav ref={navRef} className={menuOpen ? 'is-open' : ''}>
        <ul>
          {!user && (
            <li>
              <Link to="/auth/login" onClick={close}>Login</Link>
            </li>
          )}
          {!user && (
            <li>
              <Link to="/auth/registerUser" onClick={close}>Register user</Link>
            </li>
          )}
          {!user && (
            <li>
              <Link to="/auth/registerCompany" onClick={close}>Register company</Link>
            </li>
          )}

          {user && (
            <li>
              <Link to="/apartment/add" onClick={close}>Add Apartment</Link>
            </li>
          )}
          {user && (
            <li>
              <Link to="/messages" onClick={close}>Messages</Link>
            </li>
          )}
          {user?.userRole === 2 && (
            <li>
              <Link to="/admin" onClick={close}>Admin</Link>
            </li>
          )}
          <li>
            <Link to="/contact" onClick={close}>Contact</Link>
          </li>

          {/* Desktop: profil dropdown */}
          {user && (
            <li className="nav-profile-desktop">
              <Profile />
            </li>
          )}

          {/* Mobile: profil stavke u listi */}
          {user && (
            <li className="nav-profile-mobile">
              <Link to="/user/profile" onClick={close}>Profil</Link>
            </li>
          )}
          {user && (
            <li className="nav-profile-mobile">
              <button
                type="button"
                className="nav-logout"
                onClick={() => {
                  close();
                  logout();
                  navigate('/');
                }}
              >
                Odjava
              </button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
