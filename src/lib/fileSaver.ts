export const saveFile = (
  fileData: BlobPart[],
  name: string,
  type: string,
  ref: React.RefObject<HTMLAnchorElement>
) => {
  const file = new File(fileData, name, {
    type,
  });
  const objectUrl = URL.createObjectURL(file);

  if (ref.current) {
    ref.current.href = objectUrl;
    ref.current.download = name;
    ref.current.click();
  }
};
