import DropZone from "@app/components/DropZone";
import FileTable from "@app/components/FileTable";
import SearchBar from "@app/components/SearchBar";
import StorageQuota from "@app/components/StorageQuota";
import UserCard from "@app/components/UserCard";
import { Flex, Stack, VStack, useBreakpoint } from "@chakra-ui/react";
import { FC, useState } from "react";

const Index: FC = () => {
  const [search, setSearch] = useState("");
  const [filesCount, setFilesCount] = useState(0);
  const [storageCount, setStorageCount] = useState(0);
  const value = useBreakpoint();

  return (
    <DropZone>
      <Flex
        padding="2rem"
        w="100%"
        justifyContent="center"
        backgroundImage="radial-gradient(#444cf7 1.25px, #fff 1.25px);"
        backgroundSize="30px 30px;"
      >
        <VStack w={{ base: "100%", md: "90%", lg: "80%", xl: "60%" }} spacing="1rem">
          <Stack
            w="100%"
            justifyContent="space-between"
            spacing="1rem"
            direction={{ base: "column", md: "row" }}
          >
            <StorageQuota />
            <SearchBar
              search={search}
              setSearch={setSearch}
              filesCount={filesCount}
              storageCount={storageCount}
            />
            <UserCard />
          </Stack>
          <Flex
            w="100%"
            padding="1.5rem"
            borderWidth="3px"
            borderRadius="6px"
            borderColor="black"
            boxShadow="-4px 4px 0px 0px #000"
            backgroundColor="purple.200"
          >
            <FileTable
              search={search}
              setFilesCount={setFilesCount}
              setStorageCount={setStorageCount}
            />
          </Flex>
        </VStack>
      </Flex>
    </DropZone>
  );
};

export default Index;
