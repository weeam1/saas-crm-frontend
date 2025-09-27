import React, { useMemo, useEffect } from 'react';
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
	FormControl,
	FormLabel,
	Select,
	SimpleGrid,
	VStack,
	Box,
	Text,
	useBreakpointValue,
	useColorModeValue,
	Flex,
	IconButton,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import { FiX } from 'react-icons/fi';
import CustomDatePicker from 'components/datetime/CustomDatePicker';
import SearchUsers from 'views/admin/whatsapp/WhatsappSettings/SearchUsers';
import moment from 'moment';
import DropdownSearchUser from 'components/search/DropdownSearchUser';
import ManagerAgentDropdown from './ManagerAgentDropdown';

const AdvancedFilter = ({
	isOpen,
	onClose,
	filters,
	applyFilters,
	resetFilters,
	grayColors,
	statusOptions,
	actionOptions,
	levelOptions,
	entityOptions,
	usersData,
	roleData,
	setSearchTags,
}) => {
	const [openCalendar, setOpenCalendar] = React.useState(null);
	const headerBg = useColorModeValue(grayColors.primary, grayColors.darkest);
	const isMobile = useBreakpointValue({ base: true, md: false });

	const toggleCalendar = (calendar) => {
		setOpenCalendar(openCalendar === calendar ? null : calendar);
	};

	const toUTCString = (date) => {
		return date
			? moment(date).utcOffset(0, true).startOf('day').toISOString()
			: null;
	};
	const getFilterDisplayName = (key, value) => {
		if (!value) return null;
		switch (key) {
			case 'userId':
				const user = usersData?.doc?.find((u) => u._id === value);
				return `User: ${user ? user.fullName || user.username : value}`;

			case 'status':
				return `Status: ${value}`;

			case 'entity':
				return `Entity: ${value}`;

			case 'action':
				return `Action: ${value}`;

			case 'securityLevel':
				return `Level: ${value}`;

			case 'roleId':
				const role = roleData?.find((r) => r._id === value);
				return `Role: ${role ? role.roleName : value}`;

			case 'from':
				return value ? `From: ${moment(value).format('MMM D, YYYY')}` : null;

			case 'to':
				return value ? `To: ${moment(value).format('MMM D, YYYY')}` : null;

			case 'leadAgent':
				const leadAgent = usersData?.doc?.find((u) => u._id === value);
				return `lead Agent : ${leadAgent ? leadAgent.fullName || leadAgent.username : value}`;
			case 'leadManager':
				const leadManager = usersData?.doc?.find((u) => u._id === value);
				return `lead Manager : ${leadManager ? leadManager.fullName || leadManager.username : value}`;
			default:
				return value;
		}
	};

	const generateSearchTags = (filters) => {
		const tags = [];

		Object.entries(filters).forEach(([key, value]) => {
			if (value && value !== '') {
				const displayName = getFilterDisplayName(key, value);
				if (displayName) {
					tags.push(displayName);
				}
			}
		});

		return tags.length > 0 ? tags : null;
	};

	const formik = useFormik({
		initialValues: {
			userId: '',
			status: '',
			from: null,
			to: null,
			entity: '',
			action: '',
			securityLevel: '',
			roleId: '',
			leadAgent: filters.leadAgent || '',
			leadManager: filters.leadManager || '',
		},
		onSubmit: (values) => {
			const cleanedValues = {
				...values,
				from: values.from ? toUTCString(values.from) : undefined,
				to: values.to ? toUTCString(values.to) : undefined,
			};
			values.entity !== 'Lead' && (cleanedValues.entityId = '');
			const tags = generateSearchTags(cleanedValues);
			applyFilters(cleanedValues);
			onClose();
			setSearchTags([...tags]);
		},
	});

	useEffect(() => {
		if (isOpen) {
			formik.resetForm({
				values: {
					userId: filters.userId || '',
					status: filters.status || '',
					from: filters.from ? new Date(filters.from) : null,
					to: filters.to ? new Date(filters.to) : null,
					entity: filters.entity || '',
					action: filters.action || '',
					securityLevel: filters.securityLevel || '',
					roleId: filters.roleId || '',
					leadAgent: filters.leadAgent || '',
					leadManager: filters.leadManager || '',
				},
			});
			setSearchTags([]);
		}
	}, [isOpen, filters]);

	const handleClear = () => {
		formik.resetForm({
			values: {
				userId: '',
				status: '',
				from: null,
				to: null,
				entity: '',
				action: '',
				securityLevel: '',
				roleId: '',
				leadAgent: '',
				leadManager: '',
			},
		});
		resetFilters();
		setSearchTags([]);
	};

	const handleSelectUser = (user) => {
		formik.setFieldValue('userId', user?._id || null);
	};

	const cleanedInitialFilters = useMemo(() => {
		return {
			userId: filters.userId || '',
			status: filters.status || '',
			from: filters.from || null,
			to: filters.to || null,
			entity: filters.entity || '',
			action: filters.action || '',
			securityLevel: filters.securityLevel || '',
			roleId: filters.roleId || '',
			leadAgent: filters.leadAgent || '',
			leadManager: filters.leadManager || '',
		};
	}, [filters]);

	const isFilterUnchanged = useMemo(() => {
		return Object.entries(cleanedInitialFilters).every(
			([key, val]) => formik.values[key] === val
		);
	}, [formik.values, cleanedInitialFilters]);

	const isFilterEmpty = useMemo(() => {
		return Object.values(formik.values).every(
			(val) => val === '' || val === undefined || val === null
		);
	}, [formik.values]);

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			size={['full', 'xl', '2xl']}
			isCentered
		>
			<ModalOverlay />
			<ModalContent
				mx={{ base: 1, md: 4 }}
				maxW={['100%', '600px', '800px']}
				pb={4}
				borderRadius={['none', 'lg']}
			>
				<ModalHeader
					bg={headerBg}
					color='white'
					borderTopRadius={['none', 'lg']}
					py={3}
				>
					<Flex justify='space-between' align='center'>
						<Text fontSize='md' fontWeight='semibold'>
							Advanced Filters
						</Text>
						<IconButton
							icon={<FiX />}
							variant='ghost'
							color='white'
							_hover={{ bg: grayColors.dark }}
							onClick={onClose}
							aria-label='Close'
							size='sm'
						/>
					</Flex>
				</ModalHeader>
				<form onSubmit={formik.handleSubmit}>
					<ModalBody px={{ base: 2, lg: 4 }} py={4}>
						<VStack spacing={5} maxH='65vh' overflowY='auto' pr={2}>
							{/* User Selection */}
							<FormControl width='100%'>
								<FormLabel mb={1} fontSize='sm' fontWeight='medium'>
									User
								</FormLabel>
								<SearchUsers
									selectedUserId={formik.values.userId}
									users={usersData?.doc || []}
									onSelectUser={handleSelectUser}
									isMobile={isMobile}
								/>
							</FormControl>

							{/* Date Range Section */}
							<Box width='100%'>
								<Text fontSize='sm' fontWeight='semibold' mb={3}>
									Date Range
								</Text>
								<SimpleGrid columns={{ base: 1, lg: 2 }} gap={4}>
									<VStack width='100%' alignItems='flex-start'>
										<FormControl>
											<FormLabel mb={1} fontSize='sm' fontWeight='medium'>
												From Date
											</FormLabel>
											<CustomDatePicker
												selectedDate={formik.values.from}
												handleDateChange={(date) =>
													formik.setFieldValue('from', date)
												}
												placeholder='Select from date'
												maxDate={formik.values.to || new Date()}
												isCalendarOpen={openCalendar === 'from'}
												toggleCalendar={() => toggleCalendar('from')}
												isMobile={isMobile}
											/>
										</FormControl>
									</VStack>
									<VStack width='100%' alignItems='flex-start'>
										<FormControl>
											<FormLabel mb={1} fontSize='sm' fontWeight='medium'>
												To Date
											</FormLabel>
											<CustomDatePicker
												selectedDate={formik.values.to}
												handleDateChange={(date) =>
													formik.setFieldValue('to', date)
												}
												placeholder='Select to date'
												minDate={formik.values.from}
												maxDate={new Date()}
												isCalendarOpen={openCalendar === 'to'}
												toggleCalendar={() => toggleCalendar('to')}
												isMobile={isMobile}
											/>
										</FormControl>
									</VStack>
								</SimpleGrid>
							</Box>

							<SimpleGrid columns={{ base: 1, lg: 2 }} gap={4} w='full'>
								<FormControl>
									<FormLabel mb={1} fontSize='sm' fontWeight='medium'>
										Status
									</FormLabel>
									<Box>
										<Select
											name='status'
											placeholder='Select status'
											value={formik.values.status}
											onChange={formik.handleChange}
											focusBorderColor='brand.500'
											size='md'
										>
											{statusOptions.map((option) => (
												<option key={option.value} value={option.value}>
													{option.label}
												</option>
											))}
										</Select>
									</Box>
								</FormControl>

								<FormControl>
									<FormLabel mb={1} fontSize='sm' fontWeight='medium'>
										Module
									</FormLabel>
									<Box>
										<Select
											name='entity'
											placeholder='Select module'
											value={formik.values.entity}
											onChange={formik.handleChange}
											focusBorderColor='brand.500'
											size='md'
										>
											{entityOptions?.map((option) => (
												<option key={option.value} value={option.value}>
													{option.label}
												</option>
											))}
										</Select>
									</Box>
								</FormControl>
							</SimpleGrid>

							{formik.values.entity === 'Lead' && (
								<ManagerAgentDropdown
									handleChange={formik.handleChange}
									values={formik.values}
									errors={formik.errors}
									touched={formik.touched}
								/>
							)}

							{/* Lead Manager  */}
							{/* {formik.values.entity === "Lead" && (
                <FormControl mt={4}>
                  <FormLabel mb={1} fontSize="sm" fontWeight="medium">
                    Lead Manager
                  </FormLabel>
                  <DropdownSearchUser
                    selectedUserId={formik.values.entityId}
                    users={
                      usersData?.doc.filter((u) => {
                        const roleName = Array.isArray(u?.roles)
                          ? u.roles[0]?.roleName
                          : null;
                        return roleName === "Manager";
                      }) || []
                    }
                    onSelectUser={(user) =>
                      formik.setFieldValue("leadManager", user?._id || "")
                    }
                    isMobile={isMobile}
                    size="sm"
                  />
                </FormControl>
              )}

              
              {formik.values.entity === "Lead" && (
                <FormControl mt={4}>
                  <FormLabel mb={1} fontSize="sm" fontWeight="medium">
                    Lead Agent
                  </FormLabel>
                  <DropdownSearchUser
                    selectedUserId={formik.values.entityId}
                    users={
                      usersData?.doc.filter((u) => {
                        const roleName = Array.isArray(u?.roles)
                          ? u.roles[0]?.roleName
                          : null;
                        return roleName === "Agent";
                      }) || []
                    }
                    onSelectUser={(user) =>
                      formik.setFieldValue("leadAgent", user?._id || "")
                    }
                    isMobile={isMobile}
                    size="sm"
                  />
                </FormControl>
              )} */}

							<SimpleGrid columns={{ base: 1, lg: 2 }} gap={4} w='full'>
								<FormControl>
									<FormLabel mb={1} fontSize='sm' fontWeight='medium'>
										Action
									</FormLabel>
									<Box>
										<Select
											name='action'
											placeholder='Select action'
											value={formik.values.action}
											onChange={formik.handleChange}
											focusBorderColor='brand.500'
											size='md'
										>
											{actionOptions.map((option) => (
												<option key={option.value} value={option.value}>
													{option.label}
												</option>
											))}
										</Select>
									</Box>
								</FormControl>

								<FormControl>
									<FormLabel mb={1} fontSize='sm' fontWeight='medium'>
										Security Level
									</FormLabel>
									<Box>
										<Select
											name='securityLevel'
											placeholder='Select level'
											value={formik.values.securityLevel}
											onChange={formik.handleChange}
											focusBorderColor='brand.500'
											size='md'
										>
											{levelOptions.map((option) => (
												<option key={option.value} value={option.value}>
													{option.value}
												</option>
											))}
										</Select>
									</Box>
								</FormControl>
							</SimpleGrid>
							<FormControl>
								<FormLabel mb={1} fontSize='sm' fontWeight='medium'>
									Role
								</FormLabel>
								<Box>
									<Select
										name='roleId'
										placeholder='Select role'
										value={formik.values.roleId}
										onChange={formik.handleChange}
										focusBorderColor='brand.500'
										size='md'
									>
										{roleData?.map((option) => (
											<option key={option._id} value={option._id}>
												{option.roleName}
											</option>
										))}
									</Select>
								</Box>
							</FormControl>
						</VStack>
					</ModalBody>

					<ModalFooter
						px={4}
						pt={0}
						position={['sticky', 'static']}
						bottom={0}
						bg='white'
						zIndex='sticky'
					>
						<Button
							variant='outline'
							mr={3}
							onClick={handleClear}
							isDisabled={isFilterEmpty}
							size='md'
							width={['50%', 'auto']}
						>
							Clear Filters
						</Button>
						<Button
							colorScheme='brand'
							type='submit'
							isDisabled={isFilterUnchanged}
							size='md'
							width={['50%', 'auto']}
						>
							Apply Filters
						</Button>
					</ModalFooter>
				</form>
			</ModalContent>
		</Modal>
	);
};

export default AdvancedFilter;
