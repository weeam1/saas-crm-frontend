import {
	Box,
	Flex,
	HStack,
	Tooltip,
	IconButton,
	Menu,
	MenuButton,
	MenuList,
	Button,
	Text,
	MenuItem,
} from '@chakra-ui/react';
import { ChevronDownIcon, CheckIcon, InfoIcon } from '@chakra-ui/icons';
import { FaLayerGroup } from 'react-icons/fa';
import CountUpComponent from 'components/countUpComponent/countUpComponent';
import DateRangeMenuFilter from './DateRangeMenuFilter';
import SearchInput from './SearchInput';
import { useEffect } from 'react';

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
	// Trigger parent callback outside the render cycle
	useEffect(() => {
		if (searchTerm === undefined) return;

		let frame;
		frame = requestAnimationFrame(() => {
			onSearchChange(searchTerm.trim());
		});

		return () => cancelAnimationFrame(frame);
	}, [searchTerm, onSearchChange]);

	return (
		<Box
		bg='bg.surface'
							p={4}
							borderRadius='lg'
							boxShadow='card'
							border='1px solid'
							borderColor='border.default'
			position='sticky'
			top={0}
			zIndex={2}
			px={{ base: 4, md: 6 }}
			py={{ base: 3, md: 4 }}
			mb='2'
			rounded='xl'
			transition='all 0.3s ease'
			_backdropFilter={{ base: 'none', md: 'blur(8px)' }}

		>
			<Flex
				direction={{ base: 'column', xl: 'row' }}
				gap={{ base: 3, md: 4 }}
				// align={{ base: 'stretch', lg: 'center' }}
				justify='space-between'
			>
				{/* Left Section - Title and Stats */}
				<Box flex='1'>
					<Flex align='center' gap={2} mb={2}>
						<Text
							fontSize={{ base: 'xl', md: '2xl' }}
							fontWeight='bold'
							className='gold-text'
							letterSpacing='tight'
							color='text.heading'
						>
							Lead Analytics
						</Text>
						<Tooltip
							label='Analytics showing lead performance metrics'
							hasArrow
							placement='right'
						>
							<IconButton
								icon={<InfoIcon />}
								size='xs'
								variant='ghost'
								aria-label='Info'
								color='text.accent'
								_hover={{
									bg: 'bg.surface',  // Hover goes to surface level
									color: 'text.accent'
								}}
							/>
						</Tooltip>
					</Flex>

					<Flex align='center' gap={3} flexWrap='wrap'>
						<Text
							fontSize='sm'
							color='text.muted'
							fontWeight='medium'
						>
							Showing:{' '}
							<Text
								as='span'
								color='text.heading'
								fontWeight='semibold'
							>
								<CountUpComponent targetNumber={totals} />
							</Text>
						</Text>
					</Flex>
				</Box>

				{/* Right Section - Controls */}
				<HStack
					spacing={{ base: 2, md: 3 }}
					width={{ base: '100%', lg: 'auto' }}
					align='center'
					gap={{ base: 2, md: 0 }}
					flexDirection={{ base: 'column', md: 'row' }}
				>
					<DateRangeMenuFilter
						onDateRangeChange={handleDateFilter}
						isLoading={isLoading}
					/>

					{/* Category Dropdown */}
					<Box  minW={{ base: '100%', md: '160' }}>
						<Menu>
							<MenuButton
								as={Button}
								rightIcon={<ChevronDownIcon />}
								leftIcon={<FaLayerGroup />}
								variant='outline'
								minW={{ base: '100%', md: '160px' }}
								justifyContent='space-between'
								bg='bg.input'
								fontSize={{ base: 'sm', md: 'sm' }}
								fontWeight='medium'
								borderWidth='2px'
								borderRadius='lg'
								borderColor='border.default'
								color='text.body'
								_hover={{
									borderColor: 'border.gold',
									bg: 'bg.surface',  // Hover goes to surface level
									color: 'text.accent',
									boxShadow: 'goldGlow',
								}}
								_focus={{
									borderColor: 'border.focus',
									boxShadow: 'goldGlow',
								}}
								_active={{
									bg: 'bg.surface',
									color: 'text.accent',
								}}
								_disabled={{
									opacity: 0.6,
									cursor: 'not-allowed',
								}}
								isDisabled={isLoading}
								textAlign='left'
								transition='all 0.2s ease'
							>
								{selectedCategoryLabel}
							</MenuButton>
							<MenuList
								py={2}
								bg='bg.surface'
								borderColor='border.default'
								boxShadow='card'
								minW={{ base: '100%', md: '200px' }}
								fontSize='sm'
								transition='all 0.15s ease-in-out'
								transformOrigin='top'
							>
								{categories.map((option) => (
									<MenuItem
										key={option.value}
										onClick={() => onCategoryChange(option.value)}
										bg={
											selectedCategoryLabel === option.label
												? 'bg.elevated'
												: 'transparent'
										}
										color={
											selectedCategoryLabel === option.label
												? 'text.accent'
												: 'text.body'
										}
										_hover={{
											bg: 'bg.elevated',
											color: 'text.accent',
										}}
										_focus={{
											bg: 'bg.elevated',
											color: 'text.accent',
										}}
										py={2.5}
										px={3}
									>
										<HStack justify='space-between' w='100%'>
											<Text
												fontWeight={selectedCategoryLabel === option.label ? 'semibold' : 'medium'}
											>
												{option.label}
											</Text>
											{selectedCategoryLabel === option.label && (
												<CheckIcon
													color='icon.brand'
													boxSize={3}
												/>
											)}
										</HStack>
									</MenuItem>
								))}
							</MenuList>
						</Menu>
					</Box>

					{/* Search Input */}
					<SearchInput
						onSearch={onSearchChange}
						isLoading={isLoading}
					/>
				</HStack>
			</Flex>
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
