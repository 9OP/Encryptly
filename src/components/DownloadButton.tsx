import { IconButton, Spinner, useToast } from "@chakra-ui/react";
import { useCallback, useRef, useState, FC } from "react";
import { DownloadIcon, ShieldLockIcon } from "./Icons";
import { useDecryptFile, useDownloadFile } from "@app/hooks";
import { saveFile } from "@app/lib/fileSaver";

interface props {
  fileId: string;
}

const DownloadButton: FC<props> = (props: props) => {
  const { fileId } = props;
  const toast = useToast();
  const [downloading, setDownloading] = useState(false);
  const [decrypting, setDecrypting] = useState(false);
  const downloadFile = useDownloadFile();
  const decryptFile = useDecryptFile();

  const ref = useRef<HTMLAnchorElement>(null);

  const handleClick = useCallback(async () => {
    setDownloading(true);
    const { data, metadata } = await downloadFile(fileId);
    setDownloading(false);

    setDecrypting(true);
    try {
      const fileData = await decryptFile(data);
      saveFile([fileData], metadata.name, metadata.mimeType, ref);
    } catch (err) {
      toast({
        position: "bottom-right",
        duration: 5000,
        isClosable: true,
        title: "Error decrypting file",
        description: (err as Error).message,
        status: "error",
        variant: "toast",
      });
    } finally {
      setDecrypting(false);
    }
  }, [decryptFile, downloadFile, fileId]);

  return (
    <>
      <IconButton
        id={`d-${fileId}`}
        visibility={downloading || decrypting ? "visible" : "hidden"}
        variant="none"
        color="blue.500"
        aria-label="download"
        icon={
          downloading ? (
            <Spinner />
          ) : decrypting ? (
            <ShieldLockIcon boxSize="1.5rem" />
          ) : (
            <DownloadIcon boxSize="1.5rem" />
          )
        }
        onClick={handleClick}
        disabled={downloading || decrypting}
      />
      <a hidden ref={ref} />
    </>
  );
};

export default DownloadButton;
