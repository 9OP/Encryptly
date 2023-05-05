import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useIsAuthenticated } from '@app/hooks';

const LoginGuard = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const isAuthenticated = useIsAuthenticated();

  const fromPathname = state?.from?.pathname || '/';
  const fromParams = state?.from?.search || '';
  const from = fromPathname + fromParams;

  useEffect(() => {
    if (isAuthenticated) {
      // Send them back to the page they tried to visit when they were
      // redirected to the login page. Use { replace: true } so we don't create
      // another entry in the history stack for the login page.  This means that
      // when they get to the protected page and click the back button, they
      // won't end up back on the login page, which is also really nice for the
      // user experience.

      navigate(from, { replace: true });
    }
  }, [navigate, from, isAuthenticated]);

  return <Outlet />;
};

export default LoginGuard;
