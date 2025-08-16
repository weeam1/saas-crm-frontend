import {
  Box,
  Heading,
  Checkbox,
  Button,
  Text,
  Grid,
  useColorModeValue,
  HStack,
  Input,
  Divider,
  Flex,
  SimpleGrid,
  Switch,
  useTheme,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { useFetchItemsQuery, useUpdateItemMutation } from "api/apiSlice";
import PermissionSkeletonLoading from "./components/PermissionSkeletonLoading";

const Permission = () => {
  const { id } = useParams();
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const disabledBorderColor = useColorModeValue("gray.300", "gray.500");
  const disabledTextColor = useColorModeValue("gray.400", "gray.500");

  const [searchTerm, setSearchTerm] = useState("");
  const [modules, setModules] = useState([]);

  const [updateItem, { isLoading: isUpdating }] = useUpdateItemMutation();

  const { data: RolePermission, isLoading: loadingRole } = useFetchItemsQuery(
    { path: "/role-access/permissions" },
    { refetchOnMountOrArgChange: true }
  );

  const { data: UserRolePermission, isLoading: loadingUserRole } =
    useFetchItemsQuery(
      { path: `/role-access/${id}` },
      { refetchOnMountOrArgChange: true }
    );

  useEffect(() => {
    if (RolePermission?.doc && UserRolePermission?.doc) {
      const roleModules = Array.isArray(RolePermission.doc)
        ? RolePermission.doc
        : [];
      const userModules = Array.isArray(UserRolePermission.doc.permissions)
        ? UserRolePermission.doc.permissions
        : [];

      const mergedModules = roleModules.map((roleModule) => {
        const userModule = userModules.find(
          (u) =>
            u.moduleName?.toLowerCase() === roleModule.moduleName?.toLowerCase()
        );

        return {
          ...roleModule,
          isModuleEnabled: userModule?.isModuleEnabled ?? false,
          actions: roleModule.actions.map((action) => ({
            ...action,
            isAllowed:
              userModule?.isModuleEnabled &&
              userModule?.actions?.some(
                (ua) =>
                  ua.actionKey === action.actionKey && ua.isAllowed === true
              ),
          })),
        };
      });

      setModules(mergedModules);
    }
  }, [RolePermission, UserRolePermission]);

  const handleModuleToggle = (index, checked) => {
    const updatedModules = [...modules];
    updatedModules[index].isModuleEnabled = checked;
    updatedModules[index].actions = updatedModules[index].actions.map((a) => ({
      ...a,
      isAllowed: checked ? a.isAllowed : false,
    }));
    setModules(updatedModules);
  };

  const handleSelectAll = (index, checked) => {
    const updatedModules = [...modules];
    updatedModules[index].actions = updatedModules[index].actions.map((a) => ({
      ...a,
      isAllowed: checked,
    }));
    setModules(updatedModules);
  };

  const handleActionToggle = (moduleIndex, actionIndex) => {
    const updatedModules = [...modules];
    updatedModules[moduleIndex].actions[actionIndex].isAllowed =
      !updatedModules[moduleIndex].actions[actionIndex].isAllowed;
    setModules(updatedModules);
  };

  const handleUpdateRole = async () => {
    try {
      await updateItem({
        path: `role-access/update/${id}`,
        body: { permissions: modules },
      }).unwrap();
      toast.success("Permissions have been saved successfully");
    } catch (error) {
      toast.error("Failed to update the permission");
    }
  };

  const filteredModules = modules.filter((m) =>
    m.moduleName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box borderRadius="xl" boxShadow="lg" bg={"white"} p={6}>
      {/* Header */}
      <Heading mb={6} size="md">
        Role Permissions
      </Heading>

      {/* Search Section */}
      <Box mb={4}>
        <HStack
          mb={2}
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDir={{ base: "column", md: "row" }}
        >
          <Text fontWeight="semibold" fontSize="md">
            Module Name:
          </Text>
          <Input
            placeholder="Search Module..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            maxW={{ base: "100%", md: "400px" }}
          />
        </HStack>
        <Divider />
      </Box>

      {/* Permission Cards */}
      {loadingRole || loadingUserRole || isUpdating ? (
        <Box borderRadius="xl" boxShadow="lg" bg="white" p={6}>
          <Grid
            templateColumns={{
              base: "1fr",
              md: "repeat(2, 1fr)",
            }}
            gap={6}
          >
            <PermissionSkeletonLoading count={4} />
          </Grid>
        </Box>
      ) : (
        <Grid
          templateColumns={{
            base: "1fr",
            md: "repeat(2, 1fr)",
          }}
          templateRows={"1fr"}
          gap={6}
          alignItems="stretch"
        >
          {filteredModules.map((module, moduleIndex) => (
            <Box
              key={module.moduleId}
              borderWidth="1px"
              borderColor={borderColor}
              borderRadius="md"
              bg="gray.100"
              p={4}
            >
              {/* Toggle for Module Enable at bottom */}
              <Flex justify="flex-start" mb={2} mt={"-2px"}>
                <Text fontSize="sm" mr={2} color="gray.700">
                  Disable
                </Text>
                <Switch
                  colorScheme="green"
                  size="md"
                  isChecked={module.isModuleEnabled}
                  onChange={(e) =>
                    handleModuleToggle(moduleIndex, e.target.checked)
                  }
                  _focus={{ boxShadow: "none" }}
                  _active={{ boxShadow: "none" }}
                />
                <Text fontSize="sm" ml={2} color="gray.700">
                  Enable
                </Text>
              </Flex>
              {/* Module title and Check All in one row */}
              <Flex
                justify="space-between"
                align="center"
                mb={2}
                flexWrap="wrap"
                gap={2}
              >
                <Text
                  fontWeight="bold"
                  fontSize={{ base: "sm", md: "md" }}
                  display="flex"
                  gap={2}
                  flexDir="row"
                  align="center"
                >
                  {module.moduleName}
                  <Text fontSize="sm" color="gray" fontWeight="medium">
                    Permission
                  </Text>
                </Text>

                <Checkbox
                  size="md"
                  colorScheme="green"
                  borderColor={module.isModuleEnabled ? "green.300" : disabledBorderColor}
                  _focus={{ boxShadow: "none" }}
                  _active={{ boxShadow: "none" }}
                  _hover={{ borderColor: module.isModuleEnabled ? "green.300" : disabledBorderColor }}
                  isChecked={module.actions.every((a) => a.isAllowed)}
                  onChange={(e) =>
                    handleSelectAll(moduleIndex, e.target.checked)
                  }
                  isDisabled={!module.isModuleEnabled}
                  sx={{
                    '& .chakra-checkbox__control': {
                      borderColor: !module.isModuleEnabled ? disabledBorderColor : undefined,
                    },
                    '&[data-disabled]': {
                      opacity: 1,
                    }
                  }}
                >
                  <Text color={!module.isModuleEnabled ? disabledTextColor : "inherit"}>
                    Check All
                  </Text>
                </Checkbox>
              </Flex>

              <Divider my={3} />

              {/* Actions Grid */}
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2} flex="1">
                {module.actions.map((action, actionIndex) => (
                  <Checkbox
                    key={action.actionKey}
                    size="md"
                    colorScheme="green"
                    borderColor={module.isModuleEnabled ? "green.300" : disabledBorderColor}
                    _focus={{ boxShadow: "none" }}
                    _active={{ boxShadow: "none" }}
                    _hover={{ borderColor: module.isModuleEnabled ? "green.300" : disabledBorderColor }}
                    isChecked={action.isAllowed}
                    onChange={() =>
                      handleActionToggle(moduleIndex, actionIndex)
                    }
                    isDisabled={!module.isModuleEnabled}
                    sx={{
                      '& .chakra-checkbox__control': {
                        borderColor: !module.isModuleEnabled ? disabledBorderColor : undefined,
                      },
                      '&[data-disabled]': {
                        opacity: 1,
                      }
                    }}
                  >
                    <Text color={!module.isModuleEnabled ? disabledTextColor : "inherit"}>
                      {action.name}
                    </Text>
                  </Checkbox>
                ))}
              </SimpleGrid>
            </Box>
          ))}
        </Grid>
      )}
      {/* Save Button */}
      <HStack justify="flex-end" mt={6}>
        <Button
          colorScheme="brand"
          onClick={handleUpdateRole}
          borderRadius="md"
          _focus={{ boxShadow: "none" }}
          _active={{ boxShadow: "none" }}
        >
          Update Role
        </Button>
      </HStack>
    </Box>
  );
};

export default Permission;
