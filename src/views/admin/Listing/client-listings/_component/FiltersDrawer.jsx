import React, {
	useState,
	useEffect,
	useCallback,
	useMemo,
	useRef,
} from 'react';
import {
	Box,
	Button,
	Drawer,
	DrawerBody,
	DrawerHeader,
	DrawerOverlay,
	DrawerContent,
	DrawerCloseButton,
	FormControl,
	FormLabel,
	Input,
	Select,
	VStack,
	HStack,
	Divider,
	IconButton,
	Badge,
	Flex,
	Text,
	useDisclosure,
	RangeSlider,
	RangeSliderTrack,
	RangeSliderFilledTrack,
	RangeSliderThumb,
	Grid,
	GridItem,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
	FiFilter,
	FiX,
	FiCalendar,
	FiDollarSign,
	FiMaximize2,
} from 'react-icons/fi';
import { MdApartment } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { capitalizeWords } from 'utils/helpers';
import { getNameById } from 'utils/filters';

const MotionDrawerContent = motion(DrawerContent);
const MotionBadge = motion(Badge);
const MotionButton = motion(Button);

const initialFilters = {
	listingNumber: '',
	unitNumber: '',
	projectName: '',
	status: '',
	buildingAge: '',
	developer: '',
	isClient: '',
	listingType: '',
	unitType: '',
	subUnitType: '',
	country: '',
	minPrice: '',
	maxPrice: '',
	minArea: '',
	maxArea: '',
	dateFrom: '',
	dateTo: '',
};

const FilterSection = React.memo(({ title, icon, children }) => {
	return (
		<Box>
			<HStack mb={3} spacing={2}>
				<Box color='brand.500'>{icon}</Box>
				<Text fontWeight='semibold' fontSize='sm' color='gray.700'>
					{title}
				</Text>
			</HStack>

			<Box
				p={4}
				bg='gray.50'
				borderRadius='lg'
				border='1px'
				borderColor='gray.200'
			>
				{children}
			</Box>
		</Box>
	);
});

