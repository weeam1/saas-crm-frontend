import {
	Box,
	Heading,
	Button,
	Grid,
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
import { useModalColors } from 'hooks/useModalColors';

const getUserPermission = (user) => {
	return user?.roles?.[0]?.permissions || [];
};

function getModifiedAndNewModules(oldPermissions, newModules) {
	const modified = [];
	const added = [];
	const removed = [];

	newModules.forEach((newModule) => {
		const oldModule = oldPermissions.find(
			(m) => m.moduleId === newModule.moduleId,
		);

		if (!oldModule) {
			if (newModule.isModuleEnabled) {
				added.push({
					...newModule,
					addedActions: [...newModule.actions],
				});
			}
		} else {
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

			newModule.actions.forEach((a) => {
				if (!oldActionsMap[a.actionKey]) {
					addedActions.push(a);
				} else if (oldActionsMap[a.actionKey].isAllowed !== a.isAllowed) {
					modifiedActions.push(a);
				}
			});

			oldModule.actions.forEach((a) => {
				if (!newActionsMap[a.actionKey]) {
					removedActions.push(a);
				}
			});

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

	oldPermissions.forEach((oldModule) => {
		const stillExists = newModules.find(
			(m) => m.moduleId === oldModule.moduleId,
		);
		if (!stillExists) {
			removed.push({
				...oldModule,
				removedActions: [...oldModule.actions],
			});
		}
	});

	return { added, modified, removed };
}

const Permission = () => {
	const colors = useModalColors();
	const { id: userId } = useParams();
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

			const timeout = setTimeout(() => setLoading(false), 2000);
			return () => clearTimeout(timeout);
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

	const handleRadioSelect = (selectedModuleId) => {
		setModules((prevModules) =>
			prevModules.map((module) => {
				if (module.moduleId.toLowerCase().includes('leadpool')) {
					return {
						...module,
						isModuleEnabled: module.moduleId === selectedModuleId,
					};
				}
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
		<Box bg={colors.bgDeep} minH='100vh' p={4}>
			<IconButton
				aria-label='Go back'
				icon={<FiChevronLeft />}
				onClick={() => navigate(-1)}
				size='md'
				isRound
				mb={2}
				variant='ghost'
				color={colors.bodyText}
				_hover={{
					color: colors.accentGold,
					bg: colors.secondaryBtnHoverBg,
				}}
			/>

			<Box borderRadius='xl' boxShadow={colors.modalShadow} bg={colors.bg} p={6} border="1px solid" borderColor={colors.borderColor}>
				<Stack
					flexDir={{ base: 'column', md: 'row' }}
					justifyContent='space-between'
					alignItems='center'
					mb={6}
				>
					<Heading size='md' color={colors.headingText}>
						User Permissions
					</Heading>
					<CustomTooltip label='Revert custom permission override'>
						<Button
							aria-label='Revert to role permissions'
							onClick={() => handleUpdatePermission({ isDeleted: true })}
							size='sm'
							variant='ghost'
							leftIcon={<LuRotateCcw />}
							color={colors.bodyText}
							_hover={{
								color: colors.accentGold,
								bg: colors.secondaryBtnHoverBg,
							}}
						>
							Revert to Default
						</Button>
					</CustomTooltip>
				</Stack>

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
						<Grid
							templateColumns={{ base: '1fr', xl: 'repeat(2, 1fr)' }}
							gap={6}
							mx='auto'
							alignItems='start'
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
													colors={colors}
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
													colors={colors}
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

						<HStack
							justify='flex-end'
							mt={8}
							pt={4}
							borderTopWidth='1px'
							borderColor={colors.borderColor}
						>
							<Button
								bg={colors.accentGold}
								color={colors.headerText}
								onClick={handleUpdatePermission}
								borderRadius='md'
								_focus={{ boxShadow: 'none' }}
								_active={{ boxShadow: 'none' }}
								isLoading={isUpdating}
								size='lg'
								px={8}
								_hover={{
									bg: colors.goldLight,
									transform: 'translateY(-1px)',
									boxShadow: colors.goldGlow,
								}}
								_active={{ bg: colors.goldDark }}
								transition='all 0.2s ease'
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
		</Box>
	);
};

export default Permission;