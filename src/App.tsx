import { AppContext } from "@app/context";
import AuthGuard from "@app/guard/authenticationGuard";
import LoginGuard from "@app/guard/loginGuard";
import { useLogout } from "@app/hooks";
import IndexPage from "@app/pages";
import LoginPage from "@app/pages/login";
import { useToast } from "@chakra-ui/react";
import { FC, useContext, useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { SWRConfig } from "swr";

const Logout: FC = () => {
  const { accessToken, encryptionKey } = useContext(AppContext);
  const logout = useLogout();
  const navigate = useNavigate();

  useEffect(() => {
    (async function () {
      accessToken.setValue("");
      encryptionKey.setValue("");

      try {
        await logout();
      } finally {
        navigate("/login", { replace: true });
      }
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <></>;
};

const NotFound: FC = () => {
  // Recursively navigate back in the history until:
  // - find a matching route, or
  // - reach /
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    (function () {
      if (pathname !== "/") {
        navigate(-1);
      }
    })();
  }, [navigate, pathname]);

  return <></>;
};

export default function App() {
  const toast = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <SWRConfig
      value={{
        onError: async (error: Error, key) => {
          if (error?.status === 401 && location.pathname !== "/login") {
            toast({
              status: "warning",
              title: "Session expired",
              duration: 3000,
              isClosable: true,
              position: "top-right",
            });
            navigate("/login");
          } else {
            toast({
              status: "warning",
              title: error?.info,
              description: error?.message,
              duration: 3000,
              isClosable: true,
              position: "top-right",
            });
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
            <Route index element={<IndexPage />} />
          </Route>

          <Route path="/logout" element={<Logout />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </SWRConfig>
  );
}
