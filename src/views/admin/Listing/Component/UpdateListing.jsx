import React, { useEffect, useState, useRef } from "react";
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
  Textarea,
  FormErrorMessage,
  useBreakpointValue
} from "@chakra-ui/react";
import AppButton from "components/shared/AppButton";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { useFetchItemsQuery, useUpdateItemMutation } from "api/apiSlice";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import FileUpload from "./SubComponent/FileUpload";
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

const UpdateListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [selectedUnitType, setSelectedUnitType] = useState(null);
  const [developerInput, setDeveloperInput] = useState("");
  const [showDevSuggestions, setShowDevSuggestions] = useState(false);
  const inputRef = useRef();
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "superAdmin";

    const colSpan = useBreakpointValue({ base: 2, sm: 1 });

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

  const { data: developers } = useFetchItemsQuery(
    { path: `/developer/get` },
    { skip: !id }
  );

  const { data: subUnitTypes } = useFetchItemsQuery(
    selectedUnitType
      ? {
          path: `/listing/secondary/unit-types/sub-category/${selectedUnitType._id}`,
        }
      : skipToken,
    { skip: !id || !selectedUnitType }
  );

  const { data: countries } = useFetchItemsQuery({
    path: '/countries',
  });

  useEffect(() => {
    if (listing?.data?.documents) {
      setFiles([...listing.data.documents]);
    }
    if (listing?.data?.unitType && unitTypes?.doc) {
      const selected = unitTypes.doc.find(
        (type) => type._id === listing.data.unitType._id
      );
      setSelectedUnitType(selected);
    }
  }, [listing, unitTypes]);

  const [updateListing, { isLoading: isUpdating }] = useUpdateItemMutation();

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
      landlord: listing?.data?.landlord || "",
      phoneNumber: listing?.data?.phoneNumber || "",
      email: listing?.data?.email || "",
      buildingAge: listing?.data?.buildingAge || "",
      developer: listing?.data?.developer || "",
      status: listing?.data?.status || "pending",
      isConfidential: listing?.data?.isConfidential || false,
      documents: listing?.data?.documents || [],
      ownerName: listing?.data?.ownerName || "",
      ownerPhoneNumber: listing?.data?.ownerPhoneNumber || "",
      subUnitType: listing?.data?.subUnitType?._id || null,
      brokerCommissionType: listing?.data?.brokerCommissionType || "",
      brokerCommissionValue: listing?.data?.brokerCommissionValue || "",
      country: listing?.data?.country || null,
    },
    validationSchema: Yup.object().shape({
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
      country: Yup.object().shape({
        code: Yup.string().required("Country code is required"),
        name: Yup.string().required("Country name is required"),
        flags: Yup.object().shape({
          png: Yup.string(),
          svg: Yup.string(),
        }),
      }).required("Country is required"),
      brokerCommissionType: Yup.string(),
      brokerCommissionValue: Yup.number()
        .typeError("Commission Value must be a number")
        .when("brokerCommissionType", {
          is: "PERCENT",
          then: (schema) =>
            schema
              .min(0, "Percentage must be between 0 and 100")
              .max(100, "Percentage must be between 0 and 100"),
          otherwise: (schema) =>
            schema.positive("Commission Value must be greater than 0"),
        }),
    }),
    validationContext: {
      isSubUnitTypeRequired: !!subUnitTypes?.doc?.length,
    },
    onSubmit: async (values) => {
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
          lastUpdatedBy: user._id,
        };

        await updateListing({
          path: `listing/secondary/${id}`,
          body: payload,
        }).unwrap();

        toast.success("Listing updated successfully");
        navigate(-1);
      } catch (error) {
        console.error("Update error:", error);
        toast.error(error.data?.message || "Failed to update listing");
      }
    },
  });

  const handleUnitTypeChange = (e) => {
    const unitTypeId = e.target.value;
    const selected = unitTypes?.doc?.find((type) => type._id === unitTypeId);
    setSelectedUnitType(selected);
    formik.setFieldValue("unitType", unitTypeId);
    formik.setFieldValue("subUnitType", "");
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

  if (isLoading) {
    return (
      <Box p={5}>
        <Skeleton height="40px" mb={4} />
        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
          {Array.from({ length: 12 }).map((_, i) => (
            <GridItem key={i} colSpan={i % 3 === 0 ? 2 : colSpan}>
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
              {unitTypes?.doc?.map((unitType) => (
                <option key={unitType._id} value={unitType._id}>
                  {unitType.name}
                </option>
              ))}
            </Select>
            <FormErrorMessage>{formik.errors.unitType}</FormErrorMessage>
          </FormControl>
        </GridItem>

        {/* Sub Unit Type */}
        {subUnitTypes?.doc?.length > 0 && (
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
                {subUnitTypes.doc.map((sub) => (
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
              {listingTypes?.doc?.map((type) => (
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
                  const selectedDev = developers?.doc?.find(
                    (dev) => dev.developer_name === e.target.value
                  );
                  if (selectedDev) {
                    formik.setFieldValue("developer", selectedDev._id);
                  } else {
                    formik.setFieldValue("developer", e.target.value);
                  }
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
                        formik.setFieldValue("developer", dev._id);
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
            <FormLabel>Price</FormLabel>
            <Input
              name="price"
              value={formik.values.price}
              onChange={handlePriceChange}
              onBlur={formik.handleBlur}
              placeholder="Enter price"
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

        {/* Country */}
        <GridItem colSpan={colSpan}>
          <FormControl
            isInvalid={formik.touched.country && formik.errors.country}
          >
            <FormLabel>Country</FormLabel>
            <Select
              name="country"
              value={formik.values.country?.name || ''}
              onChange={(e) => {
                const selectedCountry = countries?.doc?.find(
                  country => country.name === e.target.value
                );
                formik.setFieldValue('country', selectedCountry);
              }}
              onBlur={formik.handleBlur}
              placeholder="Select country"
              focusBorderColor="brand.500"
            >
              {countries?.doc?.map((country) => (
                <option key={country.code} value={country.name}>
                  {country.name}
                </option>
              ))}
            </Select>
            <FormErrorMessage>
              {formik.errors.country?.message || formik.errors.country}
            </FormErrorMessage>
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
        {isAdmin && (
          <>
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
                  readOnly={!isAdmin}
                  placeholder="Enter landlord name"
                  focusBorderColor="brand.500"
                />
                <FormErrorMessage>{formik.errors.landlord}</FormErrorMessage>
              </FormControl>
            </GridItem>

            {/* Phone Number */}
             <GridItem colSpan={colSpan}>
              <FormControl
                isInvalid={
                  formik.touched.phoneNumber && formik.errors.phoneNumber
                }
              >
                <FormLabel>Phone Number</FormLabel>
                <Input
                  name="phoneNumber"
                  value={formik.values.phoneNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  readOnly={!isAdmin}
                  placeholder="Enter phone number"
                  focusBorderColor="brand.500"
                />
                <FormErrorMessage>{formik.errors.phoneNumber}</FormErrorMessage>
              </FormControl>
            </GridItem>

            {/* Email */}
            <GridItem colSpan={colSpan}>
              <FormControl
                isInvalid={formik.touched.email && formik.errors.email}
              >
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  readOnly={!isAdmin}
                  placeholder="Enter email"
                  focusBorderColor="brand.500"
                />
                <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
              </FormControl>
            </GridItem>
          </>
        )}

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
              min={
                formik.values.brokerCommissionType === "PERCENT"
                  ? "0"
                  : undefined
              }
              max={
                formik.values.brokerCommissionType === "PERCENT"
                  ? "100"
                  : undefined
              }
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

        {/* Documents */}
        <GridItem colSpan={2}>
          <FormControl>
            <FormLabel>Documents</FormLabel>
            <FileUpload files={files} setFiles={setFiles} />
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
              isDisabled={!formik.isValid || isUpdating}
               width={{ base: "100%", sm: "auto" }}
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
