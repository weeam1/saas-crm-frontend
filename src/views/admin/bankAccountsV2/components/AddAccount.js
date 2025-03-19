import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Text,
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
        if (!value.trim()) {
          error = "Account holder name is required";
        } else if (value.trim().length < 2) {
          error = "Account holder name must be at least 2 characters long";
        }
        break;
      case "account_number":
        if (!value.trim()) {
          error = "Account number is required";
        } else if (!/^[0-9- ]+$/.test(value)) {
          error =
            "Account number must contain only numbers, spaces, or hyphens";
        }
        break;
      case "iban":
        if (!value.trim()) {
          error = "IBAN is required";
        } else if (!/^[A-Z]{2}[0-9A-Z]{13,30}$/.test(value)) {
          error = "Invalid IBAN format (e.g., DE89370400440532013000)";
        }
        break;
      case "swift_code":
        if (!value.trim()) {
          error = "SWIFT code is required";
        } else if (!/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(value)) {
          error = "Invalid SWIFT code format (e.g., DEUTDEFF or DEUTDEFF500)";
        }
        break;
      case "bank_name":
        if (!value.trim()) {
          error = "Bank name is required";
        } else if (value.trim().length < 2) {
          error = "Bank name must be at least 2 characters long";
        }
        break;
      case "branch_address":
        if (!value.trim()) {
          error = "Branch address is required";
        } else if (value.trim().length < 5) {
          error = "Branch address must be at least 5 characters long";
        }
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
  _hover={{
    bg: "#9E7A3B",
  }}
>
  Add Account
</Button>

      <Modal isOpen={isOpen} onClose={handleClose} isCentered>
        <ModalOverlay />
        <ModalContent fontFamily="DM Sans">
          <ModalHeader>Add New Account</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={3} isInvalid={!!errors.account_holder_name}>
              <FormLabel>
                Account Holder Name{" "}
                <Text as="span" color="red.500">
                  *
                </Text>
              </FormLabel>
              <Input
                name="account_holder_name"
                value={formData.account_holder_name}
                onChange={handleChange}
              />
              <FormErrorMessage>{errors.account_holder_name}</FormErrorMessage>
            </FormControl>
            <FormControl mb={3} isInvalid={!!errors.account_number}>
              <FormLabel>
                Account Number{" "}
                <Text as="span" color="red.500">
                  *
                </Text>
              </FormLabel>
              <Input
                name="account_number"
                value={formData.account_number}
                onChange={handleChange}
              />
              <FormErrorMessage>{errors.account_number}</FormErrorMessage>
            </FormControl>
            <FormControl mb={3} isInvalid={!!errors.iban}>
              <FormLabel>
                IBAN{" "}
                <Text as="span" color="red.500">
                  *
                </Text>
              </FormLabel>
              <Input
                name="iban"
                value={formData.iban}
                onChange={handleChange}
              />
              <FormErrorMessage>{errors.iban}</FormErrorMessage>
            </FormControl>
            <FormControl mb={3} isInvalid={!!errors.swift_code}>
              <FormLabel>
                Swift Code{" "}
                <Text as="span" color="red.500">
                  *
                </Text>
              </FormLabel>
              <Input
                name="swift_code"
                value={formData.swift_code}
                onChange={handleChange}
              />
              <FormErrorMessage>{errors.swift_code}</FormErrorMessage>
            </FormControl>
            <FormControl mb={3} isInvalid={!!errors.bank_name}>
              <FormLabel>
                Bank Name{" "}
                <Text as="span" color="red.500">
                  *
                </Text>
              </FormLabel>
              <Input
                name="bank_name"
                value={formData.bank_name}
                onChange={handleChange}
              />
              <FormErrorMessage>{errors.bank_name}</FormErrorMessage>
            </FormControl>
            <FormControl mb={3} isInvalid={!!errors.branch_address}>
              <FormLabel>
                Branch Address{" "}
                <Text as="span" color="red.500">
                  *
                </Text>
              </FormLabel>
              <Input
                name="branch_address"
                value={formData.branch_address}
                onChange={handleChange}
              />
              <FormErrorMessage>{errors.branch_address}</FormErrorMessage>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" onClick={handleClose} mr={3}>
              Cancel
            </Button>
            <Button
              bg="#B79045"
              color="white"
              onClick={handleSubmit}
              isLoading={isAdding}
              isDisabled={isAdding || !isFormValid()}
              _hover={{
                bg: "#9E7A3B",
              }}
            >
              Add
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddAccountModal;