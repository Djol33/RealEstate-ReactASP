import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../AuthStore';

export function RequireAuth() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      navigate('/auth/login', { replace: true, state: { from: location.pathname } });
    }
  }, [user, navigate, location.pathname]);

  if (!user) return null;

  return <Outlet />;
}
