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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { ViewIcon, RepeatIcon } from "@chakra-ui/icons";
import { FiChevronDown } from "react-icons/fi";
import { useFetchItemsQuery, useUpdateItemMutation } from "api/apiSlice";
import moment from "moment";
import TableLoading from "components/loading/TableLoading";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import TopPagination from "components/pagination/TopPagination";

const RejectRequest = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState({});
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [currentRequestId, setCurrentRequestId] = useState(null);
  const [currentListingId, setCurrentListingId] = useState(null);
  const Navigate = useNavigate();

  const [unitTypeFilter, setUnitTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");

  const columns = [
    "Date",
    "Requester",
    "Phone",
    "Project",
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
    { path: `listing/secondary/rejected-listings` },
    { refetchOnMountOrArgChange: true }
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
          Rejected Requests
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
                data.data.map((request, index) => (
                  <Tr key={index}>
                    <Td
                      py={4}
                      fontSize={{ base: "12px", md: "14px" }}
                      fontWeight="400"
                      minWidth="100px"
                      textAlign={"center"}
                    >
                      {request.rejectedAt
                        ? moment(request.rejectedAt).format("MM/DD/YYYY")
                        : "N/A"}
                    </Td>
                    <Td
                      py={4}
                      fontSize={{ base: "12px", md: "14px" }}
                      fontWeight="400"
                      minWidth="100px"
                      textAlign={"center"}
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
                      minWidth="100px"
                      overflow="hidden"
                      textOverflow="ellipsis"
                    >
                      {request.listing?.price
                        ? `AED ${request.listing.price.toLocaleString()}`
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
                      <Menu>
                        <MenuButton
                          as={Button}
                          rightIcon={<FiChevronDown />}
                          colorScheme="brand"
                          size="sm"
                        >
                          Actions
                        </MenuButton>
                        <MenuList>
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
                ))}
            </Tbody>
          )}
        </Table>
        {!isLoading && !isFetching && data?.data?.length === 0 && (
          <Text textAlign="center" color="gray.500" py={6}>
            No rejected requests found.
          </Text>
        )}
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

      {/* Filter Modal */}
      <Modal isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Filter Rejected Requests</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box mb={4}>
              <FormLabel>Project Name</FormLabel>
              <Input
                placeholder="Filter by project name"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              />
            </Box>
            <Box mb={4}>
              <FormLabel>Requester Name</FormLabel>
              <Input
                placeholder="Filter by requester name"
                value={unitTypeFilter}
                onChange={(e) => setUnitTypeFilter(e.target.value)}
              />
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" mr={3} onClick={resetFilters}>
              Reset
            </Button>
            <Button colorScheme="blue" onClick={applyFilters}>
              Apply Filters
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default RejectRequest;
