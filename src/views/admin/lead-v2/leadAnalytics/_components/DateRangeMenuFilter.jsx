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
import { useSearchParams } from 'react-router-dom';
import { ChevronDownIcon, CalendarIcon, CheckIcon } from '@chakra-ui/icons';
import { useState, useEffect } from 'react';
import { getDateRange, dateOptions, findMatchingRange } from '../helpers';

const DateRangeMenuFilter = ({ onDateRangeChange, isLoading }) => {
	const [selectedRange, setSelectedRange] = useState('last30Days');
	const [searchParams] = useSearchParams();

	useEffect(() => {
		const fromParam = searchParams.get('from');
		const toParam = searchParams.get('to');

		if (fromParam && toParam) {
			// Try to match it with one of your predefined ranges
			const matchedRange = findMatchingRange(fromParam, toParam);
			if (matchedRange) setSelectedRange(matchedRange);
		}
	}, [searchParams]);

	const handleDateSelect = (option) => {
		const range = getDateRange(option.value);

		setSelectedRange(option.value);

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
					transition='all 0.15s ease-in-out'
					transformOrigin='top'
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
