import { Link } from 'react-router-dom';
import { SEO } from '../../../../shared/components/SEO/SEO';
import './NotFound.scss';

export function NotFound() {
  return (
    <div className="not-found">
      <SEO title="Page not found" noIndex />
      <div className="not-found-code">404</div>
      <h1>Page not found</h1>
      <p>The page you're looking for doesn't exist or may have been moved.</p>
      <Link to="/" className="not-found-link">
        <i className="fa-solid fa-house" /> Back to homepage
      </Link>
    </div>
  );
}
