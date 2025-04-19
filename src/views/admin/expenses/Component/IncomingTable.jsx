import { useState, useEffect } from "react";
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
  Select
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import AddIncomingPaymentModal from "./Sub_Component/AddIncomingPaymentModal";
import { FiFilter } from "react-icons/fi";
import { useFetchItemsQuery, useCreateItemMutation } from "api/apiSlice";
import { toast } from 'react-toastify';
import moment from "moment";
import { useNavigate } from "react-router-dom";
import Pagination from "../../developers/components/Pagination";
const IncomingTable = ({month, year}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [agencyFilterOpen, setAgencyFilterOpen] = useState(false);
  const [tempSelectedAgency, setTempSelectedAgency] = useState("");
  const [selectionAgency, setSelectionAgency] = useState("");
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const [agencies, setAgencies] = useState([]);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1); 
  const [pageSize, setPageSize] = useState(10); 
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const handlePageSizeChange = (newPageSize) => {
    setPageSize( newPageSize.target.value);
    setCurrentPage(1); 
    refetch()
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const buildQueryParams = () => {
    const params = {
      page: currentPage,
      limit: pageSize,
    };
    if (selectionAgency) params.agency = selectionAgency;
    if(month && year){
      params.month = month;
      params.year = year;
    }
    return params;
  };
  const { data, isLoading, isError,refetch } = useFetchItemsQuery( { path: `/invoices/monthly`, params: buildQueryParams() },
    { refetchOnMountOrArgChange: true, skip: !user._id });

const [createItemMuation] = useCreateItemMutation();
  const handleAddPayment = async (newPayment) => {
    try {
			await createItemMuation({
				path: '/invoices',
				body: newPayment,
			}).unwrap();

			toast.success('Expense added successfully.');
      refetch()
		} catch (error) {
			console.error(error);
			toast.error(error.data.message || 'Lead not added');
		}
  };

  const {
    data: agencyData,
    isLoading: agencyLoading,
    error: agencyError,
  } = useFetchItemsQuery(
    { path: `/agencies` },
    { refetchOnMountOrArgChange: true, skip: !user._id }
  );

  useEffect(() => {
    if (agencyData && agencyData.doc) {
      setAgencies(agencyData.doc);
    }
    if (agencyError) {
      console.error("Error fetching agencies:", agencyError);
      setAgencies([]);
    }
  }, [agencyData, agencyError]);

  const handlerAgencyFilter = () => {
    setSelectionAgency(tempSelectedAgency);
    refetch()
    setAgencyFilterOpen(false)
  }

  const handlerIncomingPaymentAddition = () => {
    navigate(`/invoice/developers`);
  }
  useEffect(() => {
    if (data) {
      setTotalPages(data.totalPages || 0);
      setTotalItems(data.totalDocs || 0);
      refetch()
    }
  }, [data]);
  return (
    <Box
      overflowY="auto"
      scrollBehavior="smooth"
      borderRadius="md"
      boxShadow="sm"
      bg="white"
      px={2}
    >
      <Flex justifyContent="space-between" alignItems="center" p={3}>
        <Text fontSize="20px" fontWeight="bold" color="black" p={3}>
          Payments
        </Text>
        <Box gap={2} display="flex" alignItems="center"> 
          <IconButton
            icon={<FiFilter />}
            onClick={() => setAgencyFilterOpen(true)}
            aria-label="Filter Date"
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
            onClick={handlerIncomingPaymentAddition}
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
          refetching={isLoading}
          loading={isLoading}
        />
      </Box>
      <Box borderRadius="lg" boxShadow="sm" bg="white"  maxH={"calc(60vh - 100px)"} overflowY="auto">
        <Table variant='striped' size='sm' bg='white'>
          <Thead
        		position='sticky'
						top={0}
						bg='white'
						zIndex={2}
						boxShadow='0px 2px 8px rgba(0, 0, 0, 0.1)'
            fontSize={"16px"}
            borderRadius="lg" 
          >
            <Tr>
              <Th bg='brand.200' whiteSpace='nowrap' py={4} 	fontSize={{ base: '12px', md: '14px' }} fontWeight='500' color='gray.700' textTransform={"capitalize"}>
                Date
              </Th>
              <Th bg='brand.200' whiteSpace='nowrap' py={4} 	fontSize={{ base: '12px', md: '14px' }} fontWeight='500' color='gray.700' textTransform={"capitalize"}>
                developer
              </Th>
              <Th bg='brand.200' whiteSpace='nowrap' py={4} 	fontSize={{ base: '12px', md: '14px' }} fontWeight='500' color='gray.700' textTransform={"capitalize"}>
                Email
              </Th>
              <Th bg='brand.200' whiteSpace='nowrap' py={4} 	fontSize={{ base: '12px', md: '14px' }} fontWeight='500' color='gray.700' textTransform={"capitalize"}>
                TRN
              </Th>
              <Th bg='brand.200' whiteSpace='nowrap' py={4} 	fontSize={{ base: '12px', md: '14px' }} fontWeight='500' color='gray.700' textTransform={"capitalize"}>
                Agency
              </Th>
              <Th bg='brand.200' whiteSpace='nowrap' py={4} 	fontSize={{ base: '12px', md: '14px' }} fontWeight='500' color='gray.700' textTransform={"capitalize"}>
                country
              </Th>
              <Th bg='brand.200' whiteSpace='nowrap' py={4} 	fontSize={{ base: '12px', md: '14px' }} fontWeight='500' color='gray.700' textTransform={"capitalize"}>
                Amount
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {data && data.doc.map((row, index) => (
              <Tr key={index}>
                <Td
                    py={4}
                    fontSize={{ base: '12px', md: '14px' }}
                    fontWeight='400'
                    minWidth='100px'
                  >
                    {row.createdAt ? moment(row.createdAt).format("MM/DD/YYYY hh:mmA") : "no data Found"}
                </Td>
                <Td
                    py={4}
                    fontSize={{ base: '12px', md: '14px' }}
                    fontWeight='400'
                    minWidth='100px'
                  >
                  {row?.developer?.developer_name ? row.developer.developer_name : "no data Found" }
                </Td>
                <Td
                    py={4}
                    fontSize={{ base: '12px', md: '14px' }}
                    fontWeight='400'
                    minWidth='100px'
                  >
                  {row?.developer?.email ? row.developer.email : "no data Found" }
                </Td>
                <Td
                    py={4}
                    fontSize={{ base: '12px', md: '14px' }}
                    fontWeight='400'
                    minWidth='100px'
                  >
                  {row?.developer?.trn ? row.developer.trn : "no data Found" }
                </Td>
                <Td
                    py={4}
                    fontSize={{ base: '12px', md: '14px' }}
                    fontWeight='400'
                    minWidth='100px'
                  >
                  {row?.agency?.name ? row.agency.name : "no data Found" }
                </Td>
                <Td
                    py={4}
                    fontSize={{ base: '12px', md: '14px' }}
                    fontWeight='400'
                    minWidth='100px'
                  >
                  {row?.developer?.country ? row.developer.country: "no data Found" }
                </Td>
                <Td
                  py={4}
                  fontSize={{ base: '12px', md: '14px' }}
                  fontWeight='400'
                  minWidth='100px'
                >
                  {row.totalAmount ? row.totalAmount : "no data Found" }
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      <AddIncomingPaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddPayment}
      />
      {/* Agency Filter Modal */}
      {agencyFilterOpen && (
        <Modal
          fontFamily="'DM Sans', sans-serif"
          onClose={() => setAgencyFilterOpen(false)}
          isOpen={agencyFilterOpen}
          isCentered
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Agency Filter</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormLabel fontSize="sm" fontWeight="600">
                Select Agency
              </FormLabel>
              <Select
                value={tempSelectedAgency}
                onChange={(e) => setTempSelectedAgency(e.target.value)}
                mb={4}
              >
                <option value="">All</option>
                {agencies.length > 0 ? (
                  agencies.map((agency) => (
                    <option key={agency._id} value={agency._id}>
                      {agency.name}
                    </option>
                  ))
                ) : (
                  <option disabled>No agencies available</option>
                )}
              </Select>
              {agencies.length === 0 && (
                <Text fontSize="sm" color="gray.500">
                  No agencies available at the moment.
                </Text>
              )}
            </ModalBody>
            <ModalFooter>
              <Button
                variant="outline"
                bg="#e2e8f0"
                size="md"
                w="100px"
                borderRadius="3px"
                mr={2}
                onClick={() => setAgencyFilterOpen(false)}
              >
                Close
              </Button>
              <Button
                bg="#d99a36"
                color="white"
                w="100px"
                borderRadius="3px"
                size="md"
                onClick={handlerAgencyFilter}
              >
                Apply
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
};

export default IncomingTable;
