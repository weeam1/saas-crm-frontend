import {
  Box,
  Heading,
  Button,
  Grid,
  useColorModeValue,
  HStack,
  Flex,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { useFetchItemsQuery, useUpdateItemMutation } from "api/apiSlice";
import PermissionSkeletonLoading from "./components/PermissionSkeletonLoading";
import AppButton from "components/shared/AppButton";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import PermissionCard from "./components/PermissionCard";
import NoData from "views/admin/lead-v2/components/subComponents/NoData";
import LeadpoolSelector from "./components/LeadpoolSelector";
import useUserSession from "hooks/useUserSession";
import { useUserActivityLog } from "hooks/useUserActivityLog";

function getModifiedAndNewModules(oldPermissions, newModules) {
  const modified = [];
  const added = [];
  const removed = [];

  // 🔹 Check for added & modified modules
  newModules.forEach((newModule) => {
    const oldModule = oldPermissions.find(
      (m) => m.moduleId === newModule.moduleId
    );

    if (!oldModule) {
      // ✅ New module added with all its actions
      if (newModule.isModuleEnabled) {
        added.push({
          ...newModule,
          addedActions: [...newModule.actions], // all actions considered added
        });
      }
    } else {
      // ✅ Compare existing module for modifications
      const addedActions = [];
      const removedActions = [];
      const modifiedActions = [];

      const oldActionsMap = {};
      oldModule.actions.forEach((a) => {
        oldActionsMap[a.actionKey] = a;
      });

      const newActionsMap = {};
      newModule.actions.forEach((a) => {
        newActionsMap[a.actionKey] = a;
      });

      // 🔹 Find added & modified actions
      newModule.actions.forEach((a) => {
        if (!oldActionsMap[a.actionKey]) {
          addedActions.push(a);
        } else if (oldActionsMap[a.actionKey].isAllowed !== a.isAllowed) {
          modifiedActions.push(a);
        }
      });

      // 🔹 Find removed actions
      oldModule.actions.forEach((a) => {
        if (!newActionsMap[a.actionKey]) {
          removedActions.push(a);
        }
      });

      // 🔹 If anything changed at all
      if (
        oldModule.moduleName !== newModule.moduleName ||
        addedActions.length > 0 ||
        removedActions.length > 0 ||
        modifiedActions.length > 0
      ) {
        modified.push({
          ...newModule,
          addedActions,
          removedActions,
          modifiedActions,
        });
      }
    }
  });

  // 🔹 Check for removed modules
  oldPermissions.forEach((oldModule) => {
    const stillExists = newModules.find(
      (m) => m.moduleId === oldModule.moduleId
    );
    if (!stillExists) {
      removed.push({
        ...oldModule,
        removedActions: [...oldModule.actions], // all actions removed
      });
    }
  });

  return { added, modified, removed };
}

const Permission = () => {
  const { id, roleName } = useParams();
  const borderColor = useColorModeValue("brand.300", "brand.500");
  const cardBg = useColorModeValue("white", "gray.800");
  const disabledBorderColor = useColorModeValue("gray.300", "gray.600");
  const disabledTextColor = useColorModeValue("gray.500", "gray.400");
  const sectionBg = useColorModeValue("brand.50", "gray.700");

  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [originalModules, setOriginalModules] = useState([]);

  const [updateItem, { isLoading: isUpdating }] = useUpdateItemMutation();

  const { createUserLog } = useUserActivityLog();
  const { user } = useUserSession();

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
      setLoading(true);
      const roleModules = Array.isArray(RolePermission.doc)
        ? RolePermission.doc
        : [];
      const userModules = Array.isArray(UserRolePermission.doc.permissions)
        ? UserRolePermission.doc.permissions
        : [];

      const mergedModules = roleModules.map((roleModule) => {
        const userModule = userModules.find(
          (u) => u.moduleId === roleModule.moduleId
        );

        return {
          ...roleModule,
          isModuleEnabled: userModule?.isModuleEnabled ?? false,
          actions: roleModule.actions.map((action) => ({
            ...action,
            isAllowed: userModule?.actions?.some(
              (ua) => ua.actionKey === action.actionKey && ua.isAllowed === true
            ),
          })),
        };
      });

      setModules(mergedModules);
      setOriginalModules(JSON.parse(JSON.stringify(mergedModules)));

      // Delay before setting loading false
      const timeout = setTimeout(() => setLoading(false), 2000);

      return () => clearTimeout(timeout); // cleanup on re-run/unmount
    }
  }, [RolePermission, UserRolePermission]);

  const handleModuleToggle = (index, checked) => {
    const updatedModules = [...modules];
    updatedModules[index].isModuleEnabled = checked;
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

  // Radio selection for leadpool modules only
  const handleRadioSelect = (selectedModuleId) => {
    setModules((prevModules) =>
      prevModules.map((module) => {
        if (module.moduleId.toLowerCase().includes("leadpool")) {
          // enforce radio: only the selected leadpool is true
          return {
            ...module,
            isModuleEnabled: module.moduleId === selectedModuleId,
          };
        }
        // non-leadpool modules stay unchanged
        return module;
      })
    );
  };

  const getPayloadModules = () => {
    return modules
      .map((module) => {
        const allowedActions = module.actions
          .filter((a) => a.isAllowed)
          .map((a) => ({
            actionKey: a.actionKey,
            isAllowed: true,
          }));

        return {
          moduleId: module.moduleId,
          moduleName: module.moduleName,
          isModuleEnabled: module.isModuleEnabled,
          actions: allowedActions,
        };
      })
      .filter((module) => module.isModuleEnabled === true);
  };

  const handleUpdatePermission = async () => {
    const payloadModules = getPayloadModules();

    const { modified, added, removed } = getModifiedAndNewModules(
      UserRolePermission?.doc?.permissions,
      payloadModules
    );

    try {
      await updateItem({
        path: `role-access/update/${id}`,
        body: { permissions: payloadModules },
      }).unwrap();

      createUserLog({
        userId: user?._id,
        action: "UPDATE",
        entity: "Permission",
        status: "success",
        message: `${user.fullName} update the permission`,
        rawPayload: { permission: { modified, added, removed } },
      });

      toast.success("Permissions updated successfully");
      setOriginalModules(JSON.parse(JSON.stringify(modules)));
    } catch (error) {
      toast.error("Failed to update the permission");
      const errorMsg =
        error?.data?.message ||
        error?.message ||
        "Failed to update the permission. Please try again.";

      createUserLog({
        userId: user?._id,
        action: "UPDATE",
        entity: "Permission",
        status: error?.status === "500" ? "error" : "fail",
        message: errorMsg,
      });
    }
  };

  const filteredModules = modules.filter(
    (m) => !m.moduleId.toLowerCase().includes("leadpool")
  );
  const leadPoolModules = modules.filter((m) =>
    m.moduleId.toLowerCase().includes("leadpool")
  );

  // const filteredModules = modules.filter((m) =>
  // 	m.moduleName.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  return (
    <>
      {/* Back Button */}
      <AppButton
        ml="2"
        leftIcon={<IoArrowBack />}
        onClick={() => navigate(-1)}
        mb={4}
      >
        Back
      </AppButton>

      <Box borderRadius="xl" boxShadow="lg" bg={cardBg} p={6}>
        {/* Header */}
        <Heading mb={6} size="md" color="brand.600">
          {roleName} Role Permissions
        </Heading>
        {/* Search Section */}
        {/* <Box mb={4}>
					<HStack
						mb={2}
						display='flex'
						justifyContent='center'
						alignItems='center'
						flexDir={{ base: 'column', md: 'row' }}
					>
						<Text fontWeight='semibold' fontSize='md'>
							Module Name:
						</Text>
						<Input
							placeholder='Search Module...'
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							maxW={{ base: '100%', md: '400px' }}
						/>
					</HStack>
					<Divider />
				</Box> */}

        {/* Permission Cards */}
        {loadingRole || loadingUserRole || loading ? (
          <Box>
            <Grid
              templateColumns={{
                base: "1fr",
                md: "repeat(2, 1fr)",
              }}
              gap={6}
            >
              <PermissionSkeletonLoading count={20} />
            </Grid>
          </Box>
        ) : filteredModules?.length > 0 ? (
          <>
            {/* <LeadpoolSelector modules={modules} setModules={setModules} /> */}
            <Grid
              templateColumns={{ base: "1fr", xl: "repeat(2, 1fr)" }}
              gap={6}
              mx="auto"
              alignItems="start"
              // h='65vh'
              // p='2'
              // overflow='scroll'
              // scrollBehavior='smooth'
            >
              <Grid gap={6}>
                {filteredModules
                  .filter((_, index) => index % 2 === 0)
                  .map((module, index) => {
                    const originalIndex = modules.findIndex(
                      (m) => m.moduleId === module.moduleId
                    );

                    const isLeadsModule = module.moduleId === "leads";
                    return (
                      <>
                        <PermissionCard
                          key={module.moduleId}
                          module={module}
                          moduleIndex={originalIndex}
                          borderColor={borderColor}
                          disabledBorderColor={disabledBorderColor}
                          disabledTextColor={disabledTextColor}
                          handleModuleToggle={handleModuleToggle}
                          handleSelectAll={handleSelectAll}
                          handleActionToggle={handleActionToggle}
                          roleName={roleName}
                        />

                        {/* Render LeadpoolSelector after the leads module */}
                        {isLeadsModule && (
                          <LeadpoolSelector
                            modules={modules}
                            setModules={setModules}
                          />
                        )}
                      </>
                    );
                  })}
              </Grid>

              {/* Right Column */}
              <Grid gap={6}>
                {filteredModules
                  .filter((_, index) => index % 2 !== 0)
                  .map((module, index) => {
                    const originalIndex = modules.findIndex(
                      (m) => m.moduleId === module.moduleId
                    );
                    const isLeadsModule = module.moduleId === "leads";
                    return (
                      <>
                        <PermissionCard
                          key={module.moduleId}
                          module={module}
                          moduleIndex={originalIndex}
                          borderColor={borderColor}
                          disabledBorderColor={disabledBorderColor}
                          disabledTextColor={disabledTextColor}
                          handleModuleToggle={handleModuleToggle}
                          handleSelectAll={handleSelectAll}
                          handleActionToggle={handleActionToggle}
                          roleName={roleName}
                        />
                        {isLeadsModule && (
                          <LeadpoolSelector
                            modules={modules}
                            setModules={setModules}
                          />
                        )}
                      </>
                    );
                  })}
              </Grid>
            </Grid>

            {/* Save Button */}
            <HStack
              justify="flex-end"
              mt={8}
              pt={4}
              borderTopWidth="1px"
              borderColor="gray.200"
            >
              <Button
                colorScheme="brand"
                onClick={handleUpdatePermission}
                borderRadius="md"
                _focus={{ boxShadow: "none" }}
                _active={{ boxShadow: "none" }}
                isLoading={isUpdating}
                size="lg"
                px={8}
              >
                Update Permission
              </Button>
            </HStack>
          </>
        ) : (
          !loading && (
            <Flex justifyContent="center" align="center">
              <NoData label="Permission" />
            </Flex>
          )
        )}
      </Box>
    </>
  );
};

export default Permission;
