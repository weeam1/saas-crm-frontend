// import React, { useState, useEffect } from 'react';
// import {
// 	Modal,
// 	ModalOverlay,
// 	ModalContent,
// 	ModalHeader,
// 	ModalCloseButton,
// 	ModalBody,
// 	ModalFooter,
// 	FormControl,
// 	FormLabel,
// 	Input,
// 	Select,
// 	Button,
// 	VStack,
// 	Checkbox,
// 	SimpleGrid,
// 	useBreakpointValue,
// 	Flex,
// 	Text,
// 	useColorModeValue,
// } from '@chakra-ui/react';
// import CustomDatePicker from 'components/datetime/CustomDatePicker';
// import SearchUsers from 'views/admin/whatsapp/WhatsappSettings/SearchUsers';

// const AdvancedSearchModal = ({
// 	isOpen,
// 	onClose,
// 	onApplyFilters,
// 	initialFilters,
// 	users,
// 	clearFilter,
// 	user,
// 	usersData,
// }) => {
// 	const [filters, setFilters] = useState(initialFilters);
// 	const [showOverdue, setShowOverdue] = useState(false);
// 	const [showTodays, setShowTodays] = useState(false);
// 	const [openCalendar, setOpenCalendar] = useState(null);

// 	const colSpan = useBreakpointValue({ base: 1, sm: 1, md: 2 });
// 	const bgColor = useColorModeValue('white', 'gray.800');
// 	const headerBg = useColorModeValue('brand.300', 'brand.100');
// 	const headerText = useColorModeValue('brand.700', 'brand.900');
// 	const footerBg = useColorModeValue('gray.50', 'gray.700');
// 	const borderColor = useColorModeValue('gray.200', 'gray.600');

// 	useEffect(() => {
// 		if (isOpen) {
// 			setFilters(initialFilters);
// 			setShowOverdue(initialFilters.overdue || false);
// 			setShowTodays(initialFilters.todays || false);
// 		}
// 	}, [isOpen, initialFilters]);

// 	const toggleCalendar = (calendar) => {
// 		setOpenCalendar(openCalendar === calendar ? null : calendar);
// 	};

// 	const handleApply = () => {
// 		const newFilters = { ...filters };
// 		if (showOverdue) newFilters.overdue = true;
// 		else delete newFilters.overdue;
// 		if (showTodays) newFilters.todays = true;
// 		else delete newFilters.todays;
// 		onApplyFilters(newFilters);
// 		onClose();
// 	};

// 	const handleClear = () => {
// 		setFilters({});
// 		setShowOverdue(false);
// 		setShowTodays(false);
// 	};

// 	const isFilterUnchanged =
// 		JSON.stringify(filters) === JSON.stringify(initialFilters) &&
// 		showOverdue === (initialFilters.overdue || false) &&
// 		showTodays === (initialFilters.todays || false);

// 	const handleSelectUser = (user) => {
// 		setFilters({ ...filters, assignedTo: user?._id || null });
// 	};

// 	return (
// 		<Modal
// 			isOpen={isOpen}
// 			onClose={onClose}
// 			size='lg'
// 			isCentered
// 			scrollBehavior='inside'
// 			motionPreset='slideInBottom'
// 		>
// 			<ModalOverlay />
// 			<ModalContent
// 				bg={bgColor}
// 				borderRadius='2xl'
// 				shadow='2xl'
// 				maxW={{ base: 'full', sm: '90vw', md: '500px' }}
// 				overflow='hidden'
// 				mx={{ base: 3, md: 0 }}
// 			>
// 				<ModalHeader p={0} borderBottom='1px solid' borderColor={borderColor}>
// 					<Flex
// 						bg={headerBg}
// 						color={headerText}
// 						px={6}
// 						py={3}
// 						position='sticky'
// 						top='0'
// 						zIndex='10'
// 						boxShadow='md'
// 					>
// 						<Text fontSize={{ base: 'md', md: 'lg' }} fontWeight='bold'>
// 							Advanced Search
// 						</Text>
// 						<ModalCloseButton
// 							position='absolute'
// 							right='12px'
// 							top='10px'
// 							color={headerText}
// 							_hover={{ bg: 'whiteAlpha.200' }}
// 						/>
// 					</Flex>
// 				</ModalHeader>

