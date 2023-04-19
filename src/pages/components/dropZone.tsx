import { Box } from "@chakra-ui/react";
import React, { FC, ReactNode, useState } from "react";

type props = {
  onSubmit: (files: File[]) => void;
  children: ReactNode;
  multiple?: boolean;
  accepted?: string;
};

const DropZone: FC<props> = (props: props) => {
  const { onSubmit, children } = props;
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = (event: React.DragEvent<HTMLInputElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    setDragOver(false);

    if ([...files].length) {
      onSubmit([...files]);
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
