import {
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import ProjectForm from "./ProjectFormModal";
import { useFetchItemsQuery, useCreateItemMutation } from "api/apiSlice";
import { toast } from "react-toastify";
import Loader from "components/loading/Loader";
import { buttonStyle } from "utils/btn";
import ProjectFormModal from "./ProjectFormModal";
import { useUserActivityLog } from "hooks/useUserActivityLog";

const AddProject = ({ isOpen, onClose, refetch }) => {
  const { data: devData, isLoading: developersLoading } = useFetchItemsQuery({
    path: "/developer/get",
  });

  const user = JSON.parse(localStorage.getItem("user"));
  const { createUserLog } = useUserActivityLog();
  const [createItemMutation, { isLoading: isCreating }] =
    useCreateItemMutation();

  const developers = devData?.doc || [];

  const handleSubmit = async (values) => {
    try {
      const response = await createItemMutation({
        path: `/developer/projects`,
        body: values,
      }).unwrap();

      toast.success("Project created successfully");
      createUserLog({
        userId: user?._id,
        action: "CREATE",
        entity: "Project",
        entityType: "Project",
        entityId: response._id,
        status: "success",
        message: `${user?.fullName} created project "${response?.doc?.name || "Untitled"}".`,
      });
      onClose();
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Project creating fail!");
    }
  };

  return (
    <Box p={4}>
      <ProjectFormModal
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={handleSubmit}
        developers={developers}
        isSubmitting={isCreating}
        isLoading={developersLoading}
        title="Create Project"
      />
    </Box>
  );
};

export default AddProject;
