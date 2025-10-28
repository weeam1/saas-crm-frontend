import {
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	Button,
	Box,
	Text,
	HStack,
	VStack,
	Icon,
	Divider,
} from '@chakra-ui/react';
import { ChevronDownIcon, CalendarIcon, CheckIcon } from '@chakra-ui/icons';
import { useState } from 'react';
import { getDateRange } from '../helpers';

const DateRangeMenuFilter = ({ onDateRangeChange, isLoading }) => {
	const [selectedRange, setSelectedRange] = useState('last30Days');

	const dateOptions = [
		{ label: 'Today', value: 'today' },
		{ label: 'Yesterday', value: 'yesterday' },
		{ label: 'Last 7 days', value: 'last7Days' },
		{ label: 'Last 30 days', value: 'last30Days' },
		{ label: 'This month', value: 'thisMonth' },
		{ label: 'Last month', value: 'lastMonth' },
		{ label: 'This year', value: 'thisYear' },
		{ label: 'All Time', value: 'allTime' },
	];

	const handleDateSelect = (option) => {
		const range = getDateRange(option.value);

		setSelectedRange(option.label);

		// Call the callback function with date range
		if (onDateRangeChange) {
			onDateRangeChange(range);
		}
	};

	// const getDateDescription = (rangeValue) => {
	// 	const range = getDateRange(rangeValue);

	// 	if (rangeValue === 'allTime') {
	// 		return 'No date restrictions';
	// 	}

	// 	if (range.from && range.to) {
	// 		return `${range.from.toLocaleDateString()} - ${range.to.toLocaleDateString()}`;
	// 	}

	// 	return '';
	// };

	return (
		<Box>
			<Menu>
				<MenuButton
					as={Button}
					rightIcon={<ChevronDownIcon />}
					leftIcon={<CalendarIcon />}
					variant='outline'
					minW='200px'
					justifyContent='space-between'
					bg='white'
					fontSize={{ base: 'xs', md: 'sm' }}
					borderWidth='2px'
					fontWeight='medium'
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
					{dateOptions?.find((item) => item?.value === selectedRange)?.label ||
						'All Time'}
				</MenuButton>
				<MenuList
					py={2}
					fontSize='xs'
					borderColor='gray.200'
					boxShadow='lg'
					minW='200px'
				>
					{dateOptions.map((option, index) => (
						<Box key={option.value}>
							<MenuItem
								onClick={() => handleDateSelect(option)}
								bg={selectedRange === option.value ? 'brand.50' : 'transparent'}
								color={
									selectedRange === option.value ? 'brand.600' : 'gray.700'
								}
								_hover={{
									bg: 'brand.50',
									color: 'brand.600',
								}}
								py={2}
							>
								<HStack justify='space-between' w='100%'>
									<VStack align='start' spacing={0}>
										<Text fontWeight='medium'>{option.label}</Text>
										{/* <Text fontSize='sm' color='gray.500'>
											{getDateDescription(option.value)}
										</Text> */}
									</VStack>
									{selectedRange === option.value && (
										<CheckIcon color='brand.500' boxSize={3} />
									)}
								</HStack>
							</MenuItem>
							{index === dateOptions.length - 2 && <Divider my={1} />}
						</Box>
					))}
				</MenuList>
			</Menu>
		</Box>
	);
};

export default DateRangeMenuFilter;
