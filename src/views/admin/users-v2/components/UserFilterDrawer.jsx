import React, { useState, useEffect, useRef } from 'react';
import {
	Box,
	Button,
	Drawer,
	DrawerBody,
	DrawerHeader,
	DrawerOverlay,
	DrawerContent,
	DrawerCloseButton,
	Input,
	Select,
	VStack,
	HStack,
	Text,
	Grid,
	useDisclosure,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
	FiFilter,
	FiUser,
	FiPhone,
	FiMapPin,
	FiDollarSign,
	FiTrendingUp,
	FiCheckCircle,
	FiBriefcase,
	FiShield,
} from 'react-icons/fi';
import { salaryTypes } from 'utils/options';
import { getNameById } from 'utils/filters';
import { useRoles } from 'hooks/user/userRoles';

const MotionDrawerContent = motion(DrawerContent);

const initialFilters = {
	username: '',
	fullName: '',
	phoneNumber: '',
	location: '',

	minCoins: '',
	maxCoins: '',

	minSalary: '',
	maxSalary: '',
	salaryType: '',

	role: '',
	agency: '',

	isActive: '',

	minCommission: '',
	maxCommission: '',
	commissionType: '',

	minIncentive: '',
	maxIncentive: '',
};

const FilterSection = ({ title, icon, children }) => (
	<Box>
		<HStack mb={3} spacing={2}>
			<Box color='brand.500'>{icon}</Box>
			<Text fontWeight='semibold' fontSize='sm'>
				{title}
			</Text>
		</HStack>

		<Box
			p={4}
			bg='gray.50'
			borderRadius='lg'
			border='1px solid'
			borderColor='gray.200'
		>
			{children}
		</Box>
	</Box>
);

