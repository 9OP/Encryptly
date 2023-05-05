import { useDeleteAppDataFolder } from '@app/hooks';
import { Button } from '@chakra-ui/react';

const DeleteAppDataFolder = () => {
  const deleteAppDataFolder = useDeleteAppDataFolder();

  const onClick = async () => {
    await deleteAppDataFolder();
  };

  return (
    <Button onClick={onClick} colorScheme="orange" variant="outline">
      Delete app data folder
    </Button>
  );
};

export default DeleteAppDataFolder;