// 				<ModalBody
// 					p={5}
// 					overflowY='auto'
// 					maxH='65vh'
// 					borderBottom='1px solid'
// 					borderColor={borderColor}
// 				>
// 					<VStack spacing={5} align='stretch'>
// 						<FormControl>
// 							<FormLabel fontWeight='semibold'>Title</FormLabel>
// 							<Input
// 								value={filters.title || ''}
// 								onChange={(e) =>
// 									setFilters({ ...filters, title: e.target.value })
// 								}
// 								placeholder='Search by title'
// 								focusBorderColor='brand.500'
// 							/>
// 						</FormControl>

// 						<SimpleGrid columns={colSpan} gap={4} w='full'>
// 							<FormControl>
// 								<FormLabel fontWeight='semibold'>Status</FormLabel>
// 								<Select
// 									value={filters.status || ''}
// 									onChange={(e) =>
// 										setFilters({ ...filters, status: e.target.value })
// 									}
// 									placeholder='Select status'
// 									focusBorderColor='brand.500'
// 								>
// 									<option value='Pending'>Pending</option>
// 									<option value='In Progress'>In Progress</option>
// 									<option value='Completed'>Completed</option>
// 									<option value='Overdue'>Overdue</option>
// 								</Select>
// 							</FormControl>

// 							<FormControl>
// 								<FormLabel fontWeight='semibold'>Task Type</FormLabel>
// 								<Select
// 									value={filters.type || ''}
// 									onChange={(e) =>
// 										setFilters({ ...filters, type: e.target.value })
// 									}
// 									placeholder='Select type'
// 									focusBorderColor='brand.500'
// 								>
// 									<option value='Follow-up'>Follow-up</option>
// 									<option value='Meeting'>Meeting</option>
// 									<option value='Site Visit'>Site Visit</option>
// 									<option value='Call'>Call</option>
// 									<option value='Email'>Email</option>
// 									<option value='Document Collection'>
// 										Document Collection
// 									</option>
// 									<option value='Custom'>Custom</option>
// 								</Select>
// 							</FormControl>
// 						</SimpleGrid>

// 						{(user?.role === 'superAdmin' ||
// 							user?.roles?.[0]?.roleName === 'Manager' ||
// 							user?.roles?.[0]?.roleName === 'HR') && (
// 							<FormControl>
// 								<FormLabel fontWeight='semibold'>Assigned To</FormLabel>
// 								<SearchUsers
// 									selectedUserId={filters.assignedTo || null}
// 									users={
// 										user?.roles[0]?.roleName === 'Manager'
// 											? users
// 											: usersData?.doc || []
// 									}
// 									onSelectUser={handleSelectUser}
// 								/>
// 							</FormControl>
// 						)}

// 						<FormControl>
// 							<FormLabel fontWeight='semibold'>Due Date Range</FormLabel>
// 							<VStack width='100%' alignItems='flex-end'>
// 								<CustomDatePicker
// 									selectedDate={filters.dueDateFrom}
// 									handleDateChange={(date) =>
// 										setFilters({ ...filters, dueDateFrom: date })
// 									}
// 									placeholder='From date'
// 									isCalendarOpen={openCalendar === 'dueDateFrom'}
// 									toggleCalendar={() => toggleCalendar('dueDateFrom')}
// 								/>
// 								<CustomDatePicker
// 									selectedDate={filters.dueDateTo}
// 									handleDateChange={(date) =>
// 										setFilters({ ...filters, dueDateTo: date })
// 									}
// 									placeholder='To date'
// 									isCalendarOpen={openCalendar === 'dueDateTo'}
// 									toggleCalendar={() => toggleCalendar('dueDateTo')}
// 									minDate={filters.dueDateFrom}
// 								/>
// 							</VStack>
// 						</FormControl>

// 						<VStack align='start' w='full'>
// 							<Checkbox
// 								isChecked={showOverdue}
// 								onChange={(e) => setShowOverdue(e.target.checked)}
// 								colorScheme='brand'
// 							>
// 								Show overdue tasks
// 							</Checkbox>
// 							<Checkbox
// 								isChecked={showTodays}
// 								onChange={(e) => setShowTodays(e.target.checked)}
// 								colorScheme='brand'
// 							>
// 								Show today's tasks
// 							</Checkbox>
// 						</VStack>
// 					</VStack>
// 				</ModalBody>

