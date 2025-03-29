import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Text,
  Flex,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

const AddAccountModal = ({ onAdd, isAdding }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    account_holder_name: "",
    account_number: "",
    iban: "",
    swift_code: "",
    bank_name: "",
    branch_address: "",
  });
  const [errors, setErrors] = useState({
    account_holder_name: "",
    account_number: "",
    iban: "",
    swift_code: "",
    bank_name: "",
    branch_address: "",
  });

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => {
    setIsOpen(false);
    setFormData({
      account_holder_name: "",
      account_number: "",
      iban: "",
      swift_code: "",
      bank_name: "",
      branch_address: "",
    });
    setErrors({
      account_holder_name: "",
      account_number: "",
      iban: "",
      swift_code: "",
      bank_name: "",
      branch_address: "",
    });
  };

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "account_holder_name":
        if (!value.trim()) error = "Account holder name is required";
        else if (value.trim().length < 2)
          error = "Account holder name must be at least 2 characters long";
        break;
      case "account_number":
        if (!value.trim()) error = "Account number is required";
        else if (!/^[0-9]+$/.test(value))
          error = "Account number must contain only numbers";
        break;
      case "iban":
        if (!value.trim()) error = "IBAN is required";
        else {
          const countryCode = value.slice(0, 2);
          if (!/^[A-Z]{2}$/.test(countryCode)) {
            error =
              "IBAN must start with a 2-letter country code (e.g., PK, AE, EG)";
          } else {
            const ibanLengths = { PK: 24, AE: 23, EG: 29 };
            const expectedLength = ibanLengths[countryCode];
            const remaining = value.slice(2);
            if (!expectedLength) {
              if (!/^[A-Za-z0-9]+$/.test(remaining)) {
                error =
                  "IBAN must contain only letters and numbers after the country code";
              }
            } else if (value.length !== expectedLength) {
              error = `IBAN for ${countryCode} must be exactly ${expectedLength} characters long`;
            } else if (!/^[A-Za-z0-9]+$/.test(remaining)) {
              error =
                "IBAN must contain only letters and numbers after the country code";
            }
          }
        }
        break;
      case "swift_code":
        if (!value.trim()) error = "SWIFT code is required";
        else if (!/^[A-Za-z0-9]+$/.test(value))
          error = "SWIFT code must contain only letters and numbers";
        else if (value.length < 8)
          error = "SWIFT code must be at least 8 characters long";
        break;
      case "bank_name":
        if (!value.trim()) error = "Bank name is required";
        else if (value.trim().length < 2)
          error = "Bank name must be at least 2 characters long";
        break;
      case "branch_address":
        if (!value.trim()) error = "Branch address is required";
        else if (value.trim().length < 5)
          error = "Branch address must be at least 5 characters long";
        break;
      case "developer_id":
        if (!value.trim()) error = "Developer selection is required";
        break;
      default:
        break;
    }
    return error;
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      newErrors[key] = error;
      if (error) isValid = false;
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      await onAdd(formData);
      handleClose();
    }
  };

  const isFormValid = () => {
    return (
      Object.values(errors).every((error) => !error) &&
      Object.values(formData).every((value) => value.trim())
    );
  };

  return (
    <>
      <Button
        onClick={handleOpen}
        bg="#B79045"
        color="white"
        fontFamily="DM Sans"
        borderRadius="8px"
        leftIcon={<AddIcon />}
        _hover={{ bg: "#9E7A3B" }}
        fontSize={{ base: "sm", md: "md", lg: "lg" }}
        px={{ base: 3, md: 4, lg: 6 }}
        py={{ base: 2, md: 3 }}
        width={{ base: "100%", md: "auto" }}
      >
        Add Account
      </Button>

      <Modal isOpen={isOpen} onClose={handleClose} isCentered>
        <ModalOverlay />
        <ModalContent
          fontFamily="DM Sans"
          maxW={{ base: "90%", md: "550px" }}
          borderRadius="12px" // Added border radius to modal
        >
          <ModalHeader>Add New Account</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl mb={3} isInvalid={!!errors.account_holder_name}>
              <FormLabel>Account Name </FormLabel>
              <Input
                name="account_holder_name"
                value={formData.account_holder_name}
                onChange={handleChange}
                placeholder="Enter Account Name"
                borderRadius="8px"
              />
              <FormErrorMessage>{errors.account_holder_name}</FormErrorMessage>
            </FormControl>

            <FormControl mb={3} isInvalid={!!errors.account_number}>
              <FormLabel>Account Number</FormLabel>
              <Input
                name="account_number"
                value={formData.account_number}
                onChange={handleChange}
                placeholder="Enter account number"
                borderRadius="8px"
              />
              <FormErrorMessage>{errors.account_number}</FormErrorMessage>
            </FormControl>

            <FormControl mb={3} isInvalid={!!errors.iban}>
              <FormLabel>IBAN</FormLabel>
              <Input
                name="iban"
                value={formData.iban}
                onChange={handleChange}
                placeholder="Enter IBAN"
                borderRadius="8px"
              />
              <FormErrorMessage>{errors.iban}</FormErrorMessage>
            </FormControl>

            {/* Swift Code and Bank Name Side by Side */}
            <Flex direction={{ base: "column", md: "row" }} gap={4} mb={3}>
              <FormControl isInvalid={!!errors.swift_code} flex="1">
                <FormLabel>Swift Code</FormLabel>
                <Input
                  name="swift_code"
                  value={formData.swift_code}
                  onChange={handleChange}
                  placeholder="Enter Swift Code"
                  borderRadius="8px"
                />
                <FormErrorMessage>{errors.swift_code}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.bank_name} flex="1">
                <FormLabel>Bank Name</FormLabel>
                <Input
                  name="bank_name"
                  value={formData.bank_name}
                  onChange={handleChange}
                  placeholder="Enter bank name"
                  borderRadius="8px"
                />
                <FormErrorMessage>{errors.bank_name}</FormErrorMessage>
              </FormControl>
            </Flex>

            <FormControl mb={6} isInvalid={!!errors.branch_address}>
              <FormLabel>Branch Address</FormLabel>
              <Input
                name="branch_address"
                value={formData.branch_address}
                onChange={handleChange}
                placeholder="Enter Bank Address"
                borderRadius="8px"
              />
              <FormErrorMessage>{errors.branch_address}</FormErrorMessage>
            </FormControl>

            {/* Buttons */}
            <Flex justify="flex-end" gap={3}>
              <Button
                variant="ghost"
                onClick={handleClose}
                bg="#CCCACA"
                color="black"
                borderRadius="6px"
                px={6}
                py={3}
              >
                Cancel
              </Button>
              <Button
                bg="#B79045"
                color="white"
                onClick={handleSubmit}
                borderRadius="6px"
                px={6}
                py={3}
                isLoading={isAdding}
                isDisabled={isAdding || !isFormValid()}
                _hover={{
                  bg: "#9E7A3B",
                }}
              >
                Save
              </Button>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddAccountModal;
