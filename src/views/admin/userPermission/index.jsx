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
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { useFetchItemsQuery, useUpdateItemMutation } from "api/apiSlice";
import PermissionSkeletonLoading from "./components/PermissionSkeletonLoading";

const Permission = () => {
  const { id } = useParams();
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const cardBg = useColorModeValue("blue.50", "gray.700");

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
          actions: roleModule.actions.map((action) => ({
            ...action,
            isAllowed:
              userModule?.actions?.some(
                (ua) =>
                  ua.actionKey === action.actionKey && ua.isAllowed === true
              ) || false,
          })),
        };
      });

      setModules(mergedModules);
    }
  }, [RolePermission, UserRolePermission]);

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
      const response = await updateItem({
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
        Role Permission
      </Heading>

      {/* Search Section */}
      <Box mb={4}>
        <Divider mb={2} />
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
          gap={6}
        >
          {filteredModules.map((module, moduleIndex) => (
            <Box
              key={module.moduleId}
              borderWidth="1px"
              borderColor={borderColor}
              borderRadius="md"
              bg={cardBg}
              p={4}
              w="100%"
            >
              {/* Card Header */}
              <Flex justify="space-between" align="center" mb={2}>
                <Text
                  fontWeight="bold"
                  fontSize={{ base: "sm", md: "md" }}
                  display="flex"
                  gap={{ base: 0, md: 2 }}
                  flexDir={{ base: "column", md: "row" }}
                >
                  {module.moduleName}
                  <Text fontSize="sm" color="gray" fontWeight="medium">
                    Permission
                  </Text>
                </Text>
                <Checkbox
                  size="sm"
                  borderColor="blue.300"
                  _checked={{ borderColor: "blue.300" }}
                  isChecked={module.actions.every((a) => a.isAllowed)}
                  onChange={(e) =>
                    handleSelectAll(moduleIndex, e.target.checked)
                  }
                >
                  Check All
                </Checkbox>
              </Flex>

              <Divider mb={3} />

              {/* Actions Grid */}
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2}>
                {module.actions.map((action, actionIndex) => (
                  <Checkbox
                    key={action.actionKey}
                    borderColor="blue.300"
                    _checked={{ borderColor: "blue.300" }}
                    isChecked={action.isAllowed}
                    onChange={() =>
                      handleActionToggle(moduleIndex, actionIndex)
                    }
                    colorScheme="blue"
                    fontSize={{ base: "sm", md: "md" }}
                  >
                    {action.name}
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
        >
          Update Role
        </Button>
      </HStack>
    </Box>
  );
};

export default Permission;
