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

const EditTaskModal = ({
  isOpen,
  onClose,
  onSuccess,
  task,
  users,
  usersData,
}) => {
  const [updateTask] = useUpdateItemMutation();
  const [openCalendar, setOpenCalendar] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

  const { createUserLog } = useUserActivityLog();

  const toggleCalendar = (calendar) => {
    setOpenCalendar(openCalendar === calendar ? null : calendar);
  };

  const toUTCString = (date) => {
    return date ? moment(date).utcOffset(0, true).toISOString() : null;
  };

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
        const payload = {
          ...values,
          due_date: toUTCString(values.due_date),
        };

        const response = await updateTask({
          path: `/taskV2/${task._id}`,
          body: payload,
        }).unwrap();

        createUserLog({
          userId: user?._id,
          action: "UPDATE",
          entity: "Task",
          entityId: response._id,
          status: "success",
          message: `User "${user?.fullName}" updated task "${response?.title || "Untitled"}".`,
        });

        toast.success("Task updated successfully");
        onSuccess();
        onClose();
      } catch (error) {
        toast.error(error.data?.message || "Error updating task");
          const errorMsg =
        error?.data?.message || "Failed to update the priority of task. Please try again.";
        createUserLog({
          userId: user?._id,
          action: "UPDATE_FAIL",
          entity: "Task",
          entityId: task?._id || null,
          status: error?.status === "500" ? "error" : "fail",
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

  const handleSelectUser = (user) => {
    formik.setFieldValue("assigned_to", user?._id || null);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="xl" isCentered>
      <ModalOverlay />
      <ModalContent
        maxW={{ base: "95vw", md: "600px" }}
        mx={{ base: 2, md: "auto" }}
      >
        <ModalHeader>Edit Task</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={formik.handleSubmit}>
          <ModalBody
            maxHeight={{ base: "60vh", md: "70vh" }}
            overflowY="auto"
            pb={6}
          >
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
                  focusBorderColor={
                    formik.errors.title ? "red.500" : "brand.400"
                  }
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
                    formik.errors.description ? "red.500" : "brand.400"
                  }
                />
                <FormErrorMessage>{formik.errors.description}</FormErrorMessage>
              </FormControl>

              <Flex gap={4} w="100%" direction={{ base: "column", md: "row" }}>
                <FormControl
                  isInvalid={formik.errors.due_date && formik.touched.due_date}
                  flex={1}
                >
                  <FormLabel>Due Date</FormLabel>
                  <CustomDatePicker
                    selectedDate={formik.values.due_date}
                    handleDateChange={(date) =>
                      formik.setFieldValue("due_date", date)
                    }
                    minDate={new Date()}
                    isCalendarOpen={openCalendar === "due_date"}
                    toggleCalendar={() => toggleCalendar("due_date")}
                    placeholder="Select due date"
                    errors={formik.touched.due_date && formik.errors.due_date}
                  />
                  <FormErrorMessage>{formik.errors.due_date}</FormErrorMessage>
                </FormControl>

                <FormControl
                  isInvalid={formik.errors.priority && formik.touched.priority}
                  flex={1}
                >
                  <FormLabel>Priority</FormLabel>
                  <Select
                    name="priority"
                    value={formik.values.priority}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    focusBorderColor={
                      formik.errors.priority ? "red.500" : "brand.400"
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

              <Flex gap={4} w="100%" direction={{ base: "column", md: "row" }}>
                <FormControl
                  isInvalid={formik.errors.type && formik.touched.type}
                  flex={1}
                >
                  <FormLabel>Type</FormLabel>
                  <Select
                    name="type"
                    value={formik.values.type}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    focusBorderColor={
                      formik.errors.type ? "red.500" : "brand.400"
                    }
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

                <FormControl
                  isInvalid={formik.errors.status && formik.touched.status}
                  flex={1}
                >
                  <FormLabel>Status</FormLabel>
                  <Select
                    name="status"
                    value={formik.values.status}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    focusBorderColor={
                      formik.errors.status ? "red.500" : "brand.400"
                    }
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
          <ModalFooter>
            <Button variant="outline" mr={3} onClick={handleClose}>
              Cancel
            </Button>
            <Button
              colorScheme="brand"
              type="submit"
              isLoading={formik.isSubmitting}
              isDisabled={!formik.dirty || !formik.isValid}
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
