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
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  useBreakpointValue,
} from "@chakra-ui/react";
import { ViewIcon, RepeatIcon } from "@chakra-ui/icons";
import { FiChevronDown } from "react-icons/fi";
import { useFetchItemsQuery, useUpdateItemMutation } from "api/apiSlice";
import TableLoading from "components/loading/TableLoading";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import TopPagination from "components/pagination/TopPagination";
import { FiSearch } from "react-icons/fi";
import AdvancedSearchModal from "../AdvancedSearchModal";
import ActiveFiltersDisplay from "../SubComponent/ActiveFiltersDisplay";
import { format } from "date-fns";
import NoData from "views/admin/lead-v2/components/subComponents/NoData";

const RejectRequests = ({ listingType, listingUnitType }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState({});
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [currentRequestId, setCurrentRequestId] = useState(null);
  const [currentListingId, setCurrentListingId] = useState(null);
  const [filters, setFilters] = useState({});
  const [filterChanged, setFilterChanged] = useState(false);
  const Navigate = useNavigate();
  const isMobile = useBreakpointValue({ base: true, sm: true, md: false });
  const columns = [
    "SR.No",
    "Requester",
    "Phone",
    "Project",
    "Location",
    "country",
    "Area (sqft)",
    "Building Age",
    "Developer",
    "Price",
    "Date",
    "Created By",
    "Rejection Reason",
    "Status",
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
    { path: `listing/secondary/rejected-listings`, params: buildQueryParams() },
    { refetchOnMountOrArgChange: true }
  );

  const { data: countries } = useFetchItemsQuery({
    path: "/countries",
  });

  const handleStatusChange = (requestId, status, listingId) => {
    setSelectedStatus("");
    setCurrentRequestId(requestId);
    setCurrentListingId(listingId);
    setSelectedStatus(status);
    setIsStatusModalOpen(true);
  };

  const handleStatusUpdate = async () => {
    if (!selectedStatus) {
      toast({
        title: "Please select a status",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await updateStatus({
        path: `listing/secondary/${currentListingId}/requests/${currentRequestId}`,
        body: {
          status: selectedStatus,
        },
      }).unwrap();

      toast.success("Status updated successfully");

      refetch();
      setIsStatusModalOpen(false);
    } catch (error) {
      console.log(error);
      toast.error("Error updating status");
    }
  };

  useEffect(() => {
    if (data) {
      setTotalPages(data.totalPages || 0);
      setTotalItems(data.totalDocs || 0);
    }
  }, [data]);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "yellow";
      case "approved":
        return "green";
      case "rejected":
        return "red";
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
      marginTop={"-14px"}
      marginLeft={"0px"}
    >
      <Flex justifyContent="space-between" alignItems="center" p={3}>
        <Text fontSize="20px" fontWeight="bold" color="black" p={3}>
          Rejected Requests
        </Text>

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
            size="md"
            borderRadius="full"
            py={3}
            px={6}
            onClick={() => setIsFilterOpen(true)}
          >
            Advanced Search
          </Button>
        )}
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
              <TableLoading columns={columns} length={7} py="4" />
            ) : (
              <Tbody>
                {data && data.data.length > 0 ? (
                  data.data.map((request, index) => (
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
                        minWidth="100px"
                        overflow="hidden"
                        textOverflow="ellipsis"
                      >
                        {request.requester?.fullName || "N/A"}
                      </Td>
                      <Td
                        py={4}
                        fontSize={{ base: "12px", md: "14px" }}
                        fontWeight="400"
                        minWidth="100px"
                        textAlign={"center"}
                      >
                        {request.requester?.phoneNumber || "N/A"}
                      </Td>
                      <Td
                        textAlign="center"
                        whiteSpace="nowrap"
                        minWidth="200px"
                        overflow="hidden"
                        textOverflow="ellipsis"
                      >
                        {request.listing?.projectName || "N/A"}
                      </Td>
                      <Td
                        textAlign="center"
                        whiteSpace="nowrap"
                        minWidth="250px"
                        overflow="hidden"
                        textOverflow="ellipsis"
                      >
                        {request.listing?.location || "N/A"}
                      </Td>
                      <Td
                        textAlign="center"
                        whiteSpace="nowrap"
                        minWidth="250px"
                        overflow="hidden"
                        textOverflow="ellipsis"
                      >
                        {request.listing?.country?.name || "N/A"}
                      </Td>
                      <Td
                        py={4}
                        fontSize={{ base: "12px", md: "14px" }}
                        fontWeight="400"
                        minWidth="100px"
                        textAlign={"center"}
                      >
                        {request.listing?.area
                          ? request.listing.area.toLocaleString()
                          : "N/A"}
                      </Td>
                      <Td
                        textAlign="center"
                        whiteSpace="nowrap"
                        minWidth="200px"
                        overflow="hidden"
                        textOverflow="ellipsis"
                      >
                        {request.listing.buildingAge
                          ? `${request.listing.buildingAge} Years`
                          : "N/A"}
                      </Td>
                      <Td
                        textAlign="center"
                        whiteSpace="nowrap"
                        minWidth="200px"
                        overflow="hidden"
                        textOverflow="ellipsis"
                      >
                        {request.listing?.developer_name
                          ? request.listing?.developer_name
                          : "N/A"}
                      </Td>
                      <Td
                        textAlign="center"
                        whiteSpace="nowrap"
                        minWidth="100px"
                        overflow="hidden"
                        textOverflow="ellipsis"
                      >
                        {request.listing?.price
                          ? `AED ${request.listing.price.toLocaleString()}`
                          : "N/A"}
                      </Td>
                      <Td
                        textAlign="center"
                        whiteSpace="nowrap"
                        minWidth="100px"
                        overflow="hidden"
                        textOverflow="ellipsis"
                      >
                        {request?.listing?.createdAt
                          ? format(
                              request?.listing?.createdAt,
                              "MMM d, yyyy h:mm a"
                            )
                          : "N/A"}
                      </Td>
                      <Td
                        textAlign="center"
                        whiteSpace="nowrap"
                        minWidth="100px"
                        overflow="hidden"
                        textOverflow="ellipsis"
                      >
                        {request.createdBy?.fullName}
                      </Td>
                      <Td
                        textAlign="center"
                        whiteSpace="nowrap"
                        minWidth="200px"
                        overflow="hidden"
                        textOverflow="ellipsis"
                      >
                        {request.rejectionReason || "N/A"}
                      </Td>
                      <Td
                        py={4}
                        fontSize={{ base: "12px", md: "14px" }}
                        fontWeight="400"
                        minWidth="100px"
                        textAlign={"center"}
                      >
                        <Badge
                          colorScheme={getStatusColor(request.status)}
                          px={2}
                          py={1}
                          borderRadius="md"
                        >
                          {request.status}
                        </Badge>
                      </Td>
                      <Td
                        py={4}
                        fontSize={{ base: "12px", md: "14px" }}
                        fontWeight="400"
                        minWidth="100px"
                        display={"flex"}
                        gap={2}
                        justifyContent={"center"}
                      >
                        <Menu placement="bottom-start">
                          <MenuButton
                            as={Button}
                            rightIcon={<FiChevronDown />}
                            colorScheme="brand"
                            size="sm"
                          >
                            Actions
                          </MenuButton>
                          <MenuList zIndex={10}>
                            <MenuItem
                              icon={<ViewIcon />}
                              onClick={() =>
                                Navigate(
                                  `/listing/view-listing/${request.listing?.id}`
                                )
                              }
                            >
                              View Listing
                            </MenuItem>
                            <MenuItem
                              icon={<RepeatIcon />}
                              onClick={() =>
                                handleStatusChange(
                                  request.requester.id,
                                  "pending",
                                  request?.listing?.id
                                )
                              }
                            >
                              Reconsider Request
                            </MenuItem>
                          </MenuList>
                        </Menu>
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
                      <NoData label="rejected requests" />
                    </Td>
                  </Tr>
                )}
              </Tbody>
            )}
          </Table>
        </Box>
      </Box>
      {/* Status Update Modal */}
      <Modal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Reconsider Request</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box mb={4}>
              <FormLabel>New Status</FormLabel>
              <Select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                focusBorderColor="brand.500"
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
              </Select>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              mr={3}
              onClick={() => setIsStatusModalOpen(false)}
            >
              Cancel
            </Button>
            <Button colorScheme="brand" onClick={handleStatusUpdate}>
              Update Status
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <AdvancedSearchModal
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

export default RejectRequests;
