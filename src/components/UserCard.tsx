import { AppContext } from "@app/context";
import { useUserInfo } from "@app/hooks";
import { saveFile } from "@app/lib/files";
import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tag,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { FC, useContext, useRef } from "react";
import { SecretIcon } from "./Icons";
import LogoutButton from "./LogoutButton";

interface PropsModal {
  onDownload: () => void;
  onClose: () => void;
  isOpen: boolean;
}

const InfoModal: FC<PropsModal> = (props: PropsModal) => {
  const { onDownload, onClose, isOpen } = props;

  const handleDownload = () => {
    onDownload();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent
        backgroundColor="blue.500"
        color="white"
        borderWidth="3px"
        borderRadius="6px"
        borderColor="black"
        boxShadow="-4px 4px 0px 0px #000"
      >
        <ModalHeader>Info</ModalHeader>
        <ModalBody>
          Backup your encryption key securely. Anyone with your key is able to decrypt your files.
          <br />
          <br />
          <Tag colorScheme="blue">Do not store your key on Google Drive !</Tag>
        </ModalBody>

        <ModalFooter>
          <Button
            borderRadius={0}
            borderWidth="3px"
            borderColor="black"
            backgroundColor="blue.600"
            color="white"
            boxShadow="-2px 2px 0px 0px #000"
            _hover={{ boxShadow: "none" }}
            onClick={handleDownload}
          >
            Download my key
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const UserCard: FC = () => {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const { data: user } = useUserInfo();
  const { encryptionKey } = useContext(AppContext);
  const ref = useRef<HTMLAnchorElement>(null);

  const onDownload = () => {
    saveFile([encryptionKey.value], `${user?.email}_key.txt`, "text/plain", ref);
  };

  return (
    <VStack
      spacing="1.5rem"
      align="flex-end"
      justifyContent="flex-end"
      height="100%"
      padding="1.5rem"
      borderWidth="3px"
      borderRadius="6px"
      borderColor="black"
      boxShadow="-4px 4px 0px 0px #000"
      backgroundColor="rgb(209,252,135)"
    >
      <Text fontSize="md" fontWeight="semibold">
        [{user?.email}]
      </Text>
      <HStack justifyContent="space-between" w="100%">
        <Button
          colorScheme="black"
          size="md"
          leftIcon={<SecretIcon boxSize="1.5rem" />}
          variant="link"
          onClick={onOpen}
        >
          key
        </Button>
        <InfoModal onDownload={onDownload} onClose={onClose} isOpen={isOpen} />
        <a hidden ref={ref} />

        <LogoutButton />
      </HStack>
    </VStack>
  );
};

export default UserCard;
