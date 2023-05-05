import { useLogout } from '@app/hooks';
import { Button } from '@chakra-ui/react';
import { LogoutIcon } from './Icons';

const LogoutButton = () => {
  const logout = useLogout();

  return (
    <Button
      size="md"
      aria-label="logout"
      leftIcon={<LogoutIcon boxSize="1.2rem" />}
      color="black"
      variant="link"
      onClick={logout}
      fontWeight="semibold"
    >
      logout
    </Button>
  );
};

export default LogoutButton;
