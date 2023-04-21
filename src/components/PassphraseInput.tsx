import { useState, FC } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  HStack,
  Text,
} from "@chakra-ui/react";

import { useAppData, useUserInfo } from "@app/hooks";
import { ShieldLockIcon } from "@app/components/Icons";
import { AppData } from "@app/models";

const PassphraseInput = (props: {
  setEncryptionKey: (key: string, data: AppData) => Promise<void>;
}) => {
  const [passphrase, setPassphrase] = useState("");
  const { setEncryptionKey } = props;
  const { data: userInfo } = useUserInfo();
  const { data } = useAppData();

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
        <FormLabel fontSize="md" fontWeight="semibold">
          <HStack justifyContent="space-between">
            <Text>Passphrase</Text>
            <Text>{userInfo?.email ? `[${userInfo.email}]` : ""}</Text>
          </HStack>
        </FormLabel>
        <Input
          autoFocus
          placeholder="passphrase..."
          size="md"
          type="password"
          value={passphrase}
          onChange={(e) => setPassphrase(e.target.value.trim())}
          //
          _hover={{ boxShadow: "none" }}
          borderRadius="6px"
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

export default PassphraseInput;
