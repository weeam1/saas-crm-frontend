import React, { useState } from "react";
import { Box, Flex, Text, Button, useDisclosure } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { useSubStatus } from "../../../../hooks/useSubStatus";
import SubStatusTab from "./SubStatusTab";
import SubStatusModal from "./SubStatusModal";
import TopPagination from "components/pagination/TopPagination";
import DeleteConfirmationModal from "views/admin/payroll/components/DeleteConfirmationModal";

const SubStatusTabContainer = ({ mainStatuses, metaStatuses }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
  const [formData, setFormData] = useState({
    label: "",
    color: "#6366F1",
    bgColor: "#6366F1",
    textColor: "#6366F1",
    mainStatus: "",
    metaStatus: null,
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const {
    subStatuses,
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
    filterByParent,
    isCreating,
    isUpdating,
    isDeleting,
  } = useSubStatus(1, 20);

  const handleAddNew = () => {
    setEditingItem(null);
    setFormData({
      label: "",
      color: "#6366F1",
      bgColor: generateBgColor("#6366F1", 80),
      textColor: "#6366F1",
      mainStatus: "",
      metaStatus: null,
    });
    setFormErrors({});
    onOpen();
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      label: item.label || "",
      color: item.color || "#6366F1",
      bgColor: item.bgColor || "#6366F1",
      textColor: item.textColor || "#6366F1",
      mainStatus: item.mainStatus?._id || item.mainStatus || "",
      metaStatus: item.metaStatus?._id || item.metaStatus || null,
    });
    setFormErrors({});
    onOpen();
  };

  // Handle delete button click - open confirmation modal
  const handleDeleteClick = (id, label) => {
    setDeletingId(id);
    setDeletingItem({ id, label });
    onDeleteOpen();
  };

  // Handle confirm delete
  const handleConfirmDelete = async () => {
    if (!deletingItem) return;

    try {
      await deleteStatus(deletingItem.id);
      onDeleteClose();
      setDeletingItem(null);
      setDeletingId(null);
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  const handleSubmit = async () => {
    const errors = {};
    if (!formData.mainStatus) errors.mainStatus = "Main status is required";
    if (!formData.label?.trim()) errors.label = "Label is required";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);

    const finalValue = formData.label.toLowerCase().replace(/\s+/g, "_");
    const finalFormData = {
      value: finalValue,
      label: formData.label,
      color: formData.color,
      bgColor: formData.bgColor || generateBgColor(formData.color),
      textColor: formData.textColor || formData.color,
      mainStatus: formData.mainStatus,
      metaStatus: formData.metaStatus || null,
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
    }, // ✅ Only changes icon color
  };
  const getRandomColor = () => {
    const colors = [
      "#6366F1",
      "#F59E0B",
      "#EF4444",
      "#10B981",
      "#84CC16",
      "#0EA5E9",
      "#A855F7",
      "#EC4899",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <Box>
      <Flex justify="space-between" align="center" p={4}>
        <Text fontSize="lg" fontWeight="semibold">
          Sub Status
        </Text>

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
          Add Sub Status
        </Button>
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

      <SubStatusTab
        subStatuses={subStatuses}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDeleteClick} // Updated to use the new handler
        generateBgColor={generateBgColor}
        onFilterByParent={filterByParent}
        mainStatuses={mainStatuses}
        isDeleting={isDeleting}
        deletingId={deletingId}
      />

      <SubStatusModal
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
        mainStatuses={mainStatuses}
        metaStatuses={metaStatuses}
        isSubmitting={isSubmitting || isCreating || isUpdating}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        onConfirm={handleConfirmDelete}
        title="Delete Sub Status"
        itemName={deletingItem?.label}
        extraText="This action cannot be undone"
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeleting}
      />
    </Box>
  );
};

export default SubStatusTabContainer;
