import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FC, useMemo, useState } from "react";

import { ShieldLockIcon } from "@app/components/Icons";
import { useAppData, useSaveAppData, useUserInfo } from "@app/hooks";
import { sha256 } from "@app/lib/crypto";
import { AppData } from "@app/models";
import { useNavigate } from "react-router-dom";

const SetPassphrase = () => {
  const [passphrase, setPassphrase] = useState("");
  const [confirm, setConfirm] = useState("");
  const saveAppData = useSaveAppData();
  const navigate = useNavigate();

  const onSetPassphrase = async () => {
    if (isValid) {
      const digest = await sha256(passphrase);
      await saveAppData(digest);
      navigate("/login");
    }
  };

  const isValid = useMemo(
    () => passphrase != "" && passphrase === confirm,
    [passphrase, confirm]
  );

  return (
    <VStack spacing="1rem">
      <FormControl isInvalid={passphrase === ""} isRequired>
        <FormLabel>Passphrase</FormLabel>
        <Input
          autoFocus
          size="sm"
          type="password"
          value={passphrase}
          onChange={(e) => setPassphrase(e.target.value.trim())}
          //
          _hover={{ boxShadow: "none" }}
          borderRadius="10px"
          borderWidth="2px"
          borderColor="black"
          boxShadow="-4px 4px 0px 0px #000"
        />
      </FormControl>

      <FormControl isInvalid={passphrase !== confirm} isRequired>
        <FormLabel>Confirm passphrase</FormLabel>
        <Input
          size="sm"
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value.trim())}
          //
          _hover={{ boxShadow: "none" }}
          borderRadius="10px"
          borderWidth="2px"
          borderColor="black"
          boxShadow="-4px 4px 0px 0px #000"
        />
        {isValid ? (
          <></>
        ) : (
          <FormErrorMessage>Passphrases are different.</FormErrorMessage>
        )}
      </FormControl>
      <Button
        size="md"
        width="100%"
        disabled={!isValid}
        onClick={onSetPassphrase}
        //
        _hover={{ boxShadow: "none" }}
        borderRadius={0}
        borderWidth="2px"
        borderColor="black"
        backgroundColor="rgb(209,252,135)"
        boxShadow="-4px 4px 0px 0px #000"
      >
        Set passphrase
      </Button>

      <Alert variant="subtle" borderRadius="6px">
        <AlertIcon />
        <VStack spacing="0" alignItems="flex-start">
          <AlertDescription>Set your *secret* passphrase</AlertDescription>
        </VStack>
      </Alert>
    </VStack>
  );
};

interface props {
  setEncryptionKey: (key: string, data: AppData) => Promise<void>;
}

const PassphraseForm: FC<props> = (props: props) => {
  const [passphrase, setPassphrase] = useState("");
  const { setEncryptionKey } = props;
  const { data: userInfo } = useUserInfo();
  const { data } = useAppData();

  const configExists = useMemo(() => data != null, [data]);

  const handleClick = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (data) {
      await setEncryptionKey(passphrase, data);
    }
  };

  return (
    <VStack spacing="1rem">
      <FormControl>
        <FormLabel fontSize="md" fontWeight="semibold" margin={0}>
          <HStack justifyContent="space-between">
            <Text>Passphrase</Text>
            <Text>{userInfo?.email ? `[${userInfo.email}]` : ""}</Text>
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
          //
          _hover={{ boxShadow: "none" }}
          borderRadius="10px"
          borderWidth="2px"
          borderColor="black"
          boxShadow="-4px 4px 0px 0px #000"
        />
      </FormControl>

      <Button
        leftIcon={<ShieldLockIcon />}
        size="lg"
        width="100%"
        onClick={handleClick}
        disabled={!passphrase}
        //
        _hover={{ boxShadow: "none" }}
        borderRadius={0}
        borderWidth="2px"
        borderColor="black"
        backgroundColor="rgb(209,252,135)"
        boxShadow="-4px 4px 0px 0px #000"
      >
        Unlock
      </Button>
    </VStack>
  );
};

const PassphraseInput: FC<props> = (props: props) => {
  const { data } = useAppData();
  const { setEncryptionKey } = props;

  const configExists = useMemo(() => data != null, [data]);

  return (
    <>
      {configExists ? (
        <PassphraseForm setEncryptionKey={setEncryptionKey} />
      ) : (
        <SetPassphrase />
      )}
    </>
  );
};

export default PassphraseInput;
