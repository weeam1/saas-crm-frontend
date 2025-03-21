// import React, { useState } from "react";
// import {
//   Modal,
//   ModalOverlay,
//   ModalContent,
//   ModalHeader,
//   ModalFooter,
//   ModalBody,
//   ModalCloseButton,
//   Button,
//   FormControl,
//   FormLabel,
//   Input,
//   FormErrorMessage,
//   Text,
// } from "@chakra-ui/react";

// const EditAccountModal = ({ account, onUpdate, isUpdating, children }) => {
//   const [isOpen, setIsOpen] = useState(false);

//   const defaultAccount = {
//     account_holder_name: "",
//     account_number: "",
//     iban: "",
//     swift_code: "",
//     bank_name: "",
//     branch_address: "",
//     _id: null,
//   };

//   const initialAccount = account || defaultAccount;

//   // Ensure all values are strings by using String() or empty string fallback
//   const [formData, setFormData] = useState({
//     account_holder_name: String(initialAccount.account_holder_name || ""),
//     account_number: String(initialAccount.account_number || ""),
//     iban: String(initialAccount.iban || ""),
//     swift_code: String(initialAccount.swift_code || ""),
//     bank_name: String(initialAccount.bank_name || ""),
//     branch_address: String(initialAccount.branch_address || ""),
//   });

//   const [errors, setErrors] = useState({
//     account_holder_name: "",
//     account_number: "",
//     iban: "",
//     swift_code: "",
//     bank_name: "",
//     branch_address: "",
//   });

//   const handleOpen = () => {
//     if (!account) {
//       console.warn("No account data provided to EditAccountModal");
//       return;
//     }
//     setIsOpen(true);
//   };

//   const handleClose = () => {
//     setIsOpen(false);
//     setFormData({
//       account_holder_name: String(initialAccount.account_holder_name || ""),
//       account_number: String(initialAccount.account_number || ""),
//       iban: String(initialAccount.iban || ""),
//       swift_code: String(initialAccount.swift_code || ""),
//       bank_name: String(initialAccount.bank_name || ""),
//       branch_address: String(initialAccount.branch_address || ""),
//     });
//     setErrors({
//       account_holder_name: "",
//       account_number: "",
//       iban: "",
//       swift_code: "",
//       bank_name: "",
//       branch_address: "",
//     });
//   };

//   const validateField = (name, value) => {
//     let error = "";
//     // Ensure value is a string before validation
//     const safeValue = String(value || "");
//     switch (name) {
//       case "account_holder_name":
//         if (!safeValue.trim()) {
//           error = "Account holder name is required";
//         } else if (safeValue.trim().length < 2) {
//           error = "Account holder name must be at least 2 characters long";
//         }
//         break;
//       case "account_number":
//         if (!safeValue.trim()) {
//           error = "Account number is required";
//         } else if (!/^[0-9- ]+$/.test(safeValue)) {
//           error =
//             "Account number must contain only numbers, spaces, or hyphens";
//         }
//         break;
//       case "iban":
//         if (!safeValue.trim()) {
//           error = "IBAN is required";
//         } else if (!/^[A-Z]{2}[0-9A-Z]{13,30}$/.test(safeValue)) {
//           error = "Invalid IBAN format (e.g., DE89370400440532013000)";
//         }
//         break;
//       case "swift_code":
//         if (!safeValue.trim()) {
//           error = "SWIFT code is required";
//         } else if (!/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(safeValue)) {
//           error = "Invalid SWIFT code format (e.g., DEUTDEFF or DEUTDEFF500)";
//         }
//         break;
//       case "bank_name":
//         if (!safeValue.trim()) {
//           error = "Bank name is required";
//         } else if (safeValue.trim().length < 2) {
//           error = "Bank name must be at least 2 characters long";
//         }
//         break;
//       case "branch_address":
//         if (!safeValue.trim()) {
//           error = "Branch address is required";
//         } else if (safeValue.trim().length < 5) {
//           error = "Branch address must be at least 5 characters long";
//         }
//         break;
//       default:
//         break;
//     }
//     return error;
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     let isValid = true;

//     Object.keys(formData).forEach((key) => {
//       const error = validateField(key, formData[key]);
//       newErrors[key] = error;
//       if (error) isValid = false;
//     });

//     setErrors(newErrors);
//     return isValid;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     const error = validateField(name, value);
//     setErrors((prev) => ({ ...prev, [name]: error }));
//   };

