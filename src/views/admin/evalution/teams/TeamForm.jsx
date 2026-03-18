// TeamForm.jsx
import { useState } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useColorModeValue,
  Divider,
  IconButton,
  Avatar,
  Badge,
  Wrap,
  WrapItem,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Select from "react-select";
import { FiX } from "react-icons/fi";

// Mock employees data - replace with your actual API call
const mockEmployees = [
  {
    value: "emp1",
    label: "John Doe",
    role: "Team Lead",
    avatar: "https://bit.ly/dan-abramov",
  },
  {
    value: "emp2",
    label: "Sarah Wilson",
    role: "SDR",
    avatar: "https://bit.ly/sage-adebayo",
  },
  {
    value: "emp3",
    label: "Mike Chen",
    role: "AE",
    avatar: "https://bit.ly/prosper-baba",
  },
  {
    value: "emp4",
    label: "Emily Davis",
    role: "SDR",
    avatar: "https://bit.ly/code-beast",
  },
  {
    value: "emp5",
    label: "Alex Kumar",
    role: "AE",
    avatar: "https://bit.ly/kent-c-dodds",
  },
  {
    value: "emp6",
    label: "Lisa Wang",
    role: "CSM",
    avatar: "https://bit.ly/ryan-florence",
  },
  {
    value: "emp7",
    label: "Tom Harris",
    role: "SDR",
    avatar: "https://bit.ly/prosper-baba",
  },
];

const TeamForm = ({
  onClose,
  onSubmit,
  initialData = null,
  isEditing = false,
}) => {
  const [employees] = useState(mockEmployees);

  // Colors
  const cardBg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const headerBg = useColorModeValue("gray.50", "gray.600");

  // Validation schema
  const teamSchema = yup.object().shape({
    name: yup
      .string()
      .required("Team name is required")
      .min(3, "Team name must be at least 3 characters")
      .max(50, "Team name cannot exceed 50 characters"),
    description: yup
      .string()
      .max(200, "Description cannot exceed 200 characters")
      .required("Description is required"),
    teamLeader: yup.mixed().required("Team leader is required"),
    employees: yup
      .array()
      .min(1, "At least one employee is required")
      .required("Employees are required"),
  });

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(teamSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      teamLeader: initialData?.teamLeader || null,
      employees: initialData?.employees || [],
    },
  });

  const selectedTeamLeader = watch("teamLeader");
  const selectedEmployees = watch("employees");

  // Custom styles for react-select
  const selectStyles = {
    control: (base, state) => ({
      ...base,
      borderColor: state.isFocused ? "brand.500" : borderColor,
      boxShadow: state.isFocused ? "0 0 0 1px brand.500" : "none",
      "&:hover": {
        borderColor: "brand.400",
      },
      minHeight: "40px",
      backgroundColor: cardBg,
    }),
    option: (base, { isFocused, isSelected }) => ({
      ...base,
      backgroundColor: isSelected
        ? "brand.500"
        : isFocused
          ? "brand.50"
          : "white",
      color: isSelected ? "white" : "gray.700",
      "&:active": {
        backgroundColor: "brand.600",
      },
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: "brand.50",
      borderRadius: "20px",
      padding: "2px",
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: "brand.700",
      fontSize: "0.85rem",
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: "brand.500",
      "&:hover": {
        backgroundColor: "brand.100",
        color: "brand.700",
      },
    }),
  };

  // Format option label with avatar
  const formatOptionLabel = ({ label, role, avatar }) => (
    <HStack spacing={2}>
      <Avatar size="xs" name={label} src={avatar} />
      <Box>
        <Text fontSize="sm">{label}</Text>
        <Text fontSize="xs" color="gray.500">
          {role}
        </Text>
      </Box>
    </HStack>
  );

  const submitHandler = (formData) => {
    onSubmit(formData);
  };

  return (
    <Box>
      <Box as="form" onSubmit={handleSubmit(submitHandler)}>
        <VStack spacing={6} align="stretch">
          {/* Team Name */}
          <FormControl isInvalid={!!errors.name} isRequired>
            <FormLabel fontWeight="600" color="gray.700">
              Team Name
            </FormLabel>
            <Input
              placeholder="e.g., Sales Team Alpha"
              {...register("name")}
              focusBorderColor="brand.500"
              borderColor={borderColor}
              size="md"
            />
            {errors.name && (
              <FormErrorMessage>{errors.name.message}</FormErrorMessage>
            )}
          </FormControl>

          {/* Description */}
          <FormControl isInvalid={!!errors.description} isRequired>
            <FormLabel fontWeight="600" color="gray.700">
              Description
            </FormLabel>
            <Textarea
              placeholder="Describe the team purpose and responsibilities..."
              {...register("description")}
              focusBorderColor="brand.500"
              borderColor={borderColor}
              resize="vertical"
              size="md"
            />
            {errors.description && (
              <FormErrorMessage>{errors.description.message}</FormErrorMessage>
            )}
            <Text fontSize="xs" color="gray.500" mt={1}>
              {watch("description")?.length || 0}/200 characters
            </Text>
          </FormControl>

          {/* Team Leader Select */}
          <FormControl isInvalid={!!errors.teamLeader} isRequired>
            <FormLabel fontWeight="600" color="gray.700">
              Team Leader
            </FormLabel>
            <Controller
              name="teamLeader"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={employees}
                  formatOptionLabel={formatOptionLabel}
                  placeholder="Select team leader..."
                  isClearable
                  styles={selectStyles}
                />
              )}
            />
            {errors.teamLeader && (
              <FormErrorMessage>{errors.teamLeader.message}</FormErrorMessage>
            )}
          </FormControl>

          {/* Employees Multi-Select */}
          <FormControl isInvalid={!!errors.employees} isRequired>
            <FormLabel fontWeight="600" color="gray.700">
              Team Members
            </FormLabel>
            <Controller
              name="employees"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  isMulti
                  options={employees.filter(
                    (emp) => emp.value !== selectedTeamLeader?.value,
                  )}
                  formatOptionLabel={formatOptionLabel}
                  placeholder="Select team members..."
                  closeMenuOnSelect={false}
                  styles={selectStyles}
                />
              )}
            />
            {errors.employees && (
              <FormErrorMessage>{errors.employees.message}</FormErrorMessage>
            )}
          </FormControl>

          <Divider />

          {/* Action Buttons */}
          <HStack justify="flex-end" spacing={4}>
            <Button variant="outline" onClick={onClose} size="lg">
              Cancel
            </Button>
            <Button
              size="lg"
              colorScheme="brand"
              type="submit"
              isDisabled={!isValid}
              px={8}
            >
              {isEditing ? "Update Team" : "Create Team"}
            </Button>
          </HStack>
        </VStack>
      </Box>
    </Box>
  );
};

export default TeamForm;
