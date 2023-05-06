import React from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';
import { SWRConfig } from 'swr';

const AuthGuard = React.lazy(() => import('@app/guard/authenticationGuard'));
const LoginGuard = React.lazy(() => import('@app/guard/loginGuard'));
const HomePage = React.lazy(() => import('@app/pages/home'));
const LoginPage = React.lazy(() => import('@app/pages/login'));
const Privacy = React.lazy(() => import('@app/pages/privacy'));
const Terms = React.lazy(() => import('@app/pages/terms'));
const Logout = React.lazy(() => import('@app/pages/logout'));

export default function App() {
  const toast = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <SWRConfig
      value={{
        onError: (error: Error) => {
          if (error?.status === 401 && location.pathname !== '/login') {
            toast({
              status: 'warning',
              title: 'Session expired',
              duration: 3000,
              isClosable: true,
              position: 'top-right',
            });
            navigate('/login');
          } else {
            // toast({
            //   status: "warning",
            //   title: error?.info,
            //   description: error?.message,
            //   duration: 3000,
            //   isClosable: true,
            //   position: "top-right",
            // });
          }
        },
      }}
    >
      <Routes>
        <Route>
          <Route path="/login" element={<LoginGuard />}>
            <Route index element={<LoginPage />} />
          </Route>

          <Route path="/" element={<AuthGuard />}>
            <Route index element={<HomePage />} />
          </Route>

          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/logout" element={<Logout />} />
        </Route>
      </Routes>
    </SWRConfig>
  );
}
