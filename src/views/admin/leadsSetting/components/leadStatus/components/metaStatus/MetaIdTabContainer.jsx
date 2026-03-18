import React, { useState } from "react";
import { Box, Flex, Text, Button, useDisclosure } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { useMetaStatus } from "../../../../hooks/useMetaStatus";
import MetaIdTab from "./MetaIdTab";
import MetaIdModal from "./MetaIdModal";
import TopPagination from "components/pagination/TopPagination";
import DeleteConfirmationModal from "views/admin/payroll/components/DeleteConfirmationModal";
import CountUpComponent from "components/countUpComponent/countUpComponent";

const MetaIdTabContainer = () => {
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
    key: "",
    description: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const {
    metaStatuses,
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
  } = useMetaStatus(1, 20);

  const handleAddNew = () => {
    setEditingItem(null);
    setFormData({ label: "", key: "", description: "" });
    setFormErrors({});
    onOpen();
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      label: item.label || "",
      key: item.key || "",
      description: item.description || "",
    });
    setFormErrors({});
    onOpen();
  };

  // Handle delete button click - open confirmation modal
  const handleDeleteClick = (id, key) => {
    setDeletingId(id);
    setDeletingItem({ id, key });
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

    // Validate required fields
    if (!formData.label?.trim()) {
      errors.label = "Label is required";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);

    try {
      if (editingItem) {
        await updateStatus(editingItem._id, formData);
      } else {
        await createStatus(formData);
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
  return (
    <Box>
      <Flex justify="space-between" align="center" p={4}>
        <Text color={"gray.900"} fontSize="20px" fontWeight="500">
          <span style={{ marginRight: "4px" }}>Meta IDs</span>
          <CountUpComponent targetNumber={totalCount} />
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
          Add Meta ID
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

      <MetaIdTab
        metaIds={metaStatuses}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDeleteClick} // Updated to use the new handler
        isDeleting={isDeleting}
        deletingId={deletingId}
      />

      <MetaIdModal
        isOpen={isOpen}
        onClose={onClose}
        editingMetaId={editingItem}
        metaFormData={formData}
        setMetaFormData={setFormData}
        metaFormErrors={formErrors}
        setMetaFormErrors={setFormErrors}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting || isCreating || isUpdating}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        onConfirm={handleConfirmDelete}
        title="Delete Meta ID"
        itemName={deletingItem?.key}
        extraText="Deleting this Meta ID will disconnect it from all leads and statuses (Main Status & Sub Status) that are currently using it. This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeleting}
      />
    </Box>
  );
};

export default MetaIdTabContainer;
