import { useEffect } from 'react';
import { useAuth } from '../../../AuthStore';
import './Auth.css';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';

const PUBLIC_AUTH_PATHS = ['/auth/reset-password', '/auth/forgot-password'];

export default function Auth() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isPublicAuthPath = PUBLIC_AUTH_PATHS.some((p) => location.pathname.startsWith(p));

  useEffect(() => {
    if (user != null && !isPublicAuthPath) {
      navigate('/', { replace: true });
    }
  }, [user, isPublicAuthPath, navigate]);

  return <Outlet />;
}
