import { revalidateListFiles, useEncryptFile, useUploadFile } from "@app/hooks";
import { handleDataItem, saveFile } from "@app/lib/files";
import { Box, ToastId, useToast } from "@chakra-ui/react";
import React, { FC, ReactNode, useEffect, useRef, useState } from "react";
import UploadFeedback from "./UploadToast";

interface props {
  children: ReactNode;
}

const DropZone: FC<props> = (props: props) => {
  const { children } = props;
  const [dragOver, setDragOver] = useState(false);
  const toast = useToast();
  const [submitCount, setSubmitCount] = useState(0);
  const [steps, setSteps] = useState<{
    [name: string]: "ENCRYPTING" | "UPLOADING";
  }>({});
  const [progress, setProgress] = useState<{ [name: string]: number }>({});
  const [toastId, setToastId] = useState<ToastId>("");
  const [files, setFiles] = useState<File[]>([]);

  const ref = useRef<HTMLAnchorElement>(null);

  const uploadFile = useUploadFile();
  const encryptFile = useEncryptFile();

  useEffect(() => {
    if (toastId) {
      toast.update(toastId, {
        render: () => <UploadFeedback files={files} steps={steps} progress={progress} />,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [steps, progress, files]);

  useEffect(() => {
    if (submitCount === 0 && toastId) {
      toast.close(toastId);
      toast({
        position: "bottom-right",
        duration: 5000,
        isClosable: true,
        title: `${files.length} files uploaded`,
        status: "success",
        variant: "toast",
      });

      setToastId("");
      setProgress({});
      setSteps({});
      setFiles([]);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitCount]);

  const handleDrop = async (event: React.DragEvent<HTMLInputElement>) => {
    event.preventDefault();
    setDragOver(false);

    const items = [...event.dataTransfer.items];
    const files = await handleDataItem(items);

    saveFile([files[0]], files[0].name, "application/zip", ref);

    try {
      if ([...files].length) {
        await onSubmit([...files]);
      }
    } catch (err) {
      toast.closeAll();
      toast({
        position: "bottom-right",
        duration: 5000,
        isClosable: true,
        title: "Error uploading file",
        description: (err as Error).message,
        status: "error",
      });
    }
  };

  const onSubmit = async (fls: File[]) => {
    if (!fls.length) {
      return;
    }

    setSubmitCount((count) => count + 1);
    setFiles((prev) => [...prev, ...fls]);

    if (!toastId) {
      setToastId(
        toast({
          position: "bottom-right",
          duration: null,
          isClosable: true,
          render: () => <UploadFeedback files={files} steps={steps} progress={progress} />,
        })
      );
    }

    await Promise.all(
      fls.map(async (file) => {
        setSteps((prev) => ({ ...prev, [file.name]: "ENCRYPTING" }));
        const data = await encryptFile(file);

        setSteps((prev) => ({ ...prev, [file.name]: "UPLOADING" }));
        const gen = await uploadFile({ name: file.name, data });

        for await (const value of gen) {
          setProgress((prev) => ({ ...prev, [file.name]: value }));
        }
      })
    );

    await revalidateListFiles();
    setSubmitCount((count) => count - 1);
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
      <a ref={ref} />
    </Box>
  );
};

export default DropZone;
