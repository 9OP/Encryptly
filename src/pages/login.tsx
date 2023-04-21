import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Flex,
  HStack,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FC, useContext, useMemo, useState } from "react";
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
import { GithubIcon, LinkedinIcon } from "@app/components/Icons";

const Login: FC = () => {
  const url = getAuthorizationUrl();
  const [error, setError] = useState("");
  const { accessToken, encryptionKey } = useContext(AppContext);

  const setAccessToken = async (token: string) => {
    try {
      setError("");
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
      setError("");
      const digest = await sha256(passphrase);
      const key = await unwrapEncryptionKey(data, digest);
      const exportKey = await exportEncryptionKey(key);
      encryptionKey.setValue(exportKey);
    } catch (err) {
      setError("Failed generating the encryption key");
    }
  };

  const showLoginButton = useMemo(
    () => !accessToken.value,
    [accessToken.value]
  );
  const showPassphraseInput = useMemo(
    () => !showLoginButton && !encryptionKey.value,
    [showLoginButton, encryptionKey]
  );

  return (
    <Flex>
      <Flex flexDirection="row" width="45%">
        <VStack
          padding="2rem"
          spacing="2rem"
          width="100%"
          height="100%"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box>
            <VStack spacing="3rem">
              <Box
                width="100%"
                height="15rem"
                opacity="0.6"
                backgroundImage="radial-gradient(#444cf7 4px, #fff0 0px);"
                backgroundSize="60px 60px;"
              />

              <Heading
                size="4xl"
                fontWeight="semibold"
                lineHeight="5rem"
                marginBottom="2rem"
              >
                → Keep your data safe
              </Heading>
              <HStack spacing="3rem">
                <Box w="50%">
                  {showLoginButton && (
                    <GoogleLoginButton
                      url={url}
                      onSuccess={setAccessToken}
                      onFailure={setError}
                    />
                  )}
                  {showPassphraseInput && (
                    <PassphraseInput setEncryptionKey={setEncryptionKey} />
                  )}
                </Box>
                <Text w="50%" fontSize="2xl" fontWeight="semibold">
                  Encryptly seamlessly encrypt your Google Drive documents
                </Text>
              </HStack>
            </VStack>

            {error && (
              <Alert
                status="error"
                variant="subtle"
                marginTop="2rem"
                borderRadius="6px"
                borderWidth="3px"
                borderColor="black"
                boxShadow="-8px 8px 0px 0px #000"
              >
                <AlertIcon />
                <Flex direction="column">
                  <AlertTitle>Connection failed</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Flex>
              </Alert>
            )}
          </Box>

          <HStack justifyContent="space-between" width="100%">
            <Button leftIcon={<GithubIcon />} variant="link">
              Fork Encryptly
            </Button>
            <Button leftIcon={<LinkedinIcon />} variant="link">
              Connect with me
            </Button>
          </HStack>
        </VStack>
      </Flex>
      <Flex
        padding="2rem"
        backgroundColor="rgb(209,252,135)"
        width="55%"
        height="100vh"
        justifyContent="center"
      >
        <Alert
          width="fit-content"
          height="fit-content"
          status="info"
          variant="subtle"
          borderRadius="6px"
          borderWidth="3px"
          borderColor="black"
          boxShadow="-8px 8px 0px 0px #000"
        >
          <AlertIcon />
          <Flex direction="column">
            <AlertTitle>
              Automatic end-to-end encryption of your files !
            </AlertTitle>
          </Flex>
        </Alert>

        <Box
          position="absolute"
          bottom={0}
          right={0}
          width="15rem"
          height="30rem"
          opacity="0.6"
          backgroundImage="radial-gradient(#444cf7 4px, #fff0 0px);"
          backgroundSize="60px 60px;"
        />
      </Flex>
    </Flex>
  );
};

export default Login;
