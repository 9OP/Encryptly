import { FC, useContext, useEffect, useMemo, useState } from 'react';
// import DeleteAppDataFolder from '@app/components/DeleteButtonAppFolder';
import { GithubIcon, LinkedinIcon } from '@app/components/Icons';
import GoogleLoginButton from '@app/components/LoginButton';
import PassphraseInput from '@app/components/PassphraseInput';
import ProductHuntBadge from '@app/components/ProductHuntBadge';
import { AppContext } from '@app/context';
import { useRecoverAccessToken } from '@app/hooks';
import { getUserInfo } from '@app/hooks/http';
import { getAuthorizationUrl } from '@app/lib/authorizationUrl';
import { exportEncryptionKey, sha256, unwrapEncryptionKey } from '@app/lib/crypto';
import { delStorageAccessToken, setStorageAccessToken } from '@app/lib/storage';
import { WrappedKey } from '@app/models';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Image,
  Link,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';

const Login: FC = () => {
  const url = getAuthorizationUrl();
  const [error, setError] = useState('');
  const { accessToken, encryptionKey } = useContext(AppContext);
  const recoverAccessToken = useRecoverAccessToken();

  useEffect(() => {
    recoverAccessToken();
  }, []);

  const setAccessToken = async (token: string) => {
    try {
      setError('');
      await getUserInfo(token);
      accessToken.setValue(token);
      setStorageAccessToken(token);
    } catch (err) {
      setError((err as Error).message);
      delStorageAccessToken();
    }
  };

  const setEncryptionKey = async (passphrase: string, wrappedKey: WrappedKey) => {
    try {
      setError('');
      const digest = await sha256(passphrase);
      const key = await unwrapEncryptionKey(wrappedKey, digest);
      const exportKey = await exportEncryptionKey(key);
      encryptionKey.setValue(exportKey);
    } catch (err) {
      setError(`Failed unwrapping your encryption key`);
    }
  };

  const showLoginButton = useMemo(() => !accessToken.value, [accessToken.value]);

  return (
    <Flex flexDirection={{ base: 'column', lg: 'row' }}>
      {/* <DeleteAppDataFolder /> */}

      <Flex width={{ base: '100%', lg: '45%' }} height={{ base: '100vh', lg: 'none' }}>
        <VStack
          padding="2rem"
          paddingBottom="0.5rem"
          width="100%"
          height="100%"
          alignItems="center"
          justifyContent="space-between"
        >
          <VStack spacing="2.5rem">
            <ProductHuntBadge />
            <Box
              marginTop="0!important"
              width="100%"
              height={{ base: '10rem', xl: '15rem' }}
              opacity="0.6"
              backgroundImage="radial-gradient(purple.500 4px, #fff0 0px);"
              backgroundSize="60px 60px;"
            />

            <Heading
              size={{ base: '3xl', xl: '4xl' }}
              fontWeight="bold"
              lineHeight="5rem"
              marginBottom="2rem"
            >
              → Keep your data safe
            </Heading>
            <Stack spacing="2rem" direction={{ base: 'column', xl: 'row' }}>
              <Box w={{ base: '100%', xl: '50%' }}>
                {showLoginButton ? (
                  <GoogleLoginButton
                    url={url}
                    onSuccess={setAccessToken}
                    onFailure={setError}
                  />
                ) : (
                  <PassphraseInput setEncryptionKey={setEncryptionKey} />
                )}
              </Box>

              <Text
                w={{ base: '100%', xl: '50%' }}
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

          <VStack w="100%" alignItems="flex-start">
            <Link href="https://www.linkedin.com/in/martin-g-105b74150/">
              <Button leftIcon={<LinkedinIcon />} variant="link">
                Martin
              </Button>
            </Link>

            <HStack w="100%" justifyContent="space-between">
              <Link href="https://github.com/9OP/Encryptly/">
                <Button leftIcon={<GithubIcon />} variant="link">
                  Show me the code
                </Button>
              </Link>
              <HStack spacing="1rem">
                <Link href="/terms">
                  <Button variant="link" size="sm">
                    Terms
                  </Button>
                </Link>
                <Link href="/privacy">
                  <Button variant="link" size="sm">
                    Privacy
                  </Button>
                </Link>
              </HStack>
            </HStack>
          </VStack>
        </VStack>
      </Flex>

      <Flex
        width={{ base: '100%', lg: '55%' }}
        padding="2rem"
        backgroundColor="yellow.200"
        height="100vh"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <Heading marginBottom="3rem">How does it work?</Heading>

        <Image
          loading="lazy"
          src="/schema.png"
          alt="schema"
          width={{ base: '95%', md: '90%', lg: '85%', xl: '70%' }}
          zIndex="10"
          marginRight="3rem"
        />
        <Box
          position="absolute"
          bottom={0}
          right={0}
          width="15rem"
          height="30rem"
          opacity="0.6"
          backgroundImage="radial-gradient(purple.500 4px, #fff0 0px);"
          backgroundSize="60px 60px;"
        />
      </Flex>
    </Flex>
  );
};

export default Login;
