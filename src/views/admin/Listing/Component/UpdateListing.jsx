import React from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Select,
  Grid,
  GridItem,
  Skeleton,
  Alert,
  AlertIcon,
  Button,
  Flex,
} from "@chakra-ui/react";
import AppButton from "components/shared/AppButton";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { useFetchItemsQuery, useUpdateItemMutation } from "api/apiSlice";
import { useFormik } from "formik";
import { toast } from "react-toastify";

const UpdateListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch data
  const {
    data: listing,
    isLoading,
    isError,
  } = useFetchItemsQuery(
    { path: `listing/secondary/${id}` },
    { refetchOnMountOrArgChange: true }
  );

  const { data: unitTypes } = useFetchItemsQuery(
    { path: `listing/secondary/unit-types` },
    { skip: !id }
  );

  const { data: listingTypes } = useFetchItemsQuery(
    { path: `listing/secondary/types` },
    { skip: !id }
  );

  const [updateListing, { isLoading: isUpdating }] = useUpdateItemMutation();

  // Formik setup
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      projectName: listing?.data?.projectName || "",
      unitType: listing?.data?.unitType?._id || "",
      description: listing?.data?.description || "",
      area: listing?.data?.area || "",
      price: listing?.data?.price || "",
      currency: listing?.data?.currency || "AED",
      listingType: listing?.data?.listingType?._id || "",
      location: listing?.data?.location || "",
      ownerName: listing?.data?.ownerName || "",
      ownerContact: listing?.data?.ownerContact || "",
    },
    onSubmit: async (values) => {
      try {
        await updateListing({
          path: `listing/secondary/${id}`,
          body: values,
        }).unwrap();

        toast.success("Listing updated successfully");
        navigate("/listing");
      } catch (error) {
        console.error("Update error:", error);
        toast.error("Failed to update listing");
      }
    },
  });

  if (isLoading) {
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

  return (
    <Box as="form" onSubmit={formik.handleSubmit}>
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
        gap={6}
        p={6}
        bg="white"
        borderRadius="md"
        boxShadow="sm"
      >
        {/* Project Name */}
        <GridItem colSpan={2}>
          <FormControl isRequired>
            <FormLabel>Project Name</FormLabel>
            <Input
              name="projectName"
              value={formik.values.projectName}
              onChange={formik.handleChange}
              placeholder="Enter project name"
              focusBorderColor="brand.500"
            />
          </FormControl>
        </GridItem>

        {/* Unit Type */}
        <GridItem colSpan={1}>
          <FormControl isRequired>
            <FormLabel>Unit Type</FormLabel>
            <Select
              name="unitType"
              value={formik.values.unitType}
              onChange={formik.handleChange}
              placeholder="Select unit type"
              focusBorderColor="brand.500"
            >
              {unitTypes?.doc?.map((unitType) => (
                <option key={unitType._id} value={unitType._id}>
                  {unitType.name}
                </option>
              ))}
            </Select>
          </FormControl>
        </GridItem>

        {/* Listing Type */}
        <GridItem colSpan={1}>
          <FormControl isRequired>
            <FormLabel>Listing Type</FormLabel>
            <Select
              name="listingType"
              value={formik.values.listingType}
              onChange={formik.handleChange}
              placeholder="Select listing type"
              focusBorderColor="brand.500"
            >
              {listingTypes?.doc?.map((type) => (
                <option key={type._id} value={type._id}>
                  {type.name}
                </option>
              ))}
            </Select>
          </FormControl>
        </GridItem>

        {/* Area */}
        <GridItem colSpan={1}>
          <FormControl isRequired>
            <FormLabel>Area (sqft)</FormLabel>
            <Input
              type="number"
              name="area"
              value={formik.values.area}
              onChange={formik.handleChange}
              placeholder="Enter area"
              focusBorderColor="brand.500"
            />
          </FormControl>
        </GridItem>

        {/* Price */}
        <GridItem colSpan={1}>
          <FormControl isRequired>
            <FormLabel>Price</FormLabel>
            <Input
              type="number"
              name="price"
              value={formik.values.price}
              onChange={formik.handleChange}
              placeholder="Enter price"
              focusBorderColor="brand.500"
            />
          </FormControl>
        </GridItem>

        {/* Currency */}
        <GridItem colSpan={1}>
          <FormControl isRequired>
            <FormLabel>Currency</FormLabel>
            <Select
              name="currency"
              value={formik.values.currency}
              onChange={formik.handleChange}
              focusBorderColor="brand.500"
            >
              <option value="AED">AED</option>
            </Select>
          </FormControl>
        </GridItem>

        {/* Location */}
        <GridItem colSpan={1}>
          <FormControl isRequired>
            <FormLabel>Location</FormLabel>
            <Input
              name="location"
              value={formik.values.location}
              onChange={formik.handleChange}
              placeholder="Enter location"
              focusBorderColor="brand.500"
            />
          </FormControl>
        </GridItem>

        {/* Description */}
        <GridItem colSpan={1}>
          <FormControl>
            <FormLabel>Description</FormLabel>
            <Input
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              placeholder="Enter description"
              focusBorderColor="brand.500"
            />
          </FormControl>
        </GridItem>

        {/* Owner Name */}
        <GridItem colSpan={1}>
          <FormControl>
            <FormLabel>Owner Name</FormLabel>
            <Input
              name="ownerName"
              value={formik.values.ownerName}
              onChange={formik.handleChange}
              placeholder="Enter owner name"
              focusBorderColor="brand.500"
            />
          </FormControl>
        </GridItem>

        {/* Owner Contact */}
        <GridItem colSpan={1}>
          <FormControl>
            <FormLabel>Owner Contact</FormLabel>
            <Input
              name="ownerContact"
              value={formik.values.ownerContact}
              onChange={formik.handleChange}
              placeholder="Enter contact"
              focusBorderColor="brand.500"
            />
          </FormControl>
        </GridItem>

        {/* Submit Button */}
        <GridItem colSpan={2}>
          <Flex justify="flex-end">
            <Button
              type="submit"
              colorScheme="brand"
              isLoading={isUpdating}
              loadingText="Updating..."
            >
              Update Listing
            </Button>
          </Flex>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default UpdateListing;
