import { Icon, IconProps, useStyleConfig } from "@chakra-ui/react";
import { IconType } from "react-icons";
import { FcGoogle } from "react-icons/fc";
import { VscNewFile } from "react-icons/vsc";
import {
  MdOutlineCloud,
  MdDownload,
  MdUpload,
  MdClose,
  MdLogout,
  MdDarkMode,
  MdLightMode,
  MdSearch,
  MdGridView,
  MdList,
  MdOutlineClose,
  MdCheck,
  MdArrowDropUp,
  MdArrowDropDown,
  MdChevronLeft,
  MdChevronRight,
} from "react-icons/md";
import { BsGoogle, BsShieldLockFill } from "react-icons/bs";
import { IoDocumentOutline, IoFolderOutline, IoFolderOpenOutline } from "react-icons/io5";

const iconFactory = (icon: IconType) => {
  const IconFactory = (props: IconProps) => {
    const styles = useStyleConfig("Icon");
    return <Icon __css={styles} as={icon} {...props} />;
  };
  return IconFactory;
};

export const GoogleIcon = iconFactory(BsGoogle);
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
export const ArrowUpIcon = iconFactory(MdArrowDropUp);
export const ArrowDownIcon = iconFactory(MdArrowDropDown);
export const DocumentIcon = iconFactory(IoDocumentOutline);
export const FolderIcon = iconFactory(IoFolderOutline);
export const CreateFolderIcon = iconFactory(IoFolderOpenOutline);
export const ChevronLeftIcon = iconFactory(MdChevronLeft);
export const ChevronRightIcon = iconFactory(MdChevronRight);
