import { useState, useEffect } from "react";
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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useColorModeValue,
  Divider,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Select from "react-select";
import MultiSelectWithBox from "./components/MultiSelect";
import { useFetchItemsQuery } from "api/apiSlice";

const TeamForm = ({
  modalType,
  isOpen,
  onClose,
  onSubmit,
  initialData = null, // Add this
  isEditing = false, // Add this
  isSubmitting = false, // Add this
}) => {
  const borderColor = useColorModeValue("gray.200", "gray.600");

  // Separate search states for leader and members
  const [leaderSearch, setLeaderSearch] = useState("");
  const [membersSearch, setMembersSearch] = useState("");

  // Debounced search states
  const [debouncedLeaderSearch, setDebouncedLeaderSearch] = useState("");
  const [debouncedMembersSearch, setDebouncedMembersSearch] = useState("");

  // Track if user is actively searching
  const [isLeaderSearching, setIsLeaderSearching] = useState(false);
  const [isMembersSearching, setIsMembersSearching] = useState(false);

  // Debounce for leader search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedLeaderSearch(leaderSearch);
    }, 500);
    return () => clearTimeout(handler);
  }, [leaderSearch]);

  // Debounce for members search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedMembersSearch(membersSearch);
    }, 500);
    return () => clearTimeout(handler);
  }, [membersSearch]);

  // Build params object without undefined values
  const getLeaderParams = () => {
    const params = {
      page: 1,
      limit: 50,
    };

    // Only add search param if it exists and user is searching
    if (
      isLeaderSearching &&
      debouncedLeaderSearch &&
      debouncedLeaderSearch.trim() !== ""
    ) {
      params.search = debouncedLeaderSearch;
    }

    return params;
  };

  // Build params object without undefined values
  const getMembersParams = () => {
    const params = {
      page: 1,
      limit: 50,
    };

    // Only add search param if it exists and user is searching
    if (
      isMembersSearching &&
      debouncedMembersSearch &&
      debouncedMembersSearch.trim() !== ""
    ) {
      params.search = debouncedMembersSearch;
    }

    return params;
  };

  // Fetch employees for team leader - only when modal is open
  const {
    data: leaderResponse,
    isLoading: isLoadingLeaders,
    isFetching: isFetchingLeaders,
  } = useFetchItemsQuery(
    {
      path: "/evaluation/users",
      params: getLeaderParams(),
    },
    {
      skip: !isOpen, // Skip query when modal is closed
    },
  );

  // Fetch employees for team members - only when modal is open
  const {
    data: membersResponse,
    isLoading: isLoadingMembers,
    isFetching: isFetchingMembers,
  } = useFetchItemsQuery(
    {
      path: "/evaluation/users",
      params: getMembersParams(),
    },
    {
      skip: !isOpen, // Skip query when modal is closed
    },
  );

  // Transform leader data based on your API response structure
  const leaders =
    leaderResponse?.doc?.map((user) => ({
      value: user._id,
      label: user.fullName || `${user.firstName} ${user.lastName}`.trim(),
      role: user.roles?.[0]?.roleName || "",
    })) || [];

  // Transform members data based on your API response structure
  const employees =
    membersResponse?.doc?.map((user) => ({
      value: user._id,
      label: user.fullName || `${user.firstName} ${user.lastName}`.trim(),
      role: user.roles?.[0]?.roleName || "",
    })) || [];

  const teamSchema = yup.object().shape({
    name: yup.string().required("Team name is required"),
    description: yup.string().required("Description is required"),
    teamLeader: yup.mixed().required("Team leader is required"),
    employees: yup
      .array()
      .min(1, "At least one employee is required")
      .required(),
  });
  // Prepare default values from initialData for edit mode
  const getDefaultValues = () => {
    if (initialData && isEditing) {
      console.log("Initial data for edit:", initialData); // Add this to debug

      return {
        name: initialData.name || "",
        description: initialData.description || "",
        teamLeader: initialData.leader // Changed from initialData.teamLeader to initialData.leader
          ? {
              value: initialData.leader._id, // Use leader._id directly
              label:
                initialData.leader.fullName ||
                (initialData.leader.firstName && initialData.leader.lastName
                  ? `${initialData.leader.firstName} ${initialData.leader.lastName}`.trim()
                  : initialData.leader.name || ""),
            }
          : null,
        employees: initialData.members?.map((member) => member._id) || [], // Just map to IDs
      };
    }
    return {
      name: "",
      description: "",
      teamLeader: null,
      employees: [],
    };
  };

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(teamSchema),
    mode: "onChange",
    defaultValues: getDefaultValues(),
  });

  // Reset form when modal opens or initialData changes
  useEffect(() => {
    if (isOpen) {
      reset(getDefaultValues());
      // Reset search states but keep showing initial data
      setLeaderSearch("");
      setMembersSearch("");
      setIsLeaderSearching(false);
      setIsMembersSearching(false);
      setDebouncedLeaderSearch("");
      setDebouncedMembersSearch("");
    }
  }, [isOpen, initialData, isEditing, reset]);

  const selectedTeamLeader = watch("teamLeader");

  const availableEmployees = employees.filter(
    (emp) => emp.value !== selectedTeamLeader?.value,
  );

  // Simple format option label without avatar
  const formatOptionLabel = ({ label, role }) => (
    <Box>
      <Text fontSize="sm">{label}</Text>
      {role && (
        <Text fontSize="xs" color="gray.500">
          {role}
        </Text>
      )}
    </Box>
  );

  const submitHandler = (formData) => {
    const payload = {
      name: formData.name,
      description: formData.description,
      leader: formData.teamLeader?.value,
      members: formData.employees,
    };

    onSubmit(payload);
    // Don't close here - let the parent component handle closing after successful API call
  };

  // Handle leader search with search mode tracking
  const handleLeaderSearchChange = (value) => {
    setLeaderSearch(value);
    if (value && value.trim() !== "") {
      setIsLeaderSearching(true);
    } else {
      setIsLeaderSearching(false);
    }
  };

  // Handle members search with search mode tracking
  const handleMembersSearchChange = (value) => {
    setMembersSearch(value);
    if (value && value.trim() !== "") {
      setIsMembersSearching(true);
    } else {
      setIsMembersSearching(false);
    }
  };

  // Handle leader menu close - reset search but keep data
  const handleLeaderMenuClose = () => {
    setLeaderSearch("");
    setIsLeaderSearching(false);
    setDebouncedLeaderSearch("");
  };

  // Handle members menu close - reset search but keep data
  const handleMembersMenuClose = () => {
    setMembersSearch("");
    setIsMembersSearching(false);
    setDebouncedMembersSearch("");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalOverlay />
      <ModalContent maxW="800px">
        <ModalHeader>
          {modalType === "create" ? "Create Team" : "Edit Team"}
        </ModalHeader>

        <ModalCloseButton />

        <ModalBody pb={6}>
          <Box as="form" onSubmit={handleSubmit(submitHandler)}>
            <VStack spacing={6} align="stretch">
              <FormControl isInvalid={!!errors.name}>
                <FormLabel>Team Name</FormLabel>
                <Input
                  {...register("name")}
                  placeholder="Enter team name"
                  focusBorderColor="brand.500"
                />
                <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.description}>
                <FormLabel>Description</FormLabel>
                <Textarea
                  {...register("description")}
                  placeholder="Enter team description"
                  focusBorderColor="brand.500"
                />
                <FormErrorMessage>
                  {errors.description?.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.teamLeader}>
                <FormLabel>Team Leader</FormLabel>

                <Controller
                  name="teamLeader"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={leaders}
                      formatOptionLabel={formatOptionLabel}
                      isLoading={isLoadingLeaders || isFetchingLeaders}
                      placeholder="Search and select team leader..."
                      isClearable
                      onInputChange={handleLeaderSearchChange}
                      onMenuClose={handleLeaderMenuClose}
                      inputValue={leaderSearch}
                      noOptionsMessage={({ inputValue }) => {
                        if (isLoadingLeaders) return "Loading...";
                        if (inputValue) return "No leaders found";
                        if (leaders.length === 0) return "No leaders available";
                        return "Type to search leaders";
                      }}
                      loadingMessage={() => "Loading leaders..."}
                    />
                  )}
                />

                <FormErrorMessage>
                  {errors.teamLeader?.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.employees}>
                <FormLabel>Team Members</FormLabel>

                <Controller
                  name="employees"
                  control={control}
                  render={({ field }) => (
                    <MultiSelectWithBox
                      options={availableEmployees}
                      value={field.value}
                      onChange={field.onChange}
                      onSearch={handleMembersSearchChange}
                      onMenuClose={handleMembersMenuClose}
                      searchValue={membersSearch}
                      placeholder="Search and select team members..."
                      formatOptionLabel={formatOptionLabel}
                      isLoading={isLoadingMembers || isFetchingMembers}
                      noOptionsMessage={({ inputValue }) => {
                        if (isLoadingMembers) return "Loading...";
                        if (inputValue) return "No members found";
                        if (employees.length === 0)
                          return "No members available";
                        return "Type to search members";
                      }}
                      loadingMessage={() => "Loading members..."}
                    />
                  )}
                />

                <FormErrorMessage>{errors.employees?.message}</FormErrorMessage>
              </FormControl>

              <Divider />

              <HStack justify="flex-end" spacing={4}>
                <Button variant="outline" onClick={onClose} size="lg">
                  Cancel
                </Button>

                <Button
                  colorScheme="brand"
                  type="submit"
                  isLoading={isSubmitting} // Use the prop instead of false
                  loadingText={isEditing ? "Updating..." : "Creating..."}
                  isDisabled={!isValid || isSubmitting}
                  size="lg"
                  px={8}
                >
                  {isEditing ? "Update Team" : "Create Team"}
                </Button>
              </HStack>
            </VStack>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default TeamForm;
