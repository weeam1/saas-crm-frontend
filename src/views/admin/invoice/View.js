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
} from "@chakra-ui/react";
import * as htmlToImage from "html-to-image";
import { jsPDF } from "jspdf";
import { useParams } from "react-router-dom";
import { BiError } from "react-icons/bi";
import { useFetchItemsQuery } from "api/apiSlice";

const SingleInvoice = () => {
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const [bankAccountId, setBankAccountId] = useState(null);
  const [developerId, setDeveloperId] = useState(null);

  // Fetch invoice data
  const {
    data: invoiceData,
    isLoading: invoiceLoading,
    error: invoiceError,
  } = useFetchItemsQuery({
    path: `/invoice/get/${user?._id}/${id}`,
  });

  // Fetch bank account data
  const {
    data: bankAccountData,
    isLoading: bankLoading,
    error: bankError,
  } = useFetchItemsQuery(
    {
      path: `/bankAccount/get/${bankAccountId}`,
    },
    {
      skip: !bankAccountId || bankAccountId === null,
    }
  );

  // Fetch developer data
  const {
    data: developerData,
    isLoading: developerLoading,
    error: developerError,
  } = useFetchItemsQuery(
    {
      path: `/developer/get/${developerId}`,
    },
    {
      skip: !developerId || developerId === null,
    }
  );

  useEffect(() => {
    if (invoiceData?.data) {
      console.log("Invoice Data:", invoiceData.data);
      const bankId =
        typeof invoiceData.data.bank_account_id === "object"
          ? invoiceData.data.bank_account_id?._id
          : invoiceData.data.bank_account_id;
      const devId =
        typeof invoiceData.data.developer_id === "object"
          ? invoiceData.data.developer_id?._id
          : invoiceData.data.developer_id;
      setBankAccountId(bankId || null);
      setDeveloperId(devId || null);
    }
  }, [invoiceData]);

  useEffect(() => {
    console.log("Bank Account Path:", `/bankAccount/get/${bankAccountId}`);
    console.log("Developer Path:", `/developer/get/${developerId}`);
  }, [bankAccountId, developerId]);

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

  if (invoiceError || bankError || developerError) {
    return (
      <Box
        height={400}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
      >
        <Text
          display={"flex"}
          alignItems={"center"}
          color={"red"}
          fontSize={24}
        >
          <BiError size={25} style={{ marginRight: 5 }} />
          No Invoice Found!
        </Text>
      </Box>
    );
  }

  const isLoading = invoiceLoading || bankLoading || developerLoading;

  const invoice = invoiceData?.data || {};
  const unitNo = invoice.unit_no || "-";
  const nameOfReferringParty = invoice.name_of_referring_party || "-";
  const claimType = invoice.claim_type || "-";
  const commissionPercentage =
    invoice.commission_percentage || invoice.commission || 0;
  const unitPrice = invoice.unit_price || 0;
  const totalCommissionExclVat =
    invoice.total_commission_excl_vat ||
    unitPrice * (commissionPercentage / 100);
  const vatPercentage = invoice.vat_percentage || 5;
  const vatAmount =
    invoice.vat_amount || totalCommissionExclVat * (vatPercentage / 100);
  const totalCommissionInclVat =
    invoice.total_commission_incl_vat || totalCommissionExclVat + vatAmount;

  return (
    <Box bg="gray.50" p={8}>
      <Flex mb={4} justifyContent={"flex-end"}>
        <Button onClick={downloadInvoice} colorScheme="brand" size="sm">
          Download PDF
        </Button>
      </Flex>

      <Skeleton isLoaded={!isLoading}>
        <VStack id="invoice-pdf" bg="white" p={8} shadow="lg">
          <Box bg="#B79045" w="100%" textAlign="center" p={4} color="white">
            <Text fontSize="xl" fontWeight="bold">
              Tax Invoice
            </Text>
          </Box>

          <Flex justify="space-between" w="100%">
            <Box>
              <svg
                width="150"
                height="150"
                viewBox="0 0 511 405"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* SVG Paths omitted for brevity */}
              </svg>
              <Text fontSize="lg" fontWeight="bold" mb={2}>
                WEAM ELNAGGAR REAL ESTATE
              </Text>
              <Text>
                Office #3102, API World Tower, Sheikh Zayed road, Dubai, UAE
              </Text>
              <Text>Telephone: +971-58-557-7271 | +971-56-115-0747</Text>
              <Text>TRN: 104271009300003</Text>
            </Box>
            <Box textAlign="right">
              <Text fontWeight="bold">Invoice Date:</Text>
              <Text>
                {new Date(invoice.created_at).toLocaleDateString() || "N/A"}
              </Text>
              <Text fontWeight="bold" mt={2}>
                Tax Invoice No:
              </Text>
              <Text>{invoice.invoice_number || "N/A"}</Text>
            </Box>
          </Flex>

          <Box
            border={"1px solid #eee"}
            my={"20px"}
            w="100%"
            p={4}
            color="black"
          >
            <Text fontWeight="bold">Invoiced To</Text>
            <Text>{developerData?.data?.developer_name || "N/A"}</Text>
            <Text>{developerData?.data?.address || "-"}</Text>
            <Text>TRN: {developerData?.data?.trn || "-"}</Text>
          </Box>

          <Table variant="simple" size="sm" mt={4}>
            <Thead color={"white"} bg={"#B79045"}>
              <Tr>
                <Th color={"white"}>SN</Th>
                <Th color={"white"}>Unit No</Th>
                <Th color={"white"}>Name of Referring Party</Th>
                <Th color={"white"}>Claim Type</Th>
                <Th color={"white"}>Commission %</Th>
                <Th color={"white"}>Unit Price</Th>
                <Th color={"white"}>Total Commission EXCL. VAT</Th>
                <Th color={"white"}>VAT %</Th>
                <Th color={"white"}>VAT Amount</Th>
                <Th color={"white"}>Total Commission incl. VAT</Th>
              </Tr>
            </Thead>
            <Tbody>
              {invoiceData?.data ? (
                <Tr>
                  <Td textAlign="center">1</Td>
                  <Td>{unitNo}</Td>
                  <Td>{nameOfReferringParty}</Td>
                  <Td textAlign="center">{claimType}</Td>
                  <Td textAlign="center">{`${commissionPercentage}%`}</Td>
                  <Td textAlign="right">
                    {unitPrice.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </Td>
                  <Td textAlign="right">
                    {totalCommissionExclVat.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </Td>
                  <Td textAlign="center">{`${vatPercentage}%`}</Td>
                  <Td textAlign="right">
                    {vatAmount.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </Td>
                  <Td textAlign="right">
                    {totalCommissionInclVat.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </Td>
                </Tr>
              ) : (
                <Tr>
                  <Td colSpan={10} textAlign="center">
                    No data available
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>

          <Flex
            justify="space-between"
            w="100%"
            bg={"#B79045"}
            color={"white"}
            padding={2}
            mb={4}
          >
            <Text fontWeight="bold">Total Commission :</Text>
            <Text>
              {typeof totalCommissionInclVat === "number"
                ? totalCommissionInclVat.toLocaleString("en-US", {
                    style: "currency",
                    currency: "AED",
                  })
                : "N/A"}
            </Text>
          </Flex>

          <Box border={"1px solid #eee"} w="100%" p={4} color="black">
            <Text fontWeight="bold">Bank Account Details:</Text>
            <Text>
              Account Name: {bankAccountData?.data?.account_holder_name || "-"}
            </Text>
            <Text>
              Account Number: {bankAccountData?.data?.account_number || "-"}
            </Text>
            <Text>IBAN: {bankAccountData?.data?.iban || "-"}</Text>
            <Text>Swift Code: {bankAccountData?.data?.swift_code || "-"}</Text>
            <Text>Bank: {bankAccountData?.data?.bank_name || "-"}</Text>
            <Text>
              Bank Address: {bankAccountData?.data?.branch_address || "-"}
            </Text>
          </Box>

          <Box
            textAlign="right"
            w="100%"
            p={4}
            borderTop="1px"
            borderColor="gray.200"
          >
            <Text mb={2}>
              <Text as="span" fontWeight="bold">
                Total Commission EXCL. VAT:
              </Text>{" "}
              {typeof totalCommissionExclVat === "number"
                ? totalCommissionExclVat.toLocaleString("en-US", {
                    style: "currency",
                    currency: "AED",
                  })
                : "N/A"}
            </Text>
            <Text mb={2}>
              <Text as="span" fontWeight="bold">
                VAT Amount:
              </Text>{" "}
              {typeof vatAmount === "number"
                ? vatAmount.toLocaleString("en-US", {
                    style: "currency",
                    currency: "AED",
                  })
                : "N/A"}
            </Text>
            <Text fontWeight="bold">
              <Text as="span" fontWeight="bold">
                Total Commission Include VAT:
              </Text>{" "}
              {typeof totalCommissionInclVat === "number"
                ? totalCommissionInclVat.toLocaleString("en-US", {
                    style: "currency",
                    currency: "AED",
                  })
                : "N/A"}
            </Text>
          </Box>
        </VStack>
      </Skeleton>
    </Box>
  );
};

export default SingleInvoice;
