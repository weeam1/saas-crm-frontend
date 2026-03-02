import {
	Box,
	Heading,
	Button,
	Grid,
	useColorModeValue,
	HStack,
	Flex,
	IconButton,
	Stack,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { useFetchItemsQuery, useUpdateItemMutation } from 'api/apiSlice';
import AppButton from 'components/shared/AppButton';
import { IoArrowBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import NoData from 'components/Message/NoData';
import useUserSession from 'hooks/useUserSession';
import { useUserActivityLog } from 'hooks/useUserActivityLog';
import PermissionCard from 'views/admin/userPermission/components/PermissionCard';
import LeadpoolSelector from 'views/admin/userPermission/components/LeadpoolSelector';
import PermissionSkeletonLoading from 'views/admin/userPermission/components/PermissionSkeletonLoading';
import { FiChevronLeft } from 'react-icons/fi';
import CustomTooltip from 'components/shared/CustomTooltip';
import { LuRotateCcw } from 'react-icons/lu';

const getUserPermission = (user) => {
	if (user?.isRolePermissions) {
		return user?.roles?.[0]?.permissions || [];
	} else {
		return user?.permissionOverrides || [];
	}
};

function getModifiedAndNewModules(oldPermissions, newModules) {
	const modified = [];
	const added = [];
	const removed = [];

	// 🔹 Check for added & modified modules
	newModules.forEach((newModule) => {
		const oldModule = oldPermissions.find(
			(m) => m.moduleId === newModule.moduleId,
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
			(m) => m.moduleId === oldModule.moduleId,
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
	const { id: userId } = useParams();
	const borderColor = useColorModeValue('brand.300', 'brand.500');
	const cardBg = useColorModeValue('white', 'gray.800');
	const disabledBorderColor = useColorModeValue('gray.300', 'gray.600');
	const disabledTextColor = useColorModeValue('gray.500', 'gray.400');
	const sectionBg = useColorModeValue('brand.50', 'gray.700');

	const navigate = useNavigate();
	const [searchTerm, setSearchTerm] = useState('');
	const [modules, setModules] = useState([]);
	const [loading, setLoading] = useState(true);
	const [originalModules, setOriginalModules] = useState([]);

	const [updateItem, { isLoading: isUpdating }] = useUpdateItemMutation();

	const { createUserLog } = useUserActivityLog();
	const { user } = useUserSession();

	const { data: RolePermission, isLoading: loadingRole } = useFetchItemsQuery(
		{ path: '/role-access/permissions' },
		{ refetchOnMountOrArgChange: true },
	);

	const { data: userData, isLoading: loadingUser } = useFetchItemsQuery(
		{ path: `/user/v2/view/${userId}` },
		{ refetchOnMountOrArgChange: true },
	);

	useEffect(() => {
		if (RolePermission?.doc && userData) {
			setLoading(true);
			const roleModules = Array.isArray(RolePermission.doc)
				? RolePermission.doc
				: [];
			const userModules = getUserPermission(userData);

			const mergedModules = roleModules.map((roleModule) => {
				const userModule = userModules.find(
					(u) => u.moduleId === roleModule.moduleId,
				);

				return {
					...roleModule,
					isModuleEnabled: userModule?.isModuleEnabled ?? false,
					actions: roleModule.actions.map((action) => ({
						...action,
						isAllowed: userModule?.actions?.some(
							(ua) =>
								ua.actionKey === action.actionKey && ua.isAllowed === true,
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
	}, [RolePermission, userData]);

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
				if (module.moduleId.toLowerCase().includes('leadpool')) {
					// enforce radio: only the selected leadpool is true
					return {
						...module,
						isModuleEnabled: module.moduleId === selectedModuleId,
					};
				}
				// non-leadpool modules stay unchanged
				return module;
			}),
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

	const handleUpdatePermission = async ({ isDeleted = false }) => {
		let payloadModules = [];

		if (!isDeleted) {
			payloadModules = getPayloadModules();
		}

		const { modified, added, removed } = getModifiedAndNewModules(
			getUserPermission(userData),
			payloadModules,
		);

		try {
			await updateItem({
				path: `/v3/users/${userId}`,
				body: { permissionOverrides: payloadModules },
			}).unwrap();

			createUserLog({
				userId: user?._id,
				action: 'UPDATE',
				entity: 'User',
				status: 'success',
				message: `${user.fullName} update the user permissions.`,
				rawPayload: { permission: { modified, added, removed } },
			});

			toast.success('Permissions updated successfully');
			setOriginalModules(JSON.parse(JSON.stringify(modules)));

			navigate(`/users-v2/${userId}`);
		} catch (error) {
			toast.error('Failed to update the user permissions');
			const errorMsg =
				error?.data?.message ||
				error?.message ||
				'Failed to update the user permissions. Please try again.';

			createUserLog({
				userId: user?._id,
				action: 'UPDATE',
				entity: 'User',
				status: error?.status === '500' ? 'error' : 'fail',
				message: errorMsg,
			});
		}
	};

	const filteredModules = modules.filter(
		(m) => !m.moduleId.toLowerCase().includes('leadpool'),
	);

	return (
		<>
			{/* Back Button */}
			<IconButton
				aria-label='Go back'
				icon={<FiChevronLeft />}
				onClick={() => navigate(-1)}
				size='md'
				isRound
				mb={2}
			/>

			<Box borderRadius='xl' boxShadow='lg' bg={cardBg} p={6}>
				{/* Header */}
				<Stack
					flexDir={{ base: 'column', md: 'row' }}
					justifyContent='space-between'
					alignItems='center'
					mb={6}
				>
					<Heading size='md' color='brand.600'>
						User Permissions
					</Heading>
					<CustomTooltip label='Revert custom permission override'>
						<Button
							aria-label='Revert to role permissions'
							onClick={() => handleUpdatePermission({ isDeleted: true })}
							size='sm'
							variant='outline'
							leftIcon={<LuRotateCcw />}
						>
							Revert to Default
						</Button>
					</CustomTooltip>
				</Stack>

				{/* Permission Cards */}
				{loadingRole || loadingUser || loading ? (
					<Box>
						<Grid
							templateColumns={{
								base: '1fr',
								md: 'repeat(2, 1fr)',
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
							templateColumns={{ base: '1fr', xl: 'repeat(2, 1fr)' }}
							gap={6}
							mx='auto'
							alignItems='start'
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
											(m) => m.moduleId === module.moduleId,
										);

										const isLeadsModule = module.moduleId === 'leads';
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
											(m) => m.moduleId === module.moduleId,
										);
										const isLeadsModule = module.moduleId === 'leads';
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
							justify='flex-end'
							mt={8}
							pt={4}
							borderTopWidth='1px'
							borderColor='gray.200'
						>
							<Button
								colorScheme='brand'
								onClick={handleUpdatePermission}
								borderRadius='md'
								_focus={{ boxShadow: 'none' }}
								_active={{ boxShadow: 'none' }}
								isLoading={isUpdating}
								size='lg'
								px={8}
							>
								Update Permission
							</Button>
						</HStack>
					</>
				) : (
					!loading && (
						<Flex justifyContent='center' align='center'>
							<NoData label='Permission' />
						</Flex>
					)
				)}
			</Box>
		</>
	);
};

export default Permission;
