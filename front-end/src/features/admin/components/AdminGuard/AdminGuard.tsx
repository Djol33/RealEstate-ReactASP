import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../AuthStore';

export function AdminGuard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.userRole === 2;

  useEffect(() => {
    if (!isAdmin) {
      navigate(user ? '/' : '/auth/login', { replace: true });
    }
  }, [isAdmin, user, navigate]);

  if (!isAdmin) return null;

  return <Outlet />;
}
