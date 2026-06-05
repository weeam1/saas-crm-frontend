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
  Divider,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Select from "react-select";
import MultiSelectWithBox from "./components/MultiSelect";
import { useFetchItemsQuery } from "api/apiSlice";
import { useModalColors } from "hooks/useModalColors";

const TeamForm = ({
  modalType,
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isEditing = false,
  isSubmitting = false,
}) => {
  const colors = useModalColors();

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

  // Build params for leader search - using v2/user/search_users
  const getLeaderParams = () => {
    const params = {
      page: 1,
      limit: 50,
    };

    if (
      isLeaderSearching &&
      debouncedLeaderSearch &&
      debouncedLeaderSearch.trim() !== ""
    ) {
      params.search = debouncedLeaderSearch;
    }

    return params;
  };

  // Build params for members search - using v2/user/search_users
  const getMembersParams = () => {
    const params = {
      page: 1,
      limit: 50,
    };

    if (
      isMembersSearching &&
      debouncedMembersSearch &&
      debouncedMembersSearch.trim() !== ""
    ) {
      params.search = debouncedMembersSearch;
    }

    return params;
  };

  // Fetch users for team leader using v2/user/search_users
  const {
    data: leaderResponse,
    isLoading: isLoadingLeaders,
    isFetching: isFetchingLeaders,
  } = useFetchItemsQuery(
    {
      path: "/v2/user/search_users",
      params: getLeaderParams(),
    },
    {
      skip: !isOpen,
    },
  );

  // Fetch users for team members using v2/user/search_users
  const {
    data: membersResponse,
    isLoading: isLoadingMembers,
    isFetching: isFetchingMembers,
  } = useFetchItemsQuery(
    {
      path: "/v2/user/search_users",
      params: getMembersParams(),
    },
    {
      skip: !isOpen,
    },
  );

  // Get users from response - handling different response structures
  const getUsersFromResponse = (response) => {
    if (response?.doc) return response.doc;
    if (response?.data) return response.data;
    if (Array.isArray(response)) return response;
    return [];
  };

  // Transform leader data based on API response structure
  const leaders = getUsersFromResponse(leaderResponse).map((user) => ({
    value: user._id,
    label: user.fullName || `${user.firstName} ${user.lastName}`.trim(),
  }));

  // Transform members data based on API response structure
  const employees = getUsersFromResponse(membersResponse).map((user) => ({
    value: user._id,
    label: user.fullName || `${user.firstName} ${user.lastName}`.trim(),
  }));

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
      return {
        name: initialData.name || "",
        description: initialData.description || "",
        teamLeader: initialData.leader
          ? {
              value: initialData.leader._id,
              label:
                initialData.leader.fullName ||
                (initialData.leader.firstName && initialData.leader.lastName
                  ? `${initialData.leader.firstName} ${initialData.leader.lastName}`.trim()
                  : initialData.leader.name || ""),
            }
          : null,
        employees: initialData.members?.map((member) => member._id) || [],
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

  // Simple format option label without avatar (keeping original UI)
  const formatOptionLabel = ({ label }) => (
    <Box>
      <Text fontSize="sm" color={colors.bodyText}>{label}</Text>
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

  // Custom select styles for dark theme
  const selectStyles = {
    control: (base, { isFocused }) => ({
      ...base,
      backgroundColor: colors.bgInput,
      borderColor: isFocused ? colors.accentGold : colors.borderColor,
      boxShadow: isFocused ? `0 0 0 1px ${colors.accentGold}` : "none",
      "&:hover": {
        borderColor: colors.accentGold,
      },
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: colors.bg,
      border: `1px solid ${colors.borderColor}`,
    }),
    option: (base, { isFocused, isSelected }) => ({
      ...base,
      backgroundColor: isSelected
        ? colors.accentGold
        : isFocused
        ? colors.bgDeep
        : colors.bg,
      color: isSelected ? colors.headerText : colors.bodyText,
      "&:hover": {
        backgroundColor: colors.bgDeep,
        color: colors.accentGold,
      },
    }),
    singleValue: (base) => ({
      ...base,
      color: colors.headingText,
    }),
    input: (base) => ({
      ...base,
      color: colors.headingText,
    }),
    placeholder: (base) => ({
      ...base,
      color: colors.mutedText,
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: colors.mutedText,
      "&:hover": {
        color: colors.accentGold,
      },
    }),
    clearIndicator: (base) => ({
      ...base,
      color: colors.mutedText,
      "&:hover": {
        color: colors.accentGold,
      },
    }),
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" isCentered>
      <ModalOverlay bg={colors.overlayBg} backdropFilter="blur(4px)" />
      <ModalContent
        maxW="800px"
        maxH="90vh"
        overflow="hidden"
        bg={colors.bg}
        borderRadius="2xl"
        boxShadow={colors.modalShadow}
        border="1px solid"
        borderColor={colors.borderColor}
      >
        <ModalHeader bg={colors.headerBg} color={colors.headerText} borderTopRadius="2xl">
          {modalType === "create" ? "Create Team" : "Edit Team"}
        </ModalHeader>
        <ModalCloseButton color={colors.headerText} _hover={{ bg: colors.closeBtnHoverBg }} />
        <ModalBody
          pb={6}
          overflowY="auto"
          bg={colors.bg}
          sx={{
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-track": {
              background: colors.bgInput,
              borderRadius: "full",
            },
            "&::-webkit-scrollbar-thumb": {
              background: colors.accentGold,
              borderRadius: "full",
            },
          }}
        >
          <Box as="form" onSubmit={handleSubmit(submitHandler)}>
            <VStack spacing={6} align="stretch">
              <FormControl isInvalid={!!errors.name}>
                <FormLabel color={colors.labelColor}>Team Name</FormLabel>
                <Input
                  {...register("name")}
                  placeholder="Enter team name"
                  bg={colors.bgInput}
                  borderColor={colors.borderColor}
                  color={colors.headingText}
                  _placeholder={{ color: colors.mutedText }}
                  _focus={{
                    borderColor: colors.accentGold,
                    boxShadow: `0 0 0 1px ${colors.accentGold}`,
                  }}
                  _hover={{ borderColor: colors.accentGold }}
                />
                <FormErrorMessage color={colors.badgeErrorText}>
                  {errors.name?.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.description}>
                <FormLabel color={colors.labelColor}>Description</FormLabel>
                <Textarea
                  {...register("description")}
                  placeholder="Enter team description"
                  bg={colors.bgInput}
                  borderColor={colors.borderColor}
                  color={colors.headingText}
                  _placeholder={{ color: colors.mutedText }}
                  _focus={{
                    borderColor: colors.accentGold,
                    boxShadow: `0 0 0 1px ${colors.accentGold}`,
                  }}
                  _hover={{ borderColor: colors.accentGold }}
                />
                <FormErrorMessage color={colors.badgeErrorText}>
                  {errors.description?.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.teamLeader}>
                <FormLabel color={colors.labelColor}>Team Leader</FormLabel>
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
                      styles={selectStyles}
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
                <FormErrorMessage color={colors.badgeErrorText}>
                  {errors.teamLeader?.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.employees}>
                <FormLabel color={colors.labelColor}>Team Members</FormLabel>
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
                      selectStyles={selectStyles}
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
                <FormErrorMessage color={colors.badgeErrorText}>
                  {errors.employees?.message}
                </FormErrorMessage>
              </FormControl>

              <Divider borderColor={colors.borderColor} />

              <HStack justify="flex-end" spacing={4}>
                <Button
                  variant="outline"
                  onClick={onClose}
                  size="lg"
                >
                  Cancel
                </Button>
                <Button
                  variant="brand"
                  type="submit"
                  isLoading={isSubmitting}
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