//   const handleSubmit = async () => {
//     if (!account?._id) {
//       console.error("No account ID provided for update");
//       return;
//     }
//     if (validateForm()) {
//       await onUpdate(formData, account._id);
//       handleClose();
//     }
//   };

//   const isFormValid = () => {
//     return (
//       Object.values(errors).every((error) => !error) &&
//       Object.values(formData).every((value) => String(value || "").trim())
//     );
//   };

//   if (!account) {
//     return (
//       <span onClick={handleOpen}>{children || "Edit Account (No data)"}</span>
//     );
//   }

//   return (
//     <>
//       <span onClick={handleOpen}>{children}</span>

//       <Modal isOpen={isOpen} onClose={handleClose} isCentered>
//         <ModalOverlay />
//         <ModalContent fontFamily="DM Sans">
//           <ModalHeader>Edit Account</ModalHeader>
//           <ModalCloseButton />
//           <ModalBody>
//             <FormControl mb={3} isInvalid={!!errors.account_holder_name}>
//               <FormLabel>
//                 Account Holder Name{" "}
//                 <Text as="span" color="red.500">
//                   *
//                 </Text>
//               </FormLabel>
//               <Input
//                 name="account_holder_name"
//                 value={formData.account_holder_name}
//                 onChange={handleChange}
//               />
//               <FormErrorMessage>{errors.account_holder_name}</FormErrorMessage>
//             </FormControl>
//             <FormControl mb={3} isInvalid={!!errors.account_number}>
//               <FormLabel>
//                 Account Number{" "}
//                 <Text as="span" color="red.500">
//                   *
//                 </Text>
//               </FormLabel>
//               <Input
//                 name="account_number"
//                 value={formData.account_number}
//                 onChange={handleChange}
//               />
//               <FormErrorMessage>{errors.account_number}</FormErrorMessage>
//             </FormControl>
//             <FormControl mb={3} isInvalid={!!errors.iban}>
//               <FormLabel>
//                 IBAN{" "}
//                 <Text as="span" color="red.500">
//                   *
//                 </Text>
//               </FormLabel>
//               <Input
//                 name="iban"
//                 value={formData.iban}
//                 onChange={handleChange}
//               />
//               <FormErrorMessage>{errors.iban}</FormErrorMessage>
//             </FormControl>
//             <FormControl mb={3} isInvalid={!!errors.swift_code}>
//               <FormLabel>
//                 Swift Code{" "}
//                 <Text as="span" color="red.500">
//                   *
//                 </Text>
//               </FormLabel>
//               <Input
//                 name="swift_code"
//                 value={formData.swift_code}
//                 onChange={handleChange}
//               />
//               <FormErrorMessage>{errors.swift_code}</FormErrorMessage>
//             </FormControl>
//             <FormControl mb={3} isInvalid={!!errors.bank_name}>
//               <FormLabel>
//                 Bank Name{" "}
//                 <Text as="span" color="red.500">
//                   *
//                 </Text>
//               </FormLabel>
//               <Input
//                 name="bank_name"
//                 value={formData.bank_name}
//                 onChange={handleChange}
//               />
//               <FormErrorMessage>{errors.bank_name}</FormErrorMessage>
//             </FormControl>
//             <FormControl mb={3} isInvalid={!!errors.branch_address}>
//               <FormLabel>
//                 Branch Address{" "}
//                 <Text as="span" color="red.500">
//                   *
//                 </Text>
//               </FormLabel>
//               <Input
//                 name="branch_address"
//                 value={formData.branch_address}
//                 onChange={handleChange}
//               />
//               <FormErrorMessage>{errors.branch_address}</FormErrorMessage>
//             </FormControl>
//           </ModalBody>

//           <ModalFooter>
//             <Button variant="ghost" onClick={handleClose} mr={3}>
//               Cancel
//             </Button>
//             <Button
//               bg="#B79045"
//               color="white"
//               onClick={handleSubmit}
//               isLoading={isUpdating}
//               isDisabled={isUpdating || !isFormValid()}
//               _hover={{
//                 bg: "#9E7A3B",
//               }}
//             >
//               Update
//             </Button>
//           </ModalFooter>
//         </ModalContent>
//       </Modal>
//     </>
//   );
// };

// export default EditAccountModal;

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
      await onUpdate(updatedAccount, account._id); // Pass updated data back
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
        <ModalContent fontFamily="DM Sans">
          <ModalHeader>Edit Account</ModalHeader>
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
              isLoading={isUpdating}
              isDisabled={isUpdating || !isFormValid()}
              _hover={{
                bg: "#9E7A3B",
              }}
            >
              Update
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditAccountModal;