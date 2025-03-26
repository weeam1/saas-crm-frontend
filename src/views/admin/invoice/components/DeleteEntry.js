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
import { useDeleteItemMutation } from "api/apiSlice";
import { toast } from "react-toastify";

const Delete = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [deleteItem, { isLoading: deleteLoading }] = useDeleteItemMutation();

  const handleDeleteClick = async () => {
    try {
      setIsLoading(true);

      if (props.method === "one" && props.id) {
        const response = await deleteItem({
          path: `/invoices/entries/${props.id}`,
          method: "DELETE",
        }).unwrap();

        console.log("Delete One Response:", response);
        toast.success("Invoice deleted successfully!");
      } else {
        console.error("Invalid delete props:", props);
        throw new Error("No valid data provided for deletion");
      }

      // On success, refetch data with current pageIndex and pageSize
      if (props.fetchData) {
        props.fetchData({
          pageIndex: props.pageIndex,
          pageSize: props.pageSize,
        });
      }
      if (props.setAction) props.setAction((prev) => !prev);
      props.onClose();
    } catch (error) {
      console.error("Error during deletion:", error);
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "An unexpected error occurred during deletion";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    props.onClose();
  };

  return (
    <Modal onClose={props.onClose} isOpen={props.isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Delete Invoice</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          Are you sure you want to delete the selected invoice?
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="red"
            size="sm"
            mr={2}
            borderRadius="6px"
            onClick={handleDeleteClick}
            disabled={isLoading || deleteLoading}
          >
            {isLoading || deleteLoading ? <Spinner /> : "Yes"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClose}
            borderRadius="6px"
          >
            No
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default Delete;
