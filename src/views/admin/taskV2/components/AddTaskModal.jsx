import React, { useState } from "react";
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
} from "@chakra-ui/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useCreateItemMutation } from "api/apiSlice";
import CustomDatePicker from "components/datetime/CustomDatePicker";
import { toast } from "react-toastify";
import SearchUsers from "views/admin/whatsapp/WhatsappSettings/SearchUsers";
import { useUserActivityLog } from "hooks/useUserActivityLog";

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  due_date: Yup.date().required("Due date is required"),
  assigned_to: Yup.string().required("Assigned to is required"),
  priority: Yup.string().required("Priority is required"),
  type: Yup.string().required("Type is required"),
});

const AddTaskModal = ({
  isOpen,
  onClose,
  onSuccess,
  users,
  user,
  usersData,
}) => {
  const [createTask] = useCreateItemMutation();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const { createUserLog } = useUserActivityLog();
  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      due_date: null,
      assigned_to: "",
      priority: "Medium",
      type: "Custom",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const payload = {
          ...values,
          assigned_by: user._id,
          created_by: user._id,
          status: "Pending",
        };

        const response = await createTask({
          path: "/taskV2",
          body: payload,
        }).unwrap();

        createUserLog({
          userId: user?._id,
          action: "CREATE",
          entity: "Task",
          entityId: response._id,
          status: "success",
          message: `${user?.fullName} created task "${response?.title || "Untitled"}".`,
        });

        toast.success("Task created successfully");
        onSuccess();
        resetForm();
        onClose();
      } catch (error) {
        toast.error(error.data?.message || "Error creating task");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  const handleSelectUser = (user) => {
    formik.setFieldValue("assigned_to", user?._id || null);
  };
  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="xl" isCentered>
      <ModalOverlay />
      <ModalContent mx={{ base: 4, sm: 6 }} w="100%" maxW="600px">
        <ModalHeader>Create New Task</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={formik.handleSubmit}>
          <ModalBody overflowY="auto" maxH={{ base: "70vh", md: "75vh" }}>
            <VStack spacing={4} align="stretch">
              <FormControl
                isInvalid={
                  formik.errors.assigned_to && formik.touched.assigned_to
                }
              >
                <FormLabel>Assigned To</FormLabel>
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

              <FormControl
                isInvalid={formik.errors.title && formik.touched.title}
              >
                <FormLabel>Title</FormLabel>
                <Input
                  name="title"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Task title"
                  focusBorderColor={formik.errors.title ? "red.500" : "#E0B960"}
                />
                <FormErrorMessage>{formik.errors.title}</FormErrorMessage>
              </FormControl>

              <FormControl
                isInvalid={
                  formik.errors.description && formik.touched.description
                }
              >
                <FormLabel>Description</FormLabel>
                <Textarea
                  name="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Task description"
                  focusBorderColor={
                    formik.errors.description ? "red.500" : "#E0B960"
                  }
                />
                <FormErrorMessage>{formik.errors.description}</FormErrorMessage>
              </FormControl>

              <Flex gap={4} w="100%" direction={{ base: "column", md: "row" }}>
                <FormControl
                  isInvalid={formik.errors.due_date && formik.touched.due_date}
                >
                  <FormLabel>Due Date</FormLabel>
                  <CustomDatePicker
                    selectedDate={formik.values.due_date}
                    handleDateChange={(date) =>
                      formik.setFieldValue("due_date", date)
                    }
                    minDate={new Date()}
                    isCalendarOpen={isCalendarOpen}
                    toggleCalendar={() => setIsCalendarOpen(!isCalendarOpen)}
                    placeholder="Select the due date"
                  />
                  <FormErrorMessage>{formik.errors.due_date}</FormErrorMessage>
                </FormControl>

                <FormControl
                  isInvalid={formik.errors.priority && formik.touched.priority}
                >
                  <FormLabel>Priority</FormLabel>
                  <Select
                    name="priority"
                    value={formik.values.priority}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    focusBorderColor={
                      formik.errors.priority ? "red.500" : "#E0B960"
                    }
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </Select>
                  <FormErrorMessage>{formik.errors.priority}</FormErrorMessage>
                </FormControl>
              </Flex>

              <FormControl
                isInvalid={formik.errors.type && formik.touched.type}
              >
                <FormLabel>Type</FormLabel>
                <Select
                  name="type"
                  value={formik.values.type}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  focusBorderColor={formik.errors.type ? "red.500" : "#E0B960"}
                >
                  <option value="Follow-up">Follow-up</option>
                  <option value="Meeting">Meeting</option>
                  <option value="Site Visit">Site Visit</option>
                  <option value="Call">Call</option>
                  <option value="Email">Email</option>
                  <option value="Document Collection">
                    Document Collection
                  </option>
                  <option value="Custom">Custom</option>
                </Select>
                <FormErrorMessage>{formik.errors.type}</FormErrorMessage>
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="outline" mr={3} onClick={handleClose}>
              Cancel
            </Button>
            <Button
              colorScheme="brand"
              type="submit"
              isLoading={formik.isSubmitting}
            >
              Create Task
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default AddTaskModal;
