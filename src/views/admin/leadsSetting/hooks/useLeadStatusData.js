import { useState, useEffect, useMemo } from "react";
import { useToast } from "@chakra-ui/react";

export const useLeadStatusData = (leadStatuses, isApiLoading) => {
  const [mainStatuses, setMainStatuses] = useState([]);
  const [subStatuses, setSubStatuses] = useState([]);
  const [metaIds, setMetaIds] = useState([]);
  const [selectedMainStatus, setSelectedMainStatus] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [editingMetaId, setEditingMetaId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    value: "",
    label: "",
    color: "#06B6D4",
    bgColor: "#CFFAFE",
    textColor: "#0E7490",
    order: 1,
    meta_id: "",
    parentStatus: "",
  });
  const [metaFormData, setMetaFormData] = useState({
    label: "",
    key: "",
    description: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [metaFormErrors, setMetaFormErrors] = useState({});

  const toast = useToast();

  // Map real data from API
  useEffect(() => {
    if (leadStatuses && Array.isArray(leadStatuses)) {
      const mainStatusesCopy = leadStatuses.map((status) => ({
        ...status,
        statuses: status.statuses ? [...status.statuses] : [],
      }));

      setMainStatuses(mainStatusesCopy);

      const allSubStatuses = leadStatuses.flatMap((main) =>
        (main.statuses || []).map((sub) => ({
          ...sub,
          parentLabel: main.label,
          parentValue: main.value,
        })),
      );

      setSubStatuses(allSubStatuses);
      setIsLoading(false);
    } else if (
      leadStatuses &&
      Array.isArray(leadStatuses) &&
      leadStatuses.length === 0
    ) {
      setMainStatuses([]);
      setSubStatuses([]);
      setIsLoading(false);
    }
  }, [leadStatuses]);

  // Initialize meta IDs from existing data
  useEffect(() => {
    const extractedMetaIds = [];

    mainStatuses.forEach((status) => {
      if (
        status.meta_id &&
        !extractedMetaIds.some((m) => m.key === status.meta_id)
      ) {
        extractedMetaIds.push({
          id: `main_${status.meta_id}`,
          label: status.label,
          key: status.meta_id,
          description: `Meta ID for ${status.label} status`,
        });
      }
    });

    subStatuses.forEach((status) => {
      if (
        status.meta_id &&
        !extractedMetaIds.some((m) => m.key === status.meta_id)
      ) {
        extractedMetaIds.push({
          id: `sub_${status.meta_id}`,
          label: status.label,
          key: status.meta_id,
          description: `Meta ID for ${status.label} sub-status`,
        });
      }
    });

    setMetaIds(extractedMetaIds);
  }, [mainStatuses, subStatuses]);

  // Combine loading states
  useEffect(() => {
    setIsLoading(isApiLoading);
  }, [isApiLoading]);

  const handleAddNew = (type) => {
    setEditingItem(null);
    setFormData({
      value: "",
      label: "",
      color: type === "main" ? "#06B6D4" : "#6366F1",
      bgColor: type === "main" ? "#CFFAFE" : "#EEF2FF",
      textColor: type === "main" ? "#0E7490" : "#3730A3",
      order: type === "main" ? mainStatuses.length + 1 : 1,
      meta_id: "",
      parentStatus: type === "sub" ? selectedMainStatus?.value || "" : "",
    });
  };

  const handleAddMetaId = () => {
    setEditingMetaId(null);
    setMetaFormData({
      label: "",
      key: "",
      description: "",
    });
  };

  const handleEditMetaId = (metaId) => {
    setEditingMetaId(metaId);
    setMetaFormData({
      label: metaId.label || "",
      key: metaId.key || "",
      description: metaId.description || "",
    });
  };

  const handleDeleteMetaId = (metaId) => {
    if (
      window.confirm(`Are you sure you want to delete Meta ID "${metaId.key}"?`)
    ) {
      setMetaIds(metaIds.filter((m) => m.id !== metaId.id));

      toast({
        title: "Meta ID deleted",
        description: `${metaId.key} has been deleted successfully.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleEdit = (item, type) => {
    setEditingItem(item);
    setFormData({
      value: item.value || "",
      label: item.label || "",
      color: item.color || "#06B6D4",
      bgColor: item.bgColor || "#CFFAFE",
      textColor: item.textColor || "#0E7490",
      order: item.order || 1,
      meta_id: item.meta_id || "",
      parentStatus: item.parentValue || item.parentStatus || "",
    });
  };

  const handleDelete = (item, type) => {
    if (window.confirm(`Are you sure you want to delete "${item.label}"?`)) {
      toast({
        title: "Status deleted",
        description: `${item.label} has been deleted successfully.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      if (type === "main") {
        setMainStatuses(mainStatuses.filter((s) => s.value !== item.value));
        setSubStatuses(subStatuses.filter((s) => s.parentValue !== item.value));
      } else {
        setSubStatuses(subStatuses.filter((s) => s.value !== item.value));
        setMainStatuses(
          mainStatuses.map((main) => ({
            ...main,
            statuses:
              main.statuses?.filter((sub) => sub.value !== item.value) || [],
          })),
        );
      }
    }
  };

  const handleSubmit = () => {
    const errors = {};

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const finalFormData = {
      ...formData,
      value:
        formData.value || formData.label.toLowerCase().replace(/\s+/g, "_"),
    };

    if (editingItem) {
      if (editingItem.parentValue) {
        setSubStatuses(
          subStatuses.map((s) =>
            s.value === editingItem.value ? { ...s, ...finalFormData } : s,
          ),
        );
        setMainStatuses(
          mainStatuses.map((main) => ({
            ...main,
            statuses:
              main.statuses?.map((sub) =>
                sub.value === editingItem.value
                  ? { ...sub, ...finalFormData }
                  : sub,
              ) || [],
          })),
        );
      } else {
        setMainStatuses(
          mainStatuses.map((s) =>
            s.value === editingItem.value ? { ...s, ...finalFormData } : s,
          ),
        );
      }

      toast({
        title: "Status updated",
        description: `${finalFormData.label} has been updated successfully.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      if (formData.parentStatus) {
        const parentMain = mainStatuses.find(
          (m) => m.value === formData.parentStatus,
        );

        const newSubStatus = {
          ...finalFormData,
          parentValue: formData.parentStatus,
          parentLabel: parentMain?.label,
        };

        setSubStatuses([...subStatuses, newSubStatus]);

        setMainStatuses(
          mainStatuses.map((main) =>
            main.value === formData.parentStatus
              ? { ...main, statuses: [...(main.statuses || []), finalFormData] }
              : main,
          ),
        );
      } else {
        setMainStatuses([...mainStatuses, { ...finalFormData, statuses: [] }]);
      }

      toast({
        title: "Status added",
        description: `${finalFormData.label} has been added successfully.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }

    setFormErrors({});
  };

  const handleMetaSubmit = () => {
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

    if (editingMetaId) {
      setMetaIds(
        metaIds.map((m) =>
          m.id === editingMetaId.id ? { ...m, ...metaFormData } : m,
        ),
      );

      toast({
        title: "Meta ID updated",
        description: `${metaFormData.key} has been updated successfully.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      const newMetaId = {
        id: `meta_${Date.now()}`,
        ...metaFormData,
      };

      setMetaIds([...metaIds, newMetaId]);

      toast({
        title: "Meta ID added",
        description: `${metaFormData.key} has been added successfully.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }

    setMetaFormErrors({});
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

  const generateBgColor = (color) => color + "20";

  const sortedMainStatuses = useMemo(() => {
    return [...mainStatuses].sort((a, b) => a.order - b.order);
  }, [mainStatuses]);

  return {
    mainStatuses,
    subStatuses,
    metaIds,
    selectedMainStatus,
    editingItem,
    editingMetaId,
    isLoading,
    formData,
    metaFormData,
    formErrors,
    metaFormErrors,
    setFormData,
    setMetaFormData,
    setFormErrors,
    setMetaFormErrors,
    handleAddNew,
    handleAddMetaId,
    handleEditMetaId,
    handleDeleteMetaId,
    handleEdit,
    handleDelete,
    handleSubmit,
    handleMetaSubmit,
    getRandomColor,
    generateBgColor,
    sortedMainStatuses,
  };
};
