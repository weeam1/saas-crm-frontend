import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import Spinner from "components/spinner/Spinner";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDeleteItemMutation } from "api/apiSlice";

const Delete = (props) => {
  const { isOpen, onClose, method, data , fetchData} = props;
  console.log(data, "data");

  const [deleteItem, { isLoading: deleteLoading }] = useDeleteItemMutation();
  const navigate = useNavigate();

  const handleDeleteClick = async () => {
    if (!data) {
      toast.error("Developer ID is missing");
      return;
    }

    try {
      const response = await deleteItem({
        path: `/developer/delete/${data}`,
        method: "DELETE",
      }).unwrap();

      console.log("Single Delete Response:", response);

      if (response.status === "success") {
        toast.success("Developer deleted successfully!");
        fetchData();
        onClose(false);
        // navigate("/user");
      } else {
        toast.error(response?.message || "Failed to delete developer");
      }
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error(
        error?.data?.message || error.message || "Something went wrong!"
      );
    }
  };

  const handleClose = () => {
    onClose(false);
  };

  return (
    <Modal onClose={handleClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Delete Developer</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          Are you sure you want to delete the selected developer?
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="red"
            size="sm"
            mr={2}
            onClick={handleDeleteClick}
            disabled={deleteLoading} // Only use RTK Query's loading state
          >
            {deleteLoading ? <Spinner /> : "Yes"}
          </Button>
          <Button variant="outline" size="sm" onClick={handleClose}>
            No
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default Delete;
