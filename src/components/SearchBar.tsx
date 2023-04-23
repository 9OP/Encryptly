import { useListFiles } from "@app/hooks";
import formatBytes from "@app/lib/formatBytes";
import {
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Tag,
  VStack,
} from "@chakra-ui/react";
import { Dispatch, FC, SetStateAction } from "react";
import { CloseIcon, SearchIcon } from "./Icons";

interface props {
  storageCount: number;
  filesCount: number;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
}

const SearchBar: FC<props> = (props: props) => {
  const { search, setSearch, filesCount, storageCount } = props;
  const { data: files } = useListFiles();

  return (
    <VStack
      flex={1}
      width="100%"
      height="100%"
      padding="1.5rem"
      borderWidth="3px"
      borderRadius="10px"
      borderColor="black"
      boxShadow="-4px 4px 0px 0px #000"
      backgroundColor="yellow.200"
    >
      <HStack w="100%">
        <Tag size="md" colorScheme="purple" fontWeight="semibold">
          Files: {filesCount}
        </Tag>
        <Tag size="md" colorScheme="blue" fontWeight="semibold">
          Content: {formatBytes(storageCount)}
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
          borderRadius="10px"
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

export default SearchBar;
