import { useState } from "react";
import {
  Grid,
  Box,
  Text,
  Flex,
  IconButton,
  Link,
  useColorModeValue,
  Avatar,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { FaEdit, FaFileInvoice, FaUser } from "react-icons/fa";
import { format } from "date-fns";
import { Link as RouterLink } from "react-router-dom";
import DataNotFound from "components/notFoundData";
import DevelopersCardLoading from "./DevelopersCardLoading";
import ContactDetailsModal from "./ContactDetailsModal";
import { buttonStyle } from "utils/btn";

const DevelopersCardView = ({
  data,
  handleRowClick,
  setEdit,
  setSelectedId,
  setEditData,
  selectedValues,
  handleCheckboxChange,
  isLoading,
  isInitialLoading,
}) => {
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const hoverBorder = useColorModeValue("brand.300", "brand.200");
  const textColor = useColorModeValue("gray.600", "gray.200");
  const headingColor = useColorModeValue("brand.600", "brand.200");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [developerName, setDeveloperName] = useState("");
  const [developerImageUrl, setDeveloperImageUrl] = useState("");

  const handleContactClick = (contacts, developer_name, imageUrl, e) => {
    e.stopPropagation();
    setSelectedContacts(contacts);
    setDeveloperName(developer_name);
    setDeveloperImageUrl(imageUrl);
    onOpen();
  };

  if (isLoading || isInitialLoading) {
    return <DevelopersCardLoading />;
  }

  if (data?.length === 0) {
    return <DataNotFound />;
  }

  const capitalizeFirstLetter = (str) => {
    if (!str) return "N/A";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };
  return (
    <>
      <Grid
        sx={{
          width: "100%",
          gap: 3,
          marginTop: { base: 4, md: 6 },
          justifyItems: "center",
          "@media (min-width: 0px)": {
            gridTemplateColumns: "1fr",
          },
          "@media (min-width: 600px)": {
            gridTemplateColumns: "repeat(2, 1fr)",
          },
          "@media (min-width: 1040px)": {
            gridTemplateColumns: "repeat(3, 1fr)",
          },
          "@media (min-width: 1564px)": {
            gridTemplateColumns: "repeat(4, 1fr)",
          },
          "@media (min-width: 2120px)": {
            gridTemplateColumns: "repeat(5, 1fr)",
          },
          "@media (min-width: 2560px)": {
            gridTemplateColumns: "repeat(6, 1fr)",
          },
          "@media (min-width: 3840px)": {
            gridTemplateColumns: "repeat(7, 1fr)",
          },
        }}
      >
        {data.map((developer) => (
          <Box key={developer._id} minWidth="240px" width="100%">
            <Box
              p={{ base: 3, md: 5 }}
              borderWidth="1px"
              borderRadius="lg"
              boxShadow="md"
              bg="white"
              borderColor={borderColor}
              position="relative"
              transition="all 0.2s"
              _hover={{
                borderColor: hoverBorder,
                transform: "translateY(-2px)",
                boxShadow: "lg",
              }}
              minHeight={{ base: "220px", md: "260px" }}
            >
              <Box
                onClick={() => handleRowClick(developer._id)}
                cursor="pointer"
              >
                <Flex align="center" gap={3} mt={1}>
                  <Avatar
                    size="sm"
                    name={developer.developer_name}
                    src={developer.imageUrl || ""}
                  />
                  <Text
                    fontWeight="bold"
                    fontSize={{ base: "md", md: "lg" }}
                    color={headingColor}
                    isTruncated
                    maxW="70%"
                  >
                    {capitalizeFirstLetter(developer.developer_name) || "N/A"}
                  </Text>
                </Flex>

                <Flex direction="column" gap={2} mt={3}>
                  <Flex align="center">
                    <Text fontSize="sm" fontWeight="600" minW="70px">
                      TRN:
                    </Text>
                    <Text fontSize="sm" color={textColor} isTruncated>
                      {developer.trn || "N/A"}
                    </Text>
                  </Flex>

                  <Flex align="center">
                    <Text fontSize="sm" fontWeight="600" minW="70px">
                      Email:
                    </Text>
                    <Text fontSize="sm" color={textColor} isTruncated>
                      {developer.email || "N/A"}
                    </Text>
                  </Flex>

                  <Flex align="center">
                    <Text fontSize="sm" fontWeight="600" minW="70px">
                      Address:
                    </Text>
                    <Text fontSize="sm" color={textColor} isTruncated>
                      {developer.address || "N/A"}
                    </Text>
                  </Flex>

                  <Flex align="center">
                    <Text fontSize="sm" fontWeight="600" minW="70px">
                      Country:
                    </Text>
                    <Text fontSize="sm" color={textColor} isTruncated>
                      {capitalizeFirstLetter(developer.country) || "N/A"}
                    </Text>
                  </Flex>
                  <Flex align="center">
                    <Text fontSize="sm" fontWeight="600" minW="70px">
                      Phone Number:
                    </Text>
                    <Text fontSize="sm" color={textColor} isTruncated>
                      {developer.phoneNumber || "N/A"}
                    </Text>
                  </Flex>
                </Flex>

                <Text fontSize="xs" color="gray.500" mt={3} fontStyle="italic">
                  Created:{" "}
                  {developer.createdAt
                    ? format(
                        new Date(developer.createdAt),
                        "MMM d, yyyy h:mm a"
                      )
                    : "N/A"}
                </Text>

                <Flex justify="space-between" mt={4}>
                  <Flex gap={2}>
                    <Link
                      as={RouterLink}
                      to={`/invoice/developers/invoices/${developer._id}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <IconButton
                        icon={<FaFileInvoice />}
                        size="sm"
                        aria-label="View Invoices"
                        colorScheme="brand"
                        variant="outline"
                      />
                    </Link>
                    <IconButton
                      icon={<FaEdit />}
                      size="sm"
                      aria-label="Edit Developer"
                      colorScheme="brand"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEdit(true);
                        setSelectedId(developer._id);
                        setEditData(developer);
                      }}
                    />
                  </Flex>
                  <Button
                    size="sm"
                    leftIcon={<FaUser />}
                    onClick={(e) =>
                      handleContactClick(
                        developer.contactDetails,
                        developer.developer_name,
                        developer.imageUrl,
                        e
                      )
                    }
                    {...buttonStyle}
                    colorScheme="brand"
                    _hover={{ bg: "brand.400" }}
                    _active={{ bg: "brand.400" }}
                  >
                    Contacts
                  </Button>
                </Flex>
              </Box>
            </Box>
          </Box>
        ))}
      </Grid>
      <ContactDetailsModal
        isOpen={isOpen}
        onClose={onClose}
        contacts={selectedContacts}
        developerName={developerName}
        developerImageUrl={developerImageUrl}
      />
    </>
  );
};

export default DevelopersCardView;
