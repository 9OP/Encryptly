import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Flex,
  Heading,
  VStack,
} from "@chakra-ui/react";
import { FC, useContext, useState } from "react";
import getAuthorizationUrl from "@app/lib/authorizationUrl";
import { AppContext } from "@app/context";
import { getUserInfo } from "@app/hooks/http";
import {
  exportEncryptionKey,
  sha256,
  unwrapEncryptionKey,
} from "@app/lib/crypto";
import { AppData } from "@app/models";
import { delStorageAccessToken, setStorageAccessToken } from "@app/lib/storage";

import GoogleLoginButton from "@app/pages/components/googleLoginButton";
import PassphraseInput from "@app/pages/components/passphraseInput";

const Login: FC = () => {
  const url = getAuthorizationUrl();
  const [error, setError] = useState("");
  const { accessToken, encryptionKey } = useContext(AppContext);

  const setAccessToken = async (token: string) => {
    try {
      await getUserInfo(token);
      accessToken.setValue(token);
      setStorageAccessToken(token);
    } catch (err) {
      setError((err as Error).message);
      delStorageAccessToken();
    }
  };

  const setEncryptionKey = async (passphrase: string, data: AppData) => {
    try {
      const digest = await sha256(passphrase);
      const key = await unwrapEncryptionKey(data, digest);
      const exportKey = await exportEncryptionKey(key);
      encryptionKey.setValue(exportKey);
    } catch (err) {
      setError("Failed generating the encryption key");
    }
  };

  return (
    <Flex margin="2rem">
      <Flex flexDirection="row">
        <VStack
          spacing="2rem"
          width="100%"
          height="100%"
          alignItems="center"
          justifyContent="center"
        >
          <Box>
            {!accessToken.value && (
              <VStack spacing="1rem">
                <Heading size="2xl">Sign in to continue</Heading>
                <GoogleLoginButton
                  url={url}
                  onSuccess={setAccessToken}
                  onFailure={setError}
                />
              </VStack>
            )}

            {accessToken.value && !encryptionKey.value && (
              <PassphraseInput setEncryptionKey={setEncryptionKey} />
            )}

            {error && (
              <Alert status="error" variant="subtle" marginTop="1rem">
                <AlertIcon />
                <Flex direction="column">
                  <AlertTitle>Connection failed</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Flex>
              </Alert>
            )}
          </Box>
        </VStack>
        
      </Flex>
    </Flex>
  );
};

export default Login;
