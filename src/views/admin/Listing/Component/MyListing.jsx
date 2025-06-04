import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Flex,
  Text,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  FormLabel,
  Select,
  Input,
  useDisclosure,
  Textarea,
  Switch,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon, EditIcon, ViewIcon } from "@chakra-ui/icons";
import { FiSearch } from "react-icons/fi";
import {
  useFetchItemsQuery,
  useDeleteItemMutation,
  useUpdateItemMutation,
} from "api/apiSlice";
import { toast } from "react-toastify";
import TableLoading from "components/loading/TableLoading";
import { useNavigate } from "react-router-dom";
import NotesModal from "./Notes/index";
import TopPagination from "components/pagination/TopPagination";
import AdvancedSearchModal from "./AdvancedSearchModal";
import ActiveFiltersDisplay from "./SubComponent/ActiveFiltersDisplay";
import { format } from "date-fns";
import NoData from "views/admin/lead-v2/components/subComponents/NoData";

const MyListing = ({ listingType, listingUnitType }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [deleteItemMutation] = useDeleteItemMutation();
  const Navigate = useNavigate();
  const [selectedListing, setSelectedListing] = useState(null);
  const notesModalDisclosure = useDisclosure();
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "superAdmin";

  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
  const [currentListingId, setCurrentListingId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [updateStatus] = useUpdateItemMutation();
  const [filters, setFilters] = useState({});
  const [filterChanged, setFilterChanged] = useState(false);
  const [tableData, setTableData] = useState();

  const columns = [
    "SR.No",
    "projectName",
    "Unit Type",
    "Sub Unit Type",
    "Type",
    "Location",
    "Building Age",
    "Developer",
    "Price",
    "Commission Type",
    "Commission Value",
    "Total Price",
    "Size (sqft)",
    "Status",
    "Date",
    "Created By",
    "Notes",
    "Action",
  ];

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
    refetch();
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const buildQueryParams = () => {
    const params = {
      page: currentPage,
      limit: pageSize,
    };

    if (Object.keys(filters).length > 0) {
      if (filters.projectName) params.projectName = filters.projectName;
      if (filters.location) params.location = filters.location;
      if (filters.listingType) params.listingType = filters.listingType;
      if (filters.unitType) params.unitType = filters.unitType;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.minArea) params.minArea = filters.minArea;
      if (filters.maxArea) params.maxArea = filters.maxArea;
      if (filters.month) params.month = filters.month;
      if (filters.year) params.year = filters.year;
      if (filters.startFrom) params.startFrom = filters.startFrom;
      if (filters.startTo) params.startTo = filters.startTo;
    }

    return params;
  };

  const { data, isLoading, refetch, isFetching } = useFetchItemsQuery(
    { path: `listing/secondary/my-listings`, params: buildQueryParams() },
    { refetchOnMountOrArgChange: true }
  );

  const handleDeleteListing = async (listingId) => {
    try {
      await deleteItemMutation({
        path: `/listing/secondary/${listingId}`,
        body: {},
      }).unwrap();
      toast.success("The listing has been deleted successfully.", {
        autoClose: 3000,
      });
      refetch();
    } catch (error) {
      console.error("Failed to delete listing:", error);
      toast.error(
        error.data?.message ||
          "Failed to delete the listing. Please try again.",
        { autoClose: 3000 }
      );
    }
  };

  useEffect(() => {
    if (data) {
      setTotalPages(data.totalPages || 0);
      setTotalItems(data.totalDocs || 0);
      setTableData(data.data);
    }
  }, [data]);

  const handleStatusToggle = async (listingId, isActive) => {
    setCurrentListingId(listingId);

    let status = isActive ? "active" : "inactive";
    setSelectedStatus(status);

    if (status === "rejected") {
      setIsRejectionModalOpen(true);
    } else {
      await updateListingStatus(listingId, status);
    }
  };
  const handleStatusChange = async (listingId, status, previousStatus) => {
    if (status === previousStatus) {
      return;
    }
    setCurrentListingId(listingId);
    setSelectedStatus(status);

    if (status === "rejected") {
      setIsRejectionModalOpen(true);
    } else {
      await updateListingStatus(listingId, status);
    }
  };
  const updateListingStatus = async (listingId, status) => {
    try {
      const body = { status };
      if (status === "rejected") {
        body.rejectionReason = rejectionReason;
      }
      if (adminNotes) {
        body.adminNotes = adminNotes;
      }

      await updateStatus({
        path: `listing/secondary/${listingId}/status`,
        body,
      }).unwrap();

      toast.success("Status updated successfully");
      setTableData((prevData) =>
        prevData.map((listing) =>
          listing._id === listingId ? { ...listing, status } : listing
        )
      );
      setIsRejectionModalOpen(false);
    } catch (error) {
      toast.error("Error updating status");
    }
  };

  const handleApplyFilters = (newFilters) => {
    const cleanedFilters = Object.fromEntries(
      Object.entries(newFilters).filter(
        ([_, value]) => value !== "" && value !== undefined
      )
    );

    setFilters(cleanedFilters);
    setCurrentPage(1);
    setFilterChanged(true);
    refetch();
  };

  useEffect(() => {
    if (filterChanged) {
      setFilterChanged(false);
    }
  }, [filterChanged]);

  const handleClearFilters = (filterKey) => {
    if (filterKey) {
      const newFilters = { ...filters };
      delete newFilters[filterKey];
      setFilters(newFilters);
    } else {
      setFilters({});
    }
    setCurrentPage(1);
    setFilterChanged(true);
    refetch();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "yellow";
      case "approved":
        return "green";
      case "rejected":
        return "red";
      case "active":
        return "blue";
      case "inactive":
        return "gray";
      default:
        return "gray";
    }
  };
  return (
    <Box
      overflowY="auto"
      scrollBehavior="smooth"
      boxShadow="sm"
      bg="white"
      px={2}
      marginTop={"-16px"}
    >
      <Flex justifyContent="space-between" alignItems="center" p={3}>
        <Text fontSize="20px" fontWeight="bold" color="black" p={3}>
          My Listings
        </Text>
        <Box gap={2} display="flex" alignItems="center">
          <Flex justifyContent="space-between" alignItems="center" gap={2}>
            <ActiveFiltersDisplay
              filters={filters}
              onClearFilters={handleClearFilters}
              listingTypes={listingType?.doc}
              unitTypes={listingUnitType?.doc}
            />
            <IconButton
              icon={<FiSearch />}
              onClick={() => setIsFilterOpen(true)}
              aria-label="Search Listings"
              colorScheme="brand"
              variant="solid"
              size="sm"
              borderRadius="full"
              boxShadow="md"
            />
          </Flex>

          <Button
            size="md"
            variant="brand"
            leftIcon={<AddIcon />}
            py={3}
            px={6}
            onClick={() => Navigate("/listing/add-listing")}
          >
            Add New
          </Button>
        </Box>
      </Flex>
      <Box mb={1}>
        <TopPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          totalItems={totalItems}
          itemsPerPage={pageSize}
          setPageSize={setPageSize}
          handlePageSize={handlePageSizeChange}
          refetching={isLoading}
          loading={isLoading}
        />
      </Box>
      <Box borderRadius="lg" boxShadow="sm" bg="white" overflowY="auto">
        <Table variant="striped" size="lg" bg="white">
          <Thead
            position="sticky"
            top={0}
            bg="white"
            zIndex={2}
            boxShadow="0px 2px 8px rgba(0, 0, 0, 0.1)"
            fontSize={"16px"}
            borderRadius="lg"
          >
            <Tr>
              {columns.map((header, index) => (
                <Th key={index} bg="brand.200" whiteSpace="nowrap" py={4}>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text
                      fontSize={{ base: "12px", md: "14px" }}
                      fontWeight="600"
                      color="gray.700"
                      textTransform="capitalize"
                    >
                      {header}
                    </Text>
                  </Box>
                </Th>
              ))}
            </Tr>
          </Thead>
          {isLoading || isFetching ? (
            <TableLoading columns={columns} length={7} py="4" />
          ) : (
            <Tbody>
              {tableData && tableData.length > 0 ? (
                tableData.map((listing, index) => (
                  <Tr key={index}>
                    <Td
                      py={4}
                      fontSize={{ base: "12px", md: "14px" }}
                      fontWeight="400"
                      minWidth="100px"
                      textAlign={"center"}
                    >
                      {index + 1}
                    </Td>
                    <Td
                      textAlign="center"
                      whiteSpace="nowrap"
                      minWidth="200px"
                      overflow="hidden"
                      textOverflow="ellipsis"
                    >
                      {listing.projectName}
                    </Td>
                    <Td textAlign="center">
                      {listing.unitType?.name || "N/A"}
                    </Td>
                    <Td textAlign="center">
                      {listing.subUnitType?.name || "N/A"}
                    </Td>
                    <Td textAlign="center" minWidth="100px">
                      {listing.listingType?.name || "N/A"}
                    </Td>
                    <Td
                      textAlign="center"
                      whiteSpace="nowrap"
                      minWidth="250px"
                      overflow="hidden"
                      textOverflow="ellipsis"
                    >
                      {listing.location || "N/A"}
                    </Td>
                    <Td
                      textAlign="center"
                      whiteSpace="nowrap"
                      minWidth="200px"
                      overflow="hidden"
                      textOverflow="ellipsis"
                    >
                      {listing.buildingAge
                        ? `${listing.buildingAge} Years`
                        : "N/A"}
                    </Td>
                    <Td
                      textAlign="center"
                      whiteSpace="nowrap"
                      minWidth="200px"
                      overflow="hidden"
                      textOverflow="ellipsis"
                    >
                      {listing?.developer
                        ? listing?.developer
                        : "N/A"}
                    </Td>
                    <Td
                      py={4}
                      fontSize={{ base: "12px", md: "14px" }}
                      fontWeight="400"
                      minWidth="100px"
                      textAlign={"center"}
                    >
                      {listing.price
                        ? `AED${listing.price.toLocaleString()}`
                        : "N/A"}
                    </Td>
                    <Td textAlign="center">
                      {listing.brokerCommissionType === "AED"
                        ? "AED"
                        : listing.brokerCommissionType === "PERCENT"
                          ? "Percent"
                          : "N/A"}
                    </Td>
                    <Td textAlign="center">
                      {listing.brokerCommissionValue
                        ? `${listing.brokerCommissionValue}${listing.brokerCommissionType === "PERCENT" ? " %" : listing.brokerCommissionType === "AED" ? " AED" : ""}`
                        : "0"}
                    </Td>
                    <Td textAlign="center">
                      {listing.totalPrice
                        ? `AED${listing.totalPrice.toLocaleString()}`
                        : listing.price
                          ? `AED${listing.price.toLocaleString()}`
                          : "N/A"}
                    </Td>
                    <Td
                      py={4}
                      fontSize={{ base: "12px", md: "14px" }}
                      fontWeight="400"
                      minWidth="100px"
                      textAlign={"center"}
                    >
                      {listing.area ? listing.area.toLocaleString() : "N/A"}
                    </Td>
                    <Td
                      py={4}
                      fontSize={{ base: "12px", md: "14px" }}
                      fontWeight="400"
                      minWidth="100px"
                      textAlign={"center"}
                    >
                      {listing.status === "rejected" ? (
                        <>
                          <Select
                            value={listing.status}
                            colorScheme="green"
                            onChange={(e) =>
                              handleStatusChange(
                                listing._id,
                                e.target.value,
                                listing.status
                              )
                            }
                            size="sm"
                            width="150px"
                            focusBorderColor="brand.500"
                            bg={getStatusColor(listing.status) + ".100"}
                            color={getStatusColor(listing.status) + ".800"}
                          >
                            <option value="rejected">Rejected</option>
                            <option value="pending">Re-consider</option>
                          </Select>
                        </>
                      ) : listing.status === "pending" ? (
                        <Select
                          value={listing.status}
                          colorScheme="green"
                          size="sm"
                          width="150px"
                          focusBorderColor="brand.500"
                          bg={getStatusColor(listing.status) + ".100"}
                          color={getStatusColor(listing.status) + ".800"}
                          isDisabled={
                            ![
                              "approved",
                              "rejected",
                              "active",
                              "inactive",
                              "draft",
                            ].includes(listing.status)
                          }
                        >
                          <option value="pending">Pending</option>
                          <option value="draft">Draft</option>
                        </Select>
                      ) : listing.status === "draft" ? (
                        <Select
                          value={listing.status}
                          colorScheme="green"
                          size="sm"
                          width="150px"
                          focusBorderColor="brand.500"
                          bg={getStatusColor(listing.status) + ".100"}
                          color={getStatusColor(listing.status) + ".800"}
                          onChange={(e) =>
                            handleStatusChange(
                              listing._id,
                              e.target.value,
                              listing.status
                            )
                          }
                          isDisabled={
                            ![
                              "approved",
                              "rejected",
                              "active",
                              "inactive",
                              "draft",
                            ].includes(listing.status)
                          }
                        >
                          <option value={isAdmin ? "active" : "pending"}>
                            Publish
                          </option>
                          <option value="draft">Draft</option>
                        </Select>
                      ) : (
                        <Switch
                          colorScheme="green"
                          isChecked={listing.status === "active"}
                          onChange={(e) =>
                            handleStatusToggle(listing._id, e.target.checked)
                          }
                          size="md"
                        />
                      )}
                    </Td>
                    <Td
                      textAlign="center"
                      whiteSpace="nowrap"
                      minWidth="100px"
                      overflow="hidden"
                      textOverflow="ellipsis"
                    >
                      {listing.createdAt
                        ? format(listing.createdAt, "MMM d, yyyy h:mm a")
                        : "N/A"}
                    </Td>
                    <Td
                      textAlign="center"
                      whiteSpace="nowrap"
                      minWidth="100px"
                      overflow="hidden"
                      textOverflow="ellipsis"
                    >
                      {listing.createdBy?.fullName}
                    </Td>
                    <Td py={4} textAlign={"center"}>
                      <Button
                        colorScheme="brand"
                        size="sm"
                        onClick={() => {
                          setSelectedListing(null);
                          setSelectedListing(listing);
                          notesModalDisclosure.onOpen();
                        }}
                      >
                        View Notes
                      </Button>
                    </Td>
                    <Td
                      py={4}
                      fontSize={{ base: "12px", md: "14px" }}
                      fontWeight="400"
                      minWidth="100px"
                    >
                      <Box
                        display="flex"
                        gap={2}
                        justifyContent="center"
                        alignItems={"center"}
                      >
                        <IconButton
                          aria-label="Edit"
                          icon={<EditIcon />}
                          size="sm"
                          onClick={() =>
                            Navigate(`/listing/update/${listing._id}`)
                          }
                          color={"#c09f5f"}
                          _hover={{
                            backgroundColor: "#c09f5f",
                            color: "white",
                          }}
                        />
                        <IconButton
                          aria-label="Delete"
                          icon={<DeleteIcon />}
                          size="sm"
                          color={"#c09f5f"}
                          _hover={{
                            backgroundColor: "#c09f5f",
                            color: "white",
                          }}
                          onClick={() => handleDeleteListing(listing._id)}
                        />
                        <IconButton
                          aria-label="View"
                          icon={<ViewIcon />}
                          size="sm"
                          color={"#c09f5f"}
                          _hover={{
                            backgroundColor: "#c09f5f",
                            color: "white",
                          }}
                          onClick={() =>
                            Navigate(`/listing/view-listing/${listing._id}`)
                          }
                        />
                      </Box>
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr borderColor="gray.200" textAlign="center">
                  <Td
                    borderBottom="none"
                    colSpan="14"
                    fontSize={{ base: "12px", md: "15px" }}
                    fontWeight="500"
                    color="gray.500"
                    textAlign="center"
                  >
                    <NoData label="listing" />
                  </Td>
                </Tr>
              )}
            </Tbody>
          )}
        </Table>
      </Box>
      {/* Rejection Reason Modal */}
      <Modal
        isOpen={isRejectionModalOpen}
        onClose={() => setIsRejectionModalOpen(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Rejection Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box mb={4}>
              <FormLabel>Rejection Reason</FormLabel>
              <Input
                placeholder="Enter reason for rejection"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                focusBorderColor="brand.500"
              />
            </Box>
            <Box mb={4}>
              <FormLabel>Admin Notes (Optional)</FormLabel>
              <Textarea
                placeholder="Enter any additional notes"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                focusBorderColor="brand.500"
              />
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              mr={3}
              onClick={() => setIsRejectionModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={() =>
                updateListingStatus(currentListingId, selectedStatus)
              }
            >
              Confirm Rejection
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {selectedListing && (
        <NotesModal
          isOpen={notesModalDisclosure.isOpen}
          onClose={notesModalDisclosure.onClose}
          listingId={selectedListing._id}
        />
      )}

      <AdvancedSearchModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApplyFilters={handleApplyFilters}
        listingTypes={listingType?.doc}
        unitTypes={listingUnitType?.doc}
        initialFilters={filters}
        clearFilter={filterChanged}
      />
    </Box>
  );
};

export default MyListing;
