import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Flex,
  Text,
  IconButton,
  useDisclosure,
  Badge,
} from "@chakra-ui/react";
import { FiRefreshCw, FiEye } from "react-icons/fi";
import TemplateModal from "./components/TemplateModal";
import { useFetchItemsQuery, useCreateItemMutation } from "api/apiSlice";
import TopPagination from "components/pagination/TopPagination";
import TableLoading from "components/loading/TableLoading";
import NoData from "views/admin/lead-v2/components/subComponents/NoData";
import { toast } from "react-toastify";

const Templates = () => {
  const [tableData, setTableData] = useState();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedRole, setSelectedRole] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const handleAddTemplate = (role) => {
    setSelectedRole(role);
    onOpen();
  };

  const [createItemMutation, { isLoading: isCreating }] =
    useCreateItemMutation();

  const handleSaveTemplate = async (data) => {
    try {
      await createItemMutation({
        path: `/evaluation/templates/`,
        body: data,
      }).unwrap();
      onClose();
    } catch (error) {
      console.log("error", error);
      toast.error("Error in creating the evalution!");
    }
  };

  const columns = ["SR.No", "Role Name", "Description", "Action"];

  const buildQueryParams = () => {
    const params = {
      page: currentPage,
      limit: pageSize,
    };

    return params;
  };

  const { data, isLoading, isFetching, refetch } = useFetchItemsQuery(
    { path: `/role-access/v2`, params: buildQueryParams() },
    { refetchOnMountOrArgChange: true }
  );
  useEffect(() => {
    if (data) {
      setTotalPages(data.totalPages || 0);
      setTotalItems(data.totalRecords || 0);
      setTableData(data?.data);
    }
  }, [data]);

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const getRoleBadgeColor = (() => {
    const usedColors = new Map();

    const colorSchemes = [
      "red",
      "orange",
      "yellow",
      "green",
      "teal",
      "blue",
      "cyan",
      "purple",
      "pink",
      "linkedin",
      "facebook",
      "messenger",
      "whatsapp",
      "twitter",
      "telegram",
    ];

    const availableColors = [...colorSchemes];

    return (roleName) => {
      if (usedColors.has(roleName)) {
        return usedColors.get(roleName);
      }

      if (availableColors.length === 0) {
        availableColors.push(...colorSchemes);
      }

      const hashString = (str) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
          hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return hash;
      };

      const hash = hashString(roleName);
      const index = Math.abs(hash) % availableColors.length;

      const selectedColor = availableColors[index];
      availableColors.splice(index, 1);

      usedColors.set(roleName, selectedColor);

      return selectedColor;
    };
  })();
  
  return (
    <Box
      overflowY="auto"
      scrollBehavior="smooth"
      boxShadow="sm"
      bg="white"
      px={2}
      mt={"-16px"}
    >
      <Flex
        justifyContent="space-between"
        alignItems={{ base: "normal", sm: "normal", md: "center" }}
        p={3}
        flexDir={{ base: "column", sm: "column", md: "row" }}
      >
        <Text fontSize="20px" fontWeight="bold" color="black" p={3}>
          Evaluation Templates
        </Text>

        <Box
          gap={2}
          display="flex"
          alignItems="center"
          flexDir={{ base: "column", sm: "column", md: "row" }}
          justifyContent={{ base: "center", sm: "center", md: "normal" }}
        >
          <IconButton
            icon={<FiRefreshCw />}
            aria-label="Refresh"
            variant="outline"
            onClick={() => refetch()}
            loading={isLoading || isFetching}
            size="sm"
          />
        </Box>
      </Flex>
      <Box my={2}>
        <TopPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={totalItems}
          itemsPerPage={pageSize}
          setPageSize={setPageSize}
          handlePageSize={handlePageSizeChange}
          refetching={isLoading}
          loading={isLoading}
        />
      </Box>
      <Box
        borderRadius="lg"
        boxShadow="sm"
        bg="white"
        maxH="85vh"
        overflowY="auto"
      >
        <Table variant="striped" size="lg" bg="white">
          <Thead
            position="sticky"
            top={0}
            bg="white"
            zIndex={2}
            boxShadow="0px 2px 8px rgba(0, 0, 0, 0.1)"
            fontSize="16px"
            borderRadius="lg"
          >
            <Tr>
              {columns.map((header, index) => (
                <Th key={index} bg="brand.200" whiteSpace="nowrap" py={4}>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text
                      fontSize={{ base: "12px", md: "14px" }}
                      fontWeight="600"
                      color="gray.700"
                      textTransform="capitalize"
                    >
                      {header}
                    </Text>
                  </Box>
                </Th>
              ))}
            </Tr>
          </Thead>
          {isLoading || isFetching ? (
            <TableLoading columns={columns} length={7} py="4" />
          ) : (
            <Tbody>
              {tableData && tableData.length > 0 ? (
                tableData.map((template, index) => (
                  <Tr key={template.id}>
                    <Td textAlign="center">{template.serialNumber}</Td>
                    <Td textAlign="center">
                      <Badge
                        colorScheme={getRoleBadgeColor(template.roleName)}
                        fontSize="12px"
                        px={3}
                        py={1}
                        borderRadius="full"
                        fontWeight="600"
                        textTransform="capitalize"
                      >
                        {template.roleName}
                      </Badge>
                    </Td>
                    <Td maxW="300px">
                      <Text
                        fontSize="14px"
                        color="gray.600"
                        noOfLines={2}
                        title={template.description}
                      >
                        {template.description}
                      </Text>
                    </Td>
                    <Td textAlign="center">
                      <IconButton
                        aria-label="View"
                        icon={<FiEye />}
                        size="sm"
                        colorScheme="teal"
                        variant="ghost"
                        onClick={() => handleAddTemplate(template)}
                      />
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr borderColor="gray.200" textAlign="center">
                  <Td
                    borderBottom="none"
                    colSpan="13"
                    fontSize={{ base: "12px", md: "15px" }}
                    fontWeight="500"
                    color="gray.500"
                    textAlign="center"
                  >
                    <NoData label="listing" />
                  </Td>
                </Tr>
              )}
            </Tbody>
          )}
        </Table>
      </Box>

      {selectedRole && (
        <TemplateModal
          isOpen={isOpen}
          onClose={onClose}
          role={selectedRole}
          onSave={handleSaveTemplate}
        />
      )}
    </Box>
  );
};

export default Templates;
