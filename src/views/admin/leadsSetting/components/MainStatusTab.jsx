// import React, { useMemo } from "react";
// import {
//   Box,
//   Table,
//   Thead,
//   Tbody,
//   Tr,
//   Th,
//   Td,
//   Flex,
//   IconButton,
//   Badge,
//   useColorModeValue,
//   Text,
// } from "@chakra-ui/react";
// import { EditIcon } from "@chakra-ui/icons";
// import NoData from "components/Message/NoData";
// import TableSkeleton from "./TableSkeleton";
// import StatusBadge from "./StatusBadge";

// const MainStatusTab = ({
//   mainStatuses,
//   isLoading,
//   onEdit,
//   onDelete,
//   generateBgColor,
// }) => {
//   const hoverBg = useColorModeValue("gray.50", "gray.600");
//   const thBg = useColorModeValue("brand.200", "gray.700");

//   const columns = useMemo(
//     () => [
//       { Header: "Order", accessor: "order", width: 80 },
//       { Header: "Status", accessor: "status", width: 150 },
//       { Header: "Name", accessor: "label", width: 150 },
//       { Header: "Color Preview", accessor: "colors", width: 150 },
//       { Header: "Meta ID", accessor: "meta_id", width: 150 },
//       { Header: "Sub Statuses", accessor: "statusesCount", width: 120 },
//       { Header: "Actions", accessor: "actions", width: 100 },
//     ],
//     [],
//   );

//   return (
//     <Box maxHeight="70vh" overflowY="auto" scrollBehavior="smooth">
//       <Table variant="striped" size="sm">
//         <Thead position="sticky" top={0} bg={thBg} zIndex={1}>
//           <Tr h="12">
//             {columns.map((col) => (
//               <Th
//                 key={col.accessor}
//                 minW={col?.width ? `${col.width}px` : "100px"}
//                 textAlign="center"
//                 py="4"
//                 fontSize="sm"
//                 fontWeight="semibold"
//                 color="gray.700"
//                 textTransform="capitalize"
//               >
//                 {col.Header}
//               </Th>
//             ))}
//           </Tr>
//         </Thead>

//         <Tbody>
//           {isLoading ? (
//             <TableSkeleton columns={columns} rowCount={5} />
//           ) : mainStatuses.length > 0 ? (
//             mainStatuses.map((status) => (
//               <Tr key={status.value} _hover={{ bg: hoverBg }}>
//                 <Td textAlign="center">{status.order}</Td>
//                 <Td textAlign="center">
//                   <StatusBadge
//                     status={status}
//                     generateBgColor={generateBgColor}
//                   />
//                 </Td>
//                 <Td textAlign="center" fontWeight="500">
//                   {status.label}
//                 </Td>

//                 <Td textAlign="center">
//                   <Flex align="center" justify="center" gap={2}>
//                     <Box
//                       w="20px"
//                       h="20px"
//                       borderRadius="md"
//                       bg={status.color}
//                     />
//                     <Box
//                       w="20px"
//                       h="20px"
//                       borderRadius="md"
//                       bg={status.bgColor || generateBgColor(status.color)}
//                     />
//                     <Text fontSize="xs" color="gray.500">
//                       {status.color}
//                     </Text>
//                   </Flex>
//                 </Td>
//                 <Td textAlign="center">
//                   {status.meta_id ? (
//                     <Badge colorScheme="purple">{status.meta_id}</Badge>
//                   ) : (
//                     "—"
//                   )}
//                 </Td>
//                 <Td textAlign="center">
//                   <Badge colorScheme="blue">
//                     {status.statuses?.length || 0}
//                   </Badge>
//                 </Td>
//                 <Td textAlign="center">
//                   <Flex gap={1} justify="center">
//                     <IconButton
//                       icon={<EditIcon />}
//                       size="xs"
//                       colorScheme="blue"
//                       variant="ghost"
//                       onClick={() => onEdit(status)}
//                       aria-label="Edit status"
//                     />
//                   </Flex>
//                 </Td>
//               </Tr>
//             ))
//           ) : (
//             <Tr>
//               <Td colSpan={columns.length} py="10">
//                 <NoData label="main statuses" />
//               </Td>
//             </Tr>
//           )}
//         </Tbody>
//       </Table>
//     </Box>
//   );
// };

// export default MainStatusTab;

import React, { useMemo, useState } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  IconButton,
  Badge,
  useColorModeValue,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  HStack,
  Button,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon, SearchIcon } from "@chakra-ui/icons";
