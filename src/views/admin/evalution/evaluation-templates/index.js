import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  Text,
  IconButton,
  useDisclosure,
  Badge,
  HStack,
} from "@chakra-ui/react";
import { FiEye, FiEdit2, FiPlus } from "react-icons/fi";
import TemplateModal from "./components/TemplateModal";
import { useFetchItemsQuery, useCreateItemMutation } from "api/apiSlice";
import TopPagination from "components/pagination/TopPagination";
import TableLoading from "components/loading/TableLoading";
import NoData from "views/admin/lead-v2/components/subComponents/NoData";
import { toast } from "react-toastify";
import AppButton from "components/shared/AppButton";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useModalColors } from "hooks/useModalColors";
import RefreshButton from "components/refresh/RefreshButton";

const Templates = () => {
  const colors = useModalColors();
  const navigate = useNavigate();
  const [tableData, setTableData] = useState();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedRole, setSelectedRole] = useState(null);
  const [modalMode, setModalMode] = useState("view");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const [createItemMutation] = useCreateItemMutation();

  const handleOpenModal = (role, mode) => {
    setSelectedRole(role);
    setModalMode(mode);
    onOpen();
  };

  const handleSaveTemplate = async (data) => {
    try {
      await createItemMutation({
        path: `/evaluation/templates`,
        body: data,
      }).unwrap();
      onClose();
      refetch();
    } catch (error) {
      console.log("error", error);
      toast.error("Error in creating the evalution!");
    }
  };

  const columns = ["Role Name", "Description", "Template", "Action"];

  const buildQueryParams = () => {
    const params = {
      page: currentPage,
      limit: pageSize,
    };
    return params;
  };

  const { data, isLoading, isFetching, refetch } = useFetchItemsQuery(
    { path: `/evaluation/templates/roles`, params: buildQueryParams() },
    { refetchOnMountOrArgChange: true },
  );

  useEffect(() => {
    if (data) {
      setTotalPages(data.totalPages || 0);
      setTotalItems(data.total || 0);
      setTableData(data?.doc || []);
    }
  }, [data]);

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const getRoleBadgeColor = (() => {
    const usedColors = new Map();

    const colorSchemes = [
      "red", "orange", "yellow", "green", "teal", "blue", "cyan",
      "purple", "pink", "linkedin", "facebook", "messenger",
      "whatsapp", "twitter", "telegram"
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
    <>
      <AppButton mb="6" leftIcon={<IoArrowBack />} onClick={() => navigate(-1)}>
        Back
      </AppButton>
      <Box
        overflowY="auto"
        scrollBehavior="smooth"
        boxShadow={colors.cardShadow}
        bg={colors.bg}
        px={2}
        mt={"-16px"}
        borderRadius="lg"
        border="1px solid"
        borderColor={colors.borderColor}
      >
        <Flex
          justifyContent="space-between"
          alignItems={{ base: "normal", sm: "normal", md: "center" }}
          p={3}
          flexDir={{ base: "column", sm: "column", md: "row" }}
        >
          <Text fontSize="20px" fontWeight="bold" color={colors.headingText} p={3}>
            Evaluation Templates
          </Text>

          <Box
            gap={2}
            display="flex"
            alignItems="center"
            flexDir={{ base: "column", sm: "column", md: "row" }}
            justifyContent={{ base: "center", sm: "center", md: "normal" }}
          >
            <RefreshButton
	label="Refresh"
	onClick={() => refetch()}
	isLoading={isLoading}
	isFetching={isFetching}
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
          boxShadow={colors.cardShadow}
          bg={colors.bg}
          maxH="85vh"

      minH="70vh"
          overflowY="auto"
          border="1px solid"
          borderColor={colors.borderColor}
        >
          <Table variant="simple" size="lg">
            <Thead
              position="sticky"
              top={0}
              bg={colors.bgDeep}
              zIndex={2}
              boxShadow="0px 2px 8px rgba(0, 0, 0, 0.1)"
              fontSize="16px"
              borderRadius="lg"
            >
              <Tr>
                {columns.map((header, index) => (
                  <Th
                    key={index}
                    bg={colors.bgDeep}
                    whiteSpace="nowrap"
                    py={4}
                    borderColor={colors.borderColor}
                  >
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Text
                        fontSize={{ base: "12px", md: "14px" }}
                        fontWeight="600"
                        color={colors.headingText}
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
              <Tbody bg={colors.bg}>
                {tableData && tableData.length > 0 ? (
                  tableData.map((template, index) => (
                    <Tr key={template.id} borderColor={colors.borderColor}>
                      <Td textAlign="center" borderColor={colors.borderColor}>
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
                      <Td maxW="300px" borderColor={colors.borderColor}>
                        <Text
                          fontSize="14px"
                          color={colors.bodyText}
                          noOfLines={2}
                          title={template.description}
                        >
                          {template.description}
                        </Text>
                      </Td>
                      <Td textAlign="center" borderColor={colors.borderColor}>
                        <Badge
                          bg={template.hasTemplate ? colors.badgeSuccessBg : colors.badgeErrorBg}
                          color={template.hasTemplate ? colors.badgeSuccessText : colors.badgeErrorText}
                          fontSize="12px"
                          px={3}
                          py={1}
                          borderRadius="full"
                          fontWeight="600"
                          textTransform="capitalize"
                        >
                          {template.hasTemplate ? "Available" : "Not Available"}
                        </Badge>
                      </Td>
                      <Td textAlign="center" borderColor={colors.borderColor}>
                        {template.hasTemplate ? (
                          <HStack justify="center" spacing={2}>
                            <IconButton
                              icon={<FiEye />}
                              size="sm"
                              variant="ghost"
                              aria-label="View"
                              onClick={() => handleOpenModal(template, "view")}
                              color={colors.bodyText}
                              _hover={{ color: colors.accentGold, bg: colors.bgDeep }}
                            />
                            <IconButton
                              icon={<FiEdit2 />}
                              size="sm"
                              variant="ghost"
                              aria-label="Edit"
                              onClick={() => handleOpenModal(template, "edit")}
                              color={colors.bodyText}
                              _hover={{ color: colors.accentGold, bg: colors.bgDeep }}
                            />
                          </HStack>
                        ) : (
                          <IconButton
                            icon={<FiPlus />}
                            size="sm"
                            variant="ghost"
                            aria-label="Add"
                            onClick={() => handleOpenModal(template, "add")}
                            color={colors.bodyText}
                            _hover={{ color: colors.accentGold, bg: colors.bgDeep }}
                          />
                        )}
                      </Td>
                    </Tr>
                  ))
                ) : (
                  <Tr borderColor={colors.borderColor} textAlign="center">
                    <Td
                      borderBottom="none"
                      colSpan="13"
                      fontSize={{ base: "12px", md: "15px" }}
                      fontWeight="500"
                      color={colors.mutedText}
                      textAlign="center"
                      borderColor={colors.borderColor}
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
            mode={modalMode}
            onSave={handleSaveTemplate}
          />
        )}
      </Box>
    </>
  );
};

export default Templates;