import React, { useState } from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  useDisclosure,
  HStack,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { useMainStatus } from "../../../../hooks/useMainStatus";
import MainStatusTab from "./MainStatusTab";
import StatusModal from "./StatusModal";
import TopPagination from "components/pagination/TopPagination";
import CountUpComponent from "components/countUpComponent/countUpComponent";
import SearchBox from "views/admin/payroll/components/SearchBox";
import RefreshButton from "components/refresh/RefreshButton";
import { useMetaStatus } from "views/admin/leadsSetting/hooks/useMetaStatus";

const MainStatusTabContainer = () => {
  const { metaStatuses } = useMetaStatus();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    label: "",
    color: "#6366F1",
    bgColor: "#6366F1",
    textColor: "#6366F1",
    coinCost: 50,
    metaStatus: null,
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const {
    mainStatuses,
    setMainStatuses, // Make sure your hook returns setMainStatuses
    isLoading,
    pagination,
    totalPages,
    totalCount,
    handlePageChange,
    handlePageSizeChange,
    createStatus,
    updateStatus,
    deleteStatus,
    refetch,
    isCreating,
    isUpdating,
    isDeleting,
    searchTerm,
    handleSearchTermChange,
    handleSearch,
    clearSearch,
  } = useMainStatus(1, 20);

  // Function to update data locally after coin edit
  const updateDataLocally = (id, updatedData, type = "update") => {
    if (type === "update") {
      setMainStatuses((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, ...updatedData } : item,
        ),
      );
    }
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setFormData({
      label: "",
      color: "#6366F1",
      bgColor: generateBgColor("#6366F1", 80),
      textColor: "#6366F1",
      coinCost: 50,
      metaStatus: null,
    });
    setFormErrors({});
    onOpen();
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      label: item.label || "",
      color: item.color || "#06B6D4",
      bgColor: item.bgColor || "#6366F1",
      textColor: item.textColor || "#6366F1",
      coinCost: item.coinCost || 0,
      metaStatus: item.metaStatus?._id || item.metaStatus || null,
    });
    setFormErrors({});
    onOpen();
  };

  const handleDelete = async (id, label, replacementId) => {
    console.log("Delete confirmed with ID:", id, "replacement:", replacementId);
    setDeletingId(id);
    try {
      await deleteStatus(id, replacementId);
    } catch (error) {
      console.error("Error deleting:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleSubmit = async () => {
    const errors = {};
    if (!formData.label?.trim()) errors.label = "Name is required";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);

    const finalFormData = {
      ...formData,
      value: formData.label.toLowerCase().replace(/\s+/g, "_"),
    };

    try {
      if (editingItem) {
        await updateStatus(editingItem._id, finalFormData);
      } else {
        await createStatus(finalFormData);
      }
      onClose();
      setFormErrors({});
      refetch();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateBgColor = (hex, percent = 80) => {
    const cleanHex = hex.replace("#", "");
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    const newR = Math.round(r + (255 - r) * (percent / 100));
    const newG = Math.round(g + (255 - g) * (percent / 100));
    const newB = Math.round(b + (255 - b) * (percent / 100));
    return `#${[newR, newG, newB].map((x) => x.toString(16).padStart(2, "0")).join("")}`;
  };

  const getRandomColor = () => {
    const colors = [
      "#06B6D4",
      "#8B5CF6",
      "#3B82F6",
      "#EC4899",
      "#22C55E",
      "#EF4444",
      "#F97316",
      "#6B7280",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const buttonStyle = {
    size: "sm",
    borderRadius: "md",
    _hover: { shadow: "sm", transition: "all 0.2s ease-in-out" },
    _active: { bg: "brand.500" },
    color: "white",
    fontWeight: "medium",
    sx: {
      svg: {
        fill: "white",
        bg: "transparent",
        borderRadius: "full",
        p: ".5px",
      },
    },
  };

  const handleSearchClick = (term) => {
    handleSearch(term);
  };

  return (
    <Box>
      <Flex justify="space-between" align="center" p={4}>
        <Text color={"gray.900"} fontSize="20px" fontWeight="500">
          <span style={{ marginRight: "4px" }}>Main Status</span>
          <CountUpComponent targetNumber={totalCount} />
        </Text>

        <HStack spacing={4}>
          <RefreshButton
            aria-label="Refresh main statuses"
            isLoading={isLoading}
            isFetching={isLoading}
            onClick={refetch}
          />

          <Box>
            <SearchBox
              searchTerm={searchTerm}
              setSearchTerm={handleSearchTermChange}
              onSearchTermChange={handleSearchClick}
              isLoading={isLoading}
            />
          </Box>

          <Button
            {...buttonStyle}
            leftIcon={<AddIcon />}
            variant="solid"
            bg="brand.500"
            py="2"
            px="5"
            size="sm"
            textColor={"white"}
            onClick={handleAddNew}
            isLoading={isCreating}
            loadingText="Adding"
          >
            Add Main Status
          </Button>
        </HStack>
      </Flex>

      <TopPagination
        currentPage={pagination.page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        totalItems={totalCount}
        itemsPerPage={pagination.limit}
        loading={isLoading}
        handlePageSize={handlePageSizeChange}
      />

      <MainStatusTab
        mainStatuses={mainStatuses}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        generateBgColor={generateBgColor}
        isDeleting={isDeleting}
        deletingId={deletingId}
        isUpdating={isUpdating}
        updateData={updateDataLocally}
        refetchMainStatuses={refetch}
      />

      <StatusModal
        isOpen={isOpen}
        onClose={onClose}
        editingItem={editingItem}
        formData={formData}
        setFormData={setFormData}
        formErrors={formErrors}
        setFormErrors={setFormErrors}
        onSubmit={handleSubmit}
        getRandomColor={getRandomColor}
        generateBgColor={generateBgColor}
        metaStatuses={metaStatuses}
        isSubmitting={isSubmitting || isCreating || isUpdating}
      />
    </Box>
  );
};

export default MainStatusTabContainer;
