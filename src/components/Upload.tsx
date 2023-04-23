import { revalidateListFiles, useEncryptFile, useUploadFile } from "@app/hooks";
import { ToastId, useToast } from "@chakra-ui/react";
import { ReactNode, RefObject, forwardRef, useEffect, useImperativeHandle, useState } from "react";
import UploadFeedback from "./UploadToast";

interface UploadProps {
  ref: RefObject<any>;
  children: ReactNode;
}

export interface UploadHandle {
  onSubmit: (file: File[]) => Promise<void>;
}

const Upload = forwardRef<UploadHandle, UploadProps>((props: UploadProps, ref: any) => {
  const { children } = props;
  const toast = useToast();
  const [submitCount, setSubmitCount] = useState(0);
  const [steps, setSteps] = useState<{
    [name: string]: "ENCRYPTING" | "UPLOADING";
  }>({});
  const [progress, setProgress] = useState<{ [name: string]: number }>({});
  const [toastId, setToastId] = useState<ToastId>("");
  const [files, setFiles] = useState<File[]>([]);

  const uploadFile = useUploadFile();
  const encryptFile = useEncryptFile();

  useImperativeHandle<UploadHandle, any>(ref, () => ({
    async onSubmit(files: File[]) {
      await onSubmit(files);
    },
  }));

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

  return <>{children}</>;
});

export default Upload;
