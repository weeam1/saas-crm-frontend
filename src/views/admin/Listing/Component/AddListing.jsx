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
  FormErrorMessage,
  Text,
} from "@chakra-ui/react";
import { useFetchItemsQuery, useCreateItemMutation } from "api/apiSlice";
import AppButton from "components/shared/AppButton";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import FileUpload from "./SubComponent/FileUpload";
import { useFormik } from "formik";
import * as Yup from "yup";
import { skipToken } from '@reduxjs/toolkit/query';

const validationSchema = Yup.object().shape({
  projectName: Yup.string().required("Project Name is required"),
  unitType: Yup.string().required("Unit Type is required"),
  listingType: Yup.string().required("Listing Type is required"),
  description: Yup.string().required("Description is required"),
  area: Yup.number()
    .typeError("Area must be a number")
    .positive("Area must be greater than 0")
    .required("Area is required"),
  price: Yup.number()
    .typeError("Price must be a number")
    .positive("Price must be greater than 0")
    .required("Price is required"),
  currency: Yup.string().required("Currency is required"),
  location: Yup.string().required("Location is required"),
  landlord: Yup.string().required("Landlord name is required"),
  phoneNumber: Yup.string().required("Phone number is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  buildingAge: Yup.number()
    .typeError("Building age must be a number")
    .min(0, "Building age cannot be negative")
    .required("Building age is required"),
  developer: Yup.string().required("Developer is required"),
  ownerName: Yup.string().required("Owner name is required"),
  ownerPhoneNumber: Yup.string().required("Owner Phone number is required"),
  subUnitType: Yup.string().when('$isSubUnitTypeRequired', {
    is: true,
    then: (schema) => schema.required('Sub Unit Type is required'),
    otherwise: (schema) => schema.notRequired(),
  }),
});

const AddListing = () => {
  const [files, setFiles] = useState([]);
  const [unitTypes, setUnitTypes] = useState([]);
  const [selectedUnitType, setSelectedUnitType] = useState(null);
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

  // Only call sub unit type API when a unit type is selected
  const { data: listingSubUnitType } = useFetchItemsQuery(
    selectedUnitType
      ? { path: `/listing/secondary/unit-types/sub-category/${selectedUnitType._id}` }
      : skipToken,
    { refetchOnMountOrArgChange: true, skip: !user._id || !selectedUnitType }
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

  const formik = useFormik({
    initialValues: {
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
      ownerName: "",
      ownerPhoneNumber: "",
      subUnitType: "",
    },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    validationContext: {
      isSubUnitTypeRequired: !!listingSubUnitType?.doc?.length,
    },
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const payload = {
          ...values,
          documents: [...files],
          agent: user._id,
          createdBy: user._id,
          agency: user.agency,
        };

        await createItemMutation({
          path: "/listing/secondary",
          body: payload,
        }).unwrap();

        toast.success("Listing added successfully");
        navigate(-1);
        resetForm();
        setSelectedUnitType(null);
        setFiles([]);
      } catch (error) {
        console.error(error);
        toast.error(error.data?.message || "Failed to add listing");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const [createItemMutation] = useCreateItemMutation();

  const handleUnitTypeChange = (e) => {
    const unitTypeId = e.target.value;
    const selected = unitTypes.find((type) => type._id === unitTypeId);
    setSelectedUnitType(selected);
    formik.setFieldValue("unitType", unitTypeId);
    formik.setFieldValue("subUnitType", ""); // Reset subUnitType when unitType changes
  };

  return (
    <Box as="form" onSubmit={formik.handleSubmit}>
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
        gap={6}
        p={5}
        bg="white"
        borderRadius="md"
        my={5}
        mx={2}
      >
        {/* Project Name */}
        <GridItem colSpan={2}>
          <FormControl
            isInvalid={formik.touched.projectName && formik.errors.projectName}
          >
            <FormLabel>Project Name</FormLabel>
            <Input
              name="projectName"
              value={formik.values.projectName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter project name"
              focusBorderColor="brand.500"
            />
            <FormErrorMessage>{formik.errors.projectName}</FormErrorMessage>
          </FormControl>
        </GridItem>

        {/* Unit Type */}
        <GridItem colSpan={1}>
          <FormControl
            isInvalid={formik.touched.unitType && formik.errors.unitType}
          >
            <FormLabel>Unit Type</FormLabel>
            <Select
              name="unitType"
              value={formik.values.unitType}
              onChange={handleUnitTypeChange}
              onBlur={formik.handleBlur}
              placeholder="Select unit type"
              focusBorderColor="brand.500"
            >
              {unitTypes.map((unitType) => (
                <option key={unitType._id} value={unitType._id}>
                  {unitType.name}
                </option>
              ))}
            </Select>
            <FormErrorMessage>{formik.errors.unitType}</FormErrorMessage>
          </FormControl>
        </GridItem>

        {/* Sub Unit Type (Conditional) */}
        {listingSubUnitType?.doc?.length > 0 && (
          <GridItem colSpan={1}>
            <FormControl
              isInvalid={formik.touched.subUnitType && formik.errors.subUnitType}
            >
              <FormLabel>Sub Unit Type</FormLabel>
              <Select
                name="subUnitType"
                value={formik.values.subUnitType}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Select sub unit type"
                focusBorderColor="brand.500"
              >
                {listingSubUnitType.doc.map((sub) => (
                  <option key={sub._id} value={sub._id}>
                    {sub.name}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{formik.errors.subUnitType}</FormErrorMessage>
            </FormControl>
          </GridItem>
        )}

        {/* Listing Type */}
        <GridItem colSpan={1}>
          <FormControl
            isInvalid={formik.touched.listingType && formik.errors.listingType}
          >
            <FormLabel>Listing Type</FormLabel>
            <Select
              name="listingType"
              value={formik.values.listingType}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Select listing type"
              focusBorderColor="brand.500"
            >
              {listingType?.doc?.map((type) => (
                <option key={type._id} value={type._id}>
                  {type.name}
                </option>
              ))}
            </Select>
            <FormErrorMessage>{formik.errors.listingType}</FormErrorMessage>
          </FormControl>
        </GridItem>

        {/* Developer */}
        <GridItem colSpan={1}>
          <FormControl
            isInvalid={formik.touched.developer && formik.errors.developer}
          >
            <FormLabel>Developer</FormLabel>
            <Select
              name="developer"
              value={formik.values.developer}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Select developer"
              focusBorderColor="brand.500"
            >
              {developers?.doc?.map((dev) => (
                <option key={dev._id} value={dev._id}>
                  {dev.developer_name}
                </option>
              ))}
            </Select>
            <FormErrorMessage>{formik.errors.developer}</FormErrorMessage>
          </FormControl>
        </GridItem>

        {/* Area */}
        <GridItem colSpan={1}>
          <FormControl isInvalid={formik.touched.area && formik.errors.area}>
            <FormLabel>Area (sqft)</FormLabel>
            <Input
              type="number"
              name="area"
              value={formik.values.area}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter area in square feet"
              focusBorderColor="brand.500"
              min="0"
            />
            <FormErrorMessage>{formik.errors.area}</FormErrorMessage>
          </FormControl>
        </GridItem>

        {/* Price */}
        <GridItem colSpan={1}>
          <FormControl isInvalid={formik.touched.price && formik.errors.price}>
            <FormLabel>Price</FormLabel>
            <Input
              type="number"
              name="price"
              value={formik.values.price}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter price"
              focusBorderColor="brand.500"
              min="0"
            />
            <FormErrorMessage>{formik.errors.price}</FormErrorMessage>
          </FormControl>
        </GridItem>

        {/* Currency */}
        <GridItem colSpan={1}>
          <FormControl
            isInvalid={formik.touched.currency && formik.errors.currency}
          >
            <FormLabel>Currency</FormLabel>
            <Select
              name="currency"
              value={formik.values.currency}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              focusBorderColor="brand.500"
            >
              <option value="AED">AED</option>
            </Select>
            <FormErrorMessage>{formik.errors.currency}</FormErrorMessage>
          </FormControl>
        </GridItem>

        {/* Location */}
        <GridItem colSpan={1}>
          <FormControl
            isInvalid={formik.touched.location && formik.errors.location}
          >
            <FormLabel>Location</FormLabel>
            <Input
              name="location"
              value={formik.values.location}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter location"
              focusBorderColor="brand.500"
            />
            <FormErrorMessage>{formik.errors.location}</FormErrorMessage>
          </FormControl>
        </GridItem>

        {/* Building Age */}
        <GridItem colSpan={1}>
          <FormControl
            isInvalid={formik.touched.buildingAge && formik.errors.buildingAge}
          >
            <FormLabel>Building Age (years)</FormLabel>
            <Input
              type="number"
              name="buildingAge"
              value={formik.values.buildingAge}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter building age"
              focusBorderColor="brand.500"
              min="0"
              step="any"
            />
            <FormErrorMessage>{formik.errors.buildingAge}</FormErrorMessage>
          </FormControl>
        </GridItem>

        {/* Owner Name */}
        <GridItem colSpan={1}>
          <FormControl
            isInvalid={formik.touched.ownerName && formik.errors.ownerName}
          >
            <FormLabel>Owner Name</FormLabel>
            <Input
              name="ownerName"
              value={formik.values.ownerName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter owner name"
              focusBorderColor="brand.500"
            />
            <FormErrorMessage>{formik.errors.ownerName}</FormErrorMessage>
          </FormControl>
        </GridItem>
        {/* Owner Phone Number */}
        <GridItem colSpan={1}>
          <FormControl
            isInvalid={
              formik.touched.ownerPhoneNumber && formik.errors.ownerPhoneNumber
            }
          >
            <FormLabel>Owner Phone Number</FormLabel>
            <Input
              name="ownerPhoneNumber"
              value={formik.values.ownerPhoneNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter owner Phone number"
              focusBorderColor="brand.500"
            />
            <FormErrorMessage>
              {formik.errors.ownerPhoneNumber}
            </FormErrorMessage>
          </FormControl>
        </GridItem>

        {/* Landlord */}
        <GridItem colSpan={1}>
          <FormControl
            isInvalid={formik.touched.landlord && formik.errors.landlord}
          >
            <FormLabel>Landlord</FormLabel>
            <Input
              name="landlord"
              value={formik.values.landlord}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter landlord name"
              focusBorderColor="brand.500"
            />
            <FormErrorMessage>{formik.errors.landlord}</FormErrorMessage>
          </FormControl>
        </GridItem>

        {/* Phone Number */}
        <GridItem colSpan={1}>
          <FormControl
            isInvalid={formik.touched.phoneNumber && formik.errors.phoneNumber}
          >
            <FormLabel>Phone Number</FormLabel>
            <Input
              name="phoneNumber"
              value={formik.values.phoneNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter phone number"
              focusBorderColor="brand.500"
            />
            <FormErrorMessage>{formik.errors.phoneNumber}</FormErrorMessage>
          </FormControl>
        </GridItem>

        {/* Email */}
        <GridItem colSpan={1}>
          <FormControl isInvalid={formik.touched.email && formik.errors.email}>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter email"
              focusBorderColor="brand.500"
            />
            <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
          </FormControl>
        </GridItem>

        {/* Description */}
        <GridItem colSpan={2}>
          <FormControl
            isInvalid={formik.touched.description && formik.errors.description}
          >
            <FormLabel>Description</FormLabel>
            <Textarea
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter description"
              focusBorderColor="brand.500"
              height="150px"
              resize="vertical"
            />
            <FormErrorMessage>{formik.errors.description}</FormErrorMessage>
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
              isLoading={formik.isSubmitting}
              loadingText="Submitting"
              isDisabled={!formik.isValid || formik.isSubmitting}
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
