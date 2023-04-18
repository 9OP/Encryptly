import { Dispatch, FC, SetStateAction, useState } from "react";
import {
  Box,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  VStack,
} from "@chakra-ui/react";
import StorageQuota from "@app/pages/components/storage";
import { CloseIcon, SearchIcon } from "@app/pages/components/icons";
import FilesList from "./components/files";

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

const Index: FC = () => {
  const [search, setSearch] = useState("");

  return (
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
          <SearchBar search={search} setSearch={setSearch} />
        </HStack>
        <Flex w="100%" borderWidth="1px" padding="1.5rem" borderRadius="6px">
          <FilesList search={search} />
        </Flex>
      </VStack>
    </Flex>
  );
};

export default Index;