// 				<ModalFooter
// 					position='sticky'
// 					bottom='0'
// 					bg={footerBg}
// 					borderTop='1px solid'
// 					borderColor={borderColor}
// 					py={3}
// 					px={5}
// 					zIndex='10'
// 					justifyContent='flex-end'
// 					gap={3}
// 				>
// 					<Button
// 						variant='outline'
// 						colorScheme='gray'
// 						size='sm'
// 						onClick={handleClear}
// 						borderRadius='md'
// 						isDisabled={
// 							Object.keys(filters).length === 0 && !showOverdue && !showTodays
// 						}
// 					>
// 						Clear
// 					</Button>
// 					<Button
// 						colorScheme='brand'
// 						size='sm'
// 						borderRadius='md'
// 						onClick={handleApply}
// 						isDisabled={isFilterUnchanged}
// 					>
// 						Apply
// 					</Button>
// 				</ModalFooter>
// 			</ModalContent>
// 		</Modal>
// 	);
// };

// export default AdvancedSearchModal;

import React, { useState, useEffect } from 'react';
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	ModalFooter,
	FormControl,
	FormLabel,
	Input,
	Select,
	Button,
	VStack,
	Checkbox,
	SimpleGrid,
	useBreakpointValue,
	Flex,
	Text,
	Box,
	Icon,
	HStack,
	Badge,
} from '@chakra-ui/react';
import CustomDatePicker from 'components/datetime/CustomDatePicker';
import SearchUsers from 'views/admin/whatsapp/WhatsappSettings/SearchUsers';
import { FiSearch, FiX, FiCheck, FiCalendar, FiUser } from 'react-icons/fi';
import { useModalColors } from 'hooks/useModalColors';

