import { Button } from '@chakra-ui/react';
import { FC, useRef } from 'react';

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
        minH="3rem"
        w="100%"
        colorScheme="yellow"
        backgroundColor="yellow.200"
        onClick={handleClick}
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
