import { Route, useLocation, Routes, useNavigate } from "react-router-dom";
import { FC, useContext, useEffect } from "react";
import { AppContext } from "@app/context";
import { useLogout } from "@app/hooks";
import IndexPage from "@app/pages/index.page";
import LoginPage from "@app/pages/login.page";
import AuthGuard from "@app/pages/guard/authentication.guard";

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
  // const router = useRouter();
  // const toast = useToast();

  return (
    <Routes>
      <Route>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/logout" element={<Logout />} />

        <Route path="/" element={<AuthGuard />}>
          <Route index element={<IndexPage />} />
        </Route>

        {/* By default redirect to "/"" */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
