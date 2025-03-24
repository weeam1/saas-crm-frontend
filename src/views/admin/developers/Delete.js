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
import { useState } from "react";
import {
  useDeleteItemMutation,
  useDeleteManyInvoicesMutation,
} from "api/apiSlice";
import { toast } from "react-toastify";

const Delete = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [deleteItem, { isLoading: deleteLoading }] = useDeleteItemMutation();
  const [deleteManyDevelopers] = useDeleteManyInvoicesMutation(); // Updated variable name for clarity

  const handleDeleteClick = async () => {
    if (
      props.method === "many" &&
      Array.isArray(props.data) &&
      props.data.length > 0
    ) {
      try {
        console.log("Payload sent to deleteMany:", props.data);
        setIsLoading(true);
        const response = await deleteManyDevelopers({
          path: "/developer/deleteMany", // Updated endpoint to reflect "developer"
          method: "POST",
          body: { ids: props.data },
        }).unwrap();

        if (
          response?.status === "success" ||
          response?.code === 200 ||
          response?.status === 200
        ) {
          toast.success(
            `${props.data.length} developer(s) deleted successfully!`
          );
          if (props.fetchData) props.fetchData();
          if (props.setAction) props.setAction((prev) => !prev);
          props.onClose(); // Close modal
          props.setSelectedValues([]);
        } else {
          toast.error(response?.message || "Failed to delete developers");
        }
      } catch (error) {
        console.error("Error deleting multiple developers:", error);
        toast.error(error?.data?.message || "Failed to delete developers!");
      } finally {
        setIsLoading(false);
      }
    } else if (props.method === "one" && props.id) {
      try {
        setIsLoading(true);
        const response = await deleteItem({
          path: `/developer/delete/${props.id}`, // Updated endpoint to reflect "developer"
          method: "DELETE",
        }).unwrap();

        if (
          response?.status === "success" ||
          response?.code === 200 ||
          response?.status === 200
        ) {
          toast.success("Developer deleted successfully!");
          if (props.fetchData) props.fetchData();
          if (props.setAction) props.setAction((prev) => !prev);
          props.onClose(); // Close modal
        } else {
          toast.error(response?.message || "Failed to delete developer");
        }
      } catch (error) {
        console.error("Error deleting developer:", error);
        toast.error(error?.data?.message || "Failed to delete developer!");
      } finally {
        setIsLoading(false);
      }
    } else {
      console.error("Invalid delete props:", props);
      toast.error("No valid data provided for deletion!");
    }
  };

  const handleClose = () => {
    props.onClose();
  };

  return (
    <Modal onClose={props.onClose} isOpen={props.isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Delete Developer{props.method === "one" ? "" : "s"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          Are you sure you want to delete the selected developer
          {props.method === "one" ? "" : "s"}?
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="red"
            size="sm"
            mr={2}
            onClick={handleDeleteClick}
            borderRadius="5px"
            disabled={isLoading || deleteLoading}
          >
            {isLoading || deleteLoading ? <Spinner /> : "Yes"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClose}
            borderRadius="5px"
          >
            No
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default Delete;
