import React, { memo, useState } from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import MainStatusTab from "../MainStatusTab";
import SubStatusTab from "../SubStatusTab";
import MetaIdTab from "../MetaIdTab";
import StatusModal from "../StatusModal";
import MetaIdModal from "../MetaIdModal";
import { useMainStatus } from "../../hooks/useMainStatus";
import { useSubStatus } from "../../hooks/useSubStatus";
import { useMetaStatus } from "../../hooks/useMetaStatus";
import TopPagination from "components/pagination/TopPagination";
import SubStatusModal from "../SubStatusModal";

const LeadStatus = memo(() => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isSubModalOpen,
    onOpen: onSubModalOpen,
    onClose: onSubModalClose,
  } = useDisclosure();
  const {
    isOpen: isMetaModalOpen,
    onOpen: onMetaModalOpen,
    onClose: onMetaModalClose,
  } = useDisclosure();

  const [activeTab, setActiveTab] = useState(0);
  const [editingItem, setEditingItem] = useState(null);
  const [editingSubItem, setEditingSubItem] = useState(null);
  const [editingMetaId, setEditingMetaId] = useState(null);

  // Main Status Form
  const [formData, setFormData] = useState({
    label: "",
    color: "#06B6D4",
    order: 1,
    meta_id: "",
    metaStatus: null,
  });
  // Sub Status Form - Updated to match backend schema
  const [subFormData, setSubFormData] = useState({
    label: "",
    color: "#6366F1",
    bgColor: "#6366F120",
    textColor: "#6366F1",
    mainStatus: "", // Required - references LeadMainStatus
    metaStatus: null, // Optional - references LeadMetaStatus
  });

  // Meta Status Form
  const [metaFormData, setMetaFormData] = useState({
    label: "",
    key: "",
    description: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [subFormErrors, setSubFormErrors] = useState({});
  const [metaFormErrors, setMetaFormErrors] = useState({});

  // Hooks
  const {
    mainStatuses,
    pagination: mainPagination,
    totalPages: mainTotalPages,
    totalCount: mainTotalCount,
    handlePageChange: handleMainPageChange,
    handlePageSizeChange: handleMainPageSizeChange,
    isLoading: isMainLoading,
    createStatus,
    updateStatus,
    refetch: refetchMain,
  } = useMainStatus();

  const {
    subStatuses,
    pagination: subPagination,
    totalPages: subTotalPages,
    totalCount: subTotalCount,
    handlePageChange: handleSubPageChange,
    handlePageSizeChange: handleSubPageSizeChange,
    isLoading: isSubLoading,
    createStatus: createSubStatus,
    updateStatus: updateSubStatus,
    deleteStatus: deleteSubStatus,
    refetch: refetchSub,
    filterByParent,
  } = useSubStatus();

  const {
    metaStatuses,
    pagination: metaPagination,
    totalPages: metaTotalPages,
    totalCount: metaTotalCount,
    handlePageChange: handleMetaPageChange,
    handlePageSizeChange: handleMetaPageSizeChange,
    isLoading: isMetaLoading,
    createStatus: createMeta,
    updateStatus: updateMeta,
    deleteStatus: deleteMeta,
    refetch: refetchMeta,
  } = useMetaStatus();

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  // Get current tab's pagination data
  const getCurrentPagination = () => {
    switch (activeTab) {
      case 0:
        return {
          pagination: mainPagination,
          totalPages: mainTotalPages,
          totalCount: mainTotalCount,
          handlePageChange: handleMainPageChange,
          handlePageSizeChange: handleMainPageSizeChange,
          isLoading: isMainLoading,
        };
      case 1:
        return {
          pagination: subPagination,
          totalPages: subTotalPages,
          totalCount: subTotalCount,
          handlePageChange: handleSubPageChange,
          handlePageSizeChange: handleSubPageSizeChange,
          isLoading: isSubLoading,
        };
      case 2:
        return {
          pagination: metaPagination,
          totalPages: metaTotalPages,
          totalCount: metaTotalCount,
          handlePageChange: handleMetaPageChange,
          handlePageSizeChange: handleMetaPageSizeChange,
          isLoading: isMetaLoading,
        };
      default:
        return {
          pagination: mainPagination,
          totalPages: mainTotalPages,
          totalCount: mainTotalCount,
          handlePageChange: handleMainPageChange,
          handlePageSizeChange: handleMainPageSizeChange,
          isLoading: isMainLoading,
        };
    }
  };

  const currentPagination = getCurrentPagination();

  // Main Status Handlers
  const handleAddNew = () => {
    setEditingItem(null);
    setFormData({
      label: "",
      color: "#06B6D4",
      order: 1,
      metaStatus: null,
    });
    onOpen();
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      label: item.label || "",
      color: item.color || "#06B6D4",
      order: item.order || 1,
      metaStatus: item.metaStatus?._id || item.metaStatus || null, // Handle both populated and ID
    });
    onOpen();
  };

  const handleSubmit = async () => {
    const errors = {};

    if (!formData.label) {
      errors.label = "Label is required";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const finalFormData = {
      ...formData,
      value:
        formData.value || formData.label.toLowerCase().replace(/\s+/g, "_"),
    };

    try {
      if (editingItem) {
        await updateStatus(editingItem._id, finalFormData);
      } else {
        await createStatus(finalFormData);
      }

      onClose();
      setFormErrors({});
      refetchMain();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  // Sub Status Handlers
  // Sub Status Handlers
  const handleAddSub = () => {
    setEditingSubItem(null);
    setSubFormData({
      value: "",
      label: "",
      color: "#6366F1",
      bgColor: "#6366F120",
      textColor: "#6366F1",
      mainStatus: "", // Required - references LeadMainStatus
      metaStatus: null, // Optional - references LeadMetaStatus
    });
    onSubModalOpen();
  };

  const handleEditSub = (item) => {
    setEditingSubItem(item);
    setSubFormData({
      label: item.label || "",
      color: item.color || "#6366F1",
      bgColor: item.bgColor || "#6366F1",
      textColor: item.textColor || "#6366F1",
      mainStatus: item.mainStatus[0]?._id || item.mainStatus || "", // Handle both populated and ID
      metaStatus: item.metaStatus?._id || item.metaStatus || null, // Handle both populated and ID
    });
    onSubModalOpen();
  };

  const handleSubSubmit = async () => {
    const errors = {};

    if (!subFormData.mainStatus) {
      errors.mainStatus = "Parent status is required";
    }
    if (!subFormData.label) {
      errors.label = "Label is required";
    }

    if (Object.keys(errors).length > 0) {
      setSubFormErrors(errors);
      return;
    }

    // Generate value from label if not provided
    const finalValue =
      subFormData.value || subFormData.label.toLowerCase().replace(/\s+/g, "_");

    const finalFormData = {
      value: finalValue,
      label: subFormData.label,
      color: subFormData.color,
      bgColor: subFormData.bgColor || generateBgColor(subFormData.color),
      textColor: subFormData.textColor || subFormData.color,
      mainStatus: subFormData.mainStatus,
      metaStatus: subFormData.metaStatus || null,
    };

    try {
      if (editingSubItem) {
        await updateSubStatus(editingSubItem._id, finalFormData);
      } else {
        await createSubStatus(finalFormData);
      }

      onSubModalClose();
      setSubFormErrors({});
      refetchSub();
      refetchMain(); // Refresh main to get updated sub statuses
    } catch (error) {
      console.error("Error submitting sub status:", error);
    }
  };

  // Meta Status Handlers
  const handleAddMetaId = () => {
    setEditingMetaId(null);
    setMetaFormData({
      label: "",
      key: "",
      description: "",
    });
    onMetaModalOpen();
  };

  const handleEditMetaId = (metaId) => {
    setEditingMetaId(metaId);
    setMetaFormData({
      label: metaId.label || "",
      key: metaId.key || "",
      description: metaId.description || "",
    });
    onMetaModalOpen();
  };

  const handleDeleteMetaId = async (metaId) => {
    if (
      window.confirm(`Are you sure you want to delete Meta ID "${metaId.key}"?`)
    ) {
      await deleteMeta(metaId._id);
    }
  };

  const handleMetaSubmit = async () => {
    const errors = {};

    if (!metaFormData.key) {
      errors.key = "Key is required";
    }
    if (!metaFormData.description) {
      errors.description = "Description is required";
    }

    if (Object.keys(errors).length > 0) {
      setMetaFormErrors(errors);
      return;
    }

    try {
      if (editingMetaId) {
        await updateMeta(editingMetaId._id, metaFormData);
      } else {
        await createMeta(metaFormData);
      }

      onMetaModalClose();
      setMetaFormErrors({});
      refetchMeta();
    } catch (error) {
      console.error("Error submitting meta form:", error);
    }
  };

  const getRandomColor = (type) => {
    const colors = {
      main: [
        "#06B6D4",
        "#8B5CF6",
        "#3B82F6",
        "#EC4899",
        "#22C55E",
        "#EF4444",
        "#F97316",
        "#6B7280",
      ],
      sub: [
        "#6366F1",
        "#F59E0B",
        "#EF4444",
        "#10B981",
        "#84CC16",
        "#0EA5E9",
        "#A855F7",
        "#EC4899",
      ],
    };
    return colors[type][Math.floor(Math.random() * colors[type].length)];
  };

  const generateBgColor = (color) => {
    // If color is in hex format (#RRGGBB), add alpha channel (20 = ~12% opacity)
    if (color && color.startsWith("#") && color.length === 7) {
      return color + "20"; // Returns #RRGGBB20 which is valid 8-digit hex
    }
    return color;
  };
  return (
    <Box bg={bgColor} borderRadius="md" boxShadow="sm">
      {/* Header with Add Buttons */}
      <Flex
        p={4}
        justify="space-between"
        align="center"
        borderBottom="1px"
        borderColor={borderColor}
      >
        <Text fontSize="lg" fontWeight="semibold">
          Lead Status Management
        </Text>
        <Flex gap={3}>
          <Button
            leftIcon={<AddIcon />}
            colorScheme="blue"
            size="sm"
            onClick={handleAddNew}
          >
            Add Main Status
          </Button>
          <Button
            leftIcon={<AddIcon />}
            colorScheme="purple"
            size="sm"
            onClick={handleAddSub}
          >
            Add Sub Status
          </Button>
          <Button
            leftIcon={<AddIcon />}
            colorScheme="purple"
            size="sm"
            onClick={handleAddMetaId}
          >
            Add Meta ID
          </Button>
        </Flex>
      </Flex>

      {/* Single Pagination Component at Top */}
      <TopPagination
        currentPage={currentPagination.pagination.page}
        totalPages={currentPagination.totalPages}
        onPageChange={currentPagination.handlePageChange}
        totalItems={currentPagination.totalCount}
        itemsPerPage={currentPagination.pagination.limit}
        refetching={currentPagination.isLoading}
        loading={currentPagination.isLoading}
        handlePageSize={currentPagination.handlePageSizeChange}
      />

      <Tabs onChange={(index) => setActiveTab(index)}>
        <TabList px={4} pt={2}>
          <Tab>Main Status </Tab>
          <Tab>Sub Status </Tab>
          <Tab>Meta IDs </Tab>
        </TabList>

        <TabPanels>
          {/* Main Status Tab */}
          <TabPanel p={0}>
            <MainStatusTab
              mainStatuses={mainStatuses}
              isLoading={isMainLoading}
              onEdit={handleEdit}
              onDelete={() => {}}
              generateBgColor={generateBgColor}
            />
          </TabPanel>

          {/* Sub Status Tab */}
          <TabPanel p={0}>
            <SubStatusTab
              subStatuses={subStatuses}
              isLoading={isSubLoading}
              onEdit={handleEditSub}
              onDelete={deleteSubStatus}
              generateBgColor={generateBgColor}
              onFilterByParent={filterByParent}
              mainStatuses={mainStatuses}
            />
          </TabPanel>

          {/* Meta IDs Tab */}
          <TabPanel p={0}>
            <MetaIdTab
              metaIds={metaStatuses}
              isLoading={isMetaLoading}
              onEdit={handleEditMetaId}
              onDelete={handleDeleteMetaId}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* Main Status Modal */}
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
      />

      {/* Sub Status Modal */}
      <SubStatusModal
        isOpen={isSubModalOpen}
        onClose={onSubModalClose}
        editingItem={editingSubItem}
        formData={subFormData}
        setFormData={setSubFormData}
        formErrors={subFormErrors}
        setFormErrors={setSubFormErrors}
        onSubmit={handleSubSubmit}
        getRandomColor={getRandomColor}
        generateBgColor={generateBgColor}
        mainStatuses={mainStatuses}
        metaStatuses={metaStatuses}
      />

      {/* Meta ID Modal */}
      <MetaIdModal
        isOpen={isMetaModalOpen}
        onClose={onMetaModalClose}
        editingMetaId={editingMetaId}
        metaFormData={metaFormData}
        setMetaFormData={setMetaFormData}
        metaFormErrors={metaFormErrors}
        setMetaFormErrors={setMetaFormErrors}
        onSubmit={handleMetaSubmit}
      />
    </Box>
  );
});

LeadStatus.displayName = "LeadStatus";

export default LeadStatus;
