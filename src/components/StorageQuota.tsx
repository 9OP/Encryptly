import { Box, HStack, Text, Flex, Progress, Spinner } from "@chakra-ui/react";
import formatBytes from "@app/lib/formatBytes";
import { useDriveQuota } from "@app/hooks";
import { CloudIcon } from "@app/components/Icons";

const StorageQuota = () => {
  const { data } = useDriveQuota();

  return (
    <Box color="gray.500">
      <HStack marginBottom="0.5rem">
        <CloudIcon boxSize="1.2rem" />
        <Text fontWeight="semibold" fontSize="sm">
          Storage quota
        </Text>
      </HStack>
      <Flex justifyContent="center">
        {data ? (
          <Flex flexDirection="column" width="100%" alignItems="center">
            <Progress
              bg="#e0e0e0"
              width="100%"
              value={(data?.usage / data?.limit) * 100}
              borderRadius="2px"
              size="xs"
            />
            <Text fontWeight="semibold" fontSize="xs" marginTop="0.2rem">
              {formatBytes(data?.usage)} used on {formatBytes(data?.limit)}
            </Text>
          </Flex>
        ) : (
          <Spinner speed="0.65s" emptyColor="gray.200" color="blue.500" />
        )}
      </Flex>
    </Box>
  );
};

export default StorageQuota;
