import React, { useState, useEffect } from "react";
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
  Textarea,
} from "@chakra-ui/react";
import { useFetchItemsQuery, useCreateItemMutation } from "api/apiSlice";
import AppButton from "components/shared/AppButton";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import FileUpload from "./SubComponent/FileUpload";

const AddListing = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState([]);
  const [unitTypes, setUnitTypes] = useState([]);
  const [selectedUnitType, setSelectedUnitType] = useState(null);
  const [formData, setFormData] = useState({
    projectName: "",
    unitType: "",
    listingType: "",
    description: "",
    area: "",
    price: "",
    currency: "AED",
    location: "",
    landlord: "",
    phoneNumber: "",
    email: "",
    buildingAge: "",
    developer: "",
    documents: [],
  });

  const [createItemMutation] = useCreateItemMutation();
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const { data: listingType } = useFetchItemsQuery(
    { path: `/listing/secondary/types` },
    { refetchOnMountOrArgChange: true, skip: !user._id }
  );

  const { data: listingUnitType } = useFetchItemsQuery(
    { path: `/listing/secondary/unit-types` },
    { refetchOnMountOrArgChange: true, skip: !user._id }
  );

  const { data: developers } = useFetchItemsQuery(
    { path: `/developer/get` },
    { refetchOnMountOrArgChange: true, skip: !user._id }
  );

  useEffect(() => {
    if (listingUnitType?.doc) {
      setUnitTypes(listingUnitType.doc);
    }
  }, [listingUnitType]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUnitTypeChange = (e) => {
    const unitTypeId = e.target.value;
    const selected = unitTypes.find((type) => type._id === unitTypeId);
    setSelectedUnitType(selected);
    setFormData((prev) => ({ ...prev, unitType: unitTypeId }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      ...formData,
      documents: [...files],
      agent: user._id,
      createdBy: user._id,
      agency: user.agency,
    };

    try {
      await createItemMutation({
        path: "/listing/secondary",
        body: payload,
      }).unwrap();

      toast.success("Listing added successfully");
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
        landlord: "",
        phoneNumber: "",
        email: "",
        buildingAge: "",
        developer: "",
        documents: [],
      });
      setSelectedUnitType(null);
    } catch (error) {
      console.error(error);
      toast.error(error.data?.message || "Failed to add listing");
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
              onChange={handleUnitTypeChange}
              placeholder="Select unit type"
              focusBorderColor="brand.500"
            >
              {unitTypes.map((unitType) => (
                <option key={unitType._id} value={unitType._id}>
                  {unitType.name}
                </option>
              ))}
            </Select>
          </FormControl>
        </GridItem>

        {/* Unit Sub Type (Display only) */}
        <GridItem colSpan={1}>
          <FormControl>
            <FormLabel>Unit Sub Type</FormLabel>
            <Input
              value={selectedUnitType?.subType || ""}
              isReadOnly
              placeholder="Sub type "
              focusBorderColor="brand.500"
            />
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

        {/* Developer */}
        <GridItem colSpan={1}>
          <FormControl>
            <FormLabel>Developer</FormLabel>
            <Select
              name="developer"
              value={formData.developer}
              onChange={handleChange}
              placeholder="Select developer"
              focusBorderColor="brand.500"
            >
              {developers?.doc?.map((dev) => (
                <option key={dev._id} value={dev._id}>
                  {dev.developer_name}
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
              min="0"
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

        {/* Building Age */}
        <GridItem colSpan={1}>
          <FormControl>
            <FormLabel>Building Age (years)</FormLabel>
            <Input
              type="number"
              name="buildingAge"
              value={formData.buildingAge}
              onChange={handleChange}
              placeholder="Enter building age"
              focusBorderColor="brand.500"
              min="0"
            />
          </FormControl>
        </GridItem>

        {/* Landlord */}
        <GridItem colSpan={1}>
          <FormControl>
            <FormLabel>Landlord</FormLabel>
            <Input
              name="landlord"
              value={formData.landlord}
              onChange={handleChange}
              placeholder="Enter landlord name"
              focusBorderColor="brand.500"
            />
          </FormControl>
        </GridItem>

        {/* Phone Number */}
        <GridItem colSpan={1}>
          <FormControl>
            <FormLabel>Phone Number</FormLabel>
            <Input
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Enter phone number"
              focusBorderColor="brand.500"
            />
          </FormControl>
        </GridItem>

        {/* Email */}
        <GridItem colSpan={1}>
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              focusBorderColor="brand.500"
            />
          </FormControl>
        </GridItem>
        {/* Description */}
        <GridItem colSpan={2}>
          <FormControl>
            <FormLabel>Description</FormLabel>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter description"
              focusBorderColor="brand.500"
              height="150px"
              resize="vertical"
            />
          </FormControl>
        </GridItem>
        {/* Document Upload */}
        <GridItem colSpan={2}>
          <FormControl>
            <FormLabel>Document Upload</FormLabel>
            <FileUpload files={files} setFiles={setFiles} />
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
