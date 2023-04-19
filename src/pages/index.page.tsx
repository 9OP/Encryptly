import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import {
  Box,
  Text,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  VStack,
  useToast,
  ToastId,
} from "@chakra-ui/react";
import StorageQuota from "@app/pages/components/storage";
import { CloseIcon, SearchIcon } from "@app/pages/components/icons";
import FilesList from "./components/files";
import {
  revalidateListFiles,
  useEncryptFile,
  useUploadFile,
  useUserInfo,
} from "@app/hooks";
import LogoutButton from "./components/logoutButton";
import DropZone from "./components/dropZone";
import files from "./components/files";
import UploadFeedback from "./components/uploadFeedback";

interface props {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
}

const SearchBar: FC<props> = (props: props) => {
  const { search, setSearch } = props;

  return (
    <InputGroup width="18rem" size="sm">
      <InputLeftElement pointerEvents="none" paddingLeft=".4rem">
        <SearchIcon color="gray.400" boxSize="1.2rem" />
      </InputLeftElement>
      <Input
        bg="white"
        placeholder="search..."
        value={search}
        borderRadius="6px"
        onChange={(e) => setSearch(e.target.value)}
      />
      <InputRightElement
        hidden={search === ""}
        color="gray.400"
        onClick={() => setSearch("")}
        cursor="pointer"
      >
        <CloseIcon />
      </InputRightElement>
    </InputGroup>
  );
};

type UploadStep = "ENCRYPTING" | "UPLOADING";

const Index: FC = () => {
  const [search, setSearch] = useState("");
  const { data: user } = useUserInfo();
  const uploadFile = useUploadFile();
  const encryptFile = useEncryptFile();

  const toast = useToast();
  const [submitCount, setSubmitCount] = useState(0);
  const [steps, setSteps] = useState<{ [name: string]: UploadStep }>({});
  const [progress, setProgress] = useState<{ [name: string]: number }>({});
  const [toastId, setToastId] = useState<ToastId>("");
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    if (toastId) {
      toast.update(toastId, {
        render: () => (
          <UploadFeedback files={files} steps={steps} progress={progress} />
        ),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [steps, progress, files]);

  useEffect(() => {
    if (submitCount === 0 && toastId) {
      toast.close(toastId);
      toast({
        position: "bottom-right",
        duration: 5000,
        isClosable: true,
        title: `${files.length} files uploaded`,
        status: "success",
      });

      setToastId("");
      setProgress({});
      setSteps({});
      setFiles([]);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitCount]);

  const onSubmit = async (fls: File[]) => {
    if (!fls.length) {
      return;
    }

    setSubmitCount((count) => count + 1);
    setFiles((prev) => [...prev, ...fls]);

    if (!toastId) {
      setToastId(
        toast({
          position: "bottom-right",
          duration: null,
          isClosable: true,
          render: () => (
            <UploadFeedback files={files} steps={steps} progress={progress} />
          ),
        })
      );
    }

    await Promise.all(
      fls.map(async (file) => {
        setSteps((prev) => ({ ...prev, [file.name]: "ENCRYPTING" }));
        const data = await encryptFile(file);

        setSteps((prev) => ({ ...prev, [file.name]: "UPLOADING" }));
        const gen = await uploadFile({ name: file.name, data });

        for await (const value of gen) {
          setProgress((prev) => ({ ...prev, [file.name]: value }));
        }
      })
    );

    await revalidateListFiles();
    setSubmitCount((count) => count - 1);
  };

  return (
    <DropZone onSubmit={onSubmit}>
      <Flex margin="2rem" w="100%" justifyContent="center">
        <VStack w="60%" spacing="1rem">
          <HStack
            w="100%"
            justifyContent="space-between"
            borderWidth="1px"
            padding="1.5rem"
            borderRadius="6px"
          >
            <StorageQuota />
            <VStack align="flex-end">
              <HStack>
                <Text fontSize="sm" fontWeight="medium" opacity="0.7">
                  {user?.email}
                </Text>
                <LogoutButton />
              </HStack>
              <SearchBar search={search} setSearch={setSearch} />
            </VStack>
          </HStack>
          <Flex w="100%" borderWidth="1px" padding="1.5rem" borderRadius="6px">
            <FilesList search={search} />
          </Flex>
        </VStack>
      </Flex>
    </DropZone>
  );
};

export default Index;
