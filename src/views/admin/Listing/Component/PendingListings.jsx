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
  IconButton,
  useBreakpointValue,
  Spinner,
} from "@chakra-ui/react";
import { useFetchItemsQuery, useUpdateItemMutation } from "api/apiSlice";
import TableLoading from "components/loading/TableLoading";
import TopPagination from "components/pagination/TopPagination";
import { toast } from "react-toastify";
import AdvancedFilterModal from "./AdvancedSearchModal";
import { FiSearch, FiRefreshCw } from "react-icons/fi";
import ActiveFiltersDisplay from "./SubComponent/ActiveFiltersDisplay";
import { format } from "date-fns";
import NoData from "views/admin/lead-v2/components/subComponents/NoData";
import { ViewIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { useUserActivityLog } from "hooks/useUserActivityLog";

const PendingListings = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [rejectionReason, setRejectionReason] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
  const [currentListingId, setCurrentListingId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [filters, setFilters] = useState({});
  const [filterChanged, setFilterChanged] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [statusLoadingId, setStatusLoadingId] = useState(null);

  const isMobile = useBreakpointValue({ base: true, sm: true, md: false });
  const Navigate = useNavigate();

  const { createUserLog } = useUserActivityLog();

  const user = JSON.parse(localStorage.getItem("user"));

  const { data: listingType } = useFetchItemsQuery(
    { path: `/listing/secondary/types` },
    { refetchOnMountOrArgChange: true, skip: !user?._id }
  );

  const { data: listingUnitType } = useFetchItemsQuery(
    { path: `/listing/secondary/unit-types` },
    { refetchOnMountOrArgChange: true, skip: !user?._id }
  );

  const columns = [
    "SR.No",
    "Project",
    "Unit Type",
    "Sub Unit Type",
    "Type",
    "Location",
    "country",
    "Area (sqft)",
    "Building Age",
    "Developer",
    "Price",
    "Date",
    "Created By",
    "Status",
    "View Listing",
    "Action",
  ];

  const [updateStatus] = useUpdateItemMutation();

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
      if (filters.country) params.country = filters.country;
    }

    return params;
  };

  const { data, isLoading, refetch, isFetching } = useFetchItemsQuery(
    { path: `listing/secondary/status/pending`, params: buildQueryParams() },
    { refetchOnMountOrArgChange: true }
  );
  const { data: countries } = useFetchItemsQuery({
    path: "/countries",
  });
  // Update tableData when data changes
  useEffect(() => {
    if (data) {
      setTableData(data.data || []);
      setTotalPages(data.totalPages || 0);
      setTotalItems(data.totalDocs || 0);
    }
  }, [data]);

  const handleStatusChange = async (listingId, status) => {
    setCurrentListingId(listingId);
    setSelectedStatus(status);
    setStatusLoadingId(listingId);

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

      const response = await updateStatus({
        path: `listing/secondary/${listingId}/status`,
        body,
      }).unwrap();

      createUserLog({
        userId: user?._id,
        action: "UPDATE",
        entity: "listing",
        entityType: "SecondaryListing",
        entityId: response._id,
        status: "success",
        message: `"${user?.fullName}" respond on secondary listing "${response?.data?.projectName || "Untitled"}" status.`,
      });

      toast.success("Status updated successfully");

      setTableData((prevData) =>
        prevData.filter((item) => item._id !== listingId)
      );
      setTotalItems((prev) => prev - 1);

      setIsRejectionModalOpen(false);
      setRejectionReason("");
      setAdminNotes("");
    } catch (error) {
      const errorMsg =
        error?.data?.message ||
        "Failed to respond on the listing status. Please try again.";

      toast.error("Error updating status");

      createUserLog({
        userId: user?._id,
        action: "UPDATE",
        entity: "Listing",
        entityType: "SecondaryListing",
        entityId: listingId || null,
        status: error?.status === "500" ? "error" : "fail",
        message: errorMsg,
      });
    } finally {
      setStatusLoadingId(null);
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
          Pending Listings
        </Text>

        <Flex
          alignItems="center"
          gap={3}
          flexDir={{ base: "column", sm: "column", md: "row" }}
        >
          <IconButton
            icon={<FiRefreshCw />}
            aria-label="Refresh Analytics"
            onClick={() => refetch()}
            isLoading={isLoading || isFetching}
            variant="outline"
            size="sm"
          />
          {isMobile ? (
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
          ) : (
            <Button
              colorScheme="brand"
              size="sm"
              borderRadius={"md"}
              py={3}
              px={6}
              onClick={() => setIsFilterOpen(true)}
            >
              Advanced Search
            </Button>
          )}
        </Flex>
      </Flex>
      <ActiveFiltersDisplay
        filters={filters}
        onClearFilters={handleClearFilters}
        listingTypes={listingType?.doc}
        unitTypes={listingUnitType?.doc}
      />
      <Box my={2}>
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
        borderRadius="4px"
        boxShadow="sm"
        borderWidth="1px"
        overflow="hidden"
      >
        <Box position="relative" maxH="120vh" overflowY="auto">
          <Table variant="striped" size="lg">
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
              <TableLoading columns={columns} length={20} py="4" />
            ) : (
              <Tbody>
                {tableData.length > 0 ? (
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
                        {listing.subUnitType?.name || "N/A"}
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
                        textAlign="center"
                        whiteSpace="nowrap"
                        minWidth="250px"
                        overflow="hidden"
                        textOverflow="ellipsis"
                      >
                        {listing.country?.name || "N/A"}
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
                        {listing?.developer ? listing?.developer : "N/A"}
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
                      <Td textAlign="center">
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
                      </Td>
                      <Td
                        py={4}
                        fontSize={{ base: "12px", md: "14px" }}
                        fontWeight="400"
                        minWidth="100px"
                        textAlign={"center"}
                      >
                        {statusLoadingId === listing._id ? (
                          <Spinner size="sm" color="brand.500" />
                        ) : (
                          <Select
                            value={listing.status}
                            onChange={(e) => {
                              handleStatusChange(listing._id, e.target.value);
                            }}
                            size="sm"
                            width="150px"
                            focusBorderColor="brand.500"
                            bg={getStatusColor(listing.status) + ".100"}
                            color={getStatusColor(listing.status) + ".800"}
                          >
                            <option value="pending">Pending</option>
                            <option value="active">Approved</option>
                            <option value="rejected">Rejected</option>
                          </Select>
                        )}
                      </Td>
                    </Tr>
                  ))
                ) : (
                  <Tr borderColor="gray.200" textAlign="center">
                    <Td
                      borderBottom="none"
                      colSpan="13"
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
              <FormLabel>Rejection Reason (Optional)</FormLabel>
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
              isLoading={statusLoadingId ? true : false}
            >
              Confirm Rejection
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <AdvancedFilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApplyFilters={handleApplyFilters}
        listingTypes={listingType?.doc}
        unitTypes={listingUnitType?.doc}
        initialFilters={filters}
        clearFilter={filterChanged}
        countries={countries?.doc || []}
      />
    </Box>
  );
};

export default PendingListings;
