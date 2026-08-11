import { Link } from 'react-router-dom';
import './Footer.scss';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-brand">
          <img src="/src/assets/images/logonekretnine1.png" alt="logonekretnine" />
          <p>Find your next home. Browse apartments and houses for sale or rent.</p>
        </div>

        <div className="footer-links">
          <h3>Navigation</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/apartment/add">Add Apartment</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="footer-links">
          <h3>Account</h3>
          <ul>
            <li><Link to="/auth/login">Login</Link></li>
            <li><Link to="/auth/registerUser">Register</Link></li>
            <li><Link to="/auth/registerCompany">Register company</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <span>&copy; {year} Nekretnine. All rights reserved.</span>
      </div>
    </footer>
  );
}
