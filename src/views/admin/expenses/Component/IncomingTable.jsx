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

const IncomingTable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [agencyFilterOpen, setAgencyFilterOpen] = useState(false);
  const [tempSelectedAgency, setTempSelectedAgency] = useState("");
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const [agencies, setAgencies] = useState([]);
  const navigate = useNavigate();

  const buildQueryParams = () => {
    const params = {};
    if (tempSelectedAgency) params.agency = tempSelectedAgency;

    return params;
  };
  const { data, isLoading, isError,refetch } = useFetchItemsQuery( { path: `/invoices`, params: buildQueryParams() },
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
    refetch()
    setAgencyFilterOpen(false)
  }

  const handlerIncomingPaymentAddition = () => { 
  const params = new URLSearchParams({
     incomingPayment : true
    });
    navigate(`/invoice/developers?${params.toString()}`);
  }
  return (
    <Box
      overflowY="auto"
      scrollBehavior="smooth"
      borderRadius="md"
      boxShadow="sm"
      bg="white"
      px={8}
    >
      <Flex justifyContent="space-between" alignItems="center" p={4}>
        <Text fontSize="30px" fontWeight="bold" color="black" p={4}>
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
            size="lg"
            variant="brand"
            leftIcon={<AddIcon />}
            py={5}
            px={10}
            onClick={handlerIncomingPaymentAddition}
          >
            Add New
          </Button>
        </Box>
      </Flex>
      <Box borderRadius="lg" boxShadow="sm" bg="white">
        <Table variant="striped" size="lg" bg="white">
          <Thead
            position="sticky"
            top={0}
            bg="white"
            zIndex={2}
            boxShadow="0px 2px 8px rgba(0, 0, 0, 0.1)"
          >
            <Tr>
              <Th bg="brand.200" whiteSpace="nowrap" py={2} color={"black"}>
                Date
              </Th>
              <Th bg="brand.200" whiteSpace="nowrap" py={2} color={"black"}>
                developer
              </Th>
              <Th bg="brand.200" whiteSpace="nowrap" py={2} color={"black"}>
                Email
              </Th>
              <Th bg="brand.200" whiteSpace="nowrap" py={2} color={"black"}>
                TRN
              </Th>
              <Th bg="brand.200" whiteSpace="nowrap" py={2} color={"black"}>
                Agency
              </Th>
              <Th bg="brand.200" whiteSpace="nowrap" py={2} color={"black"}>
                country
              </Th>
              <Th bg="brand.200" whiteSpace="nowrap" py={2} color={"black"}>
                Amount
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {data && data.doc.map((row, index) => (
              <Tr key={index}>
                <Td>{row.createdAt ? moment(row.createdAt).format("MM/DD/YYYY hh:mmA") : "no data Found"}</Td>
                <Td>{row.developer.developer_name ? row.developer.developer_name : "no data Found" }</Td>
                <Td>{row.developer.email ? row.developer.email : "no data Found" }</Td>
                <Td>{row.developer.trn ? row.developer.trn : "no data Found" }</Td>
                <Td>{row.agency.name ? row.agency.name : "no data Found" }</Td>
                <Td>{row.developer.country ? row.developer.country: "no data Found" }</Td>
                <Td>{row.totalAmount ? row.totalAmount : "no data Found" }</Td>
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
