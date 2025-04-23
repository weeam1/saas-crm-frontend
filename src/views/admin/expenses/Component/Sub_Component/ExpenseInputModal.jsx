import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Input,
  VStack,
  Button,
  FormLabel,
  SimpleGrid,
  Select
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { useFetchItemsQuery } from "api/apiSlice";

const ExpenseInputModal = ({ isOpen, onClose, data, isEditable, onSubmit }) => {
    const user = JSON.parse(localStorage.getItem("user")) || {};
  
    const {
      data: types,
    } = useFetchItemsQuery(
      { path: `/expense_types` },
      { refetchOnMountOrArgChange: true, skip: !user._id }
    );
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      expenseNo: data?.expenseNo || "",
      type: data?.type?._id || "",
      description: data?.description || "",
      amount: data?.amount || "",
      username: data?.addedBy?.username || "",
      fullName: data?.addedBy?.fullName || "",
      location: data?.addedBy?.location || "",
      phoneNumber: data?.addedBy?.phoneNumber || "",
      agencyName: data?.addedBy?.agency?.name || "",
    },
    onSubmit: (values) => {
      const updated = {
        ...data,
        type: values.type,
        description: values.description,
        amount: values.amount,
      };

      if (onSubmit) onSubmit(updated);
    },
  });

  console.log("data", data)
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent
        as={isEditable ? "form" : "div"}
        onSubmit={formik.handleSubmit}
      >
        <ModalHeader display="flex" justifyContent="space-between">
          {isEditable ? "Edit Expense" : "View Expense"}
        </ModalHeader>
        <ModalCloseButton onClick={onClose} />

        <ModalBody>
          <VStack spacing={4} align="stretch">
            {isEditable ? (
              <>
                <div>
                  <FormLabel>Type</FormLabel>
                  <Select
                    name="type"
                    value={formik.values.type} 
                    onChange={formik.handleChange}
                    placeholder="Select type"
                    focusBorderColor="brand.500"
                  >
                    {types?.doc?.length > 0 ? (
                      types.doc.map((type) => (
                        <option key={type._id} value={type._id} >
                          {type.name}
                        </option>
                      ))
                    ) : (
                      <option value="">No types available</option>
                    )}
                  </Select>
                </div>
                <div>
                  <FormLabel>Description</FormLabel>
                  <Input
                    name="description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    placeholder="e.g., Office rent or utilities"
                    focusBorderColor="brand.500"
                  />
                </div>
                <div>
                  <FormLabel>Amount</FormLabel>
                  <Input
                    name="amount"
                    type="number"
                    value={formik.values.amount}
                    onChange={formik.handleChange}
                    placeholder="e.g., 5050"
                    focusBorderColor="brand.500"
                  />
                </div>
              </>
            ) : (
              <>
                <SimpleGrid columns={2} spacing={4}>
                  <div>
                    <FormLabel>Expense No</FormLabel>
                    <Input
                      value={formik.values.expenseNo}
                      isReadOnly
                      focusBorderColor="gray.300"
                      bg="gray.50"
                    />
                  </div>
                  <div>
                    <FormLabel>Type</FormLabel>
                    <Input
                      value={formik.values.type}
                      isReadOnly
                      focusBorderColor="gray.300"
                      bg="gray.50"
                    />
                  </div>
                  <div>
                    <FormLabel>Description</FormLabel>
                    <Input
                      value={formik.values.description}
                      isReadOnly
                      focusBorderColor="gray.300"
                      bg="gray.50"
                    />
                  </div>
                  <div>
                    <FormLabel>Amount</FormLabel>
                    <Input
                      value={formik.values.amount}
                      isReadOnly
                      focusBorderColor="gray.300"
                      bg="gray.50"
                    />
                  </div>
                  <div>
                    <FormLabel>Username</FormLabel>
                    <Input
                      value={formik.values.username}
                      isReadOnly
                      focusBorderColor="gray.300"
                      bg="gray.50"
                    />
                  </div>
                  <div>
                    <FormLabel>Full Name</FormLabel>
                    <Input
                      value={formik.values.fullName}
                      isReadOnly
                      focusBorderColor="gray.300"
                      bg="gray.50"
                    />
                  </div>
                  <div>
                    <FormLabel>Location</FormLabel>
                    <Input
                      value={formik.values.location}
                      isReadOnly
                      focusBorderColor="gray.300"
                      bg="gray.50"
                    />
                  </div>
                  <div>
                    <FormLabel>Phone Number</FormLabel>
                    <Input
                      value={formik.values.phoneNumber}
                      isReadOnly
                      focusBorderColor="gray.300"
                      bg="gray.50"
                    />
                  </div>
                  <div>
                    <FormLabel>Agency Name</FormLabel>
                    <Input
                      value={formik.values.agencyName}
                      isReadOnly
                      focusBorderColor="gray.300"
                      bg="gray.50"
                    />
                  </div>
                </SimpleGrid>
              </>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter justifyContent="space-between">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {isEditable && (
            <Button type="submit" variant="brand">
              Submit
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ExpenseInputModal;
