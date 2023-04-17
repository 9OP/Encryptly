import { Route, useLocation, Routes, useNavigate } from "react-router-dom";
import { FC, useContext, useEffect } from "react";
import { AppContext } from "@/context";
import { useLogout } from "@/hooks";
import IndexPage from "@/pages/index.page";
import LoginPage from "@/pages/login.page";
import AuthGuard from "@/pages/guard/authGuard";

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
