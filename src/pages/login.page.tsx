import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Flex,
  VStack,
} from "@chakra-ui/react";
import { FC, useContext, useState } from "react";
import GoogleLoginButton from "@/pages/components/googleLoginButton";
import getAuthorizationUrl from "@/lib/authorizationUrl";
import { AppContext } from "@/context";
import { getUserInfo } from "@/hooks/http";

const Login: FC = () => {
  const url = getAuthorizationUrl();
  const [error, setError] = useState("");
  const { accessToken } = useContext(AppContext);

  const setAccessToken = async (token: string) => {
    if (token != null && accessToken.value != token) {
      try {
        await getUserInfo(token);
        accessToken.setValue(token);
        sessionStorage.setItem("access-token", token);
      } catch (err) {
        sessionStorage.removeItem("access-token");
      }
    }
  };

  return (
    <VStack spacing="2rem" width="100%" height="100%" alignItems="center" justifyContent="center">
      <Box>
        <GoogleLoginButton url={url} onSuccess={setAccessToken} onFailure={setError} />

        {error && (
          <Alert status="warning" variant="subtle" borderRadius="6px" marginTop="1rem">
            <AlertIcon />
            <Flex direction="column">
              <AlertTitle>Connection failed</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Flex>
          </Alert>
        )}
      </Box>
    </VStack>
  );
};

export default Login;
