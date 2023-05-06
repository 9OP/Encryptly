import { FC, useMemo, useState } from 'react';
import { SecretIcon, ShieldLockIcon } from '@app/components/Icons';
import { useAppData, useSaveAppData, useUserInfo } from '@app/hooks';
import { sha256 } from '@app/lib/crypto';
import { WrappedKey } from '@app/models';
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';

const SetPassphrase = () => {
  const [loading, setLoading] = useState(false);
  const [passphrase, setPassphrase] = useState('');
  const [confirm, setConfirm] = useState('');
  const saveAppData = useSaveAppData();

  const onSetPassphrase = async () => {
    setLoading(true);
    if (isValid) {
      const digest = await sha256(passphrase);
      console.log('set passphrase', digest);
      await saveAppData(digest);
    }
    setLoading(false);
  };

  const isValid = useMemo(
    () => passphrase != '' && passphrase === confirm,
    [passphrase, confirm],
  );

  return (
    <VStack spacing="1rem">
      <FormControl isInvalid={passphrase === ''} isRequired>
        <FormLabel>Passphrase</FormLabel>
        <Input
          autoFocus
          size="sm"
          placeholder="passphrase..."
          type="password"
          value={passphrase}
          onChange={(e) => setPassphrase(e.target.value.trim())}
        />
      </FormControl>

      <FormControl isInvalid={passphrase !== confirm} isRequired>
        <FormLabel>Confirm passphrase</FormLabel>
        <Input
          size="sm"
          placeholder="passphrase..."
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value.trim())}
        />
        {isValid ? (
          <></>
        ) : (
          <FormErrorMessage>Passphrases are different.</FormErrorMessage>
        )}
      </FormControl>
      <Button
        leftIcon={<SecretIcon />}
        size="md"
        width="100%"
        variant="solid"
        isDisabled={!isValid}
        isLoading={loading}
        onClick={onSetPassphrase}
        colorScheme="yellow"
        backgroundColor="yellow.200"
      >
        Set passphrase
      </Button>
    </VStack>
  );
};

interface props {
  setEncryptionKey: (key: string, wrappedKey: WrappedKey) => Promise<void>;
}

const PassphraseForm: FC<props> = (props: props) => {
  const [passphrase, setPassphrase] = useState('');
  const { setEncryptionKey } = props;
  const { data: userInfo } = useUserInfo();
  const { data } = useAppData();

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    event.stopPropagation();

    if (data) {
      await setEncryptionKey(passphrase, data.encryptionKey);
    }
  };

  return (
    <VStack spacing="1rem">
      <FormControl>
        <FormLabel fontSize="md" fontWeight="semibold" margin={0}>
          <HStack justifyContent="space-between">
            <Text>Passphrase</Text>
            <Text>{userInfo?.email ? `[${userInfo.email}]` : ''}</Text>
          </HStack>
        </FormLabel>
        <Input
          marginTop="0.8rem"
          autoFocus
          placeholder="passphrase..."
          size="md"
          type="password"
          value={passphrase}
          onChange={(e) => setPassphrase(e.target.value.trim())}
        />
      </FormControl>

      <Button
        leftIcon={<ShieldLockIcon />}
        size="lg"
        width="100%"
        onClick={handleClick}
        isDisabled={!passphrase}
        colorScheme="yellow"
        backgroundColor="yellow.200"
      >
        Unlock
      </Button>
    </VStack>
  );
};

const PassphraseInput: FC<props> = (props: props) => {
  const { data, isLoading } = useAppData();
  const { setEncryptionKey } = props;

  return (
    <>
      {isLoading ? (
        <Box display="flex" alignItems="center" justifyContent="center">
          <Spinner
            emptyColor="gray.200"
            thickness="3px"
            size="lg"
            color="blue.500"
            speed="0.4s"
          />
        </Box>
      ) : (
        <>
          {data != null ? (
            <PassphraseForm setEncryptionKey={setEncryptionKey} />
          ) : (
            <SetPassphrase />
          )}
        </>
      )}
    </>
  );
};

export default PassphraseInput;
