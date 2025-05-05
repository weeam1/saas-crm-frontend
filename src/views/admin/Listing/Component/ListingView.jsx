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
  useToast,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon, EditIcon, ViewIcon } from "@chakra-ui/icons";
import { FiFilter } from "react-icons/fi";
import { toast } from "react-toastify";
import moment from "moment";
import Pagination from "../../developers/components/Pagination";
import TableLoading from "components/loading/TableLoading";

const ListingView = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  
  // Form states
  const [unitType, setUnitType] = useState("");
  const [status, setStatus] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [size, setSize] = useState("");
  const [otherDetails, setOtherDetails] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [ownerContact, setOwnerContact] = useState("");
  const [agentName, setAgentName] = useState("");

  // Mock user data
  const user = { 
    _id: "1",
    role: "admin", // Try changing to "user" to test admin-only fields
    fullName: "Test User"
  };

  // Filter states
  const [unitTypeFilter, setUnitTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");

  // Dummy data - replace with your actual API data
  const [listings, setListings] = useState([
    {
      _id: "1",
      unitType: "1 Bedroom",
      status: "Ready to Move",
      location: "Downtown Dubai",
      price: 1200000,
      size: 850,
      otherDetails: "Sea view, furnished",
      ownerName: "Ahmed Khalid",
      ownerContact: "+971501234567",
      agentName: "Sarah Johnson",
      createdAt: "2023-05-15T10:00:00Z"
    },
    {
      _id: "2",
      unitType: "Studio",
      status: "Off-Plan",
      location: "Jumeirah Village Circle",
      price: 750000,
      size: 450,
      otherDetails: "Completion in Q2 2024",
      ownerName: "Mohammed Ali",
      ownerContact: "+971521234567",
      agentName: "David Smith",
      createdAt: "2023-06-20T14:30:00Z"
    },
    {
      _id: "3",
      unitType: "2 Bedroom",
      status: "Ready to Move",
      location: "Business Bay",
      price: 1800000,
      size: 1200,
      otherDetails: "Balcony with city views",
      ownerName: "Fatima Ahmed",
      ownerContact: "+971551234567",
      agentName: "Emma Wilson",
      createdAt: "2023-04-10T09:15:00Z"
    },
    {
      _id: "4",
      unitType: "Warehouse",
      status: "Ready to Move",
      location: "Al Quoz",
      price: 3500000,
      size: 5000,
      otherDetails: "Industrial area, 24/7 access",
      ownerName: "Khalid Mohammed",
      ownerContact: "+971581234567",
      agentName: "James Brown",
      createdAt: "2023-07-05T11:45:00Z"
    },
    {
      _id: "5",
      unitType: "3 Bedroom",
      status: "Off-Plan",
      location: "Dubai Hills",
      price: 2800000,
      size: 1800,
      otherDetails: "Golf course view, delivery Q3 2024",
      ownerName: "Layla Hassan",
      ownerContact: "+971521234569",
      agentName: "Sarah Johnson",
      createdAt: "2023-08-12T16:20:00Z"
    }
  ]);

  const columns = [
    "Unit Type",
    "Status",
    "Location",
    "Price",
    "Size (sqft)",
    "Added Date",
    "Action",
  ];

  const unitTypes = [
    "Studio",
    "1 Bedroom",
    "2 Bedroom",
    "3 Bedroom",
    "Warehouse",
    "Plot Only"
  ];

  const statusOptions = [
    "Ready to Move",
    "Off-Plan"
  ];

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const applyFilters = () => {
    setCurrentPage(1);
    setIsFilterOpen(false);
  };

  const resetFilters = () => {
    setUnitTypeFilter("");
    setStatusFilter("");
    setLocationFilter("");
    setCurrentPage(1);
    setIsFilterOpen(false);
  };

  const handleAddListing = () => {
    const newListing = {
      _id: `${listings.length + 1}`,
      unitType,
      status,
      location,
      price: parseFloat(price),
      size: parseFloat(size),
      otherDetails,
      ownerName,
      ownerContact,
      agentName,
      createdAt: new Date().toISOString()
    };
    
    setListings([newListing, ...listings]);
    toast.success("Listing added successfully.");
    resetForm();
    setIsModalOpen(false);
  };

  const handleUpdateListing = () => {
    const updatedListings = listings.map(listing => 
      listing._id === selectedListing._id ? {
        ...listing,
        unitType,
        status,
        location,
        price: parseFloat(price),
        size: parseFloat(size),
        otherDetails,
        ownerName,
        ownerContact,
        agentName
      } : listing
    );
    
    setListings(updatedListings);
    toast.success("Listing updated successfully.");
    setIsEditModalOpen(false);
    setSelectedListing(null);
    resetForm();
  };

  const handleDeleteListing = (listingId) => {
    setListings(listings.filter(listing => listing._id !== listingId));
    toast.success("The listing has been deleted successfully.", {
      autoClose: 3000,
    });
  };

  const resetForm = () => {
    setUnitType("");
    setStatus("");
    setLocation("");
    setPrice("");
    setSize("");
    setOtherDetails("");
    setOwnerName("");
    setOwnerContact("");
    setAgentName("");
  };

  const openEditModal = (listing) => {
    setSelectedListing(listing);
    setUnitType(listing.unitType);
    setStatus(listing.status);
    setLocation(listing.location);
    setPrice(listing.price.toString());
    setSize(listing.size.toString());
    setOtherDetails(listing.otherDetails);
    setOwnerName(listing.ownerName);
    setOwnerContact(listing.ownerContact);
    setAgentName(listing.agentName);
    setIsEditModalOpen(true);
  };

  // Filter and paginate data
  const filteredData = listings.filter(listing => {
    return (
      (unitTypeFilter === "" || listing.unitType === unitTypeFilter) &&
      (statusFilter === "" || listing.status === statusFilter) &&
      (locationFilter === "" || listing.location.toLowerCase().includes(locationFilter.toLowerCase()))
  )})

  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    setTotalPages(Math.ceil(filteredData.length / pageSize));
    setTotalItems(filteredData.length);
  }, [filteredData, pageSize]);

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
          Listings
        </Text>
        <Box gap={2} display="flex" alignItems="center">
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

          <Button
            size="md"
            variant="brand"
            leftIcon={<AddIcon />}
            py={3}
            px={6}
            onClick={() => setIsModalOpen(true)}
          >
            Add New
          </Button>
        </Box>
      </Flex>
      <Box mx={1} mb={1}>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          totalItems={totalItems}
          itemsPerPage={pageSize}
          setPageSize={setPageSize}
          handlePageSize={handlePageSizeChange}
          loading={false}
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
          <Tbody>
            {paginatedData.map((listing, index) => (
              <Tr key={index}>
                <Td
                  py={4}
                  fontSize={{ base: "12px", md: "14px" }}
                  fontWeight="400"
                  minWidth="100px"
                >
                  {listing.unitType || "N/A"}
                </Td>
                <Td
                  py={4}
                  fontSize={{ base: "12px", md: "14px" }}
                  fontWeight="400"
                  minWidth="100px"
                >
                  {listing.status || "N/A"}
                </Td>
                <Td
                  py={4}
                  fontSize={{ base: "12px", md: "14px" }}
                  fontWeight="400"
                  minWidth="100px"
                >
                  {listing.location || "N/A"}
                </Td>
                <Td
                  py={4}
                  fontSize={{ base: "12px", md: "14px" }}
                  fontWeight="400"
                  minWidth="100px"
                >
                  {listing.price ? `$${listing.price.toLocaleString()}` : "N/A"}
                </Td>
                <Td
                  py={4}
                  fontSize={{ base: "12px", md: "14px" }}
                  fontWeight="400"
                  minWidth="100px"
                >
                  {listing.size ? listing.size.toLocaleString() : "N/A"}
                </Td>
                <Td
                  py={4}
                  fontSize={{ base: "12px", md: "14px" }}
                  fontWeight="400"
                  minWidth="100px"
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
                  display={"flex"}
                  gap={2}
                >
                  <IconButton
                    aria-label="Edit"
                    icon={<EditIcon />}
                    size="sm"
                    onClick={() => openEditModal(listing)}
                    color={"#c09f5f"}
                    _hover={{ backgroundColor: "#c09f5f", color: "white" }}
                  />
                  <IconButton
                    aria-label="Delete"
                    icon={<DeleteIcon />}
                    size="sm"
                    color={"#c09f5f"}
                    _hover={{ backgroundColor: "#c09f5f", color: "white" }}
                    onClick={() => handleDeleteListing(listing._id)}
                  />
                  <IconButton
                    aria-label="View"
                    icon={<ViewIcon />}
                    size="sm"
                    color={"#c09f5f"}
                    _hover={{ backgroundColor: "#c09f5f", color: "white" }}
                    onClick={() => {
                      setSelectedListing(listing);
                      setIsViewModalOpen(true);
                    }}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        {filteredData.length === 0 && (
          <Text textAlign="center" color="gray.500" py={6}>
            No listings found.
          </Text>
        )}
      </Box>

      {/* Add Listing Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Listing</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box mb={4}>
              <FormLabel>Unit Type</FormLabel>
              <Select
                placeholder="Select unit type"
                value={unitType}
                onChange={(e) => setUnitType(e.target.value)}
              >
                {unitTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </Select>
            </Box>
            <Box mb={4}>
              <FormLabel>Status</FormLabel>
              <Select
                placeholder="Select status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </Select>
            </Box>
            <Box mb={4}>
              <FormLabel>Location</FormLabel>
              <Input
                placeholder="Enter location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </Box>
            <Box mb={4}>
              <FormLabel>Price</FormLabel>
              <Input
                type="number"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </Box>
            <Box mb={4}>
              <FormLabel>Size (sqft)</FormLabel>
              <Input
                type="number"
                placeholder="Enter size in square feet"
                value={size}
                onChange={(e) => setSize(e.target.value)}
              />
            </Box>
            <Box mb={4}>
              <FormLabel>Other Details</FormLabel>
              <Input
                placeholder="Enter any other details"
                value={otherDetails}
                onChange={(e) => setOtherDetails(e.target.value)}
              />
            </Box>
            {user.role === "admin" && (
              <>
                <Box mb={4}>
                  <FormLabel>Owner Name</FormLabel>
                  <Input
                    placeholder="Enter owner name"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                  />
                </Box>
                <Box mb={4}>
                  <FormLabel>Owner Contact</FormLabel>
                  <Input
                    placeholder="Enter owner contact"
                    value={ownerContact}
                    onChange={(e) => setOwnerContact(e.target.value)}
                  />
                </Box>
                <Box mb={4}>
                  <FormLabel>Agent Name</FormLabel>
                  <Input
                    placeholder="Enter agent name"
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                  />
                </Box>
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              mr={3}
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleAddListing}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Listing Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Listing</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box mb={4}>
              <FormLabel>Unit Type</FormLabel>
              <Select
                placeholder="Select unit type"
                value={unitType}
                onChange={(e) => setUnitType(e.target.value)}
              >
                {unitTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </Select>
            </Box>
            <Box mb={4}>
              <FormLabel>Status</FormLabel>
              <Select
                placeholder="Select status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </Select>
            </Box>
            <Box mb={4}>
              <FormLabel>Location</FormLabel>
              <Input
                placeholder="Enter location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </Box>
            <Box mb={4}>
              <FormLabel>Price</FormLabel>
              <Input
                type="number"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </Box>
            <Box mb={4}>
              <FormLabel>Size (sqft)</FormLabel>
              <Input
                type="number"
                placeholder="Enter size in square feet"
                value={size}
                onChange={(e) => setSize(e.target.value)}
              />
            </Box>
            <Box mb={4}>
              <FormLabel>Other Details</FormLabel>
              <Input
                placeholder="Enter any other details"
                value={otherDetails}
                onChange={(e) => setOtherDetails(e.target.value)}
              />
            </Box>
            {user.role === "admin" && (
              <>
                <Box mb={4}>
                  <FormLabel>Owner Name</FormLabel>
                  <Input
                    placeholder="Enter owner name"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                  />
                </Box>
                <Box mb={4}>
                  <FormLabel>Owner Contact</FormLabel>
                  <Input
                    placeholder="Enter owner contact"
                    value={ownerContact}
                    onChange={(e) => setOwnerContact(e.target.value)}
                  />
                </Box>
                <Box mb={4}>
                  <FormLabel>Agent Name</FormLabel>
                  <Input
                    placeholder="Enter agent name"
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                  />
                </Box>
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              mr={3}
              onClick={() => {
                setIsEditModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleUpdateListing}
            >
              Update
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* View Listing Modal */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Listing Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedListing && (
              <Box>
                <Text><strong>Unit Type:</strong> {selectedListing.unitType}</Text>
                <Text><strong>Status:</strong> {selectedListing.status}</Text>
                <Text><strong>Location:</strong> {selectedListing.location}</Text>
                <Text><strong>Price:</strong> ${selectedListing.price?.toLocaleString()}</Text>
                <Text><strong>Size:</strong> {selectedListing.size?.toLocaleString()} sqft</Text>
                <Text><strong>Added Date:</strong> {moment(selectedListing.createdAt).format("MM/DD/YYYY")}</Text>
                <Text><strong>Other Details:</strong> {selectedListing.otherDetails || "N/A"}</Text>
                
                {/* Admin-only fields */}
                {user.role === "admin" && (
                  <>
                    <Text mt={4}><strong>Owner Name:</strong> {selectedListing.ownerName || "N/A"}</Text>
                    <Text><strong>Owner Contact:</strong> {selectedListing.ownerContact || "N/A"}</Text>
                    <Text><strong>Agent Name:</strong> {selectedListing.agentName || "N/A"}</Text>
                  </>
                )}
              </Box>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => setIsViewModalOpen(false)}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Filter Modal */}
      <Modal isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Filter Listings</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box mb={4}>
              <FormLabel>Unit Type</FormLabel>
              <Select
                placeholder="All types"
                value={unitTypeFilter}
                onChange={(e) => setUnitTypeFilter(e.target.value)}
              >
                {unitTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </Select>
            </Box>
            <Box mb={4}>
              <FormLabel>Status</FormLabel>
              <Select
                placeholder="All statuses"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </Select>
            </Box>
            <Box mb={4}>
              <FormLabel>Location</FormLabel>
              <Input
                placeholder="Filter by location"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              />
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              mr={3}
              onClick={resetFilters}
            >
              Reset
            </Button>
            <Button
              colorScheme="#c09f5f"
              onClick={applyFilters}
            >
              Apply Filters
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ListingView;