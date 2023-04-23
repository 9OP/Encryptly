import { Button } from "@chakra-ui/react";
import { FC, useRef } from "react";

interface UploadButtonProps {
  onUpload: (files: File[]) => Promise<void>;
}

const UploadButton: FC<UploadButtonProps> = (props: UploadButtonProps) => {
  const { onUpload } = props;
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => inputRef.current?.click();

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const items = [...(event.target.files || [])];
    // const files = await handleDataItem(items as DataTransferItem[]);

    if (items) {
      if ([...items].length) {
        await onUpload([...items]);
      }
    }
  };

  return (
    <>
      <Button
        size="lg"
        w="100%"
        _hover={{ boxShadow: "none" }}
        onClick={handleClick}
        //
        borderRadius={0}
        borderWidth="3px"
        borderColor="black"
        backgroundColor="rgb(209,252,135)"
        boxShadow="-4px 4px 0px 0px #000"
      >
        Upload 🚀
      </Button>
      <input
        // webkitdirectory=""
        // directory=""
        type="file"
        accept="*"
        multiple={true}
        ref={(e) => (inputRef.current = e)}
        onChange={handleChange}
        hidden
      />
    </>
  );
};

export default UploadButton;