const FilterDrawer = ({
	filters = initialFilters,
	setActiveFilters,
	onFilterChange,
	listingTypes,
	unitTypes,
	onReset,
}) => {
	const countries = useSelector((state) => state.countries.countryNames);

	const countryOptions = useMemo(
		() =>
			countries.map((c) => {
				return capitalizeWords(c);
			}),
		[countries]
	);

	const { isOpen, onOpen, onClose } = useDisclosure();

	const [localFilters, setLocalFilters] = useState(filters);
	const hasAnimatedRef = useRef(false);

	useEffect(() => {
		if (isOpen) {
			setLocalFilters(filters);
		}
	}, [isOpen, filters]);

	const subUnitTypes = useMemo(() => {
		if (!localFilters.unitType) return [];
		const unit = unitTypes.find((u) => u._id === localFilters.unitType);
		return unit?.subTypes ?? [];
	}, [localFilters.unitType, unitTypes]);

	const handleInputChange = (field, value) => {
		setLocalFilters((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleApply = () => {
		const active = Object.fromEntries(
			Object.entries(localFilters).filter(
				([_, value]) => value !== '' && value !== undefined && value !== null
			)
		);
		onFilterChange(active);

		const uiActiveFilters = {
			...active,

			...(active.listingType && {
				listingType: getNameById(listingTypes, active.listingType),
			}),

			...(active.unitType && {
				unitType: getNameById(unitTypes, active.unitType),
			}),

			...(active.subUnitType && {
				subUnitType: getNameById(subUnitTypes, active.subUnitType),
			}),
		};

		// if unitType, subUnitType, listingType --> fetch name from thier list
		setActiveFilters(uiActiveFilters);
		onClose();
	};

	const handleReset = () => {
		setLocalFilters(initialFilters);
		onFilterChange(initialFilters);
		onReset?.();
	};

	const getTodayDate = () => new Date().toISOString().split('T')[0];

	return (
		<>
			{/* Trigger */}
			<MotionButton
				leftIcon={<FiFilter />}
				variant='outline'
				colorScheme='brand'
				onClick={onOpen}
				whileHover={{ scale: 1.05 }}
				whileTap={{ scale: 0.95 }}
			>
				Filters
				{/* {!!Object.values(filters).filter(Boolean).length && (
					<MotionBadge ml={2} colorScheme='red'>
						{Object.values(filters).filter(Boolean).length}
					</MotionBadge>
				)} */}
			</MotionButton>

			{/* Drawer */}
			<Drawer isOpen={isOpen} placement='left' onClose={onClose} size='md'>
				<DrawerOverlay />

				<MotionDrawerContent
					initial={hasAnimatedRef.current ? false : { x: '-100%' }}
					animate={{ x: 0 }}
					transition={{ type: 'spring', stiffness: 260, damping: 30 }}
					onAnimationComplete={() => {
						hasAnimatedRef.current = true;
					}}
				>
					<DrawerCloseButton />
					<DrawerHeader borderBottomWidth='1px'>
						<HStack spacing={3}>
							<Box color='brand.500'>
								<FiFilter size={20} />
							</Box>
							<Box>
								<Text fontSize='lg' fontWeight='bold'>
									Advanced Filters
								</Text>
								<Text fontSize='xs' color='gray.500'>
									Refine your search results
								</Text>
							</Box>
						</HStack>
					</DrawerHeader>

					<DrawerBody py={1}>
						<VStack
							spacing={6}
							p={2}
							align='stretch'
							overflow='scroll'
							maxH={{ base: '60vh', md: '70vh', lg: '85vh' }}
						>
							<FilterSection title='Basic Information' icon={<MdApartment />}>
								<Grid templateColumns='repeat(2, 1fr)' gap={3}>
									<Input
										size='sm'
										placeholder='Listing Number'
										value={localFilters.listingNumber}
										onChange={(e) =>
											handleInputChange('listingNumber', e.target.value)
										}
									/>
									<Input
										size='sm'
										placeholder='Unit Number'
										value={localFilters.unitNumber}
										onChange={(e) =>
											handleInputChange('unitNumber', e.target.value)
										}
									/>
								</Grid>

								<Input
									mt={3}
									size='sm'
									placeholder='Project Name'
									value={localFilters.projectName}
									onChange={(e) =>
										handleInputChange('projectName', e.target.value)
									}
								/>
							</FilterSection>

							<FilterSection title='Price Range' icon={<FiDollarSign />}>
								<Grid templateColumns='repeat(2, 1fr)' gap={3}>
									<Input
										type='number'
										size='sm'
										placeholder='Min'
										value={localFilters.minPrice}
										onChange={(e) =>
											handleInputChange('minPrice', e.target.value)
										}
									/>
									<Input
										type='number'
										size='sm'
										placeholder='Max'
										value={localFilters.maxPrice}
										onChange={(e) =>
											handleInputChange('maxPrice', e.target.value)
										}
									/>
								</Grid>
							</FilterSection>

							<FilterSection title='Date Range' icon={<FiCalendar />}>
								<Grid templateColumns='repeat(2, 1fr)' gap={3}>
									<Input
										type='date'
										size='sm'
										value={localFilters.dateFrom}
										max={getTodayDate()}
										onChange={(e) =>
											handleInputChange('dateFrom', e.target.value)
										}
									/>
									<Input
										type='date'
										size='sm'
										value={localFilters.dateTo}
										min={localFilters.dateFrom}
										max={getTodayDate()}
										onChange={(e) =>
											handleInputChange('dateTo', e.target.value)
										}
									/>
								</Grid>
							</FilterSection>

							<FilterSection title='Area Range' icon={<FiMaximize2 />}>
								<Grid templateColumns='repeat(2, 1fr)' gap={3}>
									<GridItem>
										<FormControl>
											<FormLabel fontSize='xs' color='gray.600'>
												Min Area (sq ft)
											</FormLabel>
											<Input
												size='sm'
												type='number'
												value={localFilters.minArea}
												onChange={(e) =>
													handleInputChange('minArea', e.target.value)
												}
												placeholder='Min area'
											/>
										</FormControl>
									</GridItem>
									<GridItem>
										<FormControl>
											<FormLabel fontSize='xs' color='gray.600'>
												Max Area (sq ft)
											</FormLabel>
											<Input
												size='sm'
												type='number'
												value={localFilters.maxArea}
												onChange={(e) =>
													handleInputChange('maxArea', e.target.value)
												}
												placeholder='Max area'
											/>
										</FormControl>
									</GridItem>
								</Grid>
							</FilterSection>

							<FilterSection title='Categories' icon={<FiFilter />}>
								<Select
									size='sm'
									placeholder='Listing Type'
									value={localFilters.listingType}
									onChange={(e) =>
										handleInputChange('listingType', e.target.value)
									}
								>
									{listingTypes.map((t) => (
										<option key={t._id} value={t._id}>
											{t.name}
										</option>
									))}
								</Select>

								<Select
									mt={3}
									size='sm'
									placeholder='Unit Type'
									value={localFilters.unitType}
									onChange={(e) =>
										handleInputChange('unitType', e.target.value)
									}
								>
									{unitTypes.map((t) => (
										<option key={t._id} value={t._id}>
											{t.name}
										</option>
									))}
								</Select>

								<Select
									mt={3}
									size='sm'
									placeholder='Sub Unit Type'
									value={localFilters.subUnitType}
									onChange={(e) =>
										handleInputChange('subUnitType', e.target.value)
									}
								>
									{subUnitTypes.map((t) => (
										<option key={t._id} value={t._id}>
											{t.name}
										</option>
									))}
								</Select>
							</FilterSection>

							{countries.length > 0 && (
								<FilterSection title='Location' icon={<MdApartment />}>
									<Select
										size='sm'
										placeholder='Select Country'
										value={localFilters.country}
										onChange={(e) =>
											handleInputChange('country', e.target.value)
										}
									>
										{countryOptions.map((c) => (
											<option key={c} value={c}>
												{c}
											</option>
										))}
									</Select>
								</FilterSection>
							)}
						</VStack>
						<HStack>
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

// const FilterDrawer = ({ filters, onFilterChange, onReset }) => {
// 	const { listingTypes, unitTypes } = useClientListing();
// 	const countries = useSelector((state) => state.countries.countryNames);

// 	const { isOpen, onOpen, onClose } = useDisclosure();
// 	const [localFilters, setLocalFilters] = useState(filters);

// 	const localFiltersRef = useRef(localFilters);

// 	const handleInputChange = (field, value) => {
// 		localFiltersRef.current[field] = value;
// 		setLocalFilters((prev) => ({ ...prev, [field]: value }));
// 	};

// 	const handleApply = () => {
// 		// onFilterChange(localFilters);
// 		console.log(localFilters);
// 		onClose();
// 	};

// 	const handleReset = () => {
// 		setLocalFilters(initialFilters);
// 		if (onReset) onReset();
// 		onFilterChange(initialFilters);
// 	};

// 	const formatDate = (date) => {
// 		if (!date) return '';
// 		return new Date(date).toLocaleDateString('en-US', {
// 			month: 'short',
// 			day: 'numeric',
// 			year: 'numeric',
// 		});
// 	};

// 	const getTodayDate = () => {
// 		return new Date().toISOString().split('T')[0];
// 	};

// 	const subUnitTypes = useMemo(() => {
// 		if (!localFilters?.unitType) return [];

// 		const UNIT_TYPE = unitTypes?.find(
// 			(type) => type._id === localFilters?.unitType
// 		);

// 		if (!UNIT_TYPE || !UNIT_TYPE.subTypes?.length) return [];

// 		return UNIT_TYPE.subTypes;
// 	}, [localFilters?.unitType, unitTypes]);

// 	useEffect(() => {
// 		console.log('mounted');
// 		return () => console.log('unmounted');
// 	}, []);

// 	const FilterSection = ({ title, icon, children }) => (
// 		<Box
// 		// as={motion.div}
// 		// // initial={{ opacity: 0, y: 10 }}
// 		// initial={false}
// 		// animate={{ opacity: 1, y: 0 }}
// 		// transition={{ duration: 0.3 }}
// 		>
// 			<HStack mb={3} spacing={2}>
// 				<Box color='brand.500'>{icon}</Box>
// 				<Text fontWeight='semibold' fontSize='sm' color='gray.700'>
// 					{title}
// 				</Text>
// 			</HStack>
// 			<Box
// 				p={4}
// 				bg='gray.50'
// 				borderRadius='lg'
// 				border='1px'
// 				borderColor='gray.200'
// 			>
// 				{children}
// 			</Box>
// 		</Box>
// 	);

// 	return (
// 		<>
// 			{/* Filter Trigger Button */}
// 			<Box position='relative'>
// 				<MotionButton
// 					leftIcon={<FiFilter />}
// 					colorScheme='brand'
// 					variant='outline'
// 					onClick={onOpen}
// 					whileHover={{ scale: 1.05 }}
// 					whileTap={{ scale: 0.95 }}
// 					position='relative'
// 				>
// 					Filters
// 					{filters?.length > 0 && (
// 						<MotionBadge
// 							colorScheme='red'
// 							borderRadius='full'
// 							ml={2}
// 							initial={{ scale: 0 }}
// 							animate={{ scale: 1 }}
// 						>
// 							{filters?.length}
// 						</MotionBadge>
// 					)}
// 				</MotionButton>
// 			</Box>

// 			{/* Filter Drawer */}
// 			{isOpen && (
// 				<Drawer isOpen={isOpen} placement='left' onClose={onClose} size='md'>
// 					<DrawerOverlay />
// 					<MotionDrawerContent
// 						// initial={{ x: '100%' }}
// 						initial={'hidden'}
// 						animate={'visible'}
// 						exit={{ x: '100%' }}
// 						transition={{ type: 'spring', damping: 25, stiffness: 200 }}
// 					>
// 						<DrawerCloseButton
// 							size='lg'
// 							top={4}
// 							right={4}
// 							_hover={{ bg: 'gray.100' }}
// 						/>
// 						<DrawerHeader borderBottomWidth='1px'>
// 							<Flex align='center' justify='space-between'>
// 								<HStack spacing={3}>
// 									<Box color='brand.500'>
// 										<FiFilter size={24} />
// 									</Box>
// 									<Box>
// 										<Text fontSize='xl' fontWeight='bold'>
// 											Advanced Filters
// 										</Text>
// 										<Text fontSize='sm' color='gray.500'>
// 											Refine your search results
// 										</Text>
// 									</Box>
// 								</HStack>
// 								{filters?.length > 0 && (
// 									<Badge colorScheme='brand' px={2} py={1} borderRadius='md'>
// 										{filters?.length} active
// 									</Badge>
// 								)}
// 							</Flex>
// 						</DrawerHeader>

// 						<DrawerBody py={6}>
// 							<VStack spacing={6} align='stretch'>
// 								{/* Quick Stats */}
// 								{/* <AnimatePresence>
// 										{filters > 0 && (
// 											<motion.div
// 												initial={{ opacity: 0, height: 0 }}
// 												animate={{ opacity: 1, height: 'auto' }}
// 												exit={{ opacity: 0, height: 0 }}
// 											>
// 												<Box
// 													p={3}
// 													bg='brand.50'
// 													borderRadius='md'
// 													border='1px'
// 													borderColor='brand.200'
// 												>
// 													<HStack justify='space-between'>
// 														<Text fontSize='sm' color='brand.700'>
// 															Filters applied: {activeFilterCount}
// 														</Text>
// 														<Button
// 															size='xs'
// 															variant='ghost'
// 															colorScheme='brand'
// 															onClick={handleReset}
// 															rightIcon={<FiX />}
// 														>
// 															Clear All
// 														</Button>
// 													</HStack>
// 												</Box>
// 											</motion.div>
// 										)}
// 									</AnimatePresence> */}

// 								{/* Basic Information Section */}
// 								<FilterSection title='Basic Information' icon={<MdApartment />}>
// 									<Grid templateColumns='repeat(2, 1fr)' gap={3}>
// 										<GridItem>
// 											<FormControl>
// 												<FormLabel fontSize='xs' color='gray.600'>
// 													Listing Number
// 												</FormLabel>
// 												<Input
// 													size='sm'
// 													value={localFilters.listingNumber}
// 													onChange={(e) =>
// 														handleInputChange('listingNumber', e.target.value)
// 													}
// 													placeholder='e.g., L-001'
// 												/>
// 											</FormControl>
// 										</GridItem>
// 										<GridItem>
// 											<FormControl>
// 												<FormLabel fontSize='xs' color='gray.600'>
// 													Unit Number
// 												</FormLabel>
// 												<Input
// 													size='sm'
// 													value={localFilters.unitNumber}
// 													onChange={(e) =>
// 														handleInputChange('unitNumber', e.target.value)
// 													}
// 													placeholder='e.g., Unit 101'
// 												/>
// 											</FormControl>
// 										</GridItem>
// 									</Grid>

// 									<FormControl mt={3}>
// 										<FormLabel fontSize='xs' color='gray.600'>
// 											Project Name
// 										</FormLabel>
// 										<Input
// 											size='sm'
// 											value={localFilters.projectName}
// 											onChange={(e) =>
// 												handleInputChange('projectName', e.target.value)
// 											}
// 											placeholder='Enter project name'
// 										/>
// 									</FormControl>
// 								</FilterSection>

// 								{/* Price Range Section */}
// 								<FilterSection title='Price Range' icon={<FiDollarSign />}>
// 									<Grid templateColumns='repeat(2, 1fr)' gap={3}>
// 										<GridItem>
// 											<FormControl>
// 												<FormLabel fontSize='xs' color='gray.600'>
// 													Min Price
// 												</FormLabel>
// 												<Input
// 													size='sm'
// 													type='number'
// 													value={localFilters.minPrice}
// 													onChange={(e) =>
// 														handleInputChange('minPrice', e.target.value)
// 													}
// 													placeholder='Min'
// 													leftElement={
// 														<Text fontSize='xs' color='gray.500' ml={2}>
// 															$
// 														</Text>
// 													}
// 												/>
// 											</FormControl>
// 										</GridItem>
// 										<GridItem>
// 											<FormControl>
// 												<FormLabel fontSize='xs' color='gray.600'>
// 													Max Price
// 												</FormLabel>
// 												<Input
// 													size='sm'
// 													type='number'
// 													value={localFilters.maxPrice}
// 													onChange={(e) =>
// 														handleInputChange('maxPrice', e.target.value)
// 													}
// 													placeholder='Max'
// 													leftElement={
// 														<Text fontSize='xs' color='gray.500' ml={2}>
// 															$
// 														</Text>
// 													}
// 												/>
// 											</FormControl>
// 										</GridItem>
// 									</Grid>
// 								</FilterSection>

// 								{/* Area Range Section */}
// 								<FilterSection title='Area Range' icon={<FiMaximize2 />}>
// 									<Grid templateColumns='repeat(2, 1fr)' gap={3}>
// 										<GridItem>
// 											<FormControl>
// 												<FormLabel fontSize='xs' color='gray.600'>
// 													Min Area (sq ft)
// 												</FormLabel>
// 												<Input
// 													size='sm'
// 													type='number'
// 													value={localFilters.minArea}
// 													onChange={(e) =>
// 														handleInputChange('minArea', e.target.value)
// 													}
// 													placeholder='Min area'
// 												/>
// 											</FormControl>
// 										</GridItem>
// 										<GridItem>
// 											<FormControl>
// 												<FormLabel fontSize='xs' color='gray.600'>
// 													Max Area (sq ft)
// 												</FormLabel>
// 												<Input
// 													size='sm'
// 													type='number'
// 													value={localFilters.maxArea}
// 													onChange={(e) =>
// 														handleInputChange('maxArea', e.target.value)
// 													}
// 													placeholder='Max area'
// 												/>
// 											</FormControl>
// 										</GridItem>
// 									</Grid>
// 								</FilterSection>

// 								{/* Date Range Section */}
// 								<FilterSection title='Date Range' icon={<FiCalendar />}>
// 									<Grid templateColumns='repeat(2, 1fr)' gap={3}>
// 										<GridItem>
// 											<FormControl>
// 												<FormLabel fontSize='xs' color='gray.600'>
// 													From Date
// 												</FormLabel>
// 												<Input
// 													size='sm'
// 													type='date'
// 													value={localFilters.dateFrom}
// 													onChange={(e) =>
// 														handleInputChange('dateFrom', e.target.value)
// 													}
// 													max={getTodayDate()}
// 												/>
// 											</FormControl>
// 										</GridItem>
// 										<GridItem>
// 											<FormControl>
// 												<FormLabel fontSize='xs' color='gray.600'>
// 													To Date
// 												</FormLabel>
// 												<Input
// 													size='sm'
// 													type='date'
// 													value={localFilters.dateTo}
// 													onChange={(e) =>
// 														handleInputChange('dateTo', e.target.value)
// 													}
// 													max={getTodayDate()}
// 													min={localFilters.dateFrom}
// 												/>
// 											</FormControl>
// 										</GridItem>
// 									</Grid>
// 								</FilterSection>

// 								{/* Category Selects */}
// 								<FilterSection title='Categories' icon={<FiFilter />}>
// 									<VStack spacing={3}>
// 										<FormControl>
// 											<FormLabel fontSize='xs' color='gray.600'>
// 												Listing Type
// 											</FormLabel>
// 											<Select
// 												size='sm'
// 												value={localFilters.listingType}
// 												onChange={(e) =>
// 													handleInputChange('listingType', e.target.value)
// 												}
// 												placeholder='Select listing type'
// 											>
// 												{listingTypes.map((type) => (
// 													<option key={type.id} value={type._id}>
// 														{type.name}
// 													</option>
// 												))}
// 											</Select>
// 										</FormControl>

// 										<FormControl>
// 											<FormLabel fontSize='xs' color='gray.600'>
// 												Unit Type
// 											</FormLabel>
// 											<Select
// 												size='sm'
// 												value={localFilters.unitType}
// 												onChange={(e) =>
// 													handleInputChange('unitType', e.target.value)
// 												}
// 												placeholder='Select unit type'
// 											>
// 												{unitTypes.map((type) => (
// 													<option key={type.id} value={type._id}>
// 														{type.name}
// 													</option>
// 												))}
// 											</Select>
// 										</FormControl>

// 										<FormControl>
// 											<FormLabel fontSize='xs' color='gray.600'>
// 												Sub Unit Type
// 											</FormLabel>
// 											<Select
// 												size='sm'
// 												value={localFilters.subUnitType}
// 												onChange={(e) =>
// 													handleInputChange('subUnitType', e.target.value)
// 												}
// 												placeholder='Select sub unit type'
// 											>
// 												{subUnitTypes?.map((type) => (
// 													<option key={type.id} value={type._id}>
// 														{type.name}
// 													</option>
// 												))}
// 											</Select>
// 										</FormControl>
// 									</VStack>
// 								</FilterSection>

// 								{/* Country Select */}
// 								{countries.length > 0 && (
// 									<FilterSection title='Location' icon={<MdApartment />}>
// 										<FormControl>
// 											<FormLabel fontSize='xs' color='gray.600'>
// 												Country
// 											</FormLabel>
// 											<Select
// 												size='sm'
// 												value={localFilters.country}
// 												onChange={(e) =>
// 													handleInputChange('country', e.target.value)
// 												}
// 												placeholder='Select country'
// 											>
// 												{countries?.map((country) => (
// 													<option key={country} value={country}>
// 														{country}
// 													</option>
// 												))}
// 											</Select>
// 										</FormControl>
// 									</FilterSection>
// 								)}

// 								{/* Action Buttons */}
// 								<HStack spacing={3} mt={4}>
// 									<MotionButton
// 										flex={1}
// 										variant='outline'
// 										onClick={handleReset}
// 										whileHover={{ scale: 1.02 }}
// 										whileTap={{ scale: 0.98 }}
// 									>
// 										Reset All
// 									</MotionButton>
// 									<MotionButton
// 										flex={1}
// 										colorScheme='brand'
// 										onClick={handleApply}
// 										whileHover={{ scale: 1.02 }}
// 										whileTap={{ scale: 0.98 }}
// 									>
// 										Apply Filters
// 									</MotionButton>
// 								</HStack>
// 							</VStack>
// 						</DrawerBody>
// 					</MotionDrawerContent>
// 				</Drawer>
// 			)}
// 		</>
// 	);
// };

// Main Component with Example Usage
// export const EnhancedFilters: React.FC = () => {
//   const [filters, setFilters] = useState<FilterState>(initialFilters);
//   const [activeFilters, setActiveFilters] = useState<Partial<FilterState>>({});

//   // Example data
//   const listingTypes = [
//     { id: '1', name: 'Residential' },
//     { id: '2', name: 'Commercial' },
//     { id: '3', name: 'Industrial' },
//   ];

//   const unitTypes = [
//     { id: '1', name: 'Apartment' },
//     { id: '2', name: 'Villa' },
//     { id: '3', name: 'Office' },
//   ];

//   const countries = ['USA', 'Canada', 'UK', 'UAE', 'Australia'];

//   const handleFilterChange = (newFilters: FilterState) => {
//     setFilters(newFilters);
//     // Extract only active filters for display
//     const active = Object.entries(newFilters).reduce((acc, [key, value]) => {
//       if (value && value !== '') {
//         acc[key as keyof FilterState] = value;
//       }
//       return acc;
//     }, {} as Partial<FilterState>);
//     setActiveFilters(active);
//   };

//   const handleReset = () => {
//     setFilters(initialFilters);
//     setActiveFilters({});
//   };

//   return (
//     <Box p={4}>
//       {/* Filter Display Bar */}
//       <VStack align="stretch" spacing={4}>
//         <HStack justify="space-between">
//           <Text fontSize="lg" fontWeight="bold">
//             Listings
//           </Text>
//           <FilterDrawer
//             filters={filters}
//             onFilterChange={handleFilterChange}
//             onReset={handleReset}
//             listingTypes={listingTypes}
//             unitTypes={unitTypes}
//             countries={countries}
//           />
//         </HStack>

//         {/* Active Filters Display */}
//         <AnimatePresence>
//           {Object.keys(activeFilters).length > 0 && (
//             <motion.div
//               initial={{ opacity: 0, y: -20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//             >
//               <Box
//                 p={3}
//                 bg="white"
//                 borderRadius="lg"
//                 border="1px"
//                 borderColor="gray.200"
//                 boxShadow="sm"
//               >
//                 <HStack justify="space-between" mb={2}>
//                   <Text fontSize="sm" fontWeight="medium" color="gray.600">
//                     Active Filters:
//                   </Text>
//                   <Button
//                     size="xs"
//                     variant="ghost"
//                     colorScheme="red"
//                     onClick={handleReset}
//                     rightIcon={<FiX />}
//                   >
//                     Clear All
//                   </Button>
//                 </HStack>
//                 <Flex wrap="wrap" gap={2}>
//                   {Object.entries(activeFilters).map(([key, value]) => (
//                     <MotionBadge
//                       key={key}
//                       colorScheme="brand"
//                       px={3}
//                       py={1}
//                       borderRadius="full"
//                       initial={{ scale: 0 }}
//                       animate={{ scale: 1 }}
//                       exit={{ scale: 0 }}
//                     >
//                       <HStack spacing={1}>
//                         <Text fontSize="xs" textTransform="capitalize">
//                           {key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
//                         </Text>
//                         <Text fontSize="xs" fontWeight="bold">
//                           {String(value)}
//                         </Text>
//                       </HStack>
//                     </MotionBadge>
//                   ))}
//                 </Flex>
//               </Box>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </VStack>
//     </Box>
//   );
// };

export default FilterDrawer;
