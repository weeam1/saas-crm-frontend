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
  Badge,
  Textarea,
} from "@chakra-ui/react";
import { FiFilter } from "react-icons/fi";
import { useFetchItemsQuery, useUpdateItemMutation } from "api/apiSlice";
import moment from "moment";
import Pagination from "../../../admin/developers/components/Pagination";
import TableLoading from "components/loading/TableLoading";
import { useNavigate } from "react-router-dom";
import TopPagination from "components/pagination/TopPagination";
import { toast } from "react-toastify";

const PendingListings = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const Navigate = useNavigate();

  const [unitTypeFilter, setUnitTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
  const [currentListingId, setCurrentListingId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const columns = [
    "Date",
    "Project",
    "Unit Type",
    "Type",
    "Location",
    "Area (sqft)",
    "Price",
    "Status",
    "Action",
  ];

  const [updateStatus] = useUpdateItemMutation();

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize.target.value);
    setCurrentPage(1);
    refetch();
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const { data, isLoading, isError, refetch, isFetching } = useFetchItemsQuery(
    { path: `listing/secondary/status/pending` },
    { refetchOnMountOrArgChange: true }
  );

  const { data: listingType } = useFetchItemsQuery(
    { path: `/listing/secondary/types` },
    { refetchOnMountOrArgChange: true, skip: !user._id }
  );
  const { data: listingUnitType } = useFetchItemsQuery(
    { path: `/listing/secondary/unit-types` },
    { refetchOnMountOrArgChange: true, skip: !user._id }
  );

  const applyFilters = () => {
    setCurrentPage(1);
    refetch();
    setIsFilterOpen(false);
  };

  const resetFilters = () => {
    setUnitTypeFilter("");
    setStatusFilter("");
    setLocationFilter("");
    setCurrentPage(1);
    refetch();
    setIsFilterOpen(false);
  };

  const handleStatusChange = async (listingId, status) => {
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
      refetch();
      setIsRejectionModalOpen(false);
      setRejectionReason("");
      setAdminNotes("");
    } catch (error) {
      toast.error("Error updating status");
    }
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

  useEffect(() => {
    if (data) {
      setTotalPages(data.totalPages || 0);
      setTotalItems(data.totalDocs || 0);
    }
  }, [data]);

  return (
    <Box
      overflowY="auto"
      scrollBehavior="smooth"
      boxShadow="sm"
      bg="white"
      px={2}
      marginTop={"-16px"}
      marginLeft={"-4px"}
    >
      <Flex justifyContent="space-between" alignItems="center" p={3}>
        <Text fontSize="20px" fontWeight="bold" color="black" p={3}>
          Pending Listings
        </Text>
        {/* <Box gap={2} display="flex" alignItems="center">
          <IconButton
            icon={<FiFilter />}
            onClick={() => setIsFilterOpen(true)}
            aria-label="Filter Listings"
            colorScheme="brand"
            variant="solid"
            size="sm"
            borderRadius="full"
            boxShadow="md"
          />
        </Box> */}
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
      <Box
        borderRadius="lg"
        boxShadow="sm"
        bg="white"
        maxH={"calc(60vh - 100px)"}
        overflowY="auto"
      >
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
                    >
                      {header}
                    </Text>
                  </Box>
                </Th>
              ))}
            </Tr>
          </Thead>
          {isLoading && isFetching ? (
            <TableLoading columns={columns} length={7} py="4" />
          ) : (
            <Tbody>
              {data &&
                data.data.map((listing, index) => (
                  <Tr key={index}>
                    <Td
                      py={4}
                      fontSize={{ base: "12px", md: "14px" }}
                      fontWeight="400"
                      minWidth="100px"
                      textAlign={"center"}
                    >
                      {listing.createdAt
                        ? moment(listing.createdAt).format("MM/DD/YYYY")
                        : "N/A"}
                    </Td>
                    <Td
                      py={4}
                      fontSize={{ base: "12px", md: "14px" }}
                      fontWeight="400"
                      minWidth="100px"
                      textAlign={"center"}
                    >
                      {listing?.projectName || "N/A"}
                    </Td>
                    <Td
                      py={4}
                      fontSize={{ base: "12px", md: "14px" }}
                      fontWeight="400"
                      minWidth="100px"
                      textAlign={"center"}
                    >
                      {listing?.unitType?.name || "N/A"}
                    </Td>
                    <Td
                      py={4}
                      fontSize={{ base: "12px", md: "14px" }}
                      fontWeight="400"
                      minWidth="100px"
                      textAlign={"center"}
                    >
                      {listing.listingType?.name || "N/A"}
                    </Td>
                    <Td
                      py={4}
                      fontSize={{ base: "12px", md: "14px" }}
                      fontWeight="400"
                      minWidth="100px"
                      textAlign={"center"}
                    >
                      {listing.location || "N/A"}
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
                      {listing.price
                        ? `AED ${listing.price.toLocaleString()}`
                        : "N/A"}
                    </Td>
                    <Td
                      py={4}
                      fontSize={{ base: "12px", md: "14px" }}
                      fontWeight="400"
                      minWidth="100px"
                      textAlign={"center"}
                    >
                      <Badge
                        colorScheme={getStatusColor(listing.status)}
                        px={2}
                        py={1}
                        borderRadius="md"
                        textTransform="capitalize"
                      >
                        {listing.status}
                      </Badge>
                    </Td>
                    <Td
                      py={4}
                      fontSize={{ base: "12px", md: "14px" }}
                      fontWeight="400"
                      minWidth="100px"
                      textAlign={"center"}
                    >
                      <Select
                        value={listing.status}
                        onChange={(e) =>{
                          handleStatusChange(listing._id, e.target.value)
                        }}
                        size="sm"
                        width="150px"
                        focusBorderColor="brand.500"
                      >
                         <option value = "pending">pending</option> 
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </Select>
                    </Td>
                  </Tr>
                ))}
            </Tbody>
          )}
        </Table>
        {!isLoading && !isFetching && data?.data?.length === 0 && (
          <Text textAlign="center" color="gray.500" py={6}>
            No pending listings found.
          </Text>
        )}
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

      {/* Filter Modal */}
      <Modal isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Filter Pending Listings</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box mb={4}>
              <FormLabel>Unit Type</FormLabel>
              <Select
                placeholder="All unit types"
                value={unitTypeFilter}
                onChange={(e) => setUnitTypeFilter(e.target.value)}
                focusBorderColor="brand.500"
              >
                {listingUnitType?.doc?.map((unitType) => (
                  <option key={unitType.id} value={unitType.id}>
                    {unitType.name}
                  </option>
                ))}
              </Select>
            </Box>
            <Box mb={4}>
              <FormLabel>Location</FormLabel>
              <Input
                placeholder="Filter by location"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                focusBorderColor="brand.500"
              />
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" mr={3} onClick={resetFilters}>
              Reset
            </Button>
            <Button colorScheme="brand" onClick={applyFilters}>
              Apply Filters
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default PendingListings;
