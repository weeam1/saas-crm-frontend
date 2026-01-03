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
	Badge,
	Flex,
	Text,
	useDisclosure,
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

export default FilterDrawer;
