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
  const [deleteManyInvoices] = useDeleteManyInvoicesMutation();

  const handleDeleteClick = async () => {
    try {
      setIsLoading(true);

      if (
        props.method === "many" &&
        Array.isArray(props.data) &&
        props.data.length > 0
      ) {
        console.log("Payload sent to deleteMany:", props.data);
        const response = await deleteManyInvoices({
          path: "/invoice/deleteMany",
          method: "POST",
          body: { ids: props.data },
        }).unwrap();

        if (
          response?.status === "success" ||
          response?.code === 200 ||
          response?.status === 200
        ) {
          toast.success(
            `${props.data.length} invoice(s) deleted successfully!`
          );
        } else {
          throw new Error(response?.message || "Failed to delete invoices");
        }
      } else if (props.method === "one" && props.id) {
        const response = await deleteItem({
          path: `/invoice/delete/${props.id}`,
          method: "DELETE",
        }).unwrap();

        if (
          response?.status === "success" ||
          response?.code === 200 ||
          response?.status === 200
        ) {
          toast.success("Invoice deleted successfully!");
        } else {
          throw new Error(response?.message || "Failed to delete invoice");
        }
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
      if (props.method === "many") props.setSelectedValues([]);
      props.onClose();
    } catch (error) {
      console.error("Error during deletion:", error);
      toast.error(
        error.message || "An unexpected error occurred during deletion"
      );
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
        <ModalHeader>
          Delete Invoice{props.method === "one" ? "" : "s"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          Are you sure you want to delete the selected invoice
          {props.method === "one" ? "" : "s"}?
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
