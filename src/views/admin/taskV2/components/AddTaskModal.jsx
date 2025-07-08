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
  RadioGroup,
  Radio,
  Stack,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useCreateItemMutation } from "api/apiSlice";
import CustomDatePicker from "components/datetime/CustomDatePicker";
import { toast } from "react-toastify";
import { getApi } from "services/api";

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  due_date: Yup.date().required("Due date is required"),
  assigned_to: Yup.string().required("Assigned to is required"),
  priority: Yup.string().required("Priority is required"),
  type: Yup.string().required("Type is required"),
  assign_type: Yup.string().required("Assign type is required"),
});

const AddTaskModal = ({ isOpen, onClose, onSuccess, managers, agents, user }) => {
  const [createTask] = useCreateItemMutation();
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  useEffect(() => {
    if (isOpen) {
      formik.resetForm();
      if (user?.roles[0]?.roleName === "Manager") {
        formik.setFieldValue("assign_type", "agent");
        formik.setFieldValue("team_lead", user._id);
        fetchTeamMembers(user._id);
      } else if (user.role === "superAdmin") {
        formik.setFieldValue("assign_type", "manager");
        formik.setFieldValue("team_lead", null);
      }
    }
  }, [isOpen]);

  const fetchTeamMembers = async (managerId) => {
    setIsLoadingUsers(true);
    try {
      const apiUrl = `api/v2/user/hierarchy?managerId=${managerId}`;
      const { data } = await getApi(apiUrl);
      setFilteredUsers(data.doc || []);
    } catch (error) {
      toast.error("Failed to fetch team members");
      setFilteredUsers([]);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handleAssignTypeChange = (value) => {
    formik.setFieldValue("assign_type", value);
    formik.setFieldValue("assigned_to", "");
    
    if (value === "manager") {
      formik.setFieldValue("team_lead", null);
      setFilteredUsers(managers);
    } else if (value === "agent") {
      if (user?.roles[0]?.roleName === "Manager") {
        formik.setFieldValue("team_lead", user._id);
        fetchTeamMembers(user._id);
      } else if (user.role === "superAdmin") {
        formik.setFieldValue("team_lead", null);
        setFilteredUsers(agents);
      }
    }
  };

  const handleManagerChange = async (e) => {
    const managerId = e.target.value;
    formik.setFieldValue("team_lead", managerId);
    formik.setFieldValue("assigned_to", "");
    
    if (managerId) {
      await fetchTeamMembers(managerId);
    } else {
      setFilteredUsers(agents);
    }
  };

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      due_date: null,
      assigned_to: "",
      team_lead: user?.roles[0]?.roleName === "Manager" ? user._id : null,
      priority: "Medium",
      type: "Custom",
      assign_type: user?.roles[0]?.roleName === "Manager" ? "agent" : "manager",
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

        if (values.assign_type === "manager") {
          payload.team_lead = null;
        }

        if (values.assign_type === "agent" && !payload.team_lead && user?.roles[0]?.roleName === "Manager") {
          payload.team_lead = user._id;
        }

        await createTask({
          path: "/taskV2",
          body: payload,
        }).unwrap();

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

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="xl" isCentered>
      <ModalOverlay />
      <ModalContent
        mx={{ base: 4, sm: 6 }} 
        w="100%"
        maxW="600px"
      >
        <ModalHeader>Create New Task</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={formik.handleSubmit}>
          <ModalBody
            overflowY="auto"
            maxH={{ base: "70vh", md: "75vh" }}
          >
            <VStack spacing={4} align="stretch">
              <FormControl isRequired>
                <FormLabel>Assign To</FormLabel>
                <RadioGroup
                  name="assign_type"
                  value={formik.values.assign_type}
                  onChange={handleAssignTypeChange}
                >
                  <Stack direction="row">
                    <Radio value="manager" isDisabled={user?.roles[0]?.roleName === "Manager"}>
                      Manager
                    </Radio>
                    <Radio value="agent">Agent</Radio>
                  </Stack>
                </RadioGroup>
              </FormControl>

              {formik.values.assign_type === "agent" && user.role === "superAdmin" && (
                <FormControl>
                  <FormLabel>Team Lead </FormLabel>
                  <Select
                    name="team_lead"
                    value={formik.values.team_lead || ""}
                    onChange={handleManagerChange}
                    placeholder="Select team lead"
                    focusBorderColor="#E0B960"
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
                <FormLabel>
                  {formik.values.assign_type === "manager" ? "Assign To Manager" : "Assign To Agent"}
                </FormLabel>
                <Select
                  name="assigned_to"
                  value={formik.values.assigned_to}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder={
                    isLoadingUsers 
                      ? "Loading users..." 
                      : `Select ${formik.values.assign_type}`
                  }
                  isDisabled={isLoadingUsers || filteredUsers.length === 0}
                  focusBorderColor={formik.errors.assigned_to ? "red.500" : "#E0B960"}
                >
                  {filteredUsers.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.name}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>{formik.errors.assigned_to}</FormErrorMessage>
              </FormControl>

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