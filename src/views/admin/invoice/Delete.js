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

      let response;
      if (
        props.method === "many" &&
        Array.isArray(props.data) &&
        props.data.length > 0
      ) {
        console.log("Payload sent to deleteMany:", props.data);
        response = await deleteManyInvoices({
          path: "/invoices/delete_many",
          method: "DELETE",
          body: { ids: props.data },
        }).unwrap();

        console.log("Delete Many Response:", response);
        toast.success(`${props.data.length} invoice(s) deleted successfully!`);
      } else if (props.method === "one" && props.id) {
        response = await deleteItem({
          path: `/invoices/${props.id}`,
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
      if (props.method === "many") props.setSelectedValues([]);
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
