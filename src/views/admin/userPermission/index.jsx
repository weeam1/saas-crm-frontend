import {
	Box,
	Heading,
	Button,
	Text,
	Grid,
	useColorModeValue,
	HStack,
	Input,
	Divider,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { useFetchItemsQuery, useUpdateItemMutation } from 'api/apiSlice';
import PermissionSkeletonLoading from './components/PermissionSkeletonLoading';
import AppButton from 'components/shared/AppButton';
import { IoArrowBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import PermissionCard from './components/PermissionCard';

const Permission = () => {
	const { id, roleName } = useParams();
	const borderColor = useColorModeValue('gray.200', 'gray.600');
	const disabledBorderColor = useColorModeValue('gray.400', 'gray.500');
	const disabledTextColor = useColorModeValue('gray.500', 'gray.600');

	const navigate = useNavigate();
	const [searchTerm, setSearchTerm] = useState('');
	const [modules, setModules] = useState([]);
	const [originalModules, setOriginalModules] = useState([]);

	const [updateItem, { isLoading: isUpdating }] = useUpdateItemMutation();

	const { data: RolePermission, isLoading: loadingRole } = useFetchItemsQuery(
		{ path: '/role-access/permissions' },
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

	const getPayloadModules = () => {
		return modules.map((module) => {
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
		});
	};

	const handleUpdateRole = async () => {
		const payloadModules = getPayloadModules();

		try {
			await updateItem({
				path: `role-access/update/${id}`,
				body: { permissions: payloadModules },
			}).unwrap();

			toast.success('Permissions updated successfully');
			setOriginalModules(JSON.parse(JSON.stringify(modules)));
		} catch (error) {
			toast.error('Failed to update the permission');
		}
	};

	const filteredModules = modules.filter((m) =>
		m.moduleName.toLowerCase().includes(searchTerm.toLowerCase())
	);

	return (
		<>
			{/* Back Button */}
			<AppButton
				ml='2'
				leftIcon={<IoArrowBack />}
				onClick={() => navigate(-1)}
				mb={4}
			>
				Back
			</AppButton>

			<Box borderRadius='xl' boxShadow='lg' bg={'white'} p={6}>
				{/* Header */}
				<Heading mb={6} size='md'>
					{roleName} Role Permissions
				</Heading>

				{/* Search Section */}
				<Box mb={4}>
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
				</Box>

				{/* Permission Cards */}
				{loadingRole || loadingUserRole ? (
					<Box borderRadius='xl' boxShadow='lg' bg='white' p={6}>
						<Grid
							templateColumns={{
								base: '1fr',
								md: 'repeat(2, 1fr)',
							}}
							gap={6}
						>
							<PermissionSkeletonLoading count={4} />
						</Grid>
					</Box>
				) : (
					<Grid
						templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
						gap={6}
						mx='auto'
						alignItems='start'
					>
						<Grid gap={6}>
							{filteredModules
								.filter((_, index) => index % 2 === 0)
								.map((module, index) => {
									const originalIndex = modules.findIndex(
										(m) => m.moduleId === module.moduleId
									);
									return (
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
									);
								})}
						</Grid>

						<Grid gap={6}>
							{filteredModules
								.filter((_, index) => index % 2 !== 0)
								.map((module, index) => {
									const originalIndex = modules.findIndex(
										(m) => m.moduleId === module.moduleId
									);
									return (
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
									);
								})}
						</Grid>
					</Grid>
				)}

				{/* Save Button */}
				<HStack justify='flex-end' mt={6}>
					<Button
						colorScheme='brand'
						onClick={handleUpdateRole}
						borderRadius='md'
						_focus={{ boxShadow: 'none' }}
						_active={{ boxShadow: 'none' }}
						isLoading={isUpdating}
					>
						Update Role
					</Button>
				</HStack>
			</Box>
		</>
	);
};

export default Permission;
