import { FC, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '@app/context';
import { useLogout } from '@app/hooks';

const Logout: FC = () => {
  const { accessToken, encryptionKey } = useContext(AppContext);
  const logout = useLogout();
  const navigate = useNavigate();

  useEffect(() => {
    (async function () {
      accessToken.setValue('');
      encryptionKey.setValue('');

      try {
        await logout();
      } finally {
        navigate('/login', { replace: true });
      }
    })();
  }, []);

  return <></>;
};

export default Logout;
