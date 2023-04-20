import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Flex,
  HStack,
  Heading,
  Text,
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

import GoogleLoginButton from "@app/components/LoginButton";
import PassphraseInput from "@app/components/PassphraseInput";

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
    <Flex>
      <Flex flexDirection="row" width="45%">
        <VStack
          margin="2rem"
          spacing="2rem"
          width="100%"
          height="100%"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box>
            {!accessToken.value && (
              <VStack spacing="5rem">
                <Box
                  width="150%"
                  height="15rem"
                  // backgroundColor="#e5e5f7"
                  opacity="0.6"
                  backgroundImage="radial-gradient(#444cf7 4px, #fff0 0px);"
                  backgroundSize="60px 60px;"
                >
                </Box>

                <Heading
                  size="4xl"
                  fontWeight="semibold"
                  lineHeight="5rem"
                  marginBottom="3rem"
                >
                  → Keep your data safe
                </Heading>
                <HStack spacing="3rem">
                  <GoogleLoginButton
                    url={url}
                    onSuccess={setAccessToken}
                    onFailure={setError}
                  />
                  <Text fontSize="2xl" fontWeight="semibold">
                    Encryptly seamlessly encrypt your Google Drive documents
                  </Text>
                </HStack>
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
      <Flex backgroundColor="rgb(209,252,135)" width="55%" height="100vh">
        test
      </Flex>
    </Flex>
  );
};

export default Login;
