import React, { FC, ReactNode, useState } from 'react';
import { handleDataItem } from '@app/lib/files';
import { Box, useToast } from '@chakra-ui/react';

interface DropZoneProps {
  onUpload: (files: File[]) => Promise<void>;
  children: ReactNode;
}

const DropZone: FC<DropZoneProps> = (props: DropZoneProps) => {
  const { children, onUpload } = props;
  const [dragOver, setDragOver] = useState(false);
  const toast = useToast();

  const handleDrop = async (event: React.DragEvent<HTMLInputElement>) => {
    event.preventDefault();
    setDragOver(false);

    const items = [...event.dataTransfer.items];
    const files = await handleDataItem(items);

    try {
      if ([...files].length) {
        await onUpload([...files]);
      }
    } catch (err) {
      toast.closeAll();
      toast({
        position: 'bottom-right',
        duration: 5000,
        isClosable: true,
        title: 'Error uploading file',
        description: (err as Error).message,
        status: 'error',
      });
    }
  };

  return (
    <Box
      display="flex"
      width="100%"
      height="100vh"
      onDrop={handleDrop}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setDragOver(false);
      }}
    >
      {dragOver && (
        <Box
          // overlay
          display="flex"
          position="absolute"
          bg="blue.700"
          opacity="0.2"
          zIndex="10"
          width="100%"
          height="100vh"
        ></Box>
      )}
      <>{children}</>
    </Box>
  );
};

export default DropZone;
