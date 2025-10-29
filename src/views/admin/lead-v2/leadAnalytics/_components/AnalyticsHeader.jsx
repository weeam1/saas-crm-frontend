import {
	Box,
	Flex,
	HStack,
	Tooltip,
	IconButton,
	useColorModeValue,
	useToken,
	Menu,
	MenuButton,
	MenuList,
	Button,
	Text,
	MenuItem,
	useDisclosure,
} from '@chakra-ui/react';
import { ChevronDownIcon, CheckIcon, InfoIcon } from '@chakra-ui/icons';
import { FaLayerGroup } from 'react-icons/fa';
import CountUpComponent from 'components/countUpComponent/countUpComponent';
import DateRangeMenuFilter from './DateRangeMenuFilter';
import SearchInput from './SearchInput';
import { useEffect } from 'react';

// const StatBadge = ({ label, value, colorScheme = 'brand' }) => (
// 	<Tooltip label={label} hasArrow>
// 		<Badge
// 			colorScheme={colorScheme}
// 			variant='subtle'
// 			px={3}
// 			py={1}
// 			borderRadius='full'
// 			fontSize='xs'
// 			fontWeight='medium'
// 		>
// 			{value}
// 		</Badge>
// 	</Tooltip>
// );

const AnalyticsHeader = ({
	totals,
	selectedCategoryLabel,
	categories,
	selectedCategory,
	onCategoryChange,
	searchTerm,
	onSearchChange,
	isLoading,
	handleDateFilter,
}) => {
	// const selectedCategoryLabel = categories.find(
	// 	(cat) => cat.value === selectedCategory
	// )?.label;

	// const {
	// 	isOpen: dateFilterIsOpen,
	// 	onOpen: dateFilterOnOpen,
	// 	onClose: dateFilterOnClose,
	// } = useDisclosure();

	// Trigger parent callback outside the render cycle
	useEffect(() => {
		if (searchTerm === undefined) return;

		let frame;
		frame = requestAnimationFrame(() => {
			onSearchChange(searchTerm.trim());
		});

		return () => cancelAnimationFrame(frame);
	}, [searchTerm, onSearchChange]);

	// Color hooks
	const bgColor = useColorModeValue('white', 'navy.800');
	const borderColor = useColorModeValue('softGray.200', 'navy.600');
	const shadowColor = useColorModeValue('md', 'sm');
	const [brand500, softGray100, softGray400, brand200] = useToken('colors', [
		'brand.500',
		'softGray.100',
		'softGray.400',
		'brand.200',
	]);

	return (
		<Box
			position='sticky'
			top={0}
			bg={bgColor}
			// borderBottom='1px solid'
			// borderColor={borderColor}
			zIndex={2}
			px={6}
			py={4}
			mb='2'
			rounded='md'
			boxShadow={shadowColor}
			backdropFilter='blur(8px)'
			transition='all 0.3s ease'
		>
			<Flex
				direction={{ base: 'column', lg: 'row' }}
				gap={4}
				align={{ base: 'stretch', lg: 'center' }}
				justify='space-between'
			>
				{/* Left Section - Title and Stats */}
				<Box flex='1'>
					<Flex align='center' gap={2} mb={2}>
						<Text
							fontSize='2xl'
							fontWeight='bold'
							bgGradient={`linear(to-r, ${brand500}, brand.600)`}
							bgClip='text'
							letterSpacing='tight'
						>
							Lead Analytics
						</Text>
						<Tooltip
							label='Analytics showing lead performance metrics'
							hasArrow
						>
							<IconButton
								icon={<InfoIcon />}
								size='xs'
								variant='ghost'
								color='gray.500'
								aria-label='Info'
							/>
						</Tooltip>
					</Flex>

					<Flex align='center' gap={3} flexWrap='wrap'>
						<Text fontSize='sm' color='gray.600' fontWeight='medium'>
							Showing:{' '}
							{/* <Text as='span' color='gray.800' fontWeight='semibold'>
								{selectedCategoryLabel}
							</Text> */}
							<CountUpComponent targetNumber={totals} />
						</Text>
					</Flex>
				</Box>

				{/* Right Section - Controls */}
				<HStack
					// spacing={3}
					width={{ base: '100%', lg: 'auto' }}
					align='center'
					gap='2'
					flexDirection={{ base: 'column', md: 'row' }}
				>
					<DateRangeMenuFilter
						onDateRangeChange={handleDateFilter}
						isLoading={isLoading}
					/>

					{/* Category Dropdown */}
					<Box position='relative' minW='200px'>
						{/* <Select
							value={selectedCategory}
							onChange={(e) => onCategoryChange(e.target.value)}
							bg={bgColor}
							borderColor={softGray400}
							borderWidth='2px'
							borderRadius='lg'
							_hover={{
								borderColor: 'brand.300',
								boxShadow: `0 0 0 1px ${brand200}`,
							}}
							_focus={{
								borderColor: 'brand.500',
								boxShadow: `0 0 0 2px ${brand200}`,
							}}
							_disabled={{
								opacity: 0.6,
								cursor: 'not-allowed',
							}}
							fontSize='sm'
							// height='44px'
							icon={<ChevronDownIcon color='brand.500' />}
							isDisabled={isLoading}
							transition='all 0.2s ease'
						>
							{categories.map((category) => (
								<option
									key={category.value}
									value={category.value}
									style={{
										padding: '8px 12px',
										backgroundColor: bgColor,
									}}
								>
									{category.label}
								</option>
							))}
						</Select> */}
						<Menu>
							<MenuButton
								as={Button}
								rightIcon={<ChevronDownIcon />}
								leftIcon={<FaLayerGroup />}
								variant='outline'
								minW='200px'
								justifyContent='space-between'
								bg='white'
								fontSize={{ base: 'xs', md: 'sm' }}
								fontWeight='medium'
								borderWidth='2px'
								borderRadius='lg'
								borderColor='softGray.400'
								_hover={{
									borderColor: 'brand.300',
									boxShadow: `0 0 0 1px brand.200`,
								}}
								_focus={{
									borderColor: 'brand.500',
									boxShadow: `0 0 0 2px brand.200`,
								}}
								_disabled={{
									opacity: 0.6,
									cursor: 'not-allowed',
								}}
								isDisabled={isLoading}
								textAlign='left'
								transition='all 0.2s ease'
								_expanded={{ bg: 'brand.50', borderColor: 'brand.200' }}
							>
								{selectedCategoryLabel}
							</MenuButton>
							<MenuList
								py={2}
								borderColor='gray.200'
								boxShadow='lg'
								minW='200px'
								fontSize='xs'
								transition='all 0.15s ease-in-out'
								transformOrigin='top'
							>
								{categories.map((option, index) => (
									<Box key={option.value}>
										<MenuItem
											onClick={() => onCategoryChange(option.value)}
											bg={
												selectedCategoryLabel === option.label
													? 'brand.50'
													: 'transparent'
											}
											color={
												selectedCategoryLabel === option.label
													? 'brand.600'
													: 'gray.700'
											}
											_hover={{
												bg: 'brand.50',
												color: 'brand.600',
											}}
											py={2}
										>
											<HStack justify='space-between' w='100%'>
												<Text fontWeight='medium'>{option.label}</Text>
												{selectedCategoryLabel === option.label && (
													<CheckIcon color='brand.500' boxSize={3} />
												)}
											</HStack>
										</MenuItem>
									</Box>
								))}
							</MenuList>
						</Menu>
					</Box>

					{/* Search Input */}
					<SearchInput onSearch={onSearchChange} isLoading={isLoading} />
				</HStack>
			</Flex>

			{/* {dateFilterIsOpen && (
				<DateFilter
					isOpen={dateFilterIsOpen}
					onClose={dateFilterOnClose}
					handleDateFilter={handleDateFilter}
				/>
			)} */}
		</Box>
	);
};

