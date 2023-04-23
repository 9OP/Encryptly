import { useDeleteFile, useListFiles } from "@app/hooks";
import { FileMetadata } from "@app/models";
import {
  Button,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Tag,
  useDisclosure,
} from "@chakra-ui/react";
import { FC, useMemo, useState } from "react";
import { TrashIcon } from "./Icons";

interface PropsModal {
  onDelete: () => Promise<void>;
  file: FileMetadata;
  onClose: () => void;
  isOpen: boolean;
}

const DeleteModal: FC<PropsModal> = (props: PropsModal) => {
  const { file, onDelete, onClose, isOpen } = props;
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onDelete();
      onClose();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent
        backgroundColor="red.500"
        color="white"
        borderWidth="3px"
        borderRadius="10px"
        borderColor="black"
        boxShadow="-4px 4px 0px 0px #000"
      >
        <ModalHeader>Delete</ModalHeader>
        <ModalBody>
          Are your sure to delete <Tag colorScheme="red">{file.name}</Tag> ?
        </ModalBody>

        <ModalFooter>
          <Button
            autoFocus
            mr={3}
            onClick={onClose}
            borderRadius={0}
            borderWidth="3px"
            borderColor="black"
            backgroundColor="white"
            color="black"
            boxShadow="-2px 2px 0px 0px #000"
            _hover={{ boxShadow: "none" }}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button
            borderRadius={0}
            borderWidth="3px"
            borderColor="black"
            backgroundColor="red.600"
            color="white"
            boxShadow="-2px 2px 0px 0px #000"
            _hover={{ boxShadow: "none" }}
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? <Spinner /> : "Delete"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

interface PropsButton {
  fileId: string;
}

const DeleteButton: FC<PropsButton> = (props: PropsButton) => {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const { fileId } = props;
  const deleteFile = useDeleteFile();
  const { data: files } = useListFiles();

  const file = useMemo(() => files?.find(({ id }) => id === fileId), [files]);

  const onDelete = async () => {
    await deleteFile(fileId);
  };

  return (
    <>
      <IconButton
        id={`delete-${fileId}`}
        visibility="hidden"
        variant="none"
        color="black"
        aria-label="delete"
        icon={<TrashIcon />}
        onClick={onOpen}
      />
      {file && <DeleteModal file={file} onDelete={onDelete} onClose={onClose} isOpen={isOpen} />}
    </>
  );
};

export default DeleteButton;
