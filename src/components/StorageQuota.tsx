import { CloudIcon } from "@app/components/Icons";
import { useDriveQuota } from "@app/hooks";
import formatBytes from "@app/lib/formatBytes";
import { Flex, HStack, Progress, Spinner, Text } from "@chakra-ui/react";
import Card from "./Card";

const StorageQuota = () => {
  const { data } = useDriveQuota();

  return (
    <Card w="fit-content" backgroundColor="blue.100">
      <HStack marginBottom="0.5rem">
        <CloudIcon boxSize="1.2rem" />
        <Text fontWeight="semibold">Storage quota</Text>
      </HStack>
      <Flex justifyContent="center">
        {data ? (
          <Flex flexDirection="column" width="100%" alignItems="center">
            <Progress
              backgroundColor="white"
              colorScheme="blue"
              width="100%"
              value={(data?.usage / data?.limit) * 100}
              size="xs"
              borderRadius="10px"
            />
            <Text fontWeight="semibold" fontSize="xs" marginTop="0.2rem">
              {formatBytes(data?.usage)} used on {formatBytes(data?.limit)}
            </Text>
          </Flex>
        ) : (
          <Spinner speed="0.65s" emptyColor="gray.200" color="blue.500" />
        )}
      </Flex>
    </Card>
  );
};

export default StorageQuota;