import NoData from "components/Message/NoData";
import TableSkeleton from "./TableSkeleton";
import StatusBadge from "./StatusBadge";
import { useMainStatus } from "../hooks/useMainStatus";
import TopPagination from "components/pagination/TopPagination";

const MainStatusTab = ({ onEdit, onDelete, generateBgColor }) => {
  const {
    // Data
    mainStatuses,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,

    // Pagination
    pagination,
    totalPages,
    totalCount,
    handlePageChange,
    handlePageSizeChange,

    // Filters
    filters,
    handleSearch,

    // CRUD
    createStatus,
    updateStatus,
    deleteStatus,
    refetch,
  } = useMainStatus();

  const [searchInput, setSearchInput] = useState(filters.q || "");
  const hoverBg = useColorModeValue("gray.50", "gray.600");
  const thBg = useColorModeValue("brand.200", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const columns = useMemo(
    () => [
      { Header: "Order", accessor: "order", width: 80 },
      { Header: "Status", accessor: "status", width: 150 },
      { Header: "Name", accessor: "label", width: 150 },
      { Header: "Color Preview", accessor: "colors", width: 150 },
      { Header: "Sub Statuses", accessor: "statusesCount", width: 120 },
      { Header: "Actions", accessor: "actions", width: 100 },
    ],
    [],
  );

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handleSearch(searchInput);
  };

  const handleDeleteClick = async (status) => {
    if (window.confirm(`Are you sure you want to delete "${status.label}"?`)) {
      await deleteStatus(status._id);
    }
  };

  const handleEditClick = (status) => {
    onEdit({
      ...status,
      id: status._id,
    });
  };

  const isLoading$ = isLoading || isCreating || isUpdating || isDeleting;

  return (
    <Box>
      {/* Search Bar */}
      {/* <Box p={4} borderBottom="1px" borderColor={borderColor}>
        <form onSubmit={handleSearchSubmit}>
          <InputGroup maxW="400px">
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Search main statuses..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              size="sm"
              borderRadius="md"
            />
          </InputGroup>
        </form>
      </Box> */}

      {/* Table */}
      <Box maxHeight="60vh" overflowY="auto" scrollBehavior="smooth">
        <Table variant="striped" size="sm">
          <Thead position="sticky" top={0} bg={thBg} zIndex={1}>
            <Tr h="12">
              {columns.map((col) => (
                <Th
                  key={col.accessor}
                  minW={col?.width ? `${col.width}px` : "100px"}
                  textAlign="center"
                  py="4"
                  fontSize="sm"
                  fontWeight="semibold"
                  color="gray.700"
                  textTransform="capitalize"
                >
                  {col.Header}
                </Th>
              ))}
            </Tr>
          </Thead>

          <Tbody>
            {isLoading$ ? (
              <TableSkeleton columns={columns} rowCount={pagination.limit} />
            ) : mainStatuses.length > 0 ? (
              mainStatuses.map((status) => (
                <Tr key={status._id} _hover={{ bg: hoverBg }}>
                  <Td textAlign="center">{status.order || "-"}</Td>
                  <Td textAlign="center">
                    <StatusBadge
                      status={status}
                      generateBgColor={generateBgColor}
                    />
                  </Td>
                  <Td textAlign="center" fontWeight="500">
                    {status.label}
                  </Td>

                  <Td textAlign="center">
                    <Flex align="center" justify="center" gap={2}>
                      <Box
                        w="20px"
                        h="20px"
                        borderRadius="md"
                        bg={status.color || "#06B6D4"}
                      />
                      <Box
                        w="20px"
                        h="20px"
                        borderRadius="md"
                        bg={
                          status.bgColor ||
                          generateBgColor(status.bgColor || "#06B6D4")
                        }
                      />
                      <Text fontSize="xs" color="gray.500">
                        {status.color || "#06B6D4"}
                      </Text>
                    </Flex>
                  </Td>

                  <Td textAlign="center">
                    <Badge colorScheme="blue">
                      {status.statuses?.length || 0}
                    </Badge>
                  </Td>
                  <Td textAlign="center">
                    <HStack spacing={1} justify="center">
                      <IconButton
                        icon={<EditIcon />}
                        size="xs"
                        colorScheme="blue"
                        variant="ghost"
                        onClick={() => handleEditClick(status)}
                        aria-label="Edit status"
                        isLoading={isUpdating}
                      />
                      <IconButton
                        icon={<DeleteIcon />}
                        size="xs"
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => handleDeleteClick(status)}
                        aria-label="Delete status"
                        isLoading={isDeleting}
                      />
                    </HStack>
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={columns.length} py="10">
                  <NoData label="main statuses" />
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default MainStatusTab;
