import React, { useState, useEffect, useRef } from "react";
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
  useBreakpointValue,
} from "@chakra-ui/react";
import { useFetchItemsQuery, useCreateItemMutation } from "api/apiSlice";
import AppButton from "components/shared/AppButton";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import FileUpload from "./SubComponent/FileUpload";
import { useFormik } from "formik";
import * as Yup from "yup";
import { skipToken } from "@reduxjs/toolkit/query";

const formatNumberWithCommas = (value) => {
  if (!value) return "";
  const num = Number(value.toString().replace(/,/g, ""));
  if (isNaN(num)) return "";
  return num.toLocaleString("en-US");
};

const getPositiveNumber = (value) => {
  const num = Number(value.toString().replace(/,/g, ""));
  if (isNaN(num) || num < 0) return "";
  return num;
};

const validationSchema = Yup.object().shape({
  projectName: Yup.string().required("Project Name is required"),
  unitType: Yup.string().required("Unit Type is required"),
  listingType: Yup.string().required("Listing Type is required"),
  description: Yup.string().required("Description is required"),
  area: Yup.number()
    .transform((value, originalValue) => {
      if (typeof originalValue === "string") {
        const parsed = Number(originalValue.replace(/,/g, ""));
        return isNaN(parsed) ? undefined : parsed;
      }
      return value;
    })
    .typeError("Area must be a number")
    .positive("Area must be greater than 0")
    .required("Area is required"),
  price: Yup.number()
    .transform((value, originalValue) => {
      if (typeof originalValue === "string") {
        const parsed = Number(originalValue.replace(/,/g, ""));
        return isNaN(parsed) ? undefined : parsed;
      }
      return value;
    })
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
  subUnitType: Yup.string().when("$isSubUnitTypeRequired", {
    is: true,
    then: (schema) => schema.required("Sub Unit Type is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  brokerCommissionType: Yup.string(),
  brokerCommissionValue: Yup.number()
    .typeError("Commission Value must be a number")
    .positive("Commission Value must be greater than 0"),
});

const AddListing = () => {
  const [files, setFiles] = useState([]);
  const [unitTypes, setUnitTypes] = useState([]);
  const [selectedUnitType, setSelectedUnitType] = useState(null);
  const [loadingButton, setLoadingButton] = useState(null);
  const [developerInput, setDeveloperInput] = useState("");
  const [showDevSuggestions, setShowDevSuggestions] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const inputRef = useRef();

  const colSpan = useBreakpointValue({ base: 2, sm: 1 });

  const { data: listingType } = useFetchItemsQuery(
    { path: `/listing/secondary/types` },
    { refetchOnMountOrArgChange: true, skip: !user._id }
  );

  const { data: listingUnitType } = useFetchItemsQuery(
    { path: `/listing/secondary/unit-types` },
    { refetchOnMountOrArgChange: true, skip: !user._id }
  );

  const { data: listingSubUnitType } = useFetchItemsQuery(
    selectedUnitType
      ? {
          path: `/listing/secondary/unit-types/sub-category/${selectedUnitType._id}`,
        }
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
      status: "",
      brokerCommissionType: "",
      brokerCommissionValue: "",
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
          area: getPositiveNumber(values.area),
          price: getPositiveNumber(values.price),
          brokerCommissionValue: getPositiveNumber(
            values.brokerCommissionValue
          ),
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
    formik.setFieldValue("subUnitType", "");
  };

  const handleSubmitWithStatus = async (status) => {
    setLoadingButton(status);
    await formik.setFieldValue("status", status);
    await formik.submitForm();
    setLoadingButton(null);
  };

  const handlePriceChange = (e) => {
    let value = e.target.value.replace(/,/g, "");
    value = value.replace(/[^\d.]/g, "");
    if (value.startsWith("-")) value = value.slice(1);
    const parts = value.split(".");
    if (parts.length > 2) value = parts[0] + "." + parts[1];
    formik.setFieldValue("price", value ? formatNumberWithCommas(value) : "");
  };

  const handleAreaChange = (e) => {
    let value = e.target.value.replace(/,/g, "");
    value = value.replace(/[^\d.]/g, "");
    if (value.startsWith("-")) value = value.slice(1);
    const parts = value.split(".");
    if (parts.length > 2) value = parts[0] + "." + parts[1];
    formik.setFieldValue("area", value ? formatNumberWithCommas(value) : "");
  };

  useEffect(() => {
    const selectedDev = developers?.doc?.find(
      (dev) => dev._id === formik.values.developer
    );
    if (selectedDev) {
      setDeveloperInput(selectedDev.developer_name);
    } else {
      setDeveloperInput(formik.values.developer);
    }
    // eslint-disable-next-line
  }, [formik.values.developer, developers]);

  const filteredDevelopers =
    developers?.doc?.filter((dev) =>
      developerInput
        ? dev.developer_name
            .toLowerCase()
            .includes(developerInput.toLowerCase())
        : false
    ) || [];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowDevSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
        templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)" }}
        gap={6}
        p={{ base: 2, sm: 5 }}
        bg="white"
        borderRadius="md"
        my={5}
        mx={{ base: 0, sm: 2 }}
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
        <GridItem colSpan={colSpan}>
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

        {/* Sub Unit Type */}
        {listingSubUnitType?.doc?.length > 0 && (
          <GridItem colSpan={colSpan}>
            <FormControl
              isInvalid={
                formik.touched.subUnitType && formik.errors.subUnitType
              }
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
        <GridItem colSpan={colSpan}>
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
        <GridItem colSpan={colSpan}>
          <FormControl
            isInvalid={formik.touched.developer && formik.errors.developer}
          >
            <FormLabel>Developer</FormLabel>
            <Box position="relative" ref={inputRef}>
              <Input
                name="developer"
                value={developerInput}
                onChange={(e) => {
                  setDeveloperInput(e.target.value);
                  setShowDevSuggestions(true);
                  formik.setFieldValue("developer", e.target.value);
                }}
                onFocus={() => setShowDevSuggestions(true)}
                onBlur={formik.handleBlur}
                placeholder="Type developer name"
                focusBorderColor="brand.500"
                autoComplete="off"
                width="100%"
              />
              {showDevSuggestions && filteredDevelopers.length > 0 && (
                <Box
                  position="absolute"
                  top="100%"
                  left={0}
                  width="100%"
                  bg="white"
                  border="1px solid #e2e8f0"
                  borderRadius="md"
                  boxShadow="md"
                  zIndex={10}
                  maxH="200px"
                  overflowY="auto"
                >
                  {filteredDevelopers.map((dev) => (
                    <Box
                      key={dev._id}
                      px={4}
                      py={2}
                      cursor="pointer"
                      _hover={{ bg: "gray.100" }}
                      onMouseDown={() => {
                        setDeveloperInput(dev.developer_name);
                        formik.setFieldValue("developer", dev.developer_name);
                        setShowDevSuggestions(false);
                      }}
                    >
                      {dev.developer_name}
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
            <FormErrorMessage>{formik.errors.developer}</FormErrorMessage>
          </FormControl>
        </GridItem>

        {/* Area */}
        <GridItem colSpan={colSpan}>
          <FormControl isInvalid={formik.touched.area && formik.errors.area}>
            <FormLabel>Area (sqft)</FormLabel>
            <Input
              name="area"
              value={formik.values.area}
              onChange={handleAreaChange}
              onBlur={formik.handleBlur}
              placeholder="Enter area in square feet"
              focusBorderColor="brand.500"
              inputMode="decimal"
              min="0"
            />
            <FormErrorMessage>{formik.errors.area}</FormErrorMessage>
          </FormControl>
        </GridItem>

        {/* Price */}
        <GridItem colSpan={colSpan}>
          <FormControl isInvalid={formik.touched.price && formik.errors.price}>
            <FormLabel>Selling Price</FormLabel>
            <Input
              name="price"
              value={formik.values.price}
              onChange={handlePriceChange}
              onBlur={formik.handleBlur}
              placeholder="Enter selling price"
              focusBorderColor="brand.500"
              inputMode="decimal"
              min="0"
            />
            <FormErrorMessage>{formik.errors.price}</FormErrorMessage>
          </FormControl>
        </GridItem>

        {/* Currency */}
        <GridItem colSpan={colSpan}>
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
        <GridItem colSpan={colSpan}>
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
        <GridItem colSpan={colSpan}>
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
        <GridItem colSpan={colSpan}>
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
        <GridItem colSpan={colSpan}>
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
        <GridItem colSpan={colSpan}>
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
        <GridItem colSpan={colSpan}>
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
        <GridItem colSpan={colSpan}>
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

        {/* Broker Commission Type */}
        <GridItem colSpan={colSpan}>
          <FormControl
            isInvalid={
              formik.touched.brokerCommissionType &&
              formik.errors.brokerCommissionType
            }
          >
            <FormLabel>Broker Commission Type</FormLabel>
            <Select
              name="brokerCommissionType"
              value={formik.values.brokerCommissionType}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Select type"
              focusBorderColor="brand.500"
            >
              <option value="AED">AED</option>
              <option value="PERCENT">Percent</option>
            </Select>
            <FormErrorMessage>
              {formik.errors.brokerCommissionType}
            </FormErrorMessage>
          </FormControl>
        </GridItem>

        {/* Commission Value */}
        <GridItem colSpan={colSpan}>
          <FormControl
            isInvalid={
              formik.touched.brokerCommissionValue &&
              formik.errors.brokerCommissionValue
            }
          >
            <FormLabel>Commission Value</FormLabel>
            <Input
              name="brokerCommissionValue"
              value={formik.values.brokerCommissionValue}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter commission value"
              focusBorderColor="brand.500"
              inputMode="decimal"
              min="0"
            />
            <FormErrorMessage>
              {formik.errors.brokerCommissionValue}
            </FormErrorMessage>
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
          <Flex justify="flex-end" gap={4} wrap="wrap">
            <Button
              type="button"
              variant="outline"
              colorScheme="gray"
              onClick={() => handleSubmitWithStatus("draft")}
              isLoading={loadingButton === "draft"}
              loadingText="Saving..."
              width={{ base: "100%", sm: "auto" }}
              mb={{ base: 2, sm: 0 }}
            >
              Save as Draft
            </Button>
            <Button
              type="button"
              colorScheme="brand"
              onClick={() => handleSubmitWithStatus("pending")}
              isLoading={loadingButton === "pending"}
              loadingText="Publishing..."
              width={{ base: "100%", sm: "auto" }}
            >
              Publish Listing
            </Button>
          </Flex>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default AddListing;
