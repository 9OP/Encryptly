import { useState, FC } from "react";
import { FormControl, FormLabel, Input, Button, VStack } from "@chakra-ui/react";

import { useAppData } from "@app/hooks";
import { ShieldLockIcon } from "@app/pages/components/icons";
import { AppData } from "@app/models";

const PassphraseInput = (props: {
  setEncryptionKey: (key: string, data: AppData) => Promise<void>;
}) => {
  const [passphrase, setPassphrase] = useState("");
  const { setEncryptionKey } = props;
  const { data } = useAppData();

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    event.stopPropagation();

    if (data) {
      await setEncryptionKey(passphrase, data);
    }
  };

  return (
    <VStack spacing="1rem">
      <FormControl>
        <FormLabel>Passphrase</FormLabel>
        <Input
          autoFocus
          size="md"
          type="password"
          value={passphrase}
          onChange={(e) => setPassphrase(e.target.value.trim())}
        />
      </FormControl>

      <Button
        leftIcon={<ShieldLockIcon />}
        variant="solid"
        colorScheme="blue"
        boxShadow="base"
        size="lg"
        width="100%"
        onClick={handleClick}
        disabled={!passphrase}
      >
        Unlock
      </Button>
    </VStack>
  );
};

export default PassphraseInput;