export default AnalyticsHeader;

// <InputGroup minW='280px' position='relative'>
// 	<InputLeftElement pointerEvents='none' height='44px'>
// 		<SearchIcon color='brand.400' />
// 	</InputLeftElement>
// 	<Input
// 		type='text'
// 		placeholder='Search...'
// 		value={searchTerm}
// 		onChange={(e) => onSearchChange(e.target.value)}
// 		bg={bgColor}
// 		borderColor={softGray400}
// 		borderWidth='2px'
// 		borderRadius='lg'
// 		// height='44px'
// 		pl={10}
// 		_placeholder={{
// 			color: 'gray.500',
// 			fontSize: 'sm',
// 		}}
// 		_hover={{
// 			borderColor: 'brand.300',
// 			boxShadow: `0 0 0 1px ${brand200}`,
// 		}}
// 		_focus={{
// 			borderColor: 'brand.500',
// 			boxShadow: `0 0 0 2px ${brand200}`,
// 			bg: 'white',
// 		}}
// 		_disabled={{
// 			opacity: 0.6,
// 			cursor: 'not-allowed',
// 		}}
// 		fontSize='sm'
// 		transition='all 0.2s ease'
// 		isDisabled={isLoading}
// 	/>

// 	{searchTerm && (
// 		<Box
// 			position='absolute'
// 			right='12px'
// 			top='50%'
// 			transform='translateY(-50%)'
// 			cursor='pointer'
// 			onClick={() => onSearchChange('')}
// 			color='gray.400'
// 			_hover={{ color: 'brand.500' }}
// 			zIndex={2}
// 			transition='color 0.2s ease'
// 		>
// 			<MdClear />
// 		</Box>
// 	)}
// </InputGroup>;
