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
  Flex,
} from "@chakra-ui/react";

const EditAccountModal = ({ account, onUpdate, isUpdating, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const defaultAccount = {
    account_holder_name: "",
    account_number: "",
    iban: "",
    swift_code: "",
    bank_name: "",
    branch_address: "",
    _id: null,
  };

  const initialAccount = account || defaultAccount;

  const [formData, setFormData] = useState({
    account_holder_name: String(initialAccount.account_holder_name || ""),
    account_number: String(initialAccount.account_number || ""),
    iban: String(initialAccount.iban || ""),
    swift_code: String(initialAccount.swift_code || ""),
    bank_name: String(initialAccount.bank_name || ""),
    branch_address: String(initialAccount.branch_address || ""),
  });

  const [errors, setErrors] = useState({
    account_holder_name: "",
    account_number: "",
    iban: "",
    swift_code: "",
    bank_name: "",
    branch_address: "",
  });

  const handleOpen = () => {
    if (!account) {
      console.warn("No account data provided to EditAccountModal");
      return;
    }
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setFormData({
      account_holder_name: String(initialAccount.account_holder_name || ""),
      account_number: String(initialAccount.account_number || ""),
      iban: String(initialAccount.iban || ""),
      swift_code: String(initialAccount.swift_code || ""),
      bank_name: String(initialAccount.bank_name || ""),
      branch_address: String(initialAccount.branch_address || ""),
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
    const safeValue = String(value || "");
    switch (name) {
      case "account_holder_name":
        if (!safeValue.trim()) {
          error = "Account holder name is required";
        } else if (safeValue.trim().length < 2) {
          error = "Account holder name must be at least 2 characters long";
        }
        break;
      case "account_number":
        if (!safeValue.trim()) {
          error = "Account number is required";
        } else if (!/^[0-9- ]+$/.test(safeValue)) {
          error =
            "Account number must contain only numbers, spaces, or hyphens";
        }
        break;
      case "iban":
        if (!safeValue.trim()) {
          error = "IBAN is required";
        } else if (!/^[A-Z]{2}[0-9A-Z]{13,30}$/.test(safeValue)) {
          error = "Invalid IBAN format (e.g., DE89370400440532013000)";
        }
        break;
      case "swift_code":
        if (!safeValue.trim()) {
          error = "SWIFT code is required";
        } else if (!/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(safeValue)) {
          error = "Invalid SWIFT code format (e.g., DEUTDEFF or DEUTDEFF500)";
        }
        break;
      case "bank_name":
        if (!safeValue.trim()) {
          error = "Bank name is required";
        } else if (safeValue.trim().length < 2) {
          error = "Bank name must be at least 2 characters long";
        }
        break;
      case "branch_address":
        if (!safeValue.trim()) {
          error = "Branch address is required";
        } else if (safeValue.trim().length < 5) {
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
    if (!account?._id) {
      console.error("No account ID provided for update");
      return;
    }
    if (validateForm()) {
      const updatedAccount = { ...formData, _id: account._id };
      await onUpdate(updatedAccount, account._id);
      handleClose();
    }
  };

  const isFormValid = () => {
    return (
      Object.values(errors).every((error) => !error) &&
      Object.values(formData).every((value) => String(value || "").trim())
    );
  };

  if (!account) {
    return (
      <span onClick={handleOpen}>{children || "Edit Account (No data)"}</span>
    );
  }

  return (
    <>
      <span onClick={handleOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={handleClose} isCentered>
        <ModalOverlay />
        <ModalContent
          fontFamily="DM Sans"
          maxW={{ base: "90%", md: "550px" }}
          borderRadius="12px"
        >
          <ModalHeader fontFamily="DM Sans">Edit Account</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={3} isInvalid={!!errors.account_holder_name}>
              <FormLabel fontFamily="DM Sans">Account Holder Name</FormLabel>
              <Input
                name="account_holder_name"
                value={formData.account_holder_name}
                onChange={handleChange}
                placeholder="Enter Account Name"
                borderRadius="8px"
                fontFamily="DM Sans"
              />
              <FormErrorMessage fontFamily="DM Sans">
                {errors.account_holder_name}
              </FormErrorMessage>
            </FormControl>
            <FormControl mb={3} isInvalid={!!errors.account_number}>
              <FormLabel fontFamily="DM Sans">Account Number</FormLabel>
              <Input
                name="account_number"
                value={formData.account_number}
                onChange={handleChange}
                placeholder="Enter account number"
                borderRadius="8px"
                fontFamily="DM Sans"
              />
              <FormErrorMessage fontFamily="DM Sans">
                {errors.account_number}
              </FormErrorMessage>
            </FormControl>
            <FormControl mb={3} isInvalid={!!errors.iban}>
              <FormLabel fontFamily="DM Sans">IBAN</FormLabel>
              <Input
                name="iban"
                value={formData.iban}
                onChange={handleChange}
                placeholder="Enter IBAN"
                borderRadius="8px"
                fontFamily="DM Sans"
              />
              <FormErrorMessage fontFamily="DM Sans">
                {errors.iban}
              </FormErrorMessage>
            </FormControl>
            {/* Swift Code and Bank Name Side by Side */}
            <Flex direction={{ base: "column", md: "row" }} gap={4} mb={3}>
              <FormControl isInvalid={!!errors.swift_code} flex="1">
                <FormLabel fontFamily="DM Sans">Swift Code</FormLabel>
                <Input
                  name="swift_code"
                  value={formData.swift_code}
                  onChange={handleChange}
                  placeholder="Enter Swift Code"
                  borderRadius="8px"
                  fontFamily="DM Sans"
                />
                <FormErrorMessage fontFamily="DM Sans">
                  {errors.swift_code}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.bank_name} flex="1">
                <FormLabel fontFamily="DM Sans">Bank Name</FormLabel>
                <Input
                  name="bank_name"
                  value={formData.bank_name}
                  onChange={handleChange}
                  placeholder="Enter bank name"
                  borderRadius="8px"
                  fontFamily="DM Sans"
                />
                <FormErrorMessage fontFamily="DM Sans">
                  {errors.bank_name}
                </FormErrorMessage>
              </FormControl>
            </Flex>
            <FormControl mb={3} isInvalid={!!errors.branch_address}>
              <FormLabel fontFamily="DM Sans">Branch Address</FormLabel>
              <Input
                name="branch_address"
                value={formData.branch_address}
                onChange={handleChange}
                placeholder="Enter Bank Address"
                borderRadius="8px"
                fontFamily="DM Sans"
              />
              <FormErrorMessage fontFamily="DM Sans">
                {errors.branch_address}
              </FormErrorMessage>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              variant="ghost"
              onClick={handleClose}
              bg="#CCCACA"
              color="black"
              borderRadius="6px"
              px={6}
              py={3}
              mr={3}
              fontFamily="DM Sans"
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
              isLoading={isUpdating}
              isDisabled={isUpdating || !isFormValid()}
              _hover={{ bg: "#9E7A3B" }}
              fontFamily="DM Sans"
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditAccountModal;
