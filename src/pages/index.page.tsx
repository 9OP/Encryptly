import { Dispatch, FC, SetStateAction, useContext, useState } from "react";
import {
  Box,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  VStack,
} from "@chakra-ui/react";
import { AppContext } from "@app/context";
import StorageQuota from "@app/pages/components/storage";
import { CloseIcon, SearchIcon } from "@app/pages/components/icons";

const SearchBar = (props: { search: string; setSearch: Dispatch<SetStateAction<string>> }) => {
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
  const { accessToken, encryptionKey } = useContext(AppContext);
  const [search, setSearch] = useState("");

  return (
    <Box margin="2rem" w="60%">
      <HStack>
        <StorageQuota />
        <SearchBar search={search} setSearch={setSearch} />
      </HStack>
    </Box>
  );
};

export default Index;
