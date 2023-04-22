import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  CircularProgress,
  HStack,
  VStack,
  Text,
} from "@chakra-ui/react";
import formatBytes from "@app/lib/formatBytes";
import { ShieldLockIcon, CheckIcon } from "./Icons";
import { FC } from "react";

interface props {
  files: File[];
  steps: { [name: string]: "ENCRYPTING" | "UPLOADING" };
  progress: { [name: string]: number };
}

const UploadFeedback: FC<props> = (props: props) => {
  const { files, progress, steps } = props;

  return (
    <Alert status="info" width="100%">
      <AlertIcon />
      <VStack spacing={0} alignItems="flex-start" justifyContent="center">
        <AlertTitle>Uploading ...</AlertTitle>
        <AlertDescription>
          {files.map((f, i) => {
            const value = progress[f.name] || 0;

            return (
              <HStack key={i} alignItems="center" justifyContent="flex-start">
                {steps[f.name] === "ENCRYPTING" && <ShieldLockIcon boxSize="1rem" color="white" />}
                {steps[f.name] === "UPLOADING" &&
                  (value < 100 ? (
                    <CircularProgress
                      value={value}
                      color="blue.700"
                      trackColor="white"
                      size="16px"
                      thickness="20px"
                    />
                  ) : (
                    <CheckIcon boxSize="1rem" color="white" />
                  ))}
                <Text
                  fontWeight="medium"
                  maxWidth="15rem"
                  whiteSpace="nowrap"
                  overflow="hidden"
                  textOverflow="ellipsis"
                >
                  {f.name}
                </Text>
                <Text fontWeight="semibold">{formatBytes(f.size)}</Text>
              </HStack>
            );
          })}
        </AlertDescription>
      </VStack>
    </Alert>
  );
};

export default UploadFeedback;
