import DropZone from "@app/components/DropZone";
import SearchBar from "@app/components/SearchBar";
import StorageQuota from "@app/components/StorageQuota";
import UserCard from "@app/components/UserCard";
import { Flex, HStack, VStack } from "@chakra-ui/react";
import { FC, useState } from "react";
import FilesList from "../components/FileTable";

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
