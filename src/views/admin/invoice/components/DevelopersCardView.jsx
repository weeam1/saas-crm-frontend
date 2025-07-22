import {
  Grid,
  Box,
  Text,
  Flex,
  IconButton,
  Link,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaEdit, FaFileInvoice } from "react-icons/fa";
import { format } from "date-fns";
import { Link as RouterLink } from "react-router-dom";
import DataNotFound from "components/notFoundData";
import DevelopersCardLoading from "./DevelopersCardLoading";

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

  if (isLoading || isInitialLoading) {
    return <DevelopersCardLoading />;
  }

  if (data?.length === 0) {
    return <DataNotFound />;
  }

  return (
    <Grid
      sx={{
        width: "100%",
        gap: 3,
        marginTop: { base: 4, md: 6 },
        justifyItems: "center",
        // >= 0px
        "@media (min-width: 0px)": {
          gridTemplateColumns: "1fr",
        },
        // >= 600px
        "@media (min-width: 600px)": {
          gridTemplateColumns: "repeat(2, 1fr)",
        },
        // >= 1040px
        "@media (min-width: 1040px)": {
          gridTemplateColumns: "repeat(3, 1fr)",
        },
        // >= 1564px
        "@media (min-width: 1564px)": {
          gridTemplateColumns: "repeat(4, 1fr)",
        },
        // >= 2120px
        "@media (min-width: 2120px)": {
          gridTemplateColumns: "repeat(5, 1fr)",
        },
        // >= 2560px
        "@media (min-width: 2560px)": {
          gridTemplateColumns: "repeat(6, 1fr)",
        },
        // >= 3840px
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
            bg="brand.100"
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
            <Box onClick={() => handleRowClick(developer._id)} cursor="pointer">
              <Text
                fontWeight="bold"
                fontSize={{ base: "md", md: "lg" }}
                color={headingColor}
                isTruncated
                maxW="70%"
                mt={2}
              >
                {developer.developer_name || "N/A"}
              </Text>

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
                    {developer.country || "N/A"}
                  </Text>
                </Flex>
              </Flex>

              <Text fontSize="xs" color="gray.500" mt={3} fontStyle="italic">
                Created:{" "}
                {developer.createdAt
                  ? format(new Date(developer.createdAt), "MMM d, yyyy h:mm a")
                  : "N/A"}
              </Text>
            </Box>

          <Flex justify="flex-end" mt={4} gap={2}>
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
          </Box>
        </Box>
      ))}
    </Grid>
  );
};

export default DevelopersCardView;