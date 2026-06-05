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
  useBreakpointValue,
  Spinner,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon, EditIcon, ViewIcon } from "@chakra-ui/icons";
import { FiSearch} from "react-icons/fi";
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
import SearchTags from "components/shared/SearchTags";
import { format } from "date-fns";
import NoData from "views/admin/lead-v2/components/subComponents/NoData";
import { useUserActivityLog } from "hooks/useUserActivityLog";
import { usePermissions } from "hooks/usePermissions";
import RefreshButton from "components/refresh/RefreshButton";
import useUserSession from "hooks/useUserSession";
import CustomTooltip from "components/shared/CustomTooltip";
import { useModalColors } from "hooks/useModalColors";

const MyListing = () => {
  const colors = useModalColors();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [deleteItemMutation] = useDeleteItemMutation();
  const Navigate = useNavigate();
  const [selectedListing, setSelectedListing] = useState(null);
  const notesModalDisclosure = useDisclosure();
  const [statusLoadingId, setStatusLoadingId] = useState(null);
  const { user, isSuperAdmin } = useUserSession();
  const { createUserLog } = useUserActivityLog();

  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
  const [currentListingId, setCurrentListingId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [updateStatus] = useUpdateItemMutation();
  const [filters, setFilters] = useState({});
  const [tableData, setTableData] = useState();
  const [searchTags, setSearchTags] = useState([]);
  const [shouldRefetch, setShouldRefetch] = useState(false);

  const isMobile = useBreakpointValue({ base: true, sm: true, md: false });

  const { hasPermission } = usePermissions();

  const { data: listingType } = useFetchItemsQuery(
    { path: `/listing/secondary/types` },
    { refetchOnMountOrArgChange: true, skip: !user?._id },
  );

  const { data: listingUnitType } = useFetchItemsQuery(
    { path: `/listing/secondary/unit-types` },
    { refetchOnMountOrArgChange: true, skip: !user?._id },
  );

  const actionPermission =
    hasPermission("listing", "update:own") ||
    hasPermission("listing", "delete:own") ||
    hasPermission("listing", "read:own");

  const columns = [
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
    "Status",
    "Date",
    "Created By",
    "Notes",
  ];

  // check action permission then added
  if (actionPermission) columns.push("Action");

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

  const { data, isLoading, refetch, isFetching } = useFetchItemsQuery(
    { path: `listing/secondary/my-listings`, params: buildQueryParams() },
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
        message: `"${user?.fullName}" deleted own listing "${listing?.projectName || "Untitled"}".`,
      });
      setShouldRefetch(true);
    } catch (error) {
      const errorMsg =
        error?.data?.message || "Failed to delete the task. Please try again.";
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
      setStatusLoadingId(listingId);
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
        message: `"${user?.fullName}" update the status secondary listing "${response?.data?.projectName || "Untitled"}".`,
      });
      toast.success("Status updated successfully");
      setTableData((prevData) =>
        prevData.map((listing) =>
          listing._id === listingId ? { ...listing, status } : listing,
        ),
      );
      setIsRejectionModalOpen(false);
      setRejectionReason("");
      setAdminNotes("");
    } catch (error) {
      const errorMsg =
        error?.data?.message ||
        "Failed to update the listing status. Please try again.";
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
      boxShadow={colors.cardShadow}
      bg={colors.bg}
      px={2}
      marginTop={"-16px"}
      borderRadius="lg"
      border="1px solid"
      borderColor={colors.borderColor}
    >
      <Flex
        justifyContent="space-between"
        alignItems={{ base: "normal", sm: "normal", md: "center" }}
        p={3}
        flexDir={{ base: "column", sm: "column", md: "row" }}
      >
        <Text fontSize="20px" fontWeight="bold" color={colors.headingText} p={3}>
          My Listings
        </Text>
        <Box
          gap={2}
          display="flex"
          alignItems="center"
          flexDir={{ base: "column", sm: "column", md: "row" }}
          justifyContent={{ base: "center", sm: "center", md: "normal" }}
        >
          {hasPermission("listing", "create:any") && (
            <Button
              size="sm"
              borderRadius={"md"}
              variant="brand"
              leftIcon={<AddIcon />}
              py={3}
              px={6}
              onClick={() => Navigate("/listing/my-listings/add-listing")}
            >
              Add New
            </Button>
          )}

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
	isLoading={isLoading || isFetching}
	isFetching={isLoading || isFetching}
	size="sm"
/>
        </Box>
      </Flex>

      {/* Search Tags */}
      {searchTags.length > 0 && (
        <SearchTags
          searchTags={searchTags}
          removeTag={removeTag}
          clearAllTags={clearAllTags}
        />
      )}

      <Box mb={1}>
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
                      <Td
                        py={4}
                        fontSize={{ base: "12px", md: "14px" }}
                        fontWeight="400"
                        minWidth="100px"
                        textAlign={"center"}
                        color={colors.bodyText}
                        borderColor={colors.borderColor}
                      >
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
                      <Td
                        py={4}
                        fontSize={{ base: "12px", md: "14px" }}
                        fontWeight="400"
                        minWidth="100px"
                        textAlign={"center"}
                        color={colors.bodyText}
                        borderColor={colors.borderColor}
                      >
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
                        {statusLoadingId === listing._id ? (
                          <Spinner size="sm" color={colors.accentGold} />
                        ) : listing.status === "rejected" ? (
                          <>
                            <Select
                              value={listing.status}
                              colorScheme="green"
                              onChange={(e) =>
                                handleStatusChange(
                                  listing._id,
                                  e.target.value,
                                  listing.status,
                                )
                              }
                              size="sm"
                              width="150px"
                              bg={colors.bgInput}
                              borderColor={colors.borderColor}
                              color={colors.headingText}
                              _hover={{ borderColor: colors.accentGold }}
                              _focus={{
                                borderColor: colors.accentGold,
                                boxShadow: `0 0 0 1px ${colors.accentGold}`,
                              }}
                            >
                              <option value="rejected" style={{ background: colors.bg, color: colors.headingText }}>Rejected</option>
                              <option value="pending" style={{ background: colors.bg, color: colors.headingText }}>Re-consider</option>
                            </Select>
                          </>
                        ) : listing.status === "pending" ? (
                          <Select
                            value={listing.status}
                            colorScheme="green"
                            size="sm"
                            width="150px"
                            bg={colors.bgInput}
                            borderColor={colors.borderColor}
                            color={colors.headingText}
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
                            <option value="pending" style={{ background: colors.bg, color: colors.headingText }}>Pending</option>
                            <option value="draft" style={{ background: colors.bg, color: colors.headingText }}>Draft</option>
                          </Select>
                        ) : listing.status === "draft" ? (
                          <Select
                            value={listing.status}
                            colorScheme="green"
                            size="sm"
                            width="150px"
                            bg={colors.bgInput}
                            borderColor={colors.borderColor}
                            color={colors.headingText}
                            onChange={(e) =>
                              handleStatusChange(
                                listing._id,
                                e.target.value,
                                listing.status,
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
                            <option value={isSuperAdmin ? "active" : "pending"} style={{ background: colors.bg, color: colors.headingText }}>
                              Publish
                            </option>
                            <option value="draft" style={{ background: colors.bg, color: colors.headingText }}>Draft</option>
                          </Select>
                        ) : (
                          <Switch
                            colorScheme="yellow"
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
                        color={colors.bodyText}
                        borderColor={colors.borderColor}
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
                        color={colors.bodyText}
                        borderColor={colors.borderColor}
                      >
                        {listing.createdBy?.fullName}
                      </Td>
                      <Td py={4} textAlign={"center"} borderColor={colors.borderColor}>
                        <Button
                          variant="brand"
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
                      {actionPermission && (
                        <Td
                          py={4}
                          fontSize={{ base: "12px", md: "14px" }}
                          fontWeight="400"
                          minWidth="100px"
                          borderColor={colors.borderColor}
                        >
                          <Box
                            display="flex"
                            gap={2}
                            justifyContent="center"
                            alignItems={"center"}
                          >
                            {hasPermission("listing", "update:own") && (
                              <IconButton
                                aria-label="Edit"
                                icon={<EditIcon />}
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  Navigate(
                                    `/listing/my-listings/update/${listing._id}`,
                                  )
                                }
                                color={colors.accentGold}
                                _hover={{
                                  bg: colors.bgDeep,
                                  color: colors.goldLight,
                                }}
                              />
                            )}

                            {hasPermission("listing", "delete:own") && (
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

                            {hasPermission("listing", "read:own") && (
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
                            )}
                          </Box>
                        </Td>
                      )}
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

      {/* Rejection Reason Modal */}
      <Modal
        isOpen={isRejectionModalOpen}
        onClose={() => {
          setIsRejectionModalOpen(false);
          setRejectionReason("");
          setAdminNotes("");
        }}
      >
        <ModalOverlay bg={colors.overlayBg} backdropFilter="blur(4px)" />
        <ModalContent bg={colors.bg} borderRadius="2xl" boxShadow={colors.modalShadow}>
          <ModalHeader bg={colors.headerBg} color={colors.headerText}>Rejection Details</ModalHeader>
          <ModalCloseButton color={colors.headerText} _hover={{ bg: colors.closeBtnHoverBg }} />
          <ModalBody>
            <Box mb={4}>
              <FormLabel color={colors.labelColor}>Rejection Reason</FormLabel>
              <Input
                placeholder="Enter reason for rejection"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
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
            <Box mb={4}>
              <FormLabel color={colors.labelColor}>Admin Notes (Optional)</FormLabel>
              <Textarea
                placeholder="Enter any additional notes"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
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
          <ModalFooter bg={colors.footerBg} borderTop="1px solid" borderColor={colors.borderColor}>
            <Button
              variant="outline"
              mr={3}
              onClick={() => {
                setIsRejectionModalOpen(false);
                setRejectionReason("");
                setAdminNotes("");
              }}
            >
              Cancel
            </Button>
            <Button
              variant="brand"
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
        clearFilter={false}
        countries={countries?.doc || []}
      />
    </Box>
  );
};

export default MyListing;