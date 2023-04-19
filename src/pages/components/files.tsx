import {
  Box,
  Text,
  HStack,
  IconButton,
  Spinner,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from "@chakra-ui/react";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import formatBytes from "@app/lib/formatBytes";
import { useListFiles } from "@app/hooks";
import { FileMetadata } from "@app/models";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  DocumentIcon,
} from "@app/pages/components/icons";
import Pagination from "@app/pages/components/pagination";
import DownloadButton from "@app/pages/components/downloadFileButton";

interface FileViewProps {
  files: FileMetadata[];
  isFetching: boolean;
}

type SortOrder = "ASC" | "DESC";

const FileListView = ({ files, isFetching }: FileViewProps) => {
  const [sortedFiles, setSortedFiles] = useState<FileMetadata[]>(files);
  const [nameOrder, setNameOrder] = useState<SortOrder>("DESC");
  const [dateOrder, setDateOrder] = useState<SortOrder>("DESC");
  const [sizeOrder, setSizeOrder] = useState<SortOrder>("DESC");
  const [sort, setSort] = useState<"name" | "date" | "size">("name");

  const ColHeader = ({
    title,
    order,
    setOrder,
  }: {
    title: "name" | "date" | "size";
    order: SortOrder;
    setOrder: Dispatch<SetStateAction<SortOrder>>;
  }) => (
    <Th
      padding={0}
      color="gray.500"
      fontWeight="semibold"
      textTransform="capitalize"
    >
      <HStack spacing={1} marginBottom="0.6rem">
        <Text>{title}</Text>
        <IconButton
          borderRadius="0.2rem"
          variant="ghost"
          size="xs"
          boxSize="1.1rem"
          aria-label="sort"
          onClick={() => {
            setOrder((prev) => (prev === "ASC" ? "DESC" : "ASC"));
            handleSorting(title);
            setSort(title);
          }}
          icon={
            order === "DESC" ? (
              <ArrowUpIcon boxSize="1.3rem" />
            ) : (
              <ArrowDownIcon boxSize="1.3rem" />
            )
          }
        />
      </HStack>
    </Th>
  );

  const handleSorting = useCallback(
    (sortField: "name" | "date" | "size") => {
      const sorted = [...files].sort((a, b) => {
        switch (sortField) {
          case "name":
            return nameOrder === "DESC"
              ? a.name.localeCompare(b.name)
              : b.name.localeCompare(a.name);

          case "date":
            return dateOrder === "DESC"
              ? a.createdTime.getTime() - b.createdTime.getTime()
              : b.createdTime.getTime() - a.createdTime.getTime();

          case "size":
            return sizeOrder === "DESC" ? a.size - b.size : b.size - a.size;

          default:
            return 0;
        }
      });
      setSortedFiles(sorted);

      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [dateOrder, files, nameOrder, sizeOrder]
  );

  useEffect(() => {
    handleSorting(sort);
  }, [files, handleSorting, sort]);

  return (
    <TableContainer overflowX="hidden">
      <Table variant="simple" size="sm">
        <Thead>
          <Tr padding={0}>
            <ColHeader title="name" order={nameOrder} setOrder={setNameOrder} />
            <ColHeader title="date" order={dateOrder} setOrder={setDateOrder} />
            <ColHeader title="size" order={sizeOrder} setOrder={setSizeOrder} />
            <Td padding={0}>
              <HStack
                justifyContent="flex-end"
                alignItems="center"
                marginBottom="0.6rem"
              >
                {isFetching ? <Spinner color="gray.400" size="sm" /> : <></>}
              </HStack>
            </Td>
          </Tr>
        </Thead>
        <Tbody>
          {sortedFiles.map((file, i) => (
            <Tr
              key={i}
              sx={{
                [`&:hover #d-${file.id}`]: { visibility: "visible!important" },
              }}
              cursor="pointer"
            >
              <Td paddingX={0} paddingY="0.8rem">
                <HStack
                  draggable={true}
                  onDragStart={(e) => {
                    e.dataTransfer.setData("text/plain", file.id);
                  }}
                >
                  <DocumentIcon boxSize="1.3rem" color="blue.500" />

                  <Text
                    color="gray.800"
                    fontSize="sm"
                    fontWeight="medium"
                    whiteSpace="nowrap"
                    overflow="hidden"
                    textOverflow="ellipsis"
                    className="txt"
                  >
                    {file.name}
                  </Text>
                </HStack>
              </Td>
              <Td
                fontSize="xs"
                color="gray.500"
                fontWeight="medium"
                paddingX={0}
              >
                {file?.createdTime?.toLocaleString()}
              </Td>
              <Td
                fontSize="xs"
                color="gray.500"
                fontWeight="medium"
                paddingX={0}
              >
                {formatBytes(file?.size || 0)}
              </Td>
              <Td>
                <HStack justifyContent="flex-end">
                  <DownloadButton fileId={file.id} />
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

const FilesList = (props: { search: string }): JSX.Element => {
  const { search } = props;
  const [selected, setSelected] = useState(1);
  const { data, isLoading, isValidating } = useListFiles();

  const pagination = 12;

  const isFetching = useMemo(
    () => isLoading || isValidating,
    [isLoading, isValidating]
  );

  const filteredFiles = useMemo(() => {
    let filtered = data || [];
    if (search) {
      filtered =
        filtered.filter((f) =>
          f.name.toLowerCase().includes(search.toLowerCase())
        ) || [];
    }
    return filtered;
  }, [data, search]);

  const pages = useMemo(() => {
    return Math.ceil((filteredFiles?.length || 0) / pagination);
  }, [filteredFiles]);

  const rangeFiles = useMemo(() => {
    const startIndex = (selected - 1) * pagination + 1;
    const endIndex = selected * pagination + 1;
    return filteredFiles?.slice(startIndex - 1, endIndex - 1);
  }, [filteredFiles, selected, pagination]);

  return (
    <Box width="100%">
      <FileListView files={rangeFiles} isFetching={isFetching} />

      {pages > 1 && (
        <Pagination
          range={pages}
          selected={selected}
          setSelected={setSelected}
        />
      )}
    </Box>
  );
};

export default FilesList;
