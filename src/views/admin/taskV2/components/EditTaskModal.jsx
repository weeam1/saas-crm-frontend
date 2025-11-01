import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Button,
  VStack,
  Flex,
  FormErrorMessage,
  useColorModeValue,
  Text,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useUpdateItemMutation } from "api/apiSlice";
import CustomDatePicker from "components/datetime/CustomDatePicker";
import { toast } from "react-toastify";
import SearchUsers from "views/admin/whatsapp/WhatsappSettings/SearchUsers";
import moment from "moment";
import { useUserActivityLog } from "hooks/useUserActivityLog";

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  due_date: Yup.date().required("Due date is required"),
  assigned_to: Yup.string().required("Assigned to is required"),
  priority: Yup.string().required("Priority is required"),
  type: Yup.string().required("Type is required"),
  status: Yup.string().required("Status is required"),
});

const EditTaskModal = ({ isOpen, onClose, onSuccess, task, users, usersData }) => {
  const [updateTask] = useUpdateItemMutation();
  const [openCalendar, setOpenCalendar] = useState(null);
  const { createUserLog } = useUserActivityLog();
  const user = JSON.parse(localStorage.getItem("user"));

  const bgColor = useColorModeValue("white", "gray.800");
  const headerBg = useColorModeValue("brand.300", "brand.100");
  const headerText = useColorModeValue("brand.700", "brand.900");
  const footerBg = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const toggleCalendar = (calendar) => {
    setOpenCalendar(openCalendar === calendar ? null : calendar);
  };

  const toUTCString = (date) => (date ? moment(date).utcOffset(0, true).toISOString() : null);

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      due_date: null,
      assigned_to: "",
      priority: "Medium",
      type: "Custom",
      status: "Pending",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const payload = { ...values, due_date: toUTCString(values.due_date) };
        const response = await updateTask({ path: `/taskV2/${task._id}`, body: payload }).unwrap();

        createUserLog({
          userId: user?._id,
          action: "UPDATE",
          entity: "Task",
          entityType: "TaskV2",
          entityId: response._id,
          status: "success",
          message: `"${user?.fullName}" updated task "${response?.title || "Untitled"}".`,
        });

        toast.success("Task updated successfully");
        onSuccess();
        onClose();
      } catch (error) {
        toast.error(error.data?.message || "Error updating task");
        const errorMsg =
          error?.data?.message || "Failed to update the task. Please try again.";
        createUserLog({
          userId: user?._id,
          action: "UPDATE",
          entity: "Task",
          entityType: "TaskV2",
          entityId: task?._id || null,
          status: "error",
          message: errorMsg,
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (task) {
        formik.setValues({
          title: task.title || "",
          description: task.description || "",
          due_date: task.due_date ? new Date(task.due_date) : null,
          assigned_to: task.assigned_to?._id || "",
          priority: task.priority || "Medium",
          type: task.type || "Custom",
          status: task.status || "Pending",
        });
      } else {
        formik.resetForm();
      }
    }
  }, [isOpen, task]);

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  const handleSelectUser = (selectedUser) => {
    formik.setFieldValue("assigned_to", selectedUser?._id || null);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent
        bg={bgColor}
        borderRadius="2xl"
        shadow="2xl"
        maxW={{ base: "full", sm: "90vw", md: "600px" }}
        overflow="hidden"
        mx={{ base: 3, md: 0 }}
      >
        {/* Header */}
        <ModalHeader p={0} borderBottom="1px solid" borderColor={borderColor}>
          <Flex
            align="center"
            bg={headerBg}
            color={headerText}
            px={6}
            py={3}
            position="sticky"
            top="0"
            zIndex="10"
            boxShadow="md"
          >
            <Text fontSize={{ base: "md", md: "lg" }} fontWeight="bold">
              Edit Task
            </Text>
            <ModalCloseButton
              position="absolute"
              right="12px"
              top="10px"
              color={headerText}
              _hover={{ bg: "whiteAlpha.200" }}
            />
          </Flex>
        </ModalHeader>

        {/* Form */}
        <form onSubmit={formik.handleSubmit}>
          <ModalBody
            p={5}
            overflowY="auto"
            maxH="65vh"
            borderBottom="1px solid"
            borderColor={borderColor}
          >
            <VStack spacing={5} align="stretch">
              <FormControl isInvalid={formik.errors.assigned_to && formik.touched.assigned_to}>
                <FormLabel fontWeight="semibold">Assigned To</FormLabel>
                <SearchUsers
                  selectedUserId={formik.values.assigned_to || null}
                  users={
                    user?.roles[0]?.roleName === "Manager"
                      ? users
                      : usersData?.doc || []
                  }
                  onSelectUser={handleSelectUser}
                />
                <FormErrorMessage>{formik.errors.assigned_to}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={formik.errors.title && formik.touched.title}>
                <FormLabel fontWeight="semibold">Title</FormLabel>
                <Input
                  name="title"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter task title"
                  focusBorderColor="brand.500"
                />
                <FormErrorMessage>{formik.errors.title}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={formik.errors.description && formik.touched.description}>
                <FormLabel fontWeight="semibold">Description</FormLabel>
                <Textarea
                  name="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter task description"
                  focusBorderColor="brand.500"
                />
                <FormErrorMessage>{formik.errors.description}</FormErrorMessage>
              </FormControl>

              <Flex gap={4} direction={{ base: "column", md: "row" }}>
                <FormControl isInvalid={formik.errors.due_date && formik.touched.due_date} flex={1}>
                  <FormLabel fontWeight="semibold">Due Date</FormLabel>
                  <CustomDatePicker
                    selectedDate={formik.values.due_date}
                    handleDateChange={(date) => formik.setFieldValue("due_date", date)}
                    minDate={new Date()}
                    isCalendarOpen={openCalendar === "due_date"}
                    toggleCalendar={() => toggleCalendar("due_date")}
                    placeholder="Select due date"
                  />
                  <FormErrorMessage>{formik.errors.due_date}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={formik.errors.priority && formik.touched.priority} flex={1}>
                  <FormLabel fontWeight="semibold">Priority</FormLabel>
                  <Select
                    name="priority"
                    value={formik.values.priority}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    focusBorderColor="brand.500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </Select>
                  <FormErrorMessage>{formik.errors.priority}</FormErrorMessage>
                </FormControl>
              </Flex>

              <Flex gap={4} direction={{ base: "column", md: "row" }}>
                <FormControl isInvalid={formik.errors.type && formik.touched.type} flex={1}>
                  <FormLabel fontWeight="semibold">Type</FormLabel>
                  <Select
                    name="type"
                    value={formik.values.type}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    focusBorderColor="brand.500"
                  >
                    <option value="Follow-up">Follow-up</option>
                    <option value="Meeting">Meeting</option>
                    <option value="Site Visit">Site Visit</option>
                    <option value="Call">Call</option>
                    <option value="Email">Email</option>
                    <option value="Document Collection">Document Collection</option>
                    <option value="Custom">Custom</option>
                  </Select>
                  <FormErrorMessage>{formik.errors.type}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={formik.errors.status && formik.touched.status} flex={1}>
                  <FormLabel fontWeight="semibold">Status</FormLabel>
                  <Select
                    name="status"
                    value={formik.values.status}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    focusBorderColor="brand.500"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Overdue">Overdue</option>
                  </Select>
                  <FormErrorMessage>{formik.errors.status}</FormErrorMessage>
                </FormControl>
              </Flex>
            </VStack>
          </ModalBody>

          {/* Footer */}
          <ModalFooter
            position="sticky"
            bottom="0"
            bg={footerBg}
            borderTop="1px solid"
            borderColor={borderColor}
            py={3}
            px={5}
            zIndex="10"
            justifyContent="flex-end"
            gap={3}
          >
            <Button variant="outline" colorScheme="gray" onClick={handleClose} borderRadius="md">
              Cancel
            </Button>
            <Button
              colorScheme="brand"
              type="submit"
              isLoading={formik.isSubmitting}
              isDisabled={!formik.dirty || !formik.isValid}
              borderRadius="md"
            >
              Update Task
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default EditTaskModal;
