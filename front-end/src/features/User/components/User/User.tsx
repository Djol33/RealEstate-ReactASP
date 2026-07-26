import { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../../AuthStore';

export function User() {
  const nav = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const isOwnProfileRoute = location.pathname.endsWith('/user/profile');

  useEffect(() => {
    if (isOwnProfileRoute && user == null) nav('/auth/login');
  }, [user, isOwnProfileRoute]);

  return <Outlet />;
}
