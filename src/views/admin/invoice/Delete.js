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
    if (
      props.method === "many" &&
      Array.isArray(props.data) &&
      props.data.length > 0
    ) {
      try {
        console.log("Payload sent to deleteMany:", props.data);
        setIsLoading(true);
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
          if (props.fetchData) props.fetchData();
          if (props.setAction) props.setAction((prev) => !prev);
          props.onClose(); // Close modal
          props.setSelectedValues([]);
        } else {
          toast.error(response?.message || "Failed to delete invoices");
        }
      } catch (error) {
        console.error("Error deleting multiple invoices:", error);
        toast.error(error?.data?.message || "Failed to delete invoices!");
      } finally {
        setIsLoading(false);
      }
    } else if (props.method === "one" && props.id) {
      try {
        setIsLoading(true);
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
          if (props.fetchData) props.fetchData();
          if (props.setAction) props.setAction((prev) => !prev);
          props.onClose(); // Close modal
        } else {
          toast.error(response?.message || "Failed to delete invoice");
        }
      } catch (error) {
        console.error("Error deleting invoice:", error);
        toast.error(error?.data?.message || "Failed to delete invoice!");
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
            onClick={handleDeleteClick}
            disabled={isLoading || deleteLoading}
          >
            {isLoading || deleteLoading ? <Spinner /> : "Yes"}
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
