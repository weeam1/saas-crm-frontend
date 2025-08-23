import {
  Box,
  Heading,
  Button,
  Grid,
  useColorModeValue,
  HStack,
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
  const [originalModules, setOriginalModules] = useState([]);

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

  console.log({ modules });

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

    try {
      await updateItem({
        path: `role-access/update/${id}`,
        body: { permissions: payloadModules },
      }).unwrap();

      toast.success("Permissions updated successfully");
      setOriginalModules(JSON.parse(JSON.stringify(modules)));
    } catch (error) {
      toast.error("Failed to update the permission");
    }
  };

  const filteredModules = modules.filter(
    (m) => !m.moduleId.toLowerCase().includes("leadpool")
  );
  const leadPoolModules = modules.filter((m) =>
    m.moduleId.toLowerCase().includes("leadpool")
  );

  console.log({ leadPoolModules });
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
        {loadingRole || loadingUserRole ? (
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
          <>
            {/* <LeadpoolSelector modules={modules} setModules={setModules} /> */}
            <Grid
              templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
              gap={6}
              mx="auto"
              alignItems="start"
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
          </>
        )}

        {filteredModules.length === 0 && !loadingRole && !loadingUserRole && (
          <NoData label="Permission" />
        )}

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
      </Box>
    </>
  );
};

export default Permission;
