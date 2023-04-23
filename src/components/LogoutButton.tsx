import { useLogout } from "@app/hooks";
import { Button } from "@chakra-ui/react";
import { LogoutIcon } from "./Icons";

const LogoutButton = () => {
  const logout = useLogout();

  return (
    <Button
      size="md"
      //width="100%"
      aria-label="logout"
      leftIcon={<LogoutIcon boxSize="1.2rem" />}
      // colorScheme="gray"
      color="black"
      variant="link"
      onClick={logout}
      // fontSize="sm"
      fontWeight="semibold"
      //
      // _hover={{ boxShadow: "none" }}
      // borderRadius="10px"
      // borderWidth="2px"
      // borderColor="black"
      // boxShadow="-4px 4px 0px 0px #000"
    >
      logout
    </Button>
  );
};

export default LogoutButton;
