import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Select,
  Textarea,
  Input,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import * as Yup from "yup";
import { useCreateItemMutation, useUpdateItemMutation } from "api/apiSlice";
import { useUserActivityLog } from "hooks/useUserActivityLog";
import { toast } from "react-toastify";

const AddEditCashModal = ({ isOpen, onClose, cash, agencies, onSuccess }) => {
  const { createUserLog } = useUserActivityLog();
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const [createCash] = useCreateItemMutation();
  const [updateCash] = useUpdateItemMutation();

  const initialFormState = {
    paymentMethod: "cash",
    amount: 0,
    description: "",
    agency: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  //  Yup validation schema
  const validationSchema = Yup.object().shape({
    paymentMethod: Yup.string()
      .oneOf(["cash", "credit card", "debit card"], "Invalid payment method")
      .required("Payment method is required"),
    amount: Yup.number()
      .typeError("Amount must be a number")
      .min(0.01, "Amount must be greater than 0")
      .test("is-decimal", "Amount must have at most 2 decimal places", (value) =>
        /^\d+(\.\d{1,2})?$/.test(value)
      )
      .required("Amount is required"),
    agency: Yup.string().required("Agency is required"),
    description: Yup.string()
      .max(500, "Description cannot exceed 500 characters")
      .nullable(),
  });

  // Prefill data if editing
  useEffect(() => {
    if (isOpen) {
      if (cash) {
        setFormData({
          paymentMethod: cash.paymentMethod || "cash",
          amount: cash.amount?.toFixed(2) || 0,
          description: cash.description || "",
          agency: cash.agency?._id || "",
        });
      } else {
        setFormData(initialFormState);
      }
      setErrors({});
    }
  }, [isOpen, cash]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  //  Handles raw typing
  const handleAmountChange = (value) => {
    setFormData((prev) => ({ ...prev, amount: value }));
  };

  const handleAmountBlur = () => {
    if (formData.amount !== "" && !isNaN(formData.amount)) {
      setFormData((prev) => ({
        ...prev,
        amount: parseFloat(prev.amount).toFixed(2),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      //  Validate with Yup
      await validationSchema.validate(formData, { abortEarly: false });
      setErrors({});

      const payload = {
        path: cash
          ? `expensev2/incoming-cash/${cash._id}`
          : "expensev2/incoming-cash",
        body: {
          ...formData,
          amount: parseFloat(formData.amount),
        },
      };

      if (cash) {
        await updateCash(payload).unwrap();
        toast.success("Cash entry updated");

        createUserLog({
          userId: user?._id,
          action: "UPDATE",
          entity: "IncomingCash",
          entityId: cash._id,
          entityType: "IncomingCash",
          status: "success",
          message: `${user?.fullName} updated incoming cash entry.`,
        });
      } else {
        await createCash(payload).unwrap();
        toast.success("Cash entry created");

        createUserLog({
          userId: user?._id,
          action: "CREATE",
          entity: "IncomingCash",
          entityType: "IncomingCash",
          status: "success",
          message: `${user?.fullName} created new incoming cash entry.`,
        });
      }

      onSuccess();
      setFormData(initialFormState);
    } catch (error) {
      if (error.name === "ValidationError") {
        const formErrors = {};
        error.inner.forEach((err) => {
          formErrors[err.path] = err.message;
        });
        setErrors(formErrors);
      } else {
        console.error("Failed to save cash entry:", error);
        toast.error("Error");

        createUserLog({
          userId: user?._id,
          action: cash ? "UPDATE" : "CREATE",
          entity: "IncomingCash",
          entityType: "IncomingCash",
          entityId: cash?._id || null,
          status: "fail",
          message: error.data?.message || "Failed to save cash entry",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{cash ? "Edit" : "Add New"} Incoming Cash</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit}>
          <ModalBody pb={6}>
            {/* Payment Method */}
            <FormControl isRequired mb={4} isInvalid={!!errors.paymentMethod}>
              <FormLabel>Payment Method</FormLabel>
              <Select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
              >
                <option value="cash">Cash</option>
                <option value="credit card">Credit Card</option>
                <option value="debit card">Debit Card</option>
              </Select>
              <FormErrorMessage>{errors.paymentMethod}</FormErrorMessage>
            </FormControl>

            {/* Amount */}
            <FormControl isRequired mb={4} isInvalid={!!errors.amount}>
              <FormLabel>Amount</FormLabel>
              <Input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                onBlur={handleAmountBlur}
                borderRadius="md"
                placeholder="Enter amount"
              />
              <FormErrorMessage>{errors.amount}</FormErrorMessage>
            </FormControl>

            {/* Agency */}
            <FormControl mb={4} isInvalid={!!errors.agency}>
              <FormLabel>Agency</FormLabel>
              <Select
                name="agency"
                value={formData.agency}
                onChange={handleChange}
                placeholder="Select agency"
              >
                {agencies.map((agency) => (
                  <option key={agency._id} value={agency._id}>
                    {agency.name}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{errors.agency}</FormErrorMessage>
            </FormControl>

            {/* Description */}
            <FormControl mb={4} isInvalid={!!errors.description}>
              <FormLabel>Description</FormLabel>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter description"
                rows={3}
              />
              <FormErrorMessage>{errors.description}</FormErrorMessage>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button onClick={onClose} mr={3}>
              Cancel
            </Button>
            <Button colorScheme="brand" type="submit" isLoading={isSubmitting}>
              {cash ? "Update" : "Create"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default AddEditCashModal;
