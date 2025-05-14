import React, { useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Grid,
  GridItem,
  Box,
  Flex,
} from "@chakra-ui/react";
import { useFetchItemsQuery, useCreateItemMutation } from "api/apiSlice";
import AppButton from "components/shared/AppButton";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AddListing = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    projectName: "",
    unitType: "",
    listingType: "",
    description: "",
    area: "",
    price: "",
    currency: "AED",
    location: "",
    ownerName: "",
    ownerContact: "",
  });

  const [createItemMutation] = useCreateItemMutation();
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const { data: listingStatus } = useFetchItemsQuery(
    { path: `/listing/secondary/statuses` },
    { refetchOnMountOrArgChange: true, skip: !user._id }
  );

  const { data: listingType } = useFetchItemsQuery(
    { path: `/listing/secondary/types` },
    { refetchOnMountOrArgChange: true, skip: !user._id }
  );

  const { data: listingUnitType } = useFetchItemsQuery(
    { path: `/listing/secondary/unit-types` },
    { refetchOnMountOrArgChange: true, skip: !user._id }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createItemMutation({
        path: "/listing/secondary",
        body: formData,
      }).unwrap();

      toast("Listing added successfully.", {
        autoClose: 3000,
      });
      navigate("/listing");
      setFormData({
        projectName: "",
        unitType: "",
        listingType: "",
        description: "",
        area: "",
        price: "",
        currency: "AED",
        location: "",
        ownerName: "",
        ownerContact: "",
      });
    } catch (error) {
      console.error(error);
      toast("Failed to add listing", {
        autoClose: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit}>
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
          <FormControl isRequired>
            <FormLabel>Project Name</FormLabel>
            <Input
              name="projectName"
              value={formData.projectName}
              onChange={handleChange}
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
              value={formData.unitType}
              onChange={handleChange}
              placeholder="Select unit type"
              focusBorderColor="brand.500"
            >
              {listingUnitType?.doc?.map((unitType) => (
                <option key={unitType._id} value={unitType._id}>
                  {unitType.name}
                </option>
              ))}
            </Select>
          </FormControl>
        </GridItem>

        {/* listing Type */}
        <GridItem colSpan={1}>
          <FormControl isRequired>
            <FormLabel>Listing Type</FormLabel>
            <Select
              name="listingType"
              value={formData.listingType}
              onChange={handleChange}
              placeholder="Select listing type"
              focusBorderColor="brand.500"
            >
              {listingType?.doc?.map((type) => (
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
              value={formData.area}
              onChange={handleChange}
              placeholder="Enter area in square feet"
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
              value={formData.price}
              onChange={handleChange}
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
              value={formData.currency}
              onChange={handleChange}
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
              value={formData.location}
              onChange={handleChange}
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
              value={formData.description}
              onChange={handleChange}
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
              value={formData.ownerName}
              onChange={handleChange}
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
              type="number"
              name="ownerContact"
              value={formData.ownerContact}
              onChange={handleChange}
              placeholder="Enter owner contact"
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
              isLoading={isSubmitting}
              loadingText="Submitting"
            >
              Add Listing
            </Button>
          </Flex>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default AddListing;
