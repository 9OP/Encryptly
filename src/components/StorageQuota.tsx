import { CloudIcon } from "@app/components/Icons";
import { useDriveQuota } from "@app/hooks";
import formatBytes from "@app/lib/formatBytes";
import { Box, Flex, HStack, Progress, Spinner, Text } from "@chakra-ui/react";

const StorageQuota = () => {
  const { data } = useDriveQuota();

  return (
    <Box
      height="100%"
      padding="1.5rem"
      borderWidth="3px"
      borderRadius="10px"
      borderColor="black"
      boxShadow="-4px 4px 0px 0px #000"
      backgroundColor="blue.100"
    >
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
    </Box>
  );
};

export default StorageQuota;
