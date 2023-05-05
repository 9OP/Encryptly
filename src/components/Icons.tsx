import { Icon, IconProps, useStyleConfig } from '@chakra-ui/react';
import { IconType } from 'react-icons';
import { BsShieldLockFill } from 'react-icons/bs';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { IoMdKey } from 'react-icons/io';
import {
  IoDocumentOutline,
  IoFolderOpenOutline,
  IoFolderOutline,
  IoTrashBin,
} from 'react-icons/io5';
import {
  MdCheck,
  MdChevronLeft,
  MdChevronRight,
  MdClose,
  MdDarkMode,
  MdDownload,
  MdGridView,
  MdLightMode,
  MdList,
  MdLogout,
  MdOutlineClose,
  MdOutlineCloud,
  MdSearch,
  MdUpload,
} from 'react-icons/md';
import { SiGithub, SiLinkedin } from 'react-icons/si';
import { VscNewFile } from 'react-icons/vsc';

const iconFactory = (icon: IconType) => {
  const IconFactory = (props: IconProps) => {
    const styles = useStyleConfig('Icon');
    return <Icon __css={styles} as={icon} {...props} />;
  };
  return IconFactory;
};

export const GoogleIcon = iconFactory(FcGoogle);
export const CloudIcon = iconFactory(MdOutlineCloud);
export const DownloadIcon = iconFactory(MdDownload);
export const UploadIcon = iconFactory(MdUpload);
export const RemoveIcon = iconFactory(MdClose);
export const NewFileIcon = iconFactory(VscNewFile);
export const LogoutIcon = iconFactory(MdLogout);
export const DarkModeIcon = iconFactory(MdDarkMode);
export const LightModeIcon = iconFactory(MdLightMode);
export const SearchIcon = iconFactory(MdSearch);
export const GridIcon = iconFactory(MdGridView);
export const ListIcon = iconFactory(MdList);
export const CloseIcon = iconFactory(MdOutlineClose);
export const ShieldLockIcon = iconFactory(BsShieldLockFill);
export const CheckIcon = iconFactory(MdCheck);
export const ArrowUpIcon = iconFactory(FaChevronUp);
export const ArrowDownIcon = iconFactory(FaChevronDown);
export const DocumentIcon = iconFactory(IoDocumentOutline);
export const FolderIcon = iconFactory(IoFolderOutline);
export const CreateFolderIcon = iconFactory(IoFolderOpenOutline);
export const ChevronLeftIcon = iconFactory(MdChevronLeft);
export const ChevronRightIcon = iconFactory(MdChevronRight);
export const GithubIcon = iconFactory(SiGithub);
export const LinkedinIcon = iconFactory(SiLinkedin);
export const SecretIcon = iconFactory(IoMdKey);
export const TrashIcon = iconFactory(IoTrashBin);
