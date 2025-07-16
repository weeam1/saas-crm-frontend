import React, { useState, useEffect } from 'react';
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
	Tooltip,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	FormLabel,
	Switch,
	Input,
	Badge,
	Textarea,
	useBreakpointValue,
} from '@chakra-ui/react';
import { DeleteIcon, EditIcon, ViewIcon } from '@chakra-ui/icons';
import {
	useFetchItemsQuery,
	useCreateItemMutation,
	useDeleteItemMutation,
	useUpdateItemMutation,
} from 'api/apiSlice';
import TableLoading from 'components/loading/TableLoading';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import TopPagination from 'components/pagination/TopPagination';
import { FiSearch } from 'react-icons/fi';
import AdvancedSearchModal from './AdvancedSearchModal';
import ActiveFiltersDisplay from './SubComponent/ActiveFiltersDisplay';
import { format } from 'date-fns';
import NoData from 'views/admin/lead-v2/components/subComponents/NoData';

const AllListing = ({ listingType, listingUnitType }) => {
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
  const [tableData, setTableData] = useState();
  const Navigate = useNavigate();

  const [createItemMutation] = useCreateItemMutation();
  const [updateStatus] = useUpdateItemMutation();
  const [deleteItemMutation] = useDeleteItemMutation();

  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "superAdmin";
  const isAgent = user?.roles?.[0]?.roleName === "Agent";
  const isManager = user?.roles?.[0]?.roleName === "Manager";
  const isMobile = useBreakpointValue({ base: true, sm: true, md: false });

  const baseColumns = [
    "SR.No",
    "projectName",
    "Unit Type",
    "Sub Unit Type",
    "Type",
    "Location",
    "country",
    "Building Age",
    "Developer",
    "Price",
    "Commission Type",
    "Commission Value",
    "Total Price",
    "Size (sqft)",
    "status",
    "Date",
    "Action",
  ];

  const columns = isAdmin
    ? [...baseColumns.slice(0, -1), "Created By", ...baseColumns.slice(-1)]
    : baseColumns;

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

  const { data, isLoading, isFetching, refetch } = useFetchItemsQuery(
    { path: `/listing/secondary`, params: buildQueryParams() },
    { refetchOnMountOrArgChange: true }
  );

  const { data: countries } = useFetchItemsQuery({
    path: "/countries",
  });

  const handleRequestViewAccess = async (listingId) => {
    try {
      const response = await createItemMutation({
        path: `/listing/secondary/${listingId}/request-view`,
        body: {},
      }).unwrap();

      toast({
        title: "Request sent successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setTableData((prevData) =>
        prevData.map((listing) => {
          if (listing._id === listingId) {
            return {
              ...listing,
              viewRequests: [...response.data.viewRequests],
            };
          }
          return listing;
        })
      );
    } catch (error) {
      toast({
        title: error.data?.message || "Failed to send request",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const hasAccess = (listing) => {
    if (isAdmin) return true;
    if (listing.createdBy._id.toString() === user._id.toString()) return true;
    return listing.viewRequests.some(
      (req) =>
        req.requestingAgent.toString() === user._id.toString() &&
        req.status === "approved"
    );
  };

  const hasPendingRequest = (listing) => {
    return listing.viewRequests.some(
      (req) =>
        req.requestingAgent.toString() === user._id.toString() &&
        req.status === "pending"
    );
  };

  useEffect(() => {
    if (data) {
      setTotalPages(data.totalPages || 0);
      setTotalItems(data.totalDocs || 0);
      setTableData(data.data);
    }
  }, [data]);

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

  // const handleStatusToggle = async (listingId, isActive) => {
  //   setCurrentListingId(listingId);

  //   let status = isActive ? "active" : "inactive";
  //   setSelectedStatus(status);

  //   if (status === "rejected") {
  //     setIsRejectionModalOpen(true);
  //   } else {
  //     await updateListingStatus(listingId, status);
  //   }
  // };

  // const updateListingStatus = async (listingId, status) => {
  //   try {
  //     const body = { status };
  //     if (status === "rejected") {
  //       body.rejectionReason = rejectionReason;
  //     }
  //     if (adminNotes) {
  //       body.adminNotes = adminNotes;
  //     }

  //     await updateStatus({
  //       path: `listing/secondary/${listingId}/status`,
  //       body,
  //     }).unwrap();

  //     toast({
  //       title: "Status updated successfully",
  //       status: "success",
  //       duration: 3000,
  //       isClosable: true,
  //     });

  //     if (status === "inactive") {
  //       setTableData((prevData) =>
  //         prevData.filter((item) => item._id !== listingId)
  //       );
  //       setTotalItems((prev) => prev - 1);
  //     } else {
  //       setTableData((prevData) =>
  //         prevData.map((listing) =>
  //           listing._id === listingId ? { ...listing, status } : listing
  //         )
  //       );
  //     }

  //     setIsRejectionModalOpen(false);
  //     setRejectionReason("");
  //     setAdminNotes("");
  //   } catch (error) {
  //     toast({
  //       title: "Error updating status",
  //       description: error.data?.message || "Please try again",
  //       status: "error",
  //       duration: 3000,
  //       isClosable: true,
  //     });
  //   }
  // };

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

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
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
    <Box bg="white" px={2} marginTop={"-16px"}>
      <Flex justifyContent="space-between" p={3} alignItems={"center"}>
        <Text fontSize="20px" fontWeight="bold" color="black" p={3}>
          All Listings
        </Text>
        <Flex
          justifyContent={{ base: "flex-end", sm: "flex-end", lg: "normal" }}
        >
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
          onPageChange={setCurrentPage}
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
        overflowY="auto"
        maxH={"85vh"}
      >
        <Table variant="striped" size="lg">
          <Thead position="sticky" top={0} bg="white" zIndex={2}>
            <Tr>
              {columns.map((header, index) => (
                <Th
                  key={index}
                  bg="brand.200"
                  whiteSpace="nowrap"
                  py={4}
                  textAlign="center"
                >
                  <Text
                    fontSize="14px"
                    fontWeight="600"
                    color="gray.700"
                    textTransform="capitalize"
                  >
                    {header}
                  </Text>
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
                      minWidth="250px"
                      overflow="hidden"
                      textOverflow="ellipsis"
                    >
                      {listing.country?.name || "N/A"}
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
                    <Td textAlign="center">
                      {listing.price
                        ? `AED ${listing.price.toLocaleString()}`
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
                        ? `AED ${listing.totalPrice.toLocaleString()}`
                        : listing.price
                          ? `AED ${listing.price.toLocaleString()}`
                          : "N/A"}
                    </Td>
                    <Td textAlign="center" size={"sm"}>
                      {listing.area ? listing.area.toLocaleString() : "N/A"}
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
                      >
                        {listing.status}
                      </Badge>
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
                    {isAdmin && (
                      <Td
                        textAlign="center"
                        whiteSpace="nowrap"
                        minWidth="100px"
                        overflow="hidden"
                        textOverflow="ellipsis"
                      >
                        {listing.createdBy?.fullName}
                      </Td>
                    )}
                    <Td
                      py={4}
                      fontSize={{ base: "12px", md: "14px" }}
                      fontWeight="400"
                      minWidth="100px"
                      textAlign={"center"}
                    >
                      <Box display={"flex"} gap={2} justifyContent="center">
                        {isAdmin && (
                          <Box display={"flex"} gap={2} justifyContent="center">
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
                          </Box>
                        )}
                        <Box
                          display="flex"
                          gap={2}
                          justifyContent="center"
                          alignItems={"center"}
                        >
                          {hasAccess(listing) ? (
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
                          ) : hasPendingRequest(listing) ? (
                            <Tooltip label="View request pending approval">
                              <Button size="sm" colorScheme="yellow" isDisabled>
                                Request Pending
                              </Button>
                            </Tooltip>
                          ) : isAgent || isManager ? (
                            <Button
                              size="sm"
                              colorScheme="brand"
                              onClick={() =>
                                handleRequestViewAccess(listing._id)
                              }
                            >
                              Request View
                            </Button>
                          ) : (
                            <Tooltip label="You don't have access to view this listing">
                              <IconButton
                                icon={<ViewIcon />}
                                isDisabled
                                colorScheme="gray"
                                size="sm"
                              />
                            </Tooltip>
                          )}
                        </Box>
                      </Box>
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

export default AllListing;
