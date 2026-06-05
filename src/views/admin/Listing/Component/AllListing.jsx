
import React, { useState, useEffect, useCallback, useRef } from "react";
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
  Badge,
  useBreakpointValue,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon, ViewIcon } from "@chakra-ui/icons";
import {
  useFetchItemsQuery,
  useCreateItemMutation,
  useDeleteItemMutation,
} from "api/apiSlice";
import RefreshButton from "components/refresh/RefreshButton";
import TableLoading from "components/loading/TableLoading";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import TopPagination from "components/pagination/TopPagination";
import { FiSearch} from "react-icons/fi";
import AdvancedSearchModal from "./AdvancedSearchModal";
import SearchTags from "components/shared/SearchTags";
import { format } from "date-fns";
import NoData from "views/admin/lead-v2/components/subComponents/NoData";
import { useUserActivityLog } from "hooks/useUserActivityLog";
import { usePermissions } from "hooks/usePermissions";
import useUserSession from "hooks/useUserSession";
import CustomTooltip from "components/shared/CustomTooltip";
import { useModalColors } from "hooks/useModalColors";

const AllListing = () => {
  const colors = useModalColors();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [filters, setFilters] = useState({});
  const [tableData, setTableData] = useState();
  const [loadingButton, setLoadingButton] = useState(null);
  const [searchTags, setSearchTags] = useState([]);
  const [shouldRefetch, setShouldRefetch] = useState(false);

  const Navigate = useNavigate();

  const [createItemMutation] = useCreateItemMutation();
  const [deleteItemMutation] = useDeleteItemMutation();
  const { createUserLog } = useUserActivityLog();

  const { hasPermission } = usePermissions();
  const { user, isSuperAdmin } = useUserSession();

  const { data: listingType } = useFetchItemsQuery(
    { path: `/listing/secondary/types` },
    { refetchOnMountOrArgChange: true, skip: !user?._id },
  );

  const { data: listingUnitType } = useFetchItemsQuery(
    { path: `/listing/secondary/unit-types` },
    { refetchOnMountOrArgChange: true, skip: !user?._id },
  );

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

  const columns = isSuperAdmin
    ? [...baseColumns.slice(0, -1), "Created By", ...baseColumns.slice(-1)]
    : baseColumns;

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

    return params;
  }, [currentPage, pageSize, filters]);

  const { data, isLoading, isFetching, refetch } = useFetchItemsQuery(
    { path: `/listing/secondary`, params: buildQueryParams() },
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

    // Create new filters without the removed tag
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

  const handleRequestViewAccess = async (listingId) => {
    try {
      setLoadingButton(listingId);
      const response = await createItemMutation({
        path: `/listing/secondary/${listingId}/request-view`,
        body: {},
      }).unwrap();

      createUserLog({
        userId: user?._id,
        action: "UPDATE",
        entity: "listing",
        entityType: "SecondaryListing",
        entityId: response._id,
        status: "success",
        message: `"${user?.fullName}" request to view secondary listing "${response?.data?.projectName || "Untitled"}".`,
      });

      toast.success("Request sent successfully");

      setTableData((prevData) =>
        prevData.map((listing) => {
          if (listing._id === listingId) {
            return {
              ...listing,
              viewRequests: [...response.data.viewRequests],
            };
          }
          return listing;
        }),
      );
    } catch (error) {
      const errorMsg =
        error?.data?.message ||
        "Failed the listing view request. Please try again.";
      toast.error(error.data?.message || "Failed to send request");
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
      setLoadingButton(null);
    }
  };

  const hasAccess = (listing) => {
    if (listing.createdBy._id.toString() === user._id.toString()) return true;
    if (hasPermission("listing", "read:any")) return true;
    return listing.viewRequests?.some(
      (req) =>
        req.requestingAgent.toString() === user._id.toString() &&
        req.status === "approved",
    );
  };

  const hasPendingRequest = (listing) => {
    return listing.viewRequests?.some(
      (req) =>
        req.requestingAgent.toString() === user._id.toString() &&
        req.status === "pending",
    );
  };

  useEffect(() => {
    if (data) {
      setTotalPages(data.totalPages || 0);
      setTotalItems(data.totalDocs || 0);
      setTableData(data.data);
    }
  }, [data]);

  const handleDeleteListing = async (listing) => {
    try {
      await deleteItemMutation({
        path: `/listing/secondary/${listing._id}`,
        body: {},
      }).unwrap();
      toast.success("The listing has been deleted successfully.", {
        autoClose: 3000,
      });
      createUserLog({
        userId: user?._id,
        action: "DELETE",
        entity: "Listing",
        entityType: "SecondaryListing",
        entityId: listing._id,
        status: "success",
        message: `"${user?.fullName}" deleted listing "${listing?.projectName || "Untitled"}".`,
      });
      setShouldRefetch(true);
    } catch (error) {
      const errorMsg =
        error?.data?.message ||
        "Failed to delete the listing. Please try again.";
      console.error("Failed to delete listing:", error);
      toast.error(
        error.data?.message ||
          "Failed to delete the listing. Please try again.",
        { autoClose: 3000 },
      );
      createUserLog({
        userId: user?._id,
        action: "DELETE",
        entity: "Listing",
        entityType: "SecondaryListing",
        entityId: listing._id,
        status: error?.status === 500 ? "error" : "fail",
        message: errorMsg,
      });
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
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Refetch when page or pageSize changes
  useEffect(() => {
    setShouldRefetch(true);
  }, [currentPage, pageSize]);

  const handleRefresh = () => {
    setShouldRefetch(true);
  };

  return (
    <Box bg={colors.bg} px={2} marginTop={"-16px"} borderRadius="lg" boxShadow={colors.cardShadow} border="1px solid" borderColor={colors.borderColor}>
      <Flex justifyContent="space-between" p={3} alignItems={"center"}>
        <Text fontSize="20px" fontWeight="bold" color={colors.headingText} p={3}>
          All Listings
        </Text>
        <Flex
          gap={3}
          justifyContent={{ base: "flex-end", sm: "flex-end", lg: "normal" }}
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
              borderRadius="md"
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
	isLoading={isLoading || isFetching}
	isFetching={isLoading || isFetching}
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
                  <Th
                    key={index}
                    bg={colors.bgDeep}
                    whiteSpace="nowrap"
                    py={4}
                    textAlign="center"
                    borderColor={colors.borderColor}
                  >
                    <Text
                      fontSize="14px"
                      fontWeight="600"
                      color={colors.headingText}
                      textTransform="capitalize"
                    >
                      {header}
                    </Text>
                  </Th>
                ))}
              </Tr>
            </Thead>

            {isLoading || isFetching ? (
              <TableLoading columns={columns} length={20} py="4" />
            ) : (
              <Tbody>
                {tableData && tableData.length > 0 ? (
                  tableData.map((listing, index) => (
                    <Tr key={listing._id || index} borderColor={colors.borderColor}>
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
                        minWidth="200px"
                        overflow="hidden"
                        textOverflow="ellipsis"
                        color={colors.bodyText}
                        borderColor={colors.borderColor}
                      >
                        {listing.projectName}
                      </Td>
                      <Td textAlign="center" color={colors.bodyText} borderColor={colors.borderColor}>
                        {listing.unitType?.name || "N/A"}
                      </Td>
                      <Td textAlign="center" color={colors.bodyText} borderColor={colors.borderColor}>
                        {listing.subUnitType?.name || "N/A"}
                      </Td>
                      <Td textAlign="center" minWidth="100px" color={colors.bodyText} borderColor={colors.borderColor}>
                        {listing.listingType?.name || "N/A"}
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
                        {listing.location || "N/A"}
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
                        {listing.country?.name || "N/A"}
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
                        color={colors.bodyText}
                        borderColor={colors.borderColor}
                      >
                        {listing?.developer ? listing?.developer : "N/A"}
                      </Td>
                      <Td textAlign="center" color={colors.bodyText} borderColor={colors.borderColor}>
                        {listing.price
                          ? `AED ${listing.price.toLocaleString()}`
                          : "N/A"}
                      </Td>
                      <Td textAlign="center" color={colors.bodyText} borderColor={colors.borderColor}>
                        {listing.brokerCommissionType === "AED"
                          ? "AED"
                          : listing.brokerCommissionType === "PERCENT"
                            ? "Percent"
                            : "N/A"}
                      </Td>
                      <Td textAlign="center" color={colors.bodyText} borderColor={colors.borderColor}>
                        {listing.brokerCommissionValue
                          ? `${listing.brokerCommissionValue}${listing.brokerCommissionType === "PERCENT" ? " %" : listing.brokerCommissionType === "AED" ? " AED" : ""}`
                          : "0"}
                      </Td>
                      <Td textAlign="center" color={colors.bodyText} borderColor={colors.borderColor}>
                        {listing.totalPrice
                          ? `AED ${listing.totalPrice.toLocaleString()}`
                          : listing.price
                            ? `AED ${listing.price.toLocaleString()}`
                            : "N/A"}
                      </Td>
                      <Td textAlign="center" size={"sm"} color={colors.bodyText} borderColor={colors.borderColor}>
                        {listing.area ? listing.area.toLocaleString() : "N/A"}
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
                        color={colors.bodyText}
                        borderColor={colors.borderColor}
                      >
                        {listing.createdAt
                          ? format(listing.createdAt, "MMM d, yyyy h:mm a")
                          : "N/A"}
                      </Td>
                      {isSuperAdmin && (
                        <Td
                          textAlign="center"
                          whiteSpace="nowrap"
                          minWidth="100px"
                          overflow="hidden"
                          textOverflow="ellipsis"
                          color={colors.bodyText}
                          borderColor={colors.borderColor}
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
                        borderColor={colors.borderColor}
                      >
                        <Box display={"flex"} gap={2} justifyContent="center">
                          <Box display={"flex"} gap={2} justifyContent="center">
                            {hasPermission("listing", "update:any") && (
                              <IconButton
                                aria-label="Edit"
                                icon={<EditIcon />}
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  Navigate(
                                    `/listing/all-listings/update/${listing._id}`,
                                  )
                                }
                                color={colors.accentGold}
                                _hover={{
                                  bg: colors.bgDeep,
                                  color: colors.goldLight,
                                }}
                              />
                            )}

                            {hasPermission("listing", "delete:any") && (
                              <IconButton
                                aria-label="Delete"
                                icon={<DeleteIcon />}
                                size="sm"
                                variant="ghost"
                                color={colors.badgeErrorText}
                                _hover={{
                                  bg: colors.badgeErrorBg,
                                  color: colors.badgeErrorText,
                                }}
                                onClick={() => handleDeleteListing(listing)}
                              />
                            )}
                          </Box>
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
                                variant="ghost"
                                color={colors.accentGold}
                                _hover={{
                                  bg: colors.bgDeep,
                                  color: colors.goldLight,
                                }}
                                onClick={() =>
                                  Navigate(
                                    `/listing/view-listing/${listing._id}`,
                                  )
                                }
                              />
                            ) : hasPendingRequest(listing) ? (
                              <Tooltip label="View request pending approval">
                                <Button
                                  size="sm"
                                  colorScheme="yellow"
                                  isDisabled
                                >
                                  Request Pending
                                </Button>
                              </Tooltip>
                            ) : (
                              <Button
                                size="sm"
                                variant="brand"
                                onClick={() =>
                                  handleRequestViewAccess(listing._id)
                                }
                                isLoading={loadingButton === listing._id}
                              >
                                Request View
                              </Button>
                            )}
                          </Box>
                        </Box>
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
                      <NoData label="listing" />
                    </Td>
                  </Tr>
                )}
              </Tbody>
            )}
          </Table>
        </Box>
      </Box>
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

export default AllListing;