const UserFilterDrawer = ({
	filters,
	onApply,
	agencies = [],
	setActiveFilters,
	onReset,
}) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [localFilters, setLocalFilters] = useState(filters);

	const hasAnimated = useRef(false);

	const { roles: allRoles } = useRoles();

	const handleChange = (field, value) => {
		setLocalFilters((prev) => ({ ...prev, [field]: value }));
	};

	// const handleApply = () => {
	// 	const cleaned = Object.fromEntries(
	// 		Object.entries(localFilters..filter(
	// 			([_, v]) => v !== '' && v !== null && v !== undefined
	// 		)
	// 	);

	// 	onApply(cleaned);
	// 	onClose();
	// };

	const handleApply = () => {
		const cleaned = Object.fromEntries(
			Object.entries(localFilters).filter(
				([_, value]) => value !== '' && value !== undefined && value !== null
			)
		);

		onClose();
		onApply(cleaned);

		const { isActive, ...rest } = cleaned;

		const uiActiveFilters = {
			...rest,

			...(rest.salaryType && {
				salaryType: salaryTypes?.find((i) => i.value === rest.salaryType)
					?.label,
			}),

			...(rest.agency && {
				agency: getNameById(agencies, rest.agency),
			}),

			...(rest.role && {
				role: getNameById(allRoles, rest.role, 'roleName'),
			}),

			...(isActive && {
				'Account Status': isActive === 'true' ? 'Active' : 'Inactive',
			}),
		};

		setActiveFilters(uiActiveFilters);
	};

	// const handleReset = () => {
	// 	setLocalFilters(initialFilters);
	// 	onApply({});
	// };

	const handleReset = () => {
		setLocalFilters(initialFilters);
		onReset?.();
	};

	return (
		<>
			<Button
				leftIcon={<FiFilter />}
				variant='outline'
				colorScheme='brand'
				onClick={onOpen}
			>
				Filters
			</Button>

			<Drawer isOpen={isOpen} placement='left' onClose={onClose} size='md'>
				<DrawerOverlay />

				<MotionDrawerContent
					initial={hasAnimated.current ? false : { x: '-100%' }}
					animate={{ x: 0 }}
					transition={{ type: 'spring', stiffness: 260, damping: 30 }}
					onAnimationComplete={() => (hasAnimated.current = true)}
				>
					<DrawerCloseButton />
					<DrawerHeader borderBottomWidth='1px'>
						<HStack spacing={3}>
							<Box color='brand.500'>
								<FiFilter size={20} />
							</Box>
							<Box>
								<Text fontSize='lg' fontWeight='bold'>
									User Filters
								</Text>
								<Text fontSize='xs' color='gray.500'>
									Narrow down users precisely
								</Text>
							</Box>
						</HStack>
					</DrawerHeader>

					<DrawerBody>
						<VStack
							spacing={6}
							overflow='scroll'
							p={2}
							maxH={{ base: '50vh', md: '60vh', lg: '75vh' }}
							align='stretch'
						>
							{/* User Info */}
							<FilterSection title='User Information' icon={<FiUser />}>
								<VStack spacing={3}>
									<Input
										size='sm'
										placeholder='Email / Username'
										value={localFilters.username}
										onChange={(e) => handleChange('username', e.target.value)}
									/>
									<Input
										size='sm'
										placeholder='Full Name'
										value={localFilters.fullName}
										onChange={(e) => handleChange('fullName', e.target.value)}
									/>
									<Input
										size='sm'
										placeholder='Phone Number'
										value={localFilters.phoneNumber}
										onChange={(e) =>
											handleChange('phoneNumber', e.target.value)
										}
									/>
									{/* <Input
										size='sm'
										placeholder='Location'
										value={localFilters.location}
										onChange={(e) => handleChange('location', e.target.value)}
									/> */}
								</VStack>
							</FilterSection>

							{/* Coins */}
							<FilterSection title='Coins' icon={<FiTrendingUp />}>
								<Grid templateColumns='repeat(2, 1fr)' gap={3}>
									<Input
										size='sm'
										type='number'
										placeholder='Min'
										value={localFilters.minCoins}
										onChange={(e) => handleChange('minCoins', e.target.value)}
									/>
									<Input
										size='sm'
										type='number'
										placeholder='Max'
										value={localFilters.maxCoins}
										onChange={(e) => handleChange('maxCoins', e.target.value)}
									/>
								</Grid>
							</FilterSection>

							{/* Salary */}
							<FilterSection title='Salary' icon={<FiDollarSign />}>
								<Grid templateColumns='repeat(2, 1fr)' gap={3}>
									<Input
										size='sm'
										type='number'
										placeholder='Min Salary'
										value={localFilters.minSalary}
										onChange={(e) => handleChange('minSalary', e.target.value)}
									/>
									<Input
										size='sm'
										type='number'
										placeholder='Max Salary'
										value={localFilters.maxSalary}
										onChange={(e) => handleChange('maxSalary', e.target.value)}
									/>
								</Grid>

								<Select
									mt={3}
									size='sm'
									placeholder='Salary Type'
									value={localFilters.salaryType}
									onChange={(e) => handleChange('salaryType', e.target.value)}
								>
									{salaryTypes?.map((item) => (
										<option key={item.value} value={item.value}>
											{item.label}
										</option>
									))}
								</Select>
							</FilterSection>

							{/* Agency */}
							<FilterSection title='Agency' icon={<FiBriefcase />}>
								<Select
									size='sm'
									placeholder='Select Agency'
									value={localFilters.agency}
									onChange={(e) => handleChange('agency', e.target.value)}
								>
									{agencies.map((a) => (
										<option key={a._id} value={a._id}>
											{a.name}
										</option>
									))}
								</Select>
							</FilterSection>

							{/* Agency */}
							<FilterSection title='Role' icon={<FiShield />}>
								<Select
									size='sm'
									placeholder='Select Role'
									value={localFilters.role}
									onChange={(e) => handleChange('role', e.target.value)}
								>
									{allRoles?.map((a) => (
										<option key={a._id} value={a._id}>
											{a.roleName}
										</option>
									))}
								</Select>
							</FilterSection>

							{/* Commission & Incentive */}
							{/* <FilterSection
								title='Commission & Incentive'
								icon={<FiTrendingUp />}
							>
								<Grid templateColumns='repeat(2, 1fr)' gap={3}>
									<Input
										size='sm'
										type='number'
										placeholder='Min Commission'
										value={localFilters.minCommission}
										onChange={(e) =>
											handleChange('minCommission', e.target.value)
										}
									/>
									<Input
										size='sm'
										type='number'
										placeholder='Max Commission'
										value={localFilters.maxCommission}
										onChange={(e) =>
											handleChange('maxCommission', e.target.value)
										}
									/>

									<Input
										size='sm'
										type='number'
										placeholder='Min Incentive'
										value={localFilters.minIncentive}
										onChange={(e) =>
											handleChange('minIncentive', e.target.value)
										}
									/>
									<Input
										size='sm'
										type='number'
										placeholder='Max Incentive'
										value={localFilters.maxIncentive}
										onChange={(e) =>
											handleChange('maxIncentive', e.target.value)
										}
									/>
								</Grid>

								<Select
									mt={3}
									size='sm'
									placeholder='Commission Type'
									value={localFilters.commissionType}
									onChange={(e) =>
										handleChange('commissionType', e.target.value)
									}
								>
									<option value='DEAL_COMMISSION'>Deal Commission</option>
									<option value='FIXED_COMMISSION'>Fixed Commission</option>
								</Select>
							</FilterSection> */}

							{/* Status */}
							<FilterSection title='Account Status' icon={<FiCheckCircle />}>
								<Select
									size='sm'
									placeholder='Account Status'
									value={localFilters.isActive}
									onChange={(e) => handleChange('isActive', e.target.value)}
								>
									<option value='true'>Active</option>
									<option value='false'>Inactive</option>
								</Select>
							</FilterSection>
						</VStack>

						<HStack p={2} borderTop='1px solid gray.600'>
							<Button flex={1} variant='outline' onClick={handleReset}>
								Reset
							</Button>
							<Button flex={1} colorScheme='brand' onClick={handleApply}>
								Apply
							</Button>
						</HStack>
					</DrawerBody>
				</MotionDrawerContent>
			</Drawer>
		</>
	);
};

export default UserFilterDrawer;
