import { IconButton, Spinner } from "@chakra-ui/react";
import { useCallback, useRef, useState, FC } from "react";
import { DownloadIcon, ShieldLockIcon } from "./icons";
import { useDecryptFile, useDownloadFile } from "@app/hooks";

interface props {
  fileId: string;
}

const DownloadButton: FC<props> = (props: props) => {
  const { fileId } = props;
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
    const fileData = await decryptFile(data);
    setDecrypting(false);

    const file = new File([fileData], metadata.name, {
      type: metadata.mimeType,
    });
    const objectUrl = URL.createObjectURL(file);

    if (ref.current) {
      ref.current.href = objectUrl;
      ref.current.download = metadata.name;
      ref.current.click();
    }
  }, [decryptFile, downloadFile, fileId]);

  return (
    <>
      <IconButton
        id={`d-${fileId}`}
        visibility={downloading || decrypting ? "visible" : "hidden"}
        size="sm"
        variant="ghost"
        color="gray.500"
        aria-label="download"
        icon={
          downloading ? (
            <Spinner />
          ) : decrypting ? (
            <ShieldLockIcon boxSize="1.2rem" />
          ) : (
            <DownloadIcon boxSize="1.2rem" />
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
