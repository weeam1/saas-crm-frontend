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
          {Array.from({ length: 10 }).map((_, i) => (
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
          Failed to load listing data. Please try again.
        </Alert>
      </Box>
    );
  }

  if (!listing) {
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

  const handleDownloading = async (file) => {
    try {
      if (!file) {
        toast.error("No file specified for download.");
        return;
      }

      const fileURL = `${constant.baseUrl}${file}`;

      // Check if file exists first
      const response = await fetch(fileURL, { method: "HEAD" });
      if (!response.ok) {
        toast.error("File not found on the server.");
        return;
      }

      // Create a hidden anchor to trigger download
      const link = document.createElement("a");
      link.href = fileURL;
      link.download = fileURL.split("/").pop();
      link.style.display = "none";

      // Append, trigger click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Download started...");
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
        onClick={() => navigate("/listing")}
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
            />
          </FormControl>
        </GridItem>

        {/* Area */}
        <GridItem colSpan={1}>
          <FormControl>
            <FormLabel fontWeight="bold">Area (sqft)</FormLabel>
            <Input
              value={listing.data?.area || "N/A"}
              readOnly
              variant="filled"
            />
          </FormControl>
        </GridItem>

        {/* Price */}
        <GridItem colSpan={1}>
          <FormControl>
            <FormLabel fontWeight="bold">Price</FormLabel>
            <Input
              value={`${listing.data?.price || "N/A"} ${listing.doc?.currency || ""}`}
              readOnly
              variant="filled"
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
            />
          </FormControl>
        </GridItem>

        {/* Description */}
        <GridItem colSpan={1}>
          <FormControl>
            <FormLabel fontWeight="bold">Description</FormLabel>
            <Input
              value={listing.data?.description || "N/A"}
              readOnly
              variant="filled"
            />
          </FormControl>
        </GridItem>

        {/* Owner Name */}
        <GridItem colSpan={1}>
          <FormControl>
            <FormLabel fontWeight="bold">Owner Name</FormLabel>
            <Input
              value={listing.data?.ownerName || "N/A"}
              readOnly
              variant="filled"
            />
          </FormControl>
        </GridItem>

        {/* Owner Contact */}
        <GridItem colSpan={1}>
          <FormControl>
            <FormLabel fontWeight="bold">Owner Contact</FormLabel>
            <Input
              value={listing.data?.ownerContact || "N/A"}
              readOnly
              variant="filled"
            />
          </FormControl>
        </GridItem>
        {/* Documents */}
        <GridItem colSpan={2}>
          <FormLabel fontWeight="bold">Documents</FormLabel>
          <Box display="flex" flexDirection="column" gap={3}>
            {listing.data?.documents?.length > 0 ? (
              listing.data.documents.map((doc, index) => {
                const fileName = doc.split("/").pop();
                return (
                  <Box
                    key={index}
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    border="1px solid #E2E8F0"
                    borderRadius="md"
                    px={4}
                    py={2}
                    bg="gray.50"
                  >
                    <Box display="flex" alignItems="center" gap={2}>
                      <Box as="span" color="blue.500" fontSize="lg">
                        📁
                      </Box>
                      <Box fontWeight="medium">{fileName}</Box>
                    </Box>
                    <a
                      onClick={(e) => {
                        e.preventDefault()
                        handleDownloading(doc);
                      }}
                    >
                      <AppButton
                        type="button"
                        size="sm"
                        variant="outline"
                        colorScheme="brand"
                      >
                        Download
                      </AppButton>
                    </a>
                  </Box>
                );
              })
            ) : (
              <Box>No documents available.</Box>
            )}
          </Box>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default ViewListing;
