import { Button } from "@chakra-ui/react";
import { LogoutIcon } from "./icons";
import { useLogout } from "@app/hooks";

const LogoutButton = () => {
  const logout = useLogout();

  return (
    <Button
      size="xs"
      width="100%"
      aria-label="logout"
      leftIcon={<LogoutIcon boxSize="1.2rem" />}
      colorScheme="gray"
      variant="ghost"
      onClick={logout}
      fontSize="sm"
      fontWeight="medium"
    >
      logout
    </Button>
  );
};

export default LogoutButton;
