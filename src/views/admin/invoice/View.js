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
  VStack,
  Button,
  Skeleton,
  MenuList,
  MenuItem,
  Menu,
  MenuButton,
  Modal,
} from "@chakra-ui/react";
import * as htmlToImage from "html-to-image";
import { jsPDF } from "jspdf";
import { useNavigate, useParams } from "react-router-dom";
import { BiError } from "react-icons/bi";
import { useFetchItemsQuery } from "api/apiSlice";
import { FaChevronDown } from "react-icons/fa";
import convertToWords from "utils/convertToWords";
import EditImg from "../../../assets/img/Invoice/ic_round-edit.svg";
import BackImg from "../../../assets/img/Invoice/Vector.svg";
import Edit from "./Edit";
import Weam from "../../../assets/img/Invoice/weam.png";

const SingleInvoice = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const [edit, setEdit] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [action, setAction] = useState(null);

  const {
    data: invoiceData,
    isLoading: invoiceLoading,
    error: invoiceError,
  } = useFetchItemsQuery({
    path: `/invoices/${id}`,
  });

  const invoices = invoiceData?.data?.entries || [];
  const totals = {
    total_commission_excl_vat: invoices.reduce(
      (sum, entry) => sum + (entry.total_commission_excl_vat || 0),
      0
    ),
    vat_amount: invoices.reduce(
      (sum, entry) => sum + (entry.vat_amount || 0),
      0
    ),
    total_commission_incl_vat: invoiceData?.data?.totalAmount || 0,
  };
  const invoiceNumber = invoiceData?.data?.invoiceNo || "-";
  const developerData = invoiceData?.data?.developer || {};
  const bankAccountData = invoiceData?.data?.bank_account || {};

  const downloadInvoice = () => {
    const invoiceElement = document.getElementById("invoice-pdf");
    htmlToImage
      .toPng(invoiceElement, { quality: 1, pixelRatio: 2 })
      .then((dataUrl) => {
        const pdf = new jsPDF("p", "mm", "a4");
        const imgWidth = 210;
        const imgHeight =
          (invoiceElement.scrollHeight * imgWidth) / invoiceElement.scrollWidth;

        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(dataUrl, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= 297;

        while (heightLeft > 0) {
          position -= 297;
          pdf.addPage();
          pdf.addImage(dataUrl, "PNG", 0, position, imgWidth, imgHeight);
          heightLeft -= 297;
        }

        pdf.save("invoice.pdf");
      })
      .catch((error) => {
        console.error("Error generating PDF: ", error);
      });
  };

  const printInvoice = () => {
    const invoiceElement = document.getElementById("invoice-pdf");
    htmlToImage
      .toPng(invoiceElement, { quality: 1, pixelRatio: 2 })
      .then((dataUrl) => {
        const printWindow = window.open("", "_blank");
        printWindow.document.write(`
          <html>
            <head>
              <title>Print Invoice</title>
              <style>
                body { margin: 0; }
                img { width: 100%; height: auto; }
              </style>
            </head>
            <body>
              <img src="${dataUrl}" onload="window.print(); window.close();" />
            </body>
          </html>
        `);
        printWindow.document.close();
      })
      .catch((error) => {
        console.error("Error preparing print: ", error);
      });
  };

  const handleExport = (option) => {
    if (option === "pdf") {
      downloadInvoice();
    } else if (option === "print") {
      printInvoice();
    }
  };

  if (invoiceError) {
    return (
      <Box
        minH="400px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        p={4}
      >
        <Text
          display="flex"
          alignItems="center"
          color="red"
          fontSize={{ base: "lg", md: "xl", lg: "2xl" }}
          fontFamily="DM Sans"
        >
          <BiError size={25} style={{ marginRight: 5 }} />
          No Invoice Found!
        </Text>
      </Box>
    );
  }

  const isLoading = invoiceLoading;
  const goBack = () => {
    navigate(`/add-entry/${invoiceData?.data?._id}`, {
      state: {
        refetch: true,
      },
    });
  };
  const handleEditClick = () => {
    setEdit(true);
    setSelectedId(id);
    setAction("edit");
  };

  return (
    <Box bg="gray.50" p={{ base: 4, md: 6, lg: 8 }} fontFamily="DM Sans">
      <Flex
        mb={4}
        justifyContent="space-between"
        alignItems="center"
        flexDir={{ base: "column", sm: "row" }}
      >
        <Flex alignItems="center" gap={2}>
          <Button
            variant="ghost"
            onClick={goBack}
            leftIcon={<img src={BackImg} alt="Back" />}
            p={0}
          />
          <Text fontSize="2xl" fontWeight="bold">
            Invoice
          </Text>
          <Text fontSize="lg">#{invoiceNumber}</Text>
        </Flex>

        <Flex gap={2} mt={{ base: 4, sm: 0 }}>
          {/* <Button
            w={{ base: "full", sm: "120px" }}
            h="48px"
            fontWeight="medium"
            fontSize={{ base: "md", lg: "xl" }}
            color="white"
            onClick={handleEditClick}
            colorScheme="brand"
            leftIcon={<img src={EditImg} alt="Edit" />}
          >
            Edit
          </Button> */}

          <Menu>
            <MenuButton
              as={Button}
              w={{ base: "full", sm: "125px" }}
              h="48px"
              fontWeight="medium"
              fontSize={{ base: "md", lg: "xl" }}
              color="white"
              colorScheme="brand"
            >
              Export
            </MenuButton>
            <MenuList fontFamily="DM Sans">
              <MenuItem onClick={() => handleExport("pdf")}>
                Export as PDF
              </MenuItem>
              <MenuItem onClick={() => handleExport("print")}>
                Print Invoice
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>

      <Skeleton isLoaded={!isLoading}>
        <VStack
          id="invoice-pdf"
          bg="white"
          p={{ base: 4, md: 6, lg: 8 }}
          shadow="lg"
          spacing={4}
          align="stretch"
        >
          <Box bg="#B79045" w="full" textAlign="center" p={4} color="white">
            <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="bold">
              Tax Invoice
            </Text>
          </Box>

          <Flex
            justify="space-between"
            w="full"
            mb={4}
            flexDir={{ base: "column", md: "row" }}
            align={{ base: "stretch", md: "flex-start" }}
            gap={4}
          >
            <Box w={{ base: "full", md: "50%" }} gap={3}>
              <img src={Weam} alt="Weam Elnaggar Real Estate" width="200px" />
              {/* <Text
                fontSize={{ base: "md", md: "lg" }}
                fontWeight="bold"
                mb={2}
              >
                WEAM ELNAGGAR REAL ESTATE
              </Text> */}
              <Text fontSize={{ base: "xs", md: "sm" }} mt={4}>
                Office #3102, API World Tower, Sheikh Zayed road, Dubai, UAE
              </Text>
              <Text fontSize={{ base: "xs", md: "sm" }} my={4}>
                Telephone: +971-58-557-7271 | +971-56-115-0747
              </Text>
              <Text fontSize={{ base: "xs", md: "sm" }}>
                <Text as="span" fontWeight="bold">
                  TRN:
                </Text>{" "}
                104271009300003
              </Text>
            </Box>

            <Box w={{ base: "full", md: "30%" }}>
              <Box mb={4}>
                <Text
                  fontSize={{ base: "xs", md: "sm" }}
                  py={1}
                  display="flex"
                  justifyContent="flex-end"
                >
                  <Text
                    as="span"
                    fontWeight="bold"
                    w={{ base: "100px", md: "120px" }}
                  >
                    Invoice Date:
                  </Text>
                  {invoices.length > 0
                    ? new Date(invoices[0].createdAt).toLocaleDateString()
                    : "N/A"}
                </Text>
                <Text
                  fontSize={{ base: "xs", md: "sm" }}
                  py={1}
                  display="flex"
                  justifyContent="flex-end"
                >
                  <Text
                    as="span"
                    fontWeight="bold"
                    w={{ base: "100px", md: "130px" }}
                  >
                    Tax Invoice No:
                  </Text>
                  {invoiceNumber}
                </Text>
              </Box>

              <Box w="full" color="black">
                <Text
                  fontWeight="bold"
                  fontSize={{ base: "sm", md: "md" }}
                  bg="#B79045"
                  color="white"
                  p={2}
                  textAlign="center"
                >
                  Invoiced To
                </Text>
                <Box border="1px solid #eee" p={2} mt={2}>
                  <Text
                    fontSize={{ base: "xs", md: "sm" }}
                    borderBottom="1px solid #eee"
                    py={1}
                    textAlign="left"
                  >
                    {developerData.developer_name || "N/A"}
                  </Text>
                  <Text
                    fontSize={{ base: "xs", md: "sm" }}
                    borderBottom="1px solid #eee"
                    py={1}
                    textAlign="left"
                  >
                    {developerData.address || "-"}
                  </Text>
                  <Text
                    fontSize={{ base: "xs", md: "sm" }}
                    py={1}
                    textAlign="left"
                  >
                    {developerData.trn || "-"}
                  </Text>
                </Box>
                <Text fontSize={{ base: "xs", md: "sm" }}>
                  <Text as="span" fontWeight="bold">
                    TRN:
                  </Text>{" "}
                  {developerData.trn || "-"}
                </Text>
              </Box>
            </Box>
          </Flex>

          <Box overflowX="auto" w="full">
            <Table
              variant="simple"
              size="sm"
              mt={4}
              minWidth={{ base: "800px", md: "100%" }}
            >
              <Thead bg="#B79045">
                <Tr>
                  <Th color="white" fontSize={{ base: "xs", md: "sm" }}>
                    SN
                  </Th>
                  <Th color="white" fontSize={{ base: "xs", md: "sm" }}>
                    Unit No
                  </Th>
                  <Th color="white" fontSize={{ base: "xs", md: "sm" }}>
                    Name of Referring Party
                  </Th>
                  <Th color="white" fontSize={{ base: "xs", md: "sm" }}>
                    Claim Type
                  </Th>
                  <Th color="white" fontSize={{ base: "xs", md: "sm" }}>
                    Commission %
                  </Th>
                  <Th color="white" fontSize={{ base: "xs", md: "sm" }}>
                    Unit Price
                  </Th>
                  <Th color="white" fontSize={{ base: "xs", md: "sm" }}>
                    Total Commission EXCL. VAT
                  </Th>
                  <Th color="white" fontSize={{ base: "xs", md: "sm" }}>
                    VAT %
                  </Th>
                  <Th color="white" fontSize={{ base: "xs", md: "sm" }}>
                    VAT Amount
                  </Th>
                  <Th color="white" fontSize={{ base: "xs", md: "sm" }}>
                    Total Commission incl. VAT
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {invoices.length > 0 ? (
                  invoices.map((invoice, index) => (
                    <Tr key={invoice._id}>
                      <Td textAlign="center" border="1px solid #CDCDCD">
                        {index + 1}
                      </Td>
                      <Td border="1px solid #CDCDCD">
                        {invoice.unit_no || "-"}
                      </Td>
                      <Td border="1px solid #CDCDCD">
                        {invoice.name_of_referring_party || "-"}
                      </Td>
                      <Td textAlign="center" border="1px solid #CDCDCD">
                        {invoice.claim_type || "-"}
                      </Td>
                      <Td
                        textAlign="center"
                        border="1px solid #CDCDCD"
                      >{`${invoice.commission_percentage || 0}%`}</Td>
                      <Td textAlign="right" border="1px solid #CDCDCD">
                        {(invoice.unit_price || 0).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </Td>
                      <Td textAlign="right" border="1px solid #CDCDCD">
                        {(
                          invoice.total_commission_excl_vat || 0
                        ).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </Td>
                      <Td
                        textAlign="center"
                        border="1px solid #CDCDCD"
                      >{`${invoice.vat_percentage || 5}%`}</Td>
                      <Td textAlign="right" border="1px solid #CDCDCD">
                        {(invoice.vat_amount || 0).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </Td>
                      <Td textAlign="right" border="1px solid #CDCDCD">
                        {(
                          invoice.total_commission_incl_vat || 0
                        ).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td
                      colSpan={10}
                      textAlign="center"
                      border="1px solid #CDCDCD"
                    >
                      No data available
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </Box>

          <Flex
            w="full"
            padding={2}
            mb={4}
            border="1px solid #CDCDCD"
            flexDirection="column"
          >
            <Text fontWeight="bold">Total Commission :</Text>
            <Text fontSize={{ base: "sm", md: "md" }} wordBreak="break-word">
              {typeof totals.total_commission_incl_vat === "number"
                ? `${convertToWords(totals.total_commission_incl_vat)}`
                : "N/A"}
            </Text>
          </Flex>

          <Flex
            w="full"
            justify="space-between"
            gap={4}
            flexDir={{ base: "column", lg: "row" }}
          >
            <Box w={{ base: "full", lg: "35%" }} p={4} color="black">
              <Text
                fontWeight="bold"
                mb={2}
                bg="#b79045"
                p={2}
                color="white"
                fontSize={{ base: "sm", md: "md" }}
              >
                Bank Account Details:
              </Text>
              <Text fontSize={{ base: "xs", md: "sm" }}>
                Account Name: {bankAccountData.account_holder_name || "-"}
              </Text>
              <Text fontSize={{ base: "xs", md: "sm" }}>
                Account Number: {bankAccountData.account_number || "-"}
              </Text>
              <Text fontSize={{ base: "xs", md: "sm" }}>
                IBAN: {bankAccountData.iban || "-"}
              </Text>
              <Text fontSize={{ base: "xs", md: "sm" }}>
                Swift Code: {bankAccountData.swift_code || "-"}
              </Text>
              <Text fontSize={{ base: "xs", md: "sm" }}>
                Bank: {bankAccountData.bank_name || "-"}
              </Text>
              <Text fontSize={{ base: "xs", md: "sm" }}>
                Bank Address: {bankAccountData.branch_address || "-"}
              </Text>
            </Box>

            <Box w={{ base: "full", lg: "30%" }} p={4}>
              <Table
                variant="simple"
                size="sm"
                w="full"
                border="1px solid #eee"
              >
                <Thead>
                  <Tr bg="#B79045" color="white">
                    <Th
                      color="white"
                      textAlign="left"
                      py={3}
                      fontSize={{ base: "xs", md: "sm" }}
                    >
                      Invoice Summary
                    </Th>
                    <Th
                      color="white"
                      textAlign="right"
                      py={3}
                      w="40%"
                      fontSize={{ base: "xs", md: "sm" }}
                    >
                      AED
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td
                      border="1px solid #eee"
                      fontSize={{ base: "xs", md: "sm" }}
                    >
                      Total Commission EXCL. VAT
                    </Td>
                    <Td
                      textAlign="right"
                      border="1px solid #eee"
                      fontSize={{ base: "xs", md: "sm" }}
                    >
                      {typeof totals.total_commission_excl_vat === "number"
                        ? totals.total_commission_excl_vat.toLocaleString(
                            "en-US",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )
                        : "N/A"}{" "}
                      AED
                    </Td>
                  </Tr>
                  <Tr>
                    <Td
                      border="1px solid #eee"
                      fontSize={{ base: "xs", md: "sm" }}
                    >
                      VAT Amount
                    </Td>
                    <Td
                      textAlign="right"
                      border="1px solid #eee"
                      fontSize={{ base: "xs", md: "sm" }}
                    >
                      {typeof totals.vat_amount === "number"
                        ? totals.vat_amount.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })
                        : "N/A"}{" "}
                      AED
                    </Td>
                  </Tr>
                  <Tr>
                    <Td
                      fontWeight="bold"
                      border="1px solid #eee"
                      fontSize={{ base: "xs", md: "sm" }}
                    >
                      Total Commission Include VAT
                    </Td>
                    <Td
                      textAlign="right"
                      fontWeight="bold"
                      border="1px solid #eee"
                      fontSize={{ base: "xs", md: "sm" }}
                    >
                      {typeof totals.total_commission_incl_vat === "number"
                        ? totals.total_commission_incl_vat.toLocaleString(
                            "en-US",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )
                        : "N/A"}{" "}
                      AED
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </Box>
          </Flex>
        </VStack>
      </Skeleton>

      {/* <Modal isOpen={edit} size="xl" onClose={() => setEdit(false)}>
        <Edit
          isOpen={edit}
          size="xl"
          onClose={() => setEdit(false)}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          setAction={setAction}
          invoiceData={invoices.length > 0 ? invoices[0] : {}}
        />
      </Modal> */}
    </Box>
  );
};

export default SingleInvoice;
