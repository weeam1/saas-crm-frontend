






// import {
//   Button,
//   Modal,
//   ModalBody,
//   ModalCloseButton,
//   ModalContent,
//   ModalFooter,
//   ModalHeader,
//   ModalOverlay,
// } from "@chakra-ui/react";
// import Spinner from "components/spinner/Spinner";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { useDeleteItemMutation } from "api/apiSlice";

// const Delete = (props) => {
//   const { isOpen, onClose, method, data, fetchData, clearSearch } = props; // Added clearSearch prop
//   console.log(data, "data");

//   const [deleteItem, { isLoading: deleteLoading }] = useDeleteItemMutation();
//   const navigate = useNavigate();

//   const handleDeleteClick = async () => {
//     if (!data) {
//       toast.error("Developer ID is missing");
//       return;
//     }

//     try {
//       const response = await deleteItem({
//         path: `/developer/delete/${data}`,
//         method: "DELETE",
//       }).unwrap();

//       console.log("Single Delete Response:", response);

//       if (response.status === "success") {
//         toast.success("Developer deleted successfully!");
//         if (typeof fetchData === "function") {
//           fetchData(); // Refresh the table data
//         } else {
//           console.error("fetchData is not a function");
//         }
//         if (typeof clearSearch === "function") {
//           clearSearch(); // Clear the search state
//         } else {
//           console.error("clearSearch is not a function");
//         }
//         onClose(false); // Close the modal
//         // navigate("/user"); // Uncomment if you want to navigate after deletion
//       } else {
//         toast.error(response?.message || "Failed to delete developer");
//       }
//     } catch (error) {
//       console.error("Delete Error:", error);
//       toast.error(
//         error?.data?.message || error.message || "Something went wrong!"
//       );
//     }
//   };

//   const handleClose = () => {
//     onClose(false);
//   };

//   return (
//     <Modal onClose={handleClose} isOpen={isOpen} isCentered>
//       <ModalOverlay />
//       <ModalContent>
//         <ModalHeader>Delete Developer</ModalHeader>
//         <ModalCloseButton />
//         <ModalBody>
//           Are you sure you want to delete the selected developer?
//         </ModalBody>
//         <ModalFooter>
//           <Button
//             colorScheme="red"
//             size="sm"
//             mr={2}
//             onClick={handleDeleteClick}
//             disabled={deleteLoading} // Only use RTK Query's loading state
//           >
//             {deleteLoading ? <Spinner /> : "Yes"}
//           </Button>
//           <Button variant="outline" size="sm" onClick={handleClose}>
//             No
//           </Button>
//         </ModalFooter>
//       </ModalContent>
//     </Modal>
//   );
// };

// export default Delete;



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