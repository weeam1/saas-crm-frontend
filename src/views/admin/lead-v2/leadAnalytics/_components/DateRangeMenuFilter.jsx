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

	return (
		<Box>
			<Menu>
				<MenuButton
					as={Button}
					rightIcon={<ChevronDownIcon />}
					leftIcon={<CalendarIcon />}
					variant='outline'
					minW={{ base: '100%', md: '200px' }}
					justifyContent='space-between'
					bg='bg.input'
					fontSize={{ base: 'sm', md: 'sm' }}
					borderWidth='2px'
					fontWeight='medium'
					borderRadius='lg'
					borderColor='border.default'
					color='text.body'
					_hover={{
						borderColor: 'border.gold',
						bg: 'bg.elevated',
						color: 'text.accent',
						boxShadow: 'goldGlow',
					}}
					_focus={{
						borderColor: 'border.focus',
						boxShadow: 'goldGlow',
					}}
					_active={{
						bg: 'bg.elevated',
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
					{dateOptions?.find((item) => item?.value === selectedRange)?.label ||
						'All Time'}
				</MenuButton>

				<MenuList
					py={2}
					fontSize='sm'
					bg='bg.surface'
					borderColor='border.default'
					boxShadow='card'
					minW={{ base: '100%', md: '200px' }}
					transition='all 0.15s ease-in-out'
					transformOrigin='top'
				>
					{dateOptions.map((option, index) => (
						<Box key={option.value}>
							<MenuItem
								onClick={() => handleDateSelect(option)}
								bg={selectedRange === option.value ? 'bg.elevated' : 'transparent'}
								color={
									selectedRange === option.value ? 'text.accent' : 'text.body'
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
								transition='all 0.15s ease'
							>
								<HStack justify='space-between' w='100%'>
									<VStack align='start' spacing={0}>
										<Text
											fontWeight={selectedRange === option.value ? 'semibold' : 'medium'}
											fontSize='sm'
										>
											{option.label}
										</Text>
									</VStack>
									{selectedRange === option.value && (
										<CheckIcon
											color='icon.brand'
											boxSize={3}
											transition='all 0.15s ease'
										/>
									)}
								</HStack>
							</MenuItem>
							{index === dateOptions.length - 2 && (
								<Divider
									my={1}
									borderColor='border.subtle'
								/>
							)}
						</Box>
					))}
				</MenuList>
			</Menu>
		</Box>
	);
};

export default DateRangeMenuFilter;