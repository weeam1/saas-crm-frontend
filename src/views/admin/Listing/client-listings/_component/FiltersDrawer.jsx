
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
	IconButton,
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
import CustomTooltip from 'components/shared/CustomTooltip';
import { useModalColors } from 'hooks/useModalColors';
import FilterButton from 'components/base/FilterButton';

const MotionDrawerContent = motion(DrawerContent);

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
	const mc = useModalColors();

	return (
		<Box>
			<HStack mb={3} spacing={2}>
				<Box color='accent.gold'>{icon}</Box>
				<Text fontWeight='semibold' fontSize='sm' color={mc.labelColor}>
					{title}
				</Text>
			</HStack>

			<Box
				p={4}
				bg={mc.bgDeep}
				borderRadius='lg'
				border='1px solid'
				borderColor={mc.borderColor}
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
	const mc = useModalColors();
	const countries = useSelector((state) => state.countries.countryNames);

	const countryOptions = useMemo(
		() =>
			countries.map((c) => {
				return capitalizeWords(c);
			}),
		[countries],
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
				([_, value]) => value !== '' && value !== undefined && value !== null,
			),
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
			{/* Trigger Button */}
		<FilterButton
	label="Filters"
	onClick={onOpen}
	size="sm"
/>

			{/* Drawer */}
			<Drawer isOpen={isOpen} placement='left' onClose={onClose} size='md'>
				<DrawerOverlay backdropFilter='blur(3px)' bg={mc.overlayBg} />

				<MotionDrawerContent
					bg={mc.bg}
					borderRight='1px solid'
					borderColor={mc.borderColor}
					initial={hasAnimatedRef.current ? false : { x: '-100%' }}
					animate={{ x: 0 }}
					transition={{ type: 'spring', stiffness: 260, damping: 30 }}
					onAnimationComplete={() => {
						hasAnimatedRef.current = true;
					}}
				>
					<DrawerCloseButton
						bg={mc.closeBtnBg}
						color={mc.closeBtnColor}
						borderRadius='full'
						_hover={{ bg: mc.closeBtnHoverBg }}
						_focus={{ boxShadow: 'none' }}
					/>

					{/* Header — Gold Gradient */}
					<DrawerHeader
						background={mc.headerBg}
						color={mc.headerText}
						borderBottomWidth='1px'
						borderBottomColor={mc.headerBg}
						py={4}
						px={6}
						boxShadow='0 2px 10px rgba(0,0,0,0.15)'
					>
						<HStack spacing={3}>
							<Box color={mc.headerText}>
								<FiFilter size={20} />
							</Box>
							<Box>
								<Text fontSize='lg' color={mc.headerText} fontWeight='bold'>
									Advanced Filters
								</Text>
								<Text fontSize='xs' color={mc.headerText} opacity={0.8}>
									Refine your search results
								</Text>
							</Box>
						</HStack>
					</DrawerHeader>

					<DrawerBody py={1} px={0}>
						<VStack
							spacing={6}
							p={2}
							align='stretch'
							overflow='scroll'
							maxH={{ base: '60vh', md: '70vh', lg: '85vh' }}
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
							{/* Basic Information */}
							<FilterSection title='Basic Information' icon={<MdApartment />}>
								<Grid templateColumns='repeat(2, 1fr)' gap={3}>
									<Input
										size='sm'
										placeholder='Listing Number'
										value={localFilters.listingNumber}
										onChange={(e) =>
											handleInputChange('listingNumber', e.target.value)
										}
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
									<Input
										size='sm'
										placeholder='Unit Number'
										value={localFilters.unitNumber}
										onChange={(e) =>
											handleInputChange('unitNumber', e.target.value)
										}
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
								</Grid>

								<Input
									mt={3}
									size='sm'
									placeholder='Project Name'
									value={localFilters.projectName}
									onChange={(e) =>
										handleInputChange('projectName', e.target.value)
									}
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
							</FilterSection>

							{/* Price Range */}
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
									<Input
										type='number'
										size='sm'
										placeholder='Max'
										value={localFilters.maxPrice}
										onChange={(e) =>
											handleInputChange('maxPrice', e.target.value)
										}
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
								</Grid>
							</FilterSection>

							{/* Date Range */}
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
										bg={mc.bgInput}
										borderColor={mc.borderColor}
										color={mc.headingText}
										_hover={{ borderColor: mc.borderFocus }}
										_focus={{
											borderColor: mc.borderFocus,
											boxShadow: `0 0 0 1px ${mc.borderFocus}`,
										}}
										borderRadius='md'
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
										bg={mc.bgInput}
										borderColor={mc.borderColor}
										color={mc.headingText}
										_hover={{ borderColor: mc.borderFocus }}
										_focus={{
											borderColor: mc.borderFocus,
											boxShadow: `0 0 0 1px ${mc.borderFocus}`,
										}}
										borderRadius='md'
									/>
								</Grid>
							</FilterSection>

							{/* Area Range */}
							<FilterSection title='Area Range' icon={<FiMaximize2 />}>
								<Grid templateColumns='repeat(2, 1fr)' gap={3}>
									<GridItem>
										<FormControl>
											<FormLabel fontSize='xs' color={mc.labelColor}>
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
									</GridItem>
									<GridItem>
										<FormControl>
											<FormLabel fontSize='xs' color={mc.labelColor}>
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
									</GridItem>
								</Grid>
							</FilterSection>

							{/* Categories */}
							<FilterSection title='Categories' icon={<FiFilter />}>
								<Select
									size='sm'
									placeholder='Listing Type'
									value={localFilters.listingType}
									onChange={(e) =>
										handleInputChange('listingType', e.target.value)
									}
									bg={mc.bgInput}
									borderColor={mc.borderColor}
									color={
										localFilters.listingType ? mc.headingText : mc.mutedText
									}
									_hover={{ borderColor: mc.borderFocus }}
									_focus={{
										borderColor: mc.borderFocus,
										boxShadow: `0 0 0 1px ${mc.borderFocus}`,
									}}
									borderRadius='md'
									iconColor={mc.labelColor}
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
									bg={mc.bgInput}
									borderColor={mc.borderColor}
									color={localFilters.unitType ? mc.headingText : mc.mutedText}
									_hover={{ borderColor: mc.borderFocus }}
									_focus={{
										borderColor: mc.borderFocus,
										boxShadow: `0 0 0 1px ${mc.borderFocus}`,
									}}
									borderRadius='md'
									iconColor={mc.labelColor}
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
									bg={mc.bgInput}
									borderColor={mc.borderColor}
									color={
										localFilters.subUnitType ? mc.headingText : mc.mutedText
									}
									_hover={{ borderColor: mc.borderFocus }}
									_focus={{
										borderColor: mc.borderFocus,
										boxShadow: `0 0 0 1px ${mc.borderFocus}`,
									}}
									borderRadius='md'
									iconColor={mc.labelColor}
								>
									{subUnitTypes.map((t) => (
										<option key={t._id} value={t._id}>
											{t.name}
										</option>
									))}
								</Select>
							</FilterSection>

							{/* Location */}
							{countries.length > 0 && (
								<FilterSection title='Location' icon={<MdApartment />}>
									<Select
										size='sm'
										placeholder='Select Country'
										value={localFilters.country}
										onChange={(e) =>
											handleInputChange('country', e.target.value)
										}
										bg={mc.bgInput}
										borderColor={mc.borderColor}
										color={localFilters.country ? mc.headingText : mc.mutedText}
										_hover={{ borderColor: mc.borderFocus }}
										_focus={{
											borderColor: mc.borderFocus,
											boxShadow: `0 0 0 1px ${mc.borderFocus}`,
										}}
										borderRadius='md'
										iconColor={mc.labelColor}
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

						{/* Action Buttons */}
						<HStack
							spacing={3}
							mt={4}
							px={2}
							pb={4}
							position='sticky'
							bottom='0'
							bg={mc.bg}
							pt={3}
							borderTop='1px solid'
							borderColor={mc.borderColor}
						>
							<Button
								flex={1}
								variant='ghost'
								onClick={handleReset}
								color={mc.secondaryBtnText}
								_hover={{
									bg: mc.secondaryBtnHoverBg,
									color: mc.secondaryBtnHoverText,
								}}
								borderRadius='md'
								leftIcon={<FiX />}
							>
								Reset
							</Button>
							<Button
								flex={1}
								onClick={handleApply}
								background={mc.primaryBtnBg}
								color={mc.primaryBtnText}
								fontWeight='bold'
								borderRadius='md'
								_hover={{
									background: mc.primaryBtnHoverBg,
									boxShadow: mc.primaryBtnShadow,
									transform: 'translateY(-1px)',
								}}
								_active={{
									background: mc.primaryBtnActiveBg,
									transform: 'translateY(0)',
								}}
								leftIcon={<FiFilter />}
							>
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
