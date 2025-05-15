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
      </Grid>
    </Box>
  );
};

export default ViewListing;
