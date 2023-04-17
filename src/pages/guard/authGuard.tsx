import { FC, useContext, useMemo, useState } from "react";
import { useLocation, useNavigate, Navigate, Outlet } from "react-router-dom";
import { AppContext } from "@/context";
import { getUserInfo } from "@/hooks/http";

const useRecoverAccessToken = () => {
  const { accessToken } = useContext(AppContext);

  return async () => {
    const token = sessionStorage.getItem("access-token");

    if (token) {
      try {
        await getUserInfo(token);
        accessToken.setValue(token);
        sessionStorage.setItem("access-token", token);
        return true;
      } catch (err) {
        accessToken.setValue("");
        sessionStorage.removeItem("access-token");
      }
    }

    return false;
  };
};

const useIsAuthenticated = () => {
  const { accessToken, encryptionKey } = useContext(AppContext);

  const hasAccessToken = useMemo(
    () => accessToken.value != "" && accessToken.value != null,
    [accessToken.value]
  );

  const hasEncryptionKey = useMemo(
    () => encryptionKey.value != "" && encryptionKey.value != null,
    [encryptionKey.value]
  );

  return hasAccessToken && hasEncryptionKey;
};

const AuthGuard: FC = () => {
  const [loading, setLoading] = useState(true);
  const { accessToken, encryptionKey } = useContext(AppContext);

  const location = useLocation();
  const navigate = useNavigate();
  const recoverAccessToken = useRecoverAccessToken();
  const isAuthenticated = useIsAuthenticated();

  if (!isAuthenticated) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} />;
  }

  // useEffect(() => {
  //   async function redirect() {
  //     const recovered = await recoverAccessToken();

  //     switch (true) {
  //       case (!recovered && !hasAccessToken) || !hasEncryptionKey:
  //         if (location.pathname !== "/login") {
  //           navigate("/login");
  //         }
  //         break;

  //       case location.pathname !== "/":
  //         navigate("/");
  //         break;

  //       default:
  //         break;
  //     }

  //     setLoading(false);
  //   }

  //   redirect();
  // }, [hasEncryptionKey, hasAccessToken, recoverAccessToken, location]);

  // if (loading) {
  //   return <>loading</>;
  // }

  return <Outlet />;
};

export default AuthGuard;
