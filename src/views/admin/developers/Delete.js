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
import { useDispatch } from "react-redux";
import { apiSlice } from "api/apiSlice";

const Delete = (props) => {
  const {
    isOpen,
    onClose,
    id,
    method,
    data,
    fetchData,
    setAction,
    setSelectedValues,
    pageIndex,
    pageSize: pageSizeProp,
    totalItems,
    currentPage,
    refetch, // Receive refetch prop
  } = props;

  const dispatch = useDispatch();
  const pageSize = pageSizeProp && pageSizeProp > 0 ? pageSizeProp : 10;

  const [isLoading, setIsLoading] = useState(false);
  const [deleteItem, { isLoading: deleteLoading }] = useDeleteItemMutation();
  const [deleteManyDevelopers] = useDeleteManyInvoicesMutation();

  const handleDeleteClick = async () => {
    // Validate pageSize and pageIndex
    if (!pageSize || pageSize <= 0) {
      console.error("Invalid pageSize after fallback:", pageSize);
      toast.error("Invalid page size. Unable to fetch updated data.");
      return;
    }

    if (pageIndex < 0) {
      console.error("Invalid pageIndex:", pageIndex);
      toast.error("Invalid page index. Unable to fetch updated data.");
      return;
    }

    let newPageIndex = pageIndex;
    const safeTotalItems = totalItems >= 0 ? totalItems : 0;
    const itemsBeingDeleted =
      method === "many" ? (Array.isArray(data) ? data.length : 0) : 1;
    const itemsAfterDeletion = Math.max(0, safeTotalItems - itemsBeingDeleted);

    const startIndex = pageIndex * pageSize;
    const itemsOnCurrentPage = Math.min(pageSize, safeTotalItems - startIndex);
    const remainingItemsOnPage = Math.max(
      0,
      itemsOnCurrentPage - itemsBeingDeleted
    );

    if (remainingItemsOnPage <= 0 && itemsAfterDeletion > 0) {
      newPageIndex = Math.max(0, Math.ceil(itemsAfterDeletion / pageSize) - 1);
    } else if (itemsAfterDeletion === 0) {
      newPageIndex = 0;
    }

    newPageIndex = Math.max(0, newPageIndex);

    if (method === "many" && Array.isArray(data) && data.length > 0) {
      try {
        setIsLoading(true);
        const response = await deleteManyDevelopers({
          path: "/developer/deleteMany",
          method: "POST",
          body: { ids: data },
        }).unwrap();
        refetch();
        if (
          response?.status === "success" ||
          response?.code === 200 ||
          response?.status === 200
        ) {
          toast.success(`${data.length} developer(s) deleted successfully!`);
          if (fetchData) fetchData({ pageIndex: newPageIndex, pageSize });
          dispatch(apiSlice.util.invalidateTags(["Developers"]));
          if (refetch) refetch();
          if (setAction) setAction((prev) => !prev);
          onClose();
          setSelectedValues([]);
        } else {
          toast.error(response?.message || "Failed to delete developers");
        }
      } catch (error) {
        console.error("Error deleting multiple developers:", error);
        toast.error(error?.data?.message || "Failed to delete developers!");
      } finally {
        setIsLoading(false);
      }
    } else if (method === "one" && id) {
      try {
        setIsLoading(true);
        const response = await deleteItem({
          path: `/developer/delete/${id}`,
          method: "DELETE",
        }).unwrap();

        if (
          response?.status === "success" ||
          response?.code === 200 ||
          response?.status === 200
        ) {
          toast.success("Developer deleted successfully!");
          if (fetchData) fetchData({ pageIndex: newPageIndex, pageSize });
          dispatch(apiSlice.util.invalidateTags(["Developers"]));
          if (refetch) refetch(); // Force refetch
          if (setAction) setAction((prev) => !prev);
          onClose();
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
    onClose();
  };

  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Delete Developer{method === "one" ? "" : "s"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          Are you sure you want to delete the selected developer
          {method === "one" ? "" : "s"}?
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
