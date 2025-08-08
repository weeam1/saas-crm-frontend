import { Box } from "@chakra-ui/react";
import { useFetchItemsQuery, useUpdateItemMutation } from "api/apiSlice";
import { toast } from "react-toastify";
import ProjectFormModal from "./ProjectFormModal";
import { useUserActivityLog } from "hooks/useUserActivityLog";

const EditProject = ({ isOpen, onClose, refetch, data }) => {
  const { data: devData, isLoading: developersLoading } = useFetchItemsQuery({
    path: "/developer/get",
  });

  const user = JSON.parse(localStorage.getItem("user"));
  const { createUserLog } = useUserActivityLog();
  const [updateItemMutation, { isLoading: isUpdate }] = useUpdateItemMutation();

  const developers = devData?.doc || [];

  const handleSubmit = async (values) => {
    try {
      const response = await updateItemMutation({
        path: `/developer/projects/${data?._id}`,
        body: values,
      }).unwrap();
      createUserLog({
        userId: user?._id,
        action: "UPDATE",
        entity: "Project",
        entityId: response._id,
        status: "success",
        message: `"${user?.fullName}" updated project "${response?.doc?.name || "Untitled"}".`,
      });
      toast.success("Project updated successfully");

      onClose();
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Project Update fail!");
      const errorMsg =
        err?.data?.message ||
        "Failed to update the project. Please try again.";
      toast.error("Error updating status");
      createUserLog({
        userId: user?._id,
        action: "UPDATE_FAIL",
        entity: "Project",
        entityId: data?._id || null,
        status: err?.status === "500" ? "error" : "fail",
        message: errorMsg,
      });
    }
  };

  return (
    <Box p={4}>
      <ProjectFormModal
        initialData={data}
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={handleSubmit}
        developers={developers}
        isSubmitting={isUpdate}
        isLoading={developersLoading}
        title="Update Project"
      />
    </Box>
  );
};

export default EditProject;
