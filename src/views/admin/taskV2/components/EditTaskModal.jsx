import React, { useState, useEffect } from "react";
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
import { getApi } from "services/api";
import { toast } from "react-toastify";

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
  managers,
  agents,
  user,
}) => {
  const [updateTask] = useUpdateItemMutation();
  const [filteredAgents, setFilteredAgents] = useState([]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isLoadingAgents, setIsLoadingAgents] = useState(false);

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      due_date: null,
      assigned_to: "",
      priority: "Medium",
      type: "Custom",
      status: "Pending",
      manager: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const payload = {
          ...values,
        };

        await updateTask({
          path: `/taskV2/${task._id}`,
          body: payload,
        }).unwrap();

        toast.success("Task updated successfully");
        onSuccess();
        onClose();
      } catch (error) {
        toast.error(error.data?.message || "Error updating task");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const fetchManagerAgents = async (managerId) => {
    setIsLoadingAgents(true);
    try {
      const apiUrl = `api/v2/user/hierarchy?managerId=${managerId}`;
      const { data } = await getApi(apiUrl);

      if (data.results > 0) {
        setFilteredAgents(data.doc);
      } else {
        setFilteredAgents([]);
      }
    } catch (error) {
      toast({
        title: "Failed to fetch agents",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setFilteredAgents([]);
    } finally {
      setIsLoadingAgents(false);
    }
  };

  const handleManagerChange = async (e) => {
    const managerId = e.target.value;
    formik.setFieldValue("manager", managerId);
    formik.setFieldValue("assigned_to", "");
    
    if (managerId) {
      await fetchManagerAgents(managerId);
    } else {
      setFilteredAgents(agents);
    }
  };

  const getAvailableAgents = () => {
    if (user.role === "superAdmin") {
      return filteredAgents.length > 0 ? filteredAgents : agents;
    } else if (user?.roles[0]?.roleName === "Manager") {
      return filteredAgents.length > 0 ? filteredAgents : agents.filter(agent => agent.manager === user._id);
    }
    return [];
  };

  useEffect(() => {
    if (isOpen && task) {
      formik.setValues({
        title: task.title || "",
        description: task.description || "",
        due_date: task.due_date ? new Date(task.due_date) : null,
        assigned_to: task.assigned_to?._id || "",
        priority: task.priority || "Medium",
        type: task.type || "Custom",
        status: task.status || "Pending",
        manager: task.assigned_to?.manager || 
                (user?.roles[0]?.roleName === "Manager" ? user._id : ""),
      });

      if (user.role === "superAdmin" && task.assigned_to?.manager) {
        fetchManagerAgents(task.assigned_to.manager);
      } else if (user?.roles[0]?.roleName === "Manager") {
        const managerAgents = agents.filter(agent => agent.manager === user._id);
        setFilteredAgents(managerAgents);
      } else {
        setFilteredAgents(agents);
      }
    }
  }, [isOpen, task]);

  const handleClose = () => {
    formik.resetForm();
    setFilteredAgents([]);
    onClose();
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
          >
            <VStack spacing={4} align="stretch">
              <FormControl isInvalid={formik.errors.title && formik.touched.title}>
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

              <FormControl isInvalid={formik.errors.description && formik.touched.description}>
                <FormLabel>Description</FormLabel>
                <Textarea
                  name="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Task description"
                  focusBorderColor={formik.errors.description ? "red.500" : "#E0B960"}
                />
                <FormErrorMessage>{formik.errors.description}</FormErrorMessage>
              </FormControl>

              <Flex
                gap={4}
                w="100%"
                direction={{ base: "column", md: "row" }}
              >
                <FormControl isInvalid={formik.errors.due_date && formik.touched.due_date}>
                  <FormLabel>Due Date</FormLabel>
                  <CustomDatePicker
                    selectedDate={formik.values.due_date}
                    handleDateChange={(date) => formik.setFieldValue("due_date", date)}
                    minDate={new Date()}
                    isCalendarOpen={isCalendarOpen}
                    toggleCalendar={() => setIsCalendarOpen(!isCalendarOpen)}
                    placeholder="Select the due date"
                  />
                  <FormErrorMessage>{formik.errors.due_date}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={formik.errors.priority && formik.touched.priority}>
                  <FormLabel>Priority</FormLabel>
                  <Select
                    name="priority"
                    value={formik.values.priority}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    focusBorderColor={formik.errors.priority ? "red.500" : "#E0B960"}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </Select>
                  <FormErrorMessage>{formik.errors.priority}</FormErrorMessage>
                </FormControl>
              </Flex>

              <Flex
                gap={4}
                w="100%"
                direction={{ base: "column", md: "row" }} 
              >
                <FormControl isInvalid={formik.errors.type && formik.touched.type}>
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
                    <option value="Document Collection">Document Collection</option>
                    <option value="Custom">Custom</option>
                  </Select>
                  <FormErrorMessage>{formik.errors.type}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={formik.errors.status && formik.touched.status}>
                  <FormLabel>Status</FormLabel>
                  <Select
                    name="status"
                    value={formik.values.status}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    focusBorderColor={formik.errors.status ? "red.500" : "#E0B960"}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Overdue">Overdue</option>
                  </Select>
                  <FormErrorMessage>{formik.errors.status}</FormErrorMessage>
                </FormControl>
              </Flex>

              {user?.role === "superAdmin" && (
                <FormControl>
                  <FormLabel>Manager</FormLabel>
                  <Select
                    name="manager"
                    value={formik.values.manager}
                    onChange={handleManagerChange}
                    placeholder="Select manager"
                    focusBorderColor={formik.errors.manager ? "red.500" : "#E0B960"}
                  >
                    {managers.map((manager) => (
                      <option key={manager._id} value={manager._id}>
                        {manager.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              )}

              <FormControl isInvalid={formik.errors.assigned_to && formik.touched.assigned_to}>
                <FormLabel>Assign To</FormLabel>
                <Select
                  name="assigned_to"
                  value={formik.values.assigned_to}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder={isLoadingAgents ? "Loading agents..." : "Select agent"}
                  isDisabled={
                    user.role === "agent" || 
                    (user.role === "superAdmin" && !formik.values.manager) ||
                    getAvailableAgents().length === 0
                  }
                  focusBorderColor={formik.errors.assigned_to ? "red.500" : "#E0B960"}
                >
                  {getAvailableAgents().map((agent) => (
                    <option key={agent._id} value={agent._id}>
                      {agent.name}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>{formik.errors.assigned_to}</FormErrorMessage>
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
              Update Task
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default EditTaskModal;