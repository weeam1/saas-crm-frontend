import React from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Grid,
  GridItem,
  Skeleton,
  Alert,
  AlertIcon,
  Text,
  Flex,
  Textarea,
} from "@chakra-ui/react";
import AppButton from "components/shared/AppButton";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { useFetchItemsQuery } from "api/apiSlice";
import { constant } from "constant";
import { toast } from "react-toastify";

const ViewListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "superAdmin";

  const {
    data: listing,
    isLoading,
    isError,
    isFetching,
  } = useFetchItemsQuery(
    { path: `listing/secondary/${id}` },
    { refetchOnMountOrArgChange: true }
  );

  if (isLoading || isFetching) {
    return (
      <Box p={5}>
        <Skeleton height="40px" mb={4} />
        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
          {Array.from({ length: 12 }).map((_, i) => (
            <GridItem key={i} colSpan={i % 3 === 0 ? 2 : 1}>
              <Skeleton height="40px" />
            </GridItem>
          ))}
        </Grid>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box p={5}>
        <AppButton
          leftIcon={<IoArrowBack />}
          onClick={() => navigate("/listing")}
        >
          Back to Listings
        </AppButton>
        <Alert status="error" mt={4}>
          <AlertIcon />
          You are not authorized to view this listing
        </Alert>
      </Box>
    );
  }

  if (!listing?.data) {
    return (
      <Box p={5}>
        <AppButton
          leftIcon={<IoArrowBack />}
          onClick={() => navigate("/listing")}
        >
          Back to Listings
        </AppButton>
        <Alert status="info" mt={4}>
          <AlertIcon />
          Listing not found.
        </Alert>
      </Box>
    );
  }

  const handleDownloadDocument = async (file) => {
    try {
      if (!file) {
        toast.error("No file specified for download.");
        return;
      }

      const fileURL = `${constant.baseUrl}${file}`;
      const response = await fetch(fileURL, { method: "HEAD" });

      if (!response.ok) {
        toast.error("File not found on the server.");
        return;
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = file.split("/").pop();
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download the file.");
    }
  };

  return (
    <Box>
      <AppButton
        ml="2"
        leftIcon={<IoArrowBack />}
        onClick={() => navigate(-1)}
        mb={4}
      >
        Back
      </AppButton>

      <Grid
        templateColumns="repeat(2, 1fr)"
        gap={10}
        p={5}
        bg={"white"}
        borderRadius={"md"}
        my={5}
        mx={2}
      >
        {/* Project Name */}
        <GridItem colSpan={2}>
          <FormControl>
            <FormLabel fontWeight="bold">Project Name</FormLabel>
            <Input
              value={listing.data?.projectName || "N/A"}
              readOnly
              variant="filled"
              focusBorderColor="brand.500"
            />
          </FormControl>
        </GridItem>

        {/* Unit Type */}
        <GridItem colSpan={1}>
          <FormControl>
            <FormLabel fontWeight="bold">Unit Type</FormLabel>
            <Input
              value={listing.data?.unitType?.name || "N/A"}
              readOnly
              variant="filled"
              focusBorderColor="brand.500"
            />
          </FormControl>
        </GridItem>

        {/* Unit Sub Type */}
        <GridItem colSpan={1}>
          <FormControl>
            <FormLabel fontWeight="bold">Unit Sub Type</FormLabel>
            <Input
              value={listing.data?.unitType?.subType || "N/A"}
              readOnly
              variant="filled"
              focusBorderColor="brand.500"
            />
          </FormControl>
        </GridItem>

        {/* Listing Type */}
        <GridItem colSpan={1}>
          <FormControl>
            <FormLabel fontWeight="bold">Listing Type</FormLabel>
            <Input
              value={listing.data?.listingType?.name || "N/A"}
              readOnly
              variant="filled"
              focusBorderColor="brand.500"
            />
          </FormControl>
        </GridItem>

        {/* Developer */}
        <GridItem colSpan={1}>
          <FormControl>
            <FormLabel fontWeight="bold">Developer</FormLabel>
            <Input
              value={listing.data?.developer?.developer_name || "N/A"}
              readOnly
              variant="filled"
              focusBorderColor="brand.500"
            />
          </FormControl>
        </GridItem>

        {/* Area */}
        <GridItem colSpan={1}>
          <FormControl>
            <FormLabel fontWeight="bold">Area (sqft)</FormLabel>
            <Input
              value={listing.data?.area ? `${listing.data.area} sqft` : "N/A"}
              readOnly
              variant="filled"
              focusBorderColor="brand.500"
            />
          </FormControl>
        </GridItem>

        {/* Price */}
        <GridItem colSpan={1}>
          <FormControl>
            <FormLabel fontWeight="bold">Price</FormLabel>
            <Input
              value={
                listing.data?.price
                  ? `${listing.data.price} ${listing.data.currency || "AED"}`
                  : "N/A"
              }
              readOnly
              variant="filled"
              focusBorderColor="brand.500"
            />
          </FormControl>
        </GridItem>

        {/* Location */}
        <GridItem colSpan={1}>
          <FormControl>
            <FormLabel fontWeight="bold">Location</FormLabel>
            <Input
              value={listing.data?.location || "N/A"}
              readOnly
              variant="filled"
              focusBorderColor="brand.500"
            />
          </FormControl>
        </GridItem>

        {/* Building Age */}
        <GridItem colSpan={1}>
          <FormControl>
            <FormLabel fontWeight="bold">Building Age</FormLabel>
            <Input
              value={
                listing.data?.buildingAge
                  ? `${listing.data.buildingAge} years`
                  : "N/A"
              }
              readOnly
              variant="filled"
              focusBorderColor="brand.500"
            />
          </FormControl>
        </GridItem>
        {/* Owner Name */}
        <GridItem colSpan={1}>
          <FormControl>
            <FormLabel fontWeight="bold">Owner name</FormLabel>
            <Input
              value={listing.data?.ownerName || "N/A"}
              readOnly
              variant="filled"
              focusBorderColor="brand.500"
            />
          </FormControl>
        </GridItem>

        {/* Owner Phone Number */}
        <GridItem colSpan={1}>
          <FormControl>
            <FormLabel fontWeight="bold">Owner Phone Number</FormLabel>
            <Input
              value={listing.data?.ownerPhoneNumber || "N/A"}
              readOnly
              variant="filled"
              focusBorderColor="brand.500"
            />
          </FormControl>
        </GridItem>

        {isAdmin && (
          <>
            {/* Landlord */}
            <GridItem colSpan={1}>
              <FormControl>
                <FormLabel fontWeight="bold">Landlord</FormLabel>
                <Input
                  value={listing.data?.landlord || "N/A"}
                  readOnly
                  variant="filled"
                  focusBorderColor="brand.500"
                />
              </FormControl>
            </GridItem>

            {/* Phone Number */}
            <GridItem colSpan={1}>
              <FormControl>
                <FormLabel fontWeight="bold">Phone Number</FormLabel>
                <Input
                  value={listing.data?.phoneNumber || "N/A"}
                  readOnly
                  variant="filled"
                  focusBorderColor="brand.500"
                />
              </FormControl>
            </GridItem>

            {/* Email */}
            <GridItem colSpan={1}>
              <FormControl>
                <FormLabel fontWeight="bold">Email</FormLabel>
                <Input
                  value={listing.data?.email || "N/A"}
                  readOnly
                  variant="filled"
                  focusBorderColor="brand.500"
                />
              </FormControl>
            </GridItem>
          </>
        )}
        {/* Description */}
        <GridItem colSpan={2}>
          <FormControl>
            <FormLabel fontWeight="bold">Description</FormLabel>
            <Textarea
              name="description"
              value={listing.data?.description}
              placeholder="Enter description"
              focusBorderColor="brand.500"
              height="150px"
              resize="vertical"
              readOnly
              variant="filled"
            />
          </FormControl>
        </GridItem>

        {/* Documents */}
        <GridItem colSpan={2}>
          <FormLabel fontWeight="bold">Documents</FormLabel>
          {listing.data?.documents?.length > 0 ? (
            <Box mt={2}>
              {listing.data.documents.map((doc, index) => {
                const fileName = doc.split("/").pop();
                return (
                  <Flex
                    key={index}
                    align="center"
                    justify="space-between"
                    p={3}
                    mb={2}
                    bg="gray.50"
                    borderRadius="md"
                  >
                    <Text>{fileName}</Text>
                    <AppButton
                      size="sm"
                      onClick={() => handleDownloadDocument(doc)}
                    >
                      Download
                    </AppButton>
                  </Flex>
                );
              })}
            </Box>
          ) : (
            <Text>No documents available</Text>
          )}
        </GridItem>
      </Grid>
    </Box>
  );
};

export default ViewListing;
