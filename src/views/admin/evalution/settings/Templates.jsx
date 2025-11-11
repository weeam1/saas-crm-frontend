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
} from "@chakra-ui/react";
import { FiRefreshCw } from "react-icons/fi";
import TemplateModal from "./components/TemplateModal";
import {
  useFetchItemsQuery,
  useCreateItemMutation,
  useDeleteItemMutation,
} from "api/apiSlice";
import TopPagination from "components/pagination/TopPagination";
import TableLoading from "components/loading/TableLoading";
import NoData from "views/admin/lead-v2/components/subComponents/NoData";
import { toast } from "react-toastify";

const Templates = () => {
  const [tableData, setTableData] = useState([]);
  const [mergedData, setMergedData] = useState([]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedRole, setSelectedRole] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const [createItemMutation, { isLoading: isCreating }] =
    useCreateItemMutation();
  const [deleteItemMutation] = useDeleteItemMutation();

  const { data, isLoading, isFetching, refetch } = useFetchItemsQuery(
    { path: `/role-access/v2`, params: { page: currentPage, limit: pageSize } },
    { refetchOnMountOrArgChange: true }
  );

  const {
    data: evaluationsData,
    isFetching: evalFetching,
    refetch: refetchEvaluations,
  } = useFetchItemsQuery(
    { path: "/evaluation/user-evaluation" },
    { refetchOnMountOrArgChange: true }
  );

  useEffect(() => {
    if (data?.data) {
      setTableData(data.data);
      setTotalPages(data.totalPages || 0);
      setTotalItems(data.totalRecords || 0);
    }
  }, [data]);

  useEffect(() => {
    if (!tableData?.length || !evaluationsData) return;
    console.log("evaluationsData", evaluationsData);

    const evalList = evaluationsData?.data.evaluations || evaluationsData || [];
    
    const merged = tableData.map((role, index) => {
      const found = evalList?.data.find((item) =>
        item?.userId?.roles?.some((r) => r === role?._id)
      );

      console.log("found", found);
      return {
        ...role,
        hasTemplate: !!found,
        templateId: found?._id || null,
      };
    });

    setMergedData(merged);
  }, [tableData, evaluationsData]);

  const handleAddTemplate = (role) => {
    setSelectedRole(role);
    onOpen();
  };

  const handleSaveTemplate = async (formData) => {
    try {
      await createItemMutation({
        path: `/evaluation/templates/`,
        body: formData,
      }).unwrap();
      toast.success("Evaluation template saved successfully!");
      onClose();
      refetchEvaluations();
      refetch();
    } catch (error) {
      console.log("error", error);
      toast.error("Error in creating the evaluation!");
    }
  };

  const handleDeleteTemplate = async (id) => {
    try {
      await deleteItemMutation({
        path: `/evaluation/templates/${id}`,
        body: {},
      }).unwrap();
      toast.success("Evaluation template deleted successfully!");
      refetchEvaluations();
      refetch();
    } catch (error) {
      console.log("error", error);
      toast.error("Error deleting the template!");
    }
  };

  const handleRefresh = async () => {
    await Promise.all([refetch(), refetchEvaluations()]);
  };

  const columns = ["SR.No", "Role Name", "Description", "Action"];

  return (
    <Box
      overflowY="auto"
      scrollBehavior="smooth"
      boxShadow="sm"
      bg="white"
      px={2}
      mt="-16px"
    >
      <Flex
        justifyContent="space-between"
        alignItems={{ base: "normal", md: "center" }}
        p={3}
        flexDir={{ base: "column", md: "row" }}
      >
        <Text fontSize="20px" fontWeight="bold" color="black" p={3}>
          Evaluation Templates
        </Text>

        <Box
          gap={2}
          display="flex"
          alignItems="center"
          flexDir={{ base: "column", md: "row" }}
          justifyContent={{ base: "center", md: "normal" }}
        >
          <IconButton
            icon={<FiRefreshCw />}
            aria-label="Refresh"
            variant="outline"
            onClick={handleRefresh}
            isLoading={isLoading || isFetching || evalFetching}
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

          {isLoading || isFetching || evalFetching ? (
            <TableLoading columns={columns} length={7} py="4" />
          ) : (
            <Tbody>
              {mergedData && mergedData.length > 0 ? (
                mergedData.map((template) => (
                  <Tr key={template._id}>
                    <Td textAlign="center">{template.serialNumber}</Td>
                    <Td textAlign="center">{template.roleName}</Td>
                    <Td textAlign="center">{template.description}</Td>
                    <Td textAlign="center">
                      <Box
                        display="flex"
                        gap={2}
                        justifyContent="center"
                        alignItems="center"
                      >
                        {template.hasTemplate ? (
                          <>
                            <Button
                              colorScheme="brand"
                              borderRadius="md"
                              size="xs"
                              onClick={() => handleAddTemplate(template)}
                            >
                              Edit Template
                            </Button>
                            <Button
                              colorScheme="red"
                              borderRadius="md"
                              size="xs"
                              onClick={() =>
                                handleDeleteTemplate(template.templateId)
                              }
                            >
                              Delete Template
                            </Button>
                          </>
                        ) : (
                          <Button
                            colorScheme="brand"
                            borderRadius="md"
                            size="xs"
                            onClick={() => handleAddTemplate(template)}
                          >
                            Add Template
                          </Button>
                        )}
                      </Box>
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan="13" textAlign="center">
                    <NoData label="Evaluation template" />
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
