import { Input, InputGroup } from "@chakra-ui/react";
import React, { FC, ReactNode, useRef } from "react";

type props = {
  onSubmit: (files: File[]) => void;
  children: ReactNode;
  multiple?: boolean;
  accepted?: string;
};

const FileUpload: FC<props> = (props: props) => {
  const { onSubmit, children, multiple, accepted } = props;
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => inputRef.current?.click();

  const handleDrop = (ev: React.DragEvent<HTMLInputElement>) => {
    ev.preventDefault();
    const files = ev.dataTransfer.files;
    if ([...files].length) {
      onSubmit([...files]);
    }
  };

  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const files = ev?.target?.files;
    if (files) {
      if ([...files].length) {
        onSubmit([...files]);
      }
    }
  };

  return (
    <InputGroup
      width="100%"
      // width="fit-content"
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "copy";
      }}
      onDragStart={(e) => {
        e.preventDefault();
        e.dataTransfer.effectAllowed = "copyMove";
      }}
      _active={{ cursor: "grab" }}
    >
      <input
        type="file"
        hidden
        multiple={multiple}
        accept={accepted || "*"}
        ref={(e) => {
          inputRef.current = e;
        }}
        onChange={handleChange}
      />
      <>{children}</>
    </InputGroup>
  );
};

export default FileUpload;
