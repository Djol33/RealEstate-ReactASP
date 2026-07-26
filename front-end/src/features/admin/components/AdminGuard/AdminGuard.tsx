import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../AuthStore';

export function AdminGuard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.userRole !== 2) {
      navigate('/');
    }
  }, [user]);

  if (!user || user.userRole !== 2) return null;

  return <Outlet />;
}
