import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Skeleton,
  Divider,
  useBreakpointValue,
  HStack,
} from "@chakra-ui/react";
import { useNavigate, useParams, Link } from "react-router-dom";
import DeleteIconSvg from "../../../assets/img/bankaccount/Vector.png";
import EditIconSvg from "../../../assets/img/bankaccount/ic_baseline-edit.png";
import { BiError } from "react-icons/bi";
import { useFetchItemsQuery } from "api/apiSlice";
import Add from "./Add";
import Edit from "./Edit";
import Delete from "./components/DeleteEntry";
import BackImg from "../../../assets/img/Invoice/Vector.svg";

const AddEntry = () => {
  // Responsive values using useBreakpointValue
  const tableSize = useBreakpointValue({ base: "sm", md: "md", lg: "lg" });
  const fontSizeTh = useBreakpointValue({ base: "xs", md: "sm", lg: "md" });
  const fontSizeTd = useBreakpointValue({ base: "xs", md: "sm", lg: "md" });
  const fontSizeSummaryLabel = useBreakpointValue({ base: "12px", md: "14px" });
  const fontSizeSummaryValue = useBreakpointValue({ base: "14px", md: "16px" });
  const paddingX = useBreakpointValue({ base: 4, md: 6, lg: 8 });

  const navigate = useNavigate();
  const { id } = useParams();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const {
    data: entriesData,
    isLoading: entriesLoading,
    error: entriesError,
    refetch,
  } = useFetchItemsQuery(
    {
      path: `/invoices/entries/invoice/${id}`,
    },
    {
      skip: !id,
    }
  );

  const [tableData, setTableData] = useState([]);
  const [summary, setSummary] = useState({
    totalCommissionExclVat: 0,
    totalVatAmount: 0,
    totalCommissionInclVat: 0,
  });

  useEffect(() => {
    if (entriesData?.doc) {
      setTableData(entriesData.doc);

      const totalCommissionExclVat = entriesData.doc.reduce(
        (sum, entry) => sum + (Number(entry.total_commission_excl_vat) || 0),
        0
      );
      const totalVatAmount = entriesData.doc.reduce(
        (sum, entry) => sum + (Number(entry.vat_amount) || 0),
        0
      );
      const totalCommissionInclVat = entriesData.doc.reduce(
        (sum, entry) => sum + (Number(entry.total_commission_incl_vat) || 0),
        0
      );

      setSummary({
        totalCommissionExclVat,
        totalVatAmount,
        totalCommissionInclVat,
      });
    } else {
      setTableData([]);
      setSummary({
        totalCommissionExclVat: 0,
        totalVatAmount: 0,
        totalCommissionInclVat: 0,
      });
    }
  }, [entriesData]);

  const goBack = () => {
    navigate("/invoice", { state: { refetch: true } });
  };

  const handleEditClick = (entryId) => {
    setSelectedId(entryId);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (entryId) => {
    setSelectedId(entryId);
    setIsDeleteModalOpen(true);
  };

  if (entriesError) {
    return (
      <Box
        minH="400px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        p={paddingX}
        bg="white"
        borderRadius="10px"
        boxShadow="md"
      >
        <HStack spacing={3} color="red.500">
          <BiError size={25} />
          <Text
            fontSize={{ base: "lg", md: "xl", lg: "2xl" }}
            fontWeight="medium"
          >
            No Entries Found!
          </Text>
        </HStack>
      </Box>
    );
  }

  return (
    <Box bg="gray.50" p={paddingX} fontFamily="DM Sans" minH="100vh">
      {/* Header Section */}
      <Flex
        mb={6}
        justifyContent="space-between"
        alignItems="center"
        flexDir={{ base: "column", sm: "row" }}
        bg="white"
        p={4}
        borderRadius="10px"
        boxShadow="sm"
      >
        <HStack spacing={3} mb={{ base: 4, sm: 0 }}>
          <Button
            variant="ghost"
            onClick={goBack}
            leftIcon={<img src={BackImg} alt="Back" />}
            p={2}
            _hover={{ bg: "gray.100" }}
          />
          <Text
            fontSize={{ base: "md", md: "lg", lg: "2xl" }}
            fontWeight="bold"
            color="gray.800"
          >
            Add Entry
          </Text>
        </HStack>

        <HStack spacing={3}>
          <Button
            w={{ base: "full", sm: "100px", md: "110px", lg: "120px" }}
            h={{ base: "36px", sm: "40px", md: "42px", lg: "44px" }}
            fontWeight="medium"
            fontSize={{ base: "sm", sm: "sm", md: "md", lg: "md" }}
            color="white"
            bg="#B79045"
            onClick={() => setIsAddModalOpen(true)}
            borderRadius="6px"
            _hover={{ bg: "#A47B38" }}
          >
            Add Entry
          </Button>
          {tableData.length > 0 && (
            <Link to={`/invoiceView/${tableData[0]?.invoice?.invoiceNo}`}>
              <Button
                w={{ base: "full", sm: "100px", md: "110px", lg: "120px" }}
                h={{ base: "36px", sm: "40px", md: "42px", lg: "44px" }}
                fontWeight="medium"
                fontSize={{ base: "sm", sm: "sm", md: "md", lg: "md" }}
                color="white"
                bg="#B79045"
                borderRadius="6px"
                _hover={{ bg: "#A47B38" }}
              >
                View Invoice
              </Button>
            </Link>
          )}
        </HStack>
      </Flex>

      <Skeleton isLoaded={!entriesLoading}>
        {tableData.length === 0 ? (
          <Box
            minH="400px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            p={4}
            bg="white"
            borderRadius="10px"
            boxShadow="md"
          >
            <HStack spacing={3} color="gray.500">
              <BiError size={25} />
              <Text
                fontSize={{ base: "lg", md: "xl", lg: "2xl" }}
                fontWeight="medium"
              >
                No Entry Available
              </Text>
            </HStack>
          </Box>
        ) : (
          <>
            <Box
              overflowX="auto"
              maxH="800px"
              overflowY="auto"
              borderRadius="10px"
              boxShadow="sm"
              p={4}
              mb={6}
            >
              <Table
                variant="simple"
                bg="white"
                size={tableSize}
                fontFamily="DM Sans"
                minWidth={{ base: "900px", md: "100%" }}
                border="1px solid"
                borderColor="#E2E8F0"
              >
                <Thead bg="#B79045">
                  <Tr>
                    <Th
                      color="white"
                      fontSize={fontSizeTh}
                      fontWeight="medium"
                      py={1.5}
                      textTransform="capitalize"
                      borderColor="#E2E8F0"
                    >
                      SN
                    </Th>
                    <Th
                      color="white"
                      fontSize={fontSizeTh}
                      fontWeight="medium"
                      py={1.5}
                      textTransform="capitalize"
                      borderColor="#E2E8F0"
                    >
                      Unit No
                    </Th>
                    <Th
                      color="white"
                      fontSize={fontSizeTh}
                      fontWeight="medium"
                      py={1.5}
                      textTransform="capitalize"
                      borderColor="#E2E8F0"
                    >
                      Name of Referring Party
                    </Th>
                    <Th
                      color="white"
                      fontSize={fontSizeTh}
                      fontWeight="medium"
                      py={1.5}
                      textTransform="capitalize"
                      borderColor="#E2E8F0"
                    >
                      Claim Type
                    </Th>
                    <Th
                      color="white"
                      fontSize={fontSizeTh}
                      fontWeight="medium"
                      py={1.5}
                      textTransform="capitalize"
                      borderColor="#E2E8F0"
                    >
                      Commission %
                    </Th>
                    <Th
                      color="white"
                      fontSize={fontSizeTh}
                      fontWeight="medium"
                      py={1.5}
                      textTransform="capitalize"
                      borderColor="#E2E8F0"
                    >
                      Unit Price
                    </Th>
                    <Th
                      color="white"
                      fontSize={fontSizeTh}
                      fontWeight="medium"
                      py={1.5}
                      textTransform="capitalize"
                      borderColor="#E2E8F0"
                    >
                      Total Commission EXCL. VAT
                    </Th>
                    <Th
                      color="white"
                      fontSize={fontSizeTh}
                      fontWeight="medium"
                      py={1.5}
                      textTransform="capitalize"
                      borderColor="#E2E8F0"
                    >
                      VAT %
                    </Th>
                    <Th
                      color="white"
                      fontSize={fontSizeTh}
                      fontWeight="medium"
                      py={1.5}
                      textTransform="capitalize"
                      borderColor="#E2E8F0"
                    >
                      VAT Amount
                    </Th>
                    <Th
                      color="white"
                      fontSize={fontSizeTh}
                      fontWeight="medium"
                      py={1.5}
                      textTransform="capitalize"
                      borderColor="#E2E8F0"
                    >
                      Total Commission incl. VAT
                    </Th>
                    <Th
                      color="white"
                      fontSize={fontSizeTh}
                      fontWeight="medium"
                      py={1.5}
                      textTransform="capitalize"
                      borderColor="#E2E8F0"
                    >
                      Action
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {tableData.map((entry, index) => (
                    <Tr key={entry._id} _hover={{ bg: "gray.50" }}>
                      <Td
                        textAlign="center"
                        border="1px solid #E2E8F0"
                        fontSize={fontSizeTd}
                        color="gray.700"
                        py={3}
                      >
                        {index + 1}
                      </Td>
                      <Td
                        border="1px solid #E2E8F0"
                        fontSize={fontSizeTd}
                        color="gray.700"
                        py={3}
                      >
                        {entry.unit_no || "-"}
                      </Td>
                      <Td
                        border="1px solid #E2E8F0"
                        fontSize={fontSizeTd}
                        color="gray.700"
                        py={3}
                      >
                        {entry.name_of_referring_party || "-"}
                      </Td>
                      <Td
                        textAlign="center"
                        border="1px solid #E2E8F0"
                        fontSize={fontSizeTd}
                        color="gray.700"
                        py={3}
                      >
                        {entry.claim_type || "-"}
                      </Td>
                      <Td
                        textAlign="center"
                        border="1px solid #E2E8F0"
                        fontSize={fontSizeTd}
                        color="gray.700"
                        py={3}
                      >
                        {`${entry.commission_percentage || 0}%`}
                      </Td>
                      <Td
                        textAlign="right"
                        border="1px solid #E2E8F0"
                        fontSize={fontSizeTd}
                        color="gray.700"
                        py={3}
                      >
                        {(entry.unit_price || 0).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </Td>
                      <Td
                        textAlign="right"
                        border="1px solid #E2E8F0"
                        fontSize={fontSizeTd}
                        color="gray.700"
                        py={3}
                      >
                        {(entry.total_commission_excl_vat || 0).toLocaleString(
                          "en-US",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}
                      </Td>
                      <Td
                        textAlign="center"
                        border="1px solid #E2E8F0"
                        fontSize={fontSizeTd}
                        color="gray.700"
                        py={3}
                      >
                        {`${entry.vat_percentage || 5}%`}
                      </Td>
                      <Td
                        textAlign="right"
                        border="1px solid #E2E8F0"
                        fontSize={fontSizeTd}
                        color="gray.700"
                        py={3}
                      >
                        {(entry.vat_amount || 0).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </Td>
                      <Td
                        textAlign="right"
                        border="1px solid #E2E8F0"
                        fontSize={fontSizeTd}
                        color="gray.700"
                        py={3}
                      >
                        {(entry.total_commission_incl_vat || 0).toLocaleString(
                          "en-US",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}
                      </Td>
                      <Td border="1px solid #E2E8F0" py={3}>
                        <HStack justifyContent="center" spacing={2}>
                          <Button
                            size="sm"
                            onClick={() => handleEditClick(entry._id)}
                            borderRadius="6px"
                          >
                            <img src={EditIconSvg} alt="Edit" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleDeleteClick(entry._id)}
                            borderRadius="6px"
                          >
                            {<img src={DeleteIconSvg} alt="Delete" />}
                          </Button>
                        </HStack>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>

            <Flex justify={{ base: "center", md: "flex-end" }}>
              <Box
                borderRadius="10px"
                p={6}
                maxW={{ base: "100%", md: "500px" }}
                w={{ base: "100%", md: "auto" }}
              >
                <Box overflowX="auto">
                  <Table variant="simple" size={tableSize} fontFamily="DM Sans">
                    <Thead bg="#B79045">
                      <Tr>
                        <Th
                          fontSize={fontSizeSummaryLabel}
                          fontWeight="medium"
                          color="white"
                          textTransform="capitalize"
                          colSpan={2}
                          py={1.5}
                        >
                          Invoice Summary
                        </Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr>
                        <Td
                          fontSize={fontSizeSummaryLabel}
                          color="gray.600"
                          fontWeight="medium"
                          borderColor="#E2E8F0"
                          py={3}
                        >
                          Total Commission Excl. VAT
                        </Td>
                        <Td
                          fontSize={fontSizeSummaryValue}
                          fontWeight="bold"
                          color="gray.800"
                          borderColor="#E2E8F0"
                          py={3}
                          textAlign="right"
                        >
                          {summary.totalCommissionExclVat.toLocaleString(
                            "en-US",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}
                        </Td>
                      </Tr>
                      <Tr>
                        <Td
                          fontSize={fontSizeSummaryLabel}
                          color="gray.600"
                          fontWeight="medium"
                          borderColor="#E2E8F0"
                          py={3}
                        >
                          Total VAT Amount
                        </Td>
                        <Td
                          fontSize={fontSizeSummaryValue}
                          fontWeight="bold"
                          color="gray.800"
                          borderColor="#E2E8F0"
                          py={3}
                          textAlign="right"
                        >
                          {summary.totalVatAmount.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </Td>
                      </Tr>
                      <Tr>
                        <Td
                          fontSize={fontSizeSummaryLabel}
                          color="gray.600"
                          fontWeight="medium"
                          borderColor="#E2E8F0"
                          py={3}
                        >
                          Total Commission Incl. VAT
                        </Td>
                        <Td
                          fontSize={fontSizeSummaryValue}
                          fontWeight="bold"
                          color="gray.800"
                          borderColor="#E2E8F0"
                          py={3}
                          textAlign="right"
                        >
                          {summary.totalCommissionInclVat.toLocaleString(
                            "en-US",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}
                        </Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </Box>
              </Box>
            </Flex>
          </>
        )}
      </Skeleton>

      {/* Modals */}
      <Add
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        fetchData={refetch}
        setAction={() => {}}
        invoiceId={id}
      />
      <Edit
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedId(null);
        }}
        selectedId={selectedId}
        invoiceId={id}
        fetchData={refetch}
        setAction={() => {}}
      />
      <Delete
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedId(null);
        }}
        id={selectedId}
        method="one"
        fetchData={refetch}
        setAction={() => {}}
      />
    </Box>
  );
};

export default AddEntry;
