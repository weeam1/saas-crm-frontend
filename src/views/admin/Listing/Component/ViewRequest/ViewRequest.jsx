import React, { useState, useEffect, useCallback } from "react";
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
  IconButton,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useFetchItemsQuery, useUpdateItemMutation } from "api/apiSlice";
import TableLoading from "components/loading/TableLoading";
import { toast } from "react-toastify";
import TopPagination from "components/pagination/TopPagination";
import { FiSearch } from "react-icons/fi";
import AdvancedSearchModal from "../AdvancedSearchModal";
import SearchTags from "components/shared/SearchTags";
import { format } from "date-fns";
import NoData from "views/admin/lead-v2/components/subComponents/NoData";
import { useUserActivityLog } from "hooks/useUserActivityLog";
import { usePermissions } from "hooks/usePermissions";
import { useModalColors } from "hooks/useModalColors";
import CustomTooltip from "components/shared/CustomTooltip";
import RefreshButton from "components/refresh/RefreshButton";

const ViewRequests = ({ listingType, listingUnitType }) => {
  const colors = useModalColors();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState({});
  const [responseNotes, setResponseNotes] = useState({});
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [currentRequestId, setCurrentRequestId] = useState(null);
  const [currentListingId, setCurrentListingId] = useState(null);
  const [filters, setFilters] = useState({});
  const [searchTags, setSearchTags] = useState([]);
  const [shouldRefetch, setShouldRefetch] = useState(false);
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
    "Status",
    "Action",
  ];

  const [updateStatus] = useUpdateItemMutation();
  const { createUserLog } = useUserActivityLog();

  const user = JSON.parse(localStorage.getItem("user"));

  const { hasPermission } = usePermissions();

  // Build query params
  const buildQueryParams = useCallback(() => {
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

    if (hasPermission("listing", "show_all_request")) {
      params.show_all_request = true;
    }
    return params;
  }, [currentPage, pageSize, filters, hasPermission]);

  const { data, isLoading, refetch, isFetching } = useFetchItemsQuery(
    {
      path: `listing/secondary/requested-listings`,
      params: buildQueryParams(),
    },
    { refetchOnMountOrArgChange: true },
  );

  const { data: countries } = useFetchItemsQuery({
    path: "/countries",
  });

  // Trigger refetch when shouldRefetch changes
  useEffect(() => {
    if (shouldRefetch) {
      refetch();
      setShouldRefetch(false);
    }
  }, [shouldRefetch, refetch]);

  // Generate search tags from filters
  const generateSearchTags = useCallback((filterObj) => {
    const tags = [];

    const filterLabels = {
      projectName: "Project Name",
      location: "Location",
      listingType: "Listing Type",
      unitType: "Unit Type",
      minPrice: "Min Price",
      maxPrice: "Max Price",
      minArea: "Min Area",
      maxArea: "Max Area",
      month: "Month",
      year: "Year",
      startFrom: "Start Date",
      startTo: "End Date",
      country: "Country",
    };

    Object.entries(filterObj).forEach(([key, value]) => {
      if (!value) return;

      let displayValue = value;
      let displayLabel = filterLabels[key] || key.charAt(0).toUpperCase() + key.slice(1);
      let originalValue = value;

      // Handle listing type
      if (key === "listingType" && listingType?.doc) {
        const listingTypeObj = listingType.doc.find(
          (type) => type._id === value
        );
        if (listingTypeObj) {
          displayValue = listingTypeObj.name;
        }
      }

      // Handle unit type
      if (key === "unitType" && listingUnitType?.doc) {
        const unitTypeObj = listingUnitType.doc.find(
          (type) => type._id === value
        );
        if (unitTypeObj) {
          displayValue = unitTypeObj.name;
        }
      }

      // Handle price formatting
      if (key === "minPrice" || key === "maxPrice") {
        displayValue = `AED ${Number(value).toLocaleString()}`;
      }

      // Handle area formatting
      if (key === "minArea" || key === "maxArea") {
        displayValue = `${Number(value).toLocaleString()} sqft`;
      }

      // Handle date formatting
      if ((key === "startFrom" || key === "startTo") && value) {
        displayValue = format(new Date(value), "d MMM, yyyy");
      }

      tags.push({
        key: `${key}-${originalValue}`,
        label: displayLabel,
        value: displayValue,
        originalKey: key,
        originalValue: originalValue,
      });
    });

    return tags;
  }, [listingType, listingUnitType]);

  // Update search tags when filters change
  useEffect(() => {
    if (Object.keys(filters).length > 0) {
      const newTags = generateSearchTags(filters);
      setSearchTags(newTags);
    } else {
      setSearchTags([]);
    }
  }, [filters, generateSearchTags]);

  // Remove individual tag
  const removeTag = useCallback((key) => {
    const removedTag = searchTags.find((tag) => tag.key === key);
    if (!removedTag) return;

    const newFilters = { ...filters };
    delete newFilters[removedTag.originalKey];

    setFilters(newFilters);
    setCurrentPage(1);
    setShouldRefetch(true);
  }, [searchTags, filters]);

  // Clear all tags
  const clearAllTags = useCallback(() => {
    setFilters({});
    setCurrentPage(1);
    setShouldRefetch(true);
  }, []);

  const openStatusModal = (listingId, requestId) => {
    setCurrentRequestId(requestId);
    setCurrentListingId(listingId);
    setIsStatusModalOpen(true);
    setSelectedStatus("");
    setResponseNotes("");
  };

  const handleStatusUpdate = async () => {
    if (!selectedStatus) {
      toast.warning("Please select a status");
      return;
    }

    try {
      await updateStatus({
        path: `listing/secondary/${currentListingId}/requests/${currentRequestId}`,
        body: {
          status: selectedStatus,
          responseNotes: responseNotes || "",
        },
      }).unwrap();
      createUserLog({
        userId: user?._id,
        action: "UPDATE",
        entity: "listing",
        entityType: "SecondaryListing",
        entityId: currentListingId,
        status: "success",
        message: `"${user?.fullName}" ${selectedStatus} the view request for the secondary listing.`,
      });
      toast.success("Status updated successfully");

      setShouldRefetch(true);
      setIsStatusModalOpen(false);
    } catch (error) {
      toast.error("Error updating status");
      const errorMsg =
        error?.data?.message ||
        "Failed to update the view request. Please try again.";
      createUserLog({
        userId: user?._id,
        action: "UPDATE",
        entity: "Listing",
        entityType: "SecondaryListing",
        entityId: currentListingId || null,
        status: error?.status === "500" ? "error" : "fail",
        message: errorMsg,
      });
    }
  };

  useEffect(() => {
    if (data) {
      setTotalPages(data.totalPages || 0);
      setTotalItems(data.totalDocs || 0);

      const initialStatus = {};
      data.data?.forEach((request) => {
        initialStatus[request.requestId] = request.status;
      });
      setSelectedStatus(initialStatus);
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
        ([_, value]) => value !== "" && value !== undefined && value !== null,
      ),
    );

    setFilters(cleanedFilters);
    setCurrentPage(1);
    setShouldRefetch(true);
    setIsFilterOpen(false);
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
    setShouldRefetch(true);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    setShouldRefetch(true);
  };

  const handleRefresh = () => {
    setShouldRefetch(true);
  };

  return (
    <Box
      overflowY="auto"
      scrollBehavior="smooth"
      boxShadow={colors.cardShadow}
      bg={colors.bg}
      px={2}
      marginTop={"-14px"}
      marginLeft={"0px"}
      borderRadius="lg"
      border="1px solid"
      borderColor={colors.borderColor}
    >
      <Flex
        justifyContent="space-between"
        alignItems="center"
        p={3}
        flexDir={{ base: "column", sm: "column", md: "row" }}
      >
        <Text fontSize="20px" fontWeight="bold" color={colors.headingText} p={3}>
          View Requests
        </Text>
        <Flex
          alignItems={"center"}
          gap={2}
          flexDir={{ base: "column", sm: "column", md: "row" }}
        >
          {isMobile ? (
            <IconButton
              icon={<FiSearch />}
              onClick={() => setIsFilterOpen(true)}
              aria-label="Search Listings"
              variant="ghost"
              size="sm"
            />
          ) : (
            <Button
              variant="outline"
              size="sm"
              borderRadius={"md"}
              py={3}
              px={6}
              onClick={() => setIsFilterOpen(true)}
            >
              Advanced Search
            </Button>
          )}

<RefreshButton
	label="Refresh"
	onClick={handleRefresh}
	isLoading={isLoading}
	isFetching={isFetching}
	size="sm"
/>
        </Flex>
      </Flex>

      {/* Search Tags */}
      {searchTags.length > 0 && (
        <SearchTags
          searchTags={searchTags}
          removeTag={removeTag}
          clearAllTags={clearAllTags}
        />
      )}

      <Box my={2}>
        <TopPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          totalItems={totalItems}
          itemsPerPage={pageSize}
          setPageSize={setPageSize}
          handlePageSize={handlePageSizeChange}
          refetching={isFetching}
          loading={isLoading}
        />
      </Box>

      <Box
        borderRadius="lg"
        boxShadow={colors.cardShadow}
        borderWidth="1px"
        borderColor={colors.borderColor}
        overflow="hidden"
      >
        <Box position="relative" maxH="120vh" overflowY="auto">
          <Table variant="simple" size="lg">
            <Thead
              position="sticky"
              top={0}
              bg={colors.bgDeep}
              zIndex={2}
              boxShadow="0px 2px 8px rgba(0, 0, 0, 0.1)"
              fontSize={"16px"}
              borderRadius="lg"
            >
              <Tr>
                {columns.map((header, index) => (
                  <Th key={index} bg={colors.bgDeep} whiteSpace="nowrap" py={4} borderColor={colors.borderColor}>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Text
                        fontSize={{ base: "12px", md: "14px" }}
                        fontWeight="600"
                        color={colors.headingText}
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
                {data && data.data && data.data.length > 0 ? (
                  data.data.map((request, index) => (
                    <Tr key={request.requestId || index} borderColor={colors.borderColor}>
                      <Td
                        py={4}
                        fontSize={{ base: "12px", md: "14px" }}
                        fontWeight="400"
                        minWidth="100px"
                        textAlign={"center"}
                        color={colors.bodyText}
                        borderColor={colors.borderColor}
                      >
                        {(currentPage - 1) * pageSize + index + 1}
                      </Td>
                      <Td
                        textAlign="center"
                        whiteSpace="nowrap"
                        minWidth="100px"
                        overflow="hidden"
                        textOverflow="ellipsis"
                        color={colors.bodyText}
                        borderColor={colors.borderColor}
                      >
                        {request?.requester?.fullName || "N/A"}
                      </Td>
                      <Td
                        py={4}
                        fontSize={{ base: "12px", md: "14px" }}
                        fontWeight="400"
                        minWidth="100px"
                        textAlign={"center"}
                        color={colors.bodyText}
                        borderColor={colors.borderColor}
                      >
                        {request.requester?.phoneNumber || "N/A"}
                      </Td>
                      <Td
                        textAlign="center"
                        whiteSpace="nowrap"
                        minWidth="200px"
                        overflow="hidden"
                        textOverflow="ellipsis"
                        color={colors.bodyText}
                        borderColor={colors.borderColor}
                      >
                        {request.listing?.projectName || "N/A"}
                      </Td>
                      <Td
                        textAlign="center"
                        whiteSpace="nowrap"
                        minWidth="250px"
                        overflow="hidden"
                        textOverflow="ellipsis"
                        color={colors.bodyText}
                        borderColor={colors.borderColor}
                      >
                        {request.listing?.location || "N/A"}
                      </Td>
                      <Td
                        textAlign="center"
                        whiteSpace="nowrap"
                        minWidth="250px"
                        overflow="hidden"
                        textOverflow="ellipsis"
                        color={colors.bodyText}
                        borderColor={colors.borderColor}
                      >
                        {request.listing?.country?.name || "N/A"}
                      </Td>
                      <Td
                        py={4}
                        fontSize={{ base: "12px", md: "14px" }}
                        fontWeight="400"
                        minWidth="100px"
                        textAlign={"center"}
                        color={colors.bodyText}
                        borderColor={colors.borderColor}
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
                        color={colors.bodyText}
                        borderColor={colors.borderColor}
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
                        color={colors.bodyText}
                        borderColor={colors.borderColor}
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
                        color={colors.bodyText}
                        borderColor={colors.borderColor}
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
                        color={colors.bodyText}
                        borderColor={colors.borderColor}
                      >
                        {request?.listing?.createdAt
                          ? format(
                              request?.listing?.createdAt,
                              "MMM d, yyyy h:mm a",
                            )
                          : "N/A"}
                      </Td>
                      <Td
                        textAlign="center"
                        whiteSpace="nowrap"
                        minWidth="100px"
                        overflow="hidden"
                        textOverflow="ellipsis"
                        color={colors.bodyText}
                        borderColor={colors.borderColor}
                      >
                        {request.createdBy?.fullName}
                      </Td>
                      <Td
                        py={4}
                        fontSize={{ base: "12px", md: "14px" }}
                        fontWeight="400"
                        minWidth="100px"
                        textAlign={"center"}
                        borderColor={colors.borderColor}
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
                        textAlign={"center"}
                        borderColor={colors.borderColor}
                      >
                        <Button
                          variant="brand"
                          size="sm"
                          onClick={() =>
                            openStatusModal(
                              request?.listing?._id || request?.listing?.id,
                              request?.requester?._id || request?.requester?.id,
                            )
                          }
                          isDisabled={request.status !== "pending"}
                        >
                          Change Status
                        </Button>
                      </Td>
                    </Tr>
                  ))
                ) : (
                  <Tr borderColor={colors.borderColor} textAlign="center">
                    <Td
                      borderBottom="none"
                      colSpan={columns.length}
                      fontSize={{ base: "12px", md: "15px" }}
                      fontWeight="500"
                      color={colors.mutedText}
                      textAlign="center"
                      borderColor={colors.borderColor}
                    >
                      <NoData label="requested requests" />
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
        onClose={() => {
          setIsStatusModalOpen(false);
          setSelectedStatus("");
          setResponseNotes("");
        }}
        isCentered
      >
        <ModalOverlay bg={colors.overlayBg} backdropFilter="blur(4px)" />
        <ModalContent borderRadius="2xl" overflow="hidden" bg={colors.bg} boxShadow={colors.modalShadow} border="1px solid" borderColor={colors.borderColor}>
          <ModalHeader
            display="flex"
            align="center"
            justify="space-between"
            bg={colors.headerBg}
            color={colors.headerText}
            px={6}
            py={3}
            borderBottom="1px solid"
            borderColor={colors.borderColor}
            position="sticky"
            top="0"
            zIndex="10"
          >
            <Text fontSize="lg" fontWeight="bold">
              Update Request Status
            </Text>
            <ModalCloseButton
              position="absolute"
              right="12px"
              top="10px"
              color={colors.headerText}
              _hover={{ bg: colors.closeBtnHoverBg }}
            />
          </ModalHeader>
          <ModalBody
            overflowY="auto"
            scrollBehavior="smooth"
            bg={colors.bg}
            sx={{
              "&::-webkit-scrollbar": { width: "6px" },
              "&::-webkit-scrollbar-track": { background: colors.bgInput, borderRadius: "10px" },
              "&::-webkit-scrollbar-thumb": {
                background: colors.accentGold,
                borderRadius: "10px",
              },
            }}
          >
            <Box mb={4}>
              <FormLabel color={colors.labelColor}>New Status</FormLabel>
              <Select
                placeholder="Select status"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                bg={colors.bgInput}
                borderColor={colors.borderColor}
                color={colors.headingText}
                _hover={{ borderColor: colors.accentGold }}
                _focus={{
                  borderColor: colors.accentGold,
                  boxShadow: `0 0 0 1px ${colors.accentGold}`,
                }}
              >
                <option value="approved" style={{ background: colors.bg, color: colors.headingText }}>Approve</option>
                <option value="rejected" style={{ background: colors.bg, color: colors.headingText }}>Reject</option>
              </Select>
            </Box>
            <Box mb={4}>
              <FormLabel color={colors.labelColor}>Response Notes</FormLabel>
              <Input
                placeholder="Enter response notes (optional)"
                value={responseNotes}
                onChange={(e) => setResponseNotes(e.target.value)}
                bg={colors.bgInput}
                borderColor={colors.borderColor}
                color={colors.headingText}
                _placeholder={{ color: colors.mutedText }}
                _hover={{ borderColor: colors.accentGold }}
                _focus={{
                  borderColor: colors.accentGold,
                  boxShadow: `0 0 0 1px ${colors.accentGold}`,
                }}
              />
            </Box>
          </ModalBody>
          <ModalFooter
            bg={colors.footerBg}
            borderTop="1px solid"
            borderColor={colors.borderColor}
            position="sticky"
            bottom="0"
            zIndex="10"
            py={3}
            px={5}
            justifyContent="flex-end"
            gap={3}
          >
            <Button
              variant="outline"
              mr={3}
              borderRadius="md"
              size="sm"
              onClick={() => {
                setIsStatusModalOpen(false);
                setSelectedStatus("");
                setResponseNotes("");
              }}
            >
              Cancel
            </Button>
            <Button
              variant="brand"
              onClick={handleStatusUpdate}
              borderRadius="md"
              size="sm"
            >
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
        clearFilter={false}
        countries={countries?.doc || []}
      />
    </Box>
  );
};

export default ViewRequests;