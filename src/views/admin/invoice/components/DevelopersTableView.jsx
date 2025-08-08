import { useState } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Flex,
  IconButton,
  Link,
  Button,
  useColorModeValue,
  Avatar,
  useDisclosure,
} from "@chakra-ui/react";
import { FaEdit, FaUser, FaFileInvoice } from "react-icons/fa";
import { format } from "date-fns";
import DataNotFound from "components/notFoundData";
import { buttonStyle } from "utils/btn";
import TableLoading from "components/loading/TableLoading";
import ContactDetailsModal from "./ContactDetailsModal";
import { Link as RouterLink } from "react-router-dom";

const DevelopersTableView = ({
  data,
  columns,
  handleRowClick,
  setEdit,
  setSelectedId,
  setEditData,
  selectedValues,
  handleCheckboxChange,
  isLoading,
  isInitialLoading,
}) => {
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [developerName, setDeveloperName] = useState("");
  const [developerImageUrl, setDeveloperImageUrl] = useState("");

  const borderColor = useColorModeValue("gray.200", "whiteAlpha.300");
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleContactClick = (contacts, developer_name, imageUrl, e) => {
    e?.stopPropagation();
    setSelectedContacts(contacts);
    setDeveloperName(developer_name);
    setDeveloperImageUrl(imageUrl);
    onOpen();
  };

  const capitalizeFirstLetter = (str) => {
    if (!str) return "N/A";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  return (
    <Box
      height="70vh"
      overflowY="auto"
      scrollBehavior="smooth"
      borderRadius="md"
      boxShadow="sm"
      bg="white"
    >
      <Table variant="striped" color="gray.500" mb="24px">
        <Thead
          position="sticky"
          top={0}
          bg="white"
          zIndex={2}
          boxShadow="0px 2px 8px rgba(0, 0, 0, 0.1)"
        >
          <Tr>
            {columns.map((column, index) => (
              <Th key={index} pe="10px" borderColor={borderColor} bg="#EDD199">
                <Flex
                  align="center"
                  justifyContent={column.center ? "center" : "start"}
                  fontSize={{ sm: "14px", lg: "16px" }}
                  color="secondaryGray.900"
                >
                  <span
                    style={{
                      textTransform: "capitalize",
                      marginRight: "8px",
                    }}
                  >
                    {column.Header}
                  </span>
                </Flex>
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {isLoading || isInitialLoading ? (
            <TableLoading columns={columns} length={10} py="4" />
          ) : data?.length === 0 ? (
            <DataNotFound />
          ) : (
            data.map((row, i) => (
              <Tr key={i}>
                {columns.map((column, index) => {
                  let cellData = "";
                  if (column.Header === "Date") {
                    const date = row.createdAt ? new Date(row.createdAt) : null;
                    cellData = (
                      <Flex align="center">
                        {/* <Checkbox
                              colorScheme="brandScheme"
                              isChecked={selectedValues.includes(row._id)}
                              onChange={(e) => handleCheckboxChange(e, row._id)}
                              me="10px"
                            /> */}
                        <Text color="brand.600" fontSize="sm" minW="180px">
                          {date ? format(date, "MMM d, yyyy h:mm a") : "N/A"}
                        </Text>
                      </Flex>
                    );
                  } else if (column.Header === "Developer") {
                    cellData = (
                      <Text
                        fontSize="sm"
                        fontWeight="700"
                        color="blue.500"
                        cursor="pointer"
                        onClick={() => handleRowClick(row._id)}
                        _hover={{ textDecoration: "underline" }}
                      >
                        <Flex align="center" gap={3} mt={1}>
                          <Avatar
                            size="sm"
                            name={row.developer_name}
                            src={row.imageUrl || ""}
                          />
                          <Text
                            fontWeight="bold"
                            fontSize={{ base: "md", md: "lg" }}
                            isTruncated
                            maxW="70%"
                          >
                            {capitalizeFirstLetter(row.developer_name) || "N/A"}
                          </Text>
                        </Flex>
                      </Text>
                    );
                  } else if (column.Header === "Trn") {
                    cellData = (
                      <Text fontSize="sm" fontWeight="700">
                        {row.trn || "-"}
                      </Text>
                    );
                  } else if (column.Header === "Email") {
                    cellData = (
                      <Text
                        fontSize="sm"
                        fontWeight="700"
                        color="blue.500"
                        cursor="pointer"
                        onClick={() => handleRowClick(row._id)}
                        _hover={{ textDecoration: "underline" }}
                      >
                        {row.email || "-"}
                      </Text>
                    );
                  } else if (column.Header === "Agency") {
                    cellData = (
                      <Text fontSize="sm" fontWeight="700">
                        {capitalizeFirstLetter(row.agency?.name) || "N/A"}
                      </Text>
                    );
                  } else if (column.Header === "Address") {
                    cellData = (
                      <Text fontSize="sm" fontWeight="700">
                        {row.address || "N/A"}
                      </Text>
                    );
                  } else if (column.Header === "Country") {
                    cellData = (
                      <Text fontSize="sm" fontWeight="700">
                        {capitalizeFirstLetter(row.country) || "N/A"}
                      </Text>
                    );
                  } else if (column.Header === "Status") {
                    cellData = (
                      <Text color={textColor} fontSize="sm" fontWeight="700">
                        {capitalizeFirstLetter(row.status) || "-"}
                      </Text>
                    );
                  } else if (column.Header === "Contact") {
                    cellData = (
                      <Flex justify="center">
                        <Button
                          {...buttonStyle}
                          leftIcon={<FaUser />}
                          onClick={(e) =>
                            handleContactClick(
                              row.contactDetails,
                              row.developer_name,
                              row.imageUrl,
                              e
                            )
                          }
                          colorScheme="brand"
                          _hover={{ bg: "brand.400" }}
                          _active={{ bg: "brand.400" }}
                        >
                          Contacts
                        </Button>
                      </Flex>
                    );
                  } else if (column.Header === "Action") {
                    cellData = (
                      <Flex justifyContent="center" gap={2}>
                        <Link
                          as={RouterLink}
                          to={`/invoice/developers/invoices/${row?._id}`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button
                            {...buttonStyle}
                            colorScheme="brand"
                            _hover={{ bg: "brand.400" }}
                            _active={{ bg: "brand.400" }}
                          >
                            Invoices
                          </Button>
                        </Link>

                        <IconButton
                          icon={<FaEdit />}
                          size="sm"
                          colorScheme="brand"
                          aria-label="Edit"
                          onClick={() => {
                            setEdit(true);
                            setSelectedId(row._id);
                            setEditData(row);
                          }}
                        />
                      </Flex>
                    );
                  }
                  return (
                    <Td
                      key={index}
                      fontSize={{ sm: "14px" }}
                      minW={{ sm: "150px", md: "200px", lg: "auto" }}
                      borderColor="transparent"
                    >
                      {cellData}
                    </Td>
                  );
                })}
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
      <ContactDetailsModal
        isOpen={isOpen}
        onClose={onClose}
        contacts={selectedContacts}
        developerName={developerName}
        developerImageUrl={developerImageUrl}
      />
    </Box>
  );
};

export default DevelopersTableView;
