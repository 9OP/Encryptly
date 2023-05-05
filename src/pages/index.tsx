import Card from '@app/components/Card';
import DropZone from '@app/components/DropZone';
import FileTable from '@app/components/FileTable';
import SearchBar from '@app/components/SearchBar';
import StorageQuota from '@app/components/StorageQuota';
import Upload, { UploadHandle } from '@app/components/Upload';
import UploadButton from '@app/components/UploadButton';
import UserCard from '@app/components/UserCard';
import { Flex, Stack, VStack } from '@chakra-ui/react';
import { FC, useRef, useState } from 'react';

const Index: FC = () => {
  const [search, setSearch] = useState('');
  const [filesCount, setFilesCount] = useState(0);
  const [storageCount, setStorageCount] = useState(0);

  const ref = useRef<UploadHandle>(null);

  const handleUpload = async (files: File[]) => {
    await ref?.current?.onSubmit(files);
  };

  return (
    <Upload ref={ref}>
      <DropZone onUpload={handleUpload}>
        <Flex
          padding="2rem"
          w="100%"
          justifyContent="center"
          backgroundImage="radial-gradient(purple.600 1.3px, #fff 1.25px);"
          backgroundSize="30px 30px;"
        >
          <VStack w={{ base: '100%', md: '90%', lg: '80%', xl: '60%' }} spacing="1rem">
            <Stack
              w="100%"
              justifyContent="space-between"
              spacing="1rem"
              direction={{ base: 'column', md: 'row' }}
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
            <UploadButton onUpload={handleUpload} />
            <Card backgroundColor="purple.200" w="100%">
              <FileTable
                search={search}
                setFilesCount={setFilesCount}
                setStorageCount={setStorageCount}
              />
            </Card>
          </VStack>
        </Flex>
      </DropZone>
    </Upload>
  );
};

export default Index;
