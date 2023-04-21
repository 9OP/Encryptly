import {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useMemo,
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
} from "@chakra-ui/react";
import StorageQuota from "@app/components/StorageQuota";
import { CloseIcon, SearchIcon } from "@app/components/Icons";
import FilesList from "../components/FileTable";
import { useListFiles, useUserInfo } from "@app/hooks";
import LogoutButton from "@app/components/LogoutButton";
import DropZone from "@app/components/DropZone";
import formatBytes from "@app/lib/formatBytes";

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
      backgroundColor="rgb(209,252,135)"
      spacing="1.5rem"
    >
      <InputGroup width="18rem" size="sm">
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
      <HStack>
        <Text fontWeight="semibold">Files: {nbFiles}</Text>
        <Text fontWeight="semibold">
          Encrypted content: {formatBytes(quantity || 0)}
        </Text>
      </HStack>
    </VStack>
  );
};

const UserCard: FC = () => {
  const { data: user } = useUserInfo();

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
      <LogoutButton />
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
        backgroundImage="radial-gradient(#444cf7 1px, #fff 1px);"
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
            backgroundColor="rgb(209,252,135)"
          >
            <FilesList search={search} />
          </Flex>
        </VStack>
      </Flex>
    </DropZone>
  );
};

export default Index;
