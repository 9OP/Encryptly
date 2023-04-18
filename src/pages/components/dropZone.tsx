import { Box } from "@chakra-ui/react";
import React, { FC, ReactNode } from "react";

type props = {
  onSubmit: (files: File[]) => void;
  children: ReactNode;
  multiple?: boolean;
  accepted?: string;
};

const DropZone: FC<props> = (props: props) => {
  const { onSubmit, children } = props;

  const handleDrop = (event: React.DragEvent<HTMLInputElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    
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
      onDragOver={(e) => e.preventDefault()}
    >
      {/* <input
        type="file"
        hidden
        multiple={multiple}
        accept={accepted || "*"}
        ref={(e) => {
          inputRef.current = e;
        }}
        onChange={handleChange}
      /> */}
      <>{children}</>
    </Box>
  );
};

export default DropZone;
