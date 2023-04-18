import { FC, useContext, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, Navigate, Outlet } from "react-router-dom";
import { AppContext } from "@app/context";
import { getUserInfo } from "@app/hooks/http";
import { delAccessToken, getAccessToken, setAccessToken } from "@app/lib/storage";

const useRecoverAccessToken = () => {
  const { accessToken } = useContext(AppContext);

  return async () => {
    const token = getAccessToken();

    if (token) {
      try {
        await getUserInfo(token);
        accessToken.setValue(token);
        setAccessToken(token);
        return true;
      } catch (err) {
        accessToken.setValue("");
        delAccessToken();
      }
    }

    return false;
  };
};

const useIsAuthenticated = () => {
  const { accessToken, encryptionKey } = useContext(AppContext);
  const hasAccessToken = accessToken.value != "" && accessToken.value != null;
  const hasEncryptionKey = encryptionKey.value != "" && encryptionKey.value != null;
  return hasAccessToken && hasEncryptionKey;
};

const AuthGuard: FC = () => {
  const location = useLocation();
  const recoverAccessToken = useRecoverAccessToken();
  const isAuthenticated = useIsAuthenticated();

  if (!isAuthenticated) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.

    return <Navigate to="/login" state={{ from: location }} />;
  }

  useEffect(() => {
    (async () => {
      if (!isAuthenticated) {
        await recoverAccessToken();
      }
    })();
  }, [isAuthenticated]);

  return <Outlet />;
};

export default AuthGuard;