const AdvancedSearchModal = ({
	isOpen,
	onClose,
	onApplyFilters,
	initialFilters,
	users,
	clearFilter,
	user,
	usersData,
}) => {
	const [filters, setFilters] = useState(initialFilters);
	const [showOverdue, setShowOverdue] = useState(false);
	const [showTodays, setShowTodays] = useState(false);
	const [openCalendar, setOpenCalendar] = useState(null);

	const mc = useModalColors();

	const colSpan = useBreakpointValue({ base: 1, sm: 1, md: 2 });

	useEffect(() => {
		if (isOpen) {
			setFilters(initialFilters);
			setShowOverdue(initialFilters.overdue || false);
			setShowTodays(initialFilters.todays || false);
		}
	}, [isOpen, initialFilters]);

	const toggleCalendar = (calendar) => {
		setOpenCalendar(openCalendar === calendar ? null : calendar);
	};

	const handleApply = () => {
		const newFilters = { ...filters };
		if (showOverdue) newFilters.overdue = true;
		else delete newFilters.overdue;
		if (showTodays) newFilters.todays = true;
		else delete newFilters.todays;
		onApplyFilters(newFilters);
		onClose();
	};

	const handleClear = () => {
		setFilters({});
		setShowOverdue(false);
		setShowTodays(false);
	};

	const isFilterUnchanged =
		JSON.stringify(filters) === JSON.stringify(initialFilters) &&
		showOverdue === (initialFilters.overdue || false) &&
		showTodays === (initialFilters.todays || false);

	const handleSelectUser = (user) => {
		setFilters({ ...filters, assignedTo: user?._id || null });
	};

	// Count active filters for badge
	const activeFilterCount =
		Object.keys(filters).filter(
			(key) =>
				filters[key] !== '' &&
				filters[key] !== null &&
				filters[key] !== undefined,
		).length +
		(showOverdue ? 1 : 0) +
		(showTodays ? 1 : 0);

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			size='lg'
			isCentered
			scrollBehavior='inside'
			motionPreset='slideInBottom'
		>
			<ModalOverlay backdropFilter='blur(3px)' bg={mc.overlayBg} />
			<ModalContent
				bg={mc.bg}
				borderRadius='2xl'
				boxShadow={mc.modalShadow}
				border='1px solid'
				borderColor={mc.borderColor}
				maxW={{ base: 'full', sm: '90vw', md: '500px' }}
				overflow='hidden'
				mx={{ base: 3, md: 0 }}
			>
				{/* Header — Gold Gradient */}
				<ModalHeader p={0}>
					<Flex
						background={mc.headerBg}
						color={mc.headerText}
						px={6}
						py={4}
						boxShadow='0 2px 10px rgba(0,0,0,0.15)'
						align='center'
						justify='space-between'
					>
						<Text
							fontSize={{ base: 'md', md: 'lg' }}
							color='inherit'
							fontWeight='bold'
						>
							Advanced Search
						</Text>
						<ModalCloseButton
							position='relative'
							top='0'
							right='0'
							bg={mc.closeBtnBg}
							color={mc.closeBtnColor}
							borderRadius='full'
							_hover={{ bg: mc.closeBtnHoverBg }}
							_focus={{ boxShadow: 'none' }}
						/>
					</Flex>
				</ModalHeader>

				{/* Body */}
				<ModalBody
					p={6}
					overflowY='auto'
					maxH='65vh'
					sx={{
						'&::-webkit-scrollbar': {
							width: '6px',
						},
						'&::-webkit-scrollbar-track': {
							background: mc.bgDeep,
							borderRadius: '3px',
						},
						'&::-webkit-scrollbar-thumb': {
							background: mc.borderColor,
							borderRadius: '3px',
							_hover: { background: mc.borderFocus },
						},
					}}
				>
					<VStack spacing={5} align='stretch'>
						{/* Title */}
						<FormControl>
							<FormLabel fontWeight='semibold' color={mc.labelColor}>
								Title
							</FormLabel>
							<Input
								value={filters.title || ''}
								onChange={(e) =>
									setFilters({ ...filters, title: e.target.value })
								}
								placeholder='Search by title'
								bg={mc.bgInput}
								borderColor={mc.borderColor}
								color={mc.headingText}
								_hover={{ borderColor: mc.borderFocus }}
								_focus={{
									borderColor: mc.borderFocus,
									boxShadow: `0 0 0 1px ${mc.borderFocus}`,
								}}
								_placeholder={{ color: mc.mutedText }}
								borderRadius='md'
							/>
						</FormControl>

						{/* Status & Type Grid */}
						<SimpleGrid columns={colSpan} gap={4} w='full'>
							<FormControl>
								<FormLabel fontWeight='semibold' color={mc.labelColor}>
									Status
								</FormLabel>
								<Select
									value={filters.status || ''}
									onChange={(e) =>
										setFilters({ ...filters, status: e.target.value })
									}
									placeholder='Select status'
									bg={mc.bgInput}
									borderColor={mc.borderColor}
									color={filters.status ? mc.headingText : mc.mutedText}
									_hover={{ borderColor: mc.borderFocus }}
									_focus={{
										borderColor: mc.borderFocus,
										boxShadow: `0 0 0 1px ${mc.borderFocus}`,
									}}
									borderRadius='md'
									iconColor={mc.labelColor}
								>
									<option value='Pending'>Pending</option>
									<option value='In Progress'>In Progress</option>
									<option value='Completed'>Completed</option>
									<option value='Overdue'>Overdue</option>
								</Select>
							</FormControl>

							<FormControl>
								<FormLabel fontWeight='semibold' color={mc.labelColor}>
									Task Type
								</FormLabel>
								<Select
									value={filters.type || ''}
									onChange={(e) =>
										setFilters({ ...filters, type: e.target.value })
									}
									placeholder='Select type'
									bg={mc.bgInput}
									borderColor={mc.borderColor}
									color={filters.type ? mc.headingText : mc.mutedText}
									_hover={{ borderColor: mc.borderFocus }}
									_focus={{
										borderColor: mc.borderFocus,
										boxShadow: `0 0 0 1px ${mc.borderFocus}`,
									}}
									borderRadius='md'
									iconColor={mc.labelColor}
								>
									<option value='Follow-up'>Follow-up</option>
									<option value='Meeting'>Meeting</option>
									<option value='Site Visit'>Site Visit</option>
									<option value='Call'>Call</option>
									<option value='Email'>Email</option>
									<option value='Document Collection'>
										Document Collection
									</option>
									<option value='Custom'>Custom</option>
								</Select>
							</FormControl>
						</SimpleGrid>

						{/* Assigned To (Role-based) */}
						{(user?.role === 'superAdmin' ||
							user?.roles?.[0]?.roleName === 'Manager' ||
							user?.roles?.[0]?.roleName === 'HR') && (
							<FormControl>
								<FormLabel fontWeight='semibold' color={mc.labelColor}>
									<Icon as={FiUser} mr={1} />
									Assigned To
								</FormLabel>
								<SearchUsers
									selectedUserId={filters.assignedTo || null}
									users={
										user?.roles[0]?.roleName === 'Manager'
											? users
											: usersData?.doc || []
									}
									onSelectUser={handleSelectUser}
								/>
							</FormControl>
						)}

						{/* Due Date Range */}
						<FormControl>
							<FormLabel fontWeight='semibold' color={mc.labelColor}>
								<Icon as={FiCalendar} mr={1} />
								Due Date Range
							</FormLabel>
							<Box
								bg={mc.bgDeep}
								p={3}
								borderRadius='lg'
								border='1px solid'
								borderColor={mc.borderColor}
							>
								<VStack width='100%' spacing={3}>
									<CustomDatePicker
										selectedDate={filters.dueDateFrom}
										handleDateChange={(date) =>
											setFilters({ ...filters, dueDateFrom: date })
										}
										placeholder='From date'
										isCalendarOpen={openCalendar === 'dueDateFrom'}
										toggleCalendar={() => toggleCalendar('dueDateFrom')}
									/>
									<Flex align='center' gap={2} w='full'>
										<Box flex={1} h='1px' bg={mc.borderColor} />
										<Text
											fontSize='xs'
											color={mc.mutedText}
											fontWeight='medium'
										>
											TO
										</Text>
										<Box flex={1} h='1px' bg={mc.borderColor} />
									</Flex>
									<CustomDatePicker
										selectedDate={filters.dueDateTo}
										handleDateChange={(date) =>
											setFilters({ ...filters, dueDateTo: date })
										}
										placeholder='To date'
										isCalendarOpen={openCalendar === 'dueDateTo'}
										toggleCalendar={() => toggleCalendar('dueDateTo')}
										minDate={filters.dueDateFrom}
									/>
								</VStack>
							</Box>
						</FormControl>

						{/* Quick Checkboxes */}
						<Box
							bg={mc.bgDeep}
							p={4}
							borderRadius='lg'
							border='1px solid'
							borderColor={mc.borderColor}
						>
							<Text
								fontSize='xs'
								color={mc.labelColor}
								fontWeight='semibold'
								mb={3}
								textTransform='uppercase'
								letterSpacing='wider'
							>
								Quick Filters
							</Text>
							<VStack align='start' spacing={2}>
								<Checkbox
									isChecked={showOverdue}
									onChange={(e) => setShowOverdue(e.target.checked)}
									colorScheme='gold'
									size='md'
								>
									<Text color={mc.bodyText} fontSize='sm'>
										Show overdue tasks
									</Text>
								</Checkbox>
								<Checkbox
									isChecked={showTodays}
									onChange={(e) => setShowTodays(e.target.checked)}
									colorScheme='gold'
									size='md'
								>
									<Text color={mc.bodyText} fontSize='sm'>
										Show today's tasks
									</Text>
								</Checkbox>
							</VStack>
						</Box>
					</VStack>
				</ModalBody>

				{/* Footer — Navy with gold accent */}
				<ModalFooter
					position='sticky'
					bottom='0'
					bg={mc.footerBg}
					borderTop='2px solid'
					borderColor={mc.headerBg}
					py={4}
					px={6}
					zIndex='10'
					gap={3}
				>
					<Button
						variant='ghost'
						size='sm'
						onClick={handleClear}
						borderRadius='md'
						color={mc.secondaryBtnText}
						_hover={{
							bg: mc.secondaryBtnHoverBg,
							color: mc.secondaryBtnHoverText,
						}}
						isDisabled={
							Object.keys(filters).length === 0 && !showOverdue && !showTodays
						}
					>
						Clear
					</Button>
					<Button
						size='sm'
						borderRadius='md'
						onClick={handleApply}
						isDisabled={isFilterUnchanged}
						background={mc.primaryBtnBg}
						color={mc.primaryBtnText}
						fontWeight='bold'
						px={6}
						_hover={{
							background: mc.primaryBtnHoverBg,
							boxShadow: mc.primaryBtnShadow,
							transform: 'translateY(-1px)',
						}}
						_active={{
							background: mc.primaryBtnActiveBg,
							transform: 'translateY(0)',
						}}
						_disabled={{
							opacity: 0.5,
							cursor: 'not-allowed',
							transform: 'none',
							boxShadow: 'none',
						}}
					>
						Apply
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default AdvancedSearchModal;
