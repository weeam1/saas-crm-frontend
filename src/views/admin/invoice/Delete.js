
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from "@chakra-ui/react";
import Spinner from "components/spinner/Spinner";
import { useState } from "react";
import { useDeleteItemMutation } from "api/apiSlice";
import { toast } from "react-toastify";

const Delete = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [deleteItem, { isLoading: deleteLoading }] = useDeleteItemMutation();

  const handleDeleteClick = async () => {
    console.log("Delete Props:", {
      method: props.method,
      data: props.data,
      id: props.id,
    });

    if (
      props.method === "many" &&
      Array.isArray(props.data) &&
      props.data.length > 0
    ) {
      try {
        setIsLoading(true);
        const response = await deleteItem({
          path: "/invoice/deleteMany",
          method: "POST",
          body: { ids: props.data },
        }).unwrap();

        console.log("Delete Many Response:", response);
        console.log("Checking condition:", {
          status: response.status,
          success: response.success,
        });

        if (response.status === 200 || response.success) {
          toast({
            title: "Success",
            description: `${props.data.length} invoice(s) deleted successfully.`,
            status: "success",
            duration: 3000,
            isClosable: true,
            position: "top-right",
          });
          props.setSelectedValues([]);
          if (props.fetchData) props.fetchData();
          if (props.setAction) props.setAction((prev) => !prev);
          console.log("Closing modal after deleting many...");
          props.onClose();
        } else {
          console.log("Success condition not met:", response);
          toast({
            title: "Warning",
            description:
              "Delete operation completed but no success confirmation.",
            status: "warning",
            duration: 3000,
            isClosable: true,
          });
        }
      } catch (error) {
        console.error("Error deleting multiple invoices:", error);
        toast({
          title: "Error",
          description: error?.data?.message || "Failed to delete invoices.",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      } finally {
        setIsLoading(false);
      }
    } else if (props.method === "one" && props.id) {
      try {
        setIsLoading(true);
        console.log("Sending delete request:", {
          path: `/invoice/delete/${props.id}`,
          method: "DELETE",
        });
        const response = await deleteItem({
          path: `/invoice/delete/${props.id}`,
          method: "DELETE",
        }).unwrap();

        console.log("Delete Single Response:", response);
        console.log("Checking condition:", {
          status: response.status,
          success: response.success,
        });

        // Adjust this based on your API response structure
        if (response.status === 200 || response.success) {
          toast({
            title: "Success",
            description: "Invoice deleted successfully.",
            status: "success",
            duration: 3000,
            isClosable: true,
            position: "top-right",
          });
          if (props.fetchData) props.fetchData();
          if (props.setAction) props.setAction((prev) => !prev);
          console.log("Closing modal after deleting one...");
          props.onClose();
        } else {
          console.log("Success condition not met:", response);
          toast({
            title: "Warning",
            description:
              "Delete operation completed but no success confirmation.",
            status: "warning",
            duration: 3000,
            isClosable: true,
          });
        }
      } catch (error) {
        console.error("Error deleting invoice:", error);
        toast({
          title: "Error",
          description: error?.data?.message || "Failed to delete invoice.",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      console.error("Invalid delete props:", props);
      toast({
        title: "Invalid Request",
        description: "No valid data provided for deletion.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  const handleClose = () => {
    console.log("Manual close triggered");
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
