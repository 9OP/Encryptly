import { AppContext } from "@app/context";
import { getUserInfo } from "@app/hooks/http";
import getAuthorizationUrl from "@app/lib/authorizationUrl";
import { exportEncryptionKey, sha256, unwrapEncryptionKey } from "@app/lib/crypto";
import { delStorageAccessToken, setStorageAccessToken } from "@app/lib/storage";
import { AppData } from "@app/models";
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
  Link,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FC, useContext, useEffect, useMemo, useState } from "react";

import { GithubIcon, LinkedinIcon } from "@app/components/Icons";
import GoogleLoginButton from "@app/components/LoginButton";
import PassphraseInput from "@app/components/PassphraseInput";
import { useRecoverAccessToken } from "@app/hooks";

const Login: FC = () => {
  const url = getAuthorizationUrl();
  const [error, setError] = useState("");
  const { accessToken, encryptionKey } = useContext(AppContext);
  const recoverAccessToken = useRecoverAccessToken();

  useEffect(() => {
    recoverAccessToken();
  }, []);

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
      setError(`Failed unwrapping your encryption key`);
    }
  };

  const showLoginButton = useMemo(() => !accessToken.value, [accessToken.value]);

  return (
    <Flex flexDirection={{ base: "column", lg: "row" }}>
      <Flex width={{ base: "100%", lg: "45%" }} height={{ base: "100vh", lg: "none" }}>
        <VStack
          padding="2rem"
          width="100%"
          height="100%"
          alignItems="center"
          justifyContent="space-between"
        >
          <VStack spacing="2.5rem">
            <Box
              width="100%"
              height={{ base: "10rem", xl: "15rem" }}
              opacity="0.6"
              backgroundImage="radial-gradient(#444cf7 4px, #fff0 0px);"
              backgroundSize="60px 60px;"
            />

            <Heading
              size={{ base: "3xl", xl: "4xl" }}
              fontWeight="bold"
              lineHeight="5rem"
              marginBottom="2rem"
            >
              → Keep your data safe
            </Heading>
            <Stack spacing="2rem" direction={{ base: "column", xl: "row" }}>
              <Box w={{ base: "100%", xl: "50%" }}>
                {showLoginButton ? (
                  <GoogleLoginButton url={url} onSuccess={setAccessToken} onFailure={setError} />
                ) : (
                  <PassphraseInput setEncryptionKey={setEncryptionKey} />
                )}
              </Box>
              <Text
                w={{ base: "100%", xl: "50%" }}
                fontSize="xl"
                fontWeight="semibold"
                textAlign="justify"
              >
                Encryptly seamlessly encrypt your Google Drive documents
              </Text>
            </Stack>

            {error && (
              <Alert minWidth="100%" status="error" variant="subtle">
                <AlertIcon />
                <Flex direction="column">
                  <AlertTitle>Connection failed</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Flex>
              </Alert>
            )}
          </VStack>

          <HStack justifyContent="space-between" width="100%">
            <Link href="https://github.com/9OP/Encryptly/">
              <Button leftIcon={<GithubIcon />} variant="link">
                Show me the code
              </Button>
            </Link>
            <Link href="https://www.linkedin.com/in/martin-guyard-105b74150/">
              <Button leftIcon={<LinkedinIcon />} variant="link">
                Martin
              </Button>
            </Link>
          </HStack>
        </VStack>
      </Flex>

      <Flex
        width={{ base: "100%", lg: "55%" }}
        padding="2rem"
        backgroundColor="rgb(209,252,135)"
        height="100vh"
        justifyContent="center"
      >
        <Alert width="fit-content" height="fit-content" status="info" variant="subtle" maxW="100%">
          <AlertIcon />
          <Flex direction="column">
            <AlertTitle margin={0}>Automatic end-to-end encryption of your files !</AlertTitle>
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
