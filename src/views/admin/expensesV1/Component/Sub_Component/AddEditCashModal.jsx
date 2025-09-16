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
  Input,
  Select,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useCreateItemMutation, useUpdateItemMutation } from "api/apiSlice";
import { useUserActivityLog } from "hooks/useUserActivityLog";
import { toast } from "react-toastify";

const AddEditCashModal = ({ isOpen, onClose, cash, agencies, onSuccess }) => {
  const { createUserLog } = useUserActivityLog();
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const [createCash] = useCreateItemMutation();
  const [updateCash] = useUpdateItemMutation();

  const [formData, setFormData] = useState({
    paymentMethod: cash?.paymentMethod || "cash",
    amount: cash?.amount || 0,
    description: cash?.description || "",
    agency: cash?.agency?._id || "",
  });

  const initialFormState = {
    paymentMethod: "cash",
    amount: 0,
    description: "",
    agency: "",
  };

  useEffect(() => {
    if (isOpen && !cash) {
      setFormData(initialFormState);
    } else if (isOpen && cash) {
      setFormData({
        paymentMethod: cash.paymentMethod || "cash",
        amount: cash.amount || 0,
        description: cash.description || "",
        agency: cash.agency?._id || "",
      });
    }
  }, [isOpen, cash]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAmountChange = (value) => {
    setFormData((prev) => ({ ...prev, amount: parseFloat(value) || 0 }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        path: cash
          ? `expensev2/incoming-cash/${cash._id}`
          : "expensev2/incoming-cash",
        body: formData,
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
            <FormControl isRequired mb={4}>
              <FormLabel>Payment Method</FormLabel>
              <Select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
              >
                <option value="cash">Cash</option>
                <option value="credit">Credit</option>
                <option value="debit">Debit</option>
              </Select>
            </FormControl>

            <FormControl isRequired mb={4}>
              <FormLabel>Amount</FormLabel>
              <NumberInput
                value={formData.amount}
                onChange={handleAmountChange}
                min={0}
                precision={2}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <FormControl mb={4}>
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
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>Description</FormLabel>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter description"
                rows={3}
              />
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
