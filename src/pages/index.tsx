import {
  Dispatch,
  FC,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
  Badge,
  Tag,
  Button,
} from "@chakra-ui/react";
import StorageQuota from "@app/components/StorageQuota";
import { CloseIcon, SearchIcon, SecretIcon } from "@app/components/Icons";
import FilesList from "../components/FileTable";
import { useListFiles, useUserInfo } from "@app/hooks";
import LogoutButton from "@app/components/LogoutButton";
import DropZone from "@app/components/DropZone";
import formatBytes from "@app/lib/formatBytes";
import { AppContext } from "@app/context";

interface props {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
}

const SearchBar: FC<props> = (props: props) => {
  const { search, setSearch } = props;
  const { data: files } = useListFiles();

  const nbFiles = useMemo(() => files?.length || 0, [files]);
  const quantity = useMemo(
    () => files?.reduce((acc, { size }) => acc + size, 0),
    [files]
  );

  return (
    <VStack
      flex={1}
      height="100%"
      padding="1.5rem"
      borderWidth="3px"
      borderRadius="6px"
      borderColor="black"
      boxShadow="-4px 4px 0px 0px #000"
      backgroundColor="yellow.200"
    >
      <HStack w="100%">
        <Tag size="md" colorScheme="purple" fontWeight="semibold">
          Files: {nbFiles}
        </Tag>
        <Tag size="md" colorScheme="blue" fontWeight="semibold">
          Content: {formatBytes(quantity || 0)}
        </Tag>
      </HStack>
      <InputGroup width="18rem" size="sm" w="100%">
        <InputLeftElement pointerEvents="none" paddingLeft=".4rem">
          <SearchIcon color="gray.400" boxSize="1.2rem" />
        </InputLeftElement>
        <Input
          bg="white"
          placeholder="search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          //
          _hover={{ boxShadow: "none" }}
          borderRadius="6px"
          borderWidth="2px"
          borderColor="black"
          boxShadow="-4px 4px 0px 0px #000"
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
    </VStack>
  );
};

const UserCard: FC = () => {
  const { data: user } = useUserInfo();
  const { encryptionKey } = useContext(AppContext);
  const ref = useRef<HTMLAnchorElement>(null);

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    const name = `${user?.email}_key.txt`;

    const file = new File([encryptionKey.value], name, {
      type: "text/plain",
    });

    const objectUrl = URL.createObjectURL(file);

    if (ref.current) {
      ref.current.href = objectUrl;
      ref.current.download = name;
      ref.current.click();
    }
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
          leftIcon={<SecretIcon boxSize="1.5rem"/>}
          variant="link"
          onClick={handleClick}
        >
          key
        </Button>
        <a hidden ref={ref} />
        <LogoutButton />
      </HStack>
    </VStack>
  );
};

const Index: FC = () => {
  const [search, setSearch] = useState("");

  return (
    <DropZone>
      <Flex
        padding="2rem"
        w="100%"
        justifyContent="center"
        backgroundImage="radial-gradient(#444cf7 1.25px, #fff 1.25px);"
        backgroundSize="30px 30px;"
      >
        <VStack w="60%" spacing="1rem">
          <HStack w="100%" justifyContent="space-between" spacing="1rem">
            <StorageQuota />
            <SearchBar search={search} setSearch={setSearch} />
            <UserCard />
          </HStack>
          <Flex
            w="100%"
            padding="1.5rem"
            borderWidth="3px"
            borderRadius="6px"
            borderColor="black"
            boxShadow="-4px 4px 0px 0px #000"
            backgroundColor="purple.200"
          >
            <FilesList search={search} />
          </Flex>
        </VStack>
      </Flex>
    </DropZone>
  );
};

export default Index;
