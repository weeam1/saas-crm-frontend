import React, { useState, useRef, useEffect } from 'react';
import {
	Stack,
	Input,
	FormControl,
	FormLabel,
	useColorModeValue,
	Box,
} from '@chakra-ui/react';

const months = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
];

/**
 * Reusable component for selecting month and year with up/down arrow keys
 * @param {Object} props
 * @param {number} [props.defaultMonth] - Default month (1-12, default: current month)
 * @param {number} [props.defaultYear] - Default year (default: current year)
 * @param {number} [props.minYear=1900] - Minimum year
 * @param {number} [props.maxYear=2100] - Maximum year
 * @param {function} [props.onChange] - Callback for month/year changes (month, year)
 * @param {string} [props.size='md'] - Input size ('sm', 'md', 'lg')
 */
const MonthYearPicker = ({
	defaultMonth = new Date().getMonth() + 1,
	defaultYear = new Date().getFullYear(),
	minYear = 1900,
	maxYear = 2100,
	onChange,
	size = 'md',
}) => {
	const [month, setMonth] = useState(Math.max(1, Math.min(12, defaultMonth)));
	const [year, setYear] = useState(
		Math.max(minYear, Math.min(maxYear, defaultYear))
	);
	const monthInputRef = useRef(null);
	const yearInputRef = useRef(null);

	// Notify parent component of changes
	useEffect(() => {
		if (onChange) {
			onChange(month, year);
		}
	}, [month, year, onChange]);

	// Handle month keyboard navigation
	const handleMonthKeyDown = (e) => {
		if (e.key === 'ArrowUp') {
			e.preventDefault();
			setMonth((prev) => (prev === 12 ? 1 : prev + 1));
		} else if (e.key === 'ArrowDown') {
			e.preventDefault();
			setMonth((prev) => (prev === 1 ? 12 : prev - 1));
		} else if (e.key === 'Tab' && !e.shiftKey && yearInputRef.current) {
			e.preventDefault();
			yearInputRef.current.focus();
		}
	};

	// Handle year keyboard navigation
	const handleYearKeyDown = (e) => {
		if (e.key === 'ArrowUp') {
			e.preventDefault();
			setYear((prev) => (prev < maxYear ? prev + 1 : prev));
		} else if (e.key === 'ArrowDown') {
			e.preventDefault();
			setYear((prev) => (prev > minYear ? prev - 1 : prev));
		} else if (e.key === 'Tab' && e.shiftKey && monthInputRef.current) {
			e.preventDefault();
			monthInputRef.current.focus();
		}
	};

	// Handle manual month input
	const handleMonthChange = (e) => {
		const value = e.target.value;
		const monthIndex = months.findIndex((m) =>
			m.toLowerCase().startsWith(value.toLowerCase())
		);
		if (monthIndex !== -1) {
			setMonth(monthIndex + 1);
		}
	};

	// Handle manual year input
	const handleYearChange = (e) => {
		const value = parseInt(e.target.value, 10);
		if (!isNaN(value) && value >= minYear && value <= maxYear) {
			setYear(value);
		}
	};

	// Colors for light/dark mode
	const bg = useColorModeValue('white', 'gray.700');
	const borderColor = useColorModeValue('gray.200', 'gray.600');

	return (
		<Box>
			<Stack direction='row' spacing={4} align='flex-start'>
				<FormControl>
					<FormLabel fontSize='sm' mb={1}>
						Month
					</FormLabel>
					<Input
						ref={monthInputRef}
						value={months[month - 1]}
						onKeyDown={handleMonthKeyDown}
						onChange={handleMonthChange}
						size={size}
						bg={bg}
						borderColor={borderColor}
						_hover={{ borderColor: 'blue.500' }}
						_focus={{
							borderColor: 'blue.500',
							boxShadow: '0 0 0 1px blue.500',
						}}
						aria-label='Select month'
						readOnly
						sx={{
							cursor: 'pointer',
							'&:focus': { outline: 'none' },
						}}
					/>
				</FormControl>
				<FormControl>
					<FormLabel fontSize='sm' mb={1}>
						Year
					</FormLabel>
					<Input
						ref={yearInputRef}
						value={year}
						onKeyDown={handleYearKeyDown}
						onChange={handleYearChange}
						size={size}
						bg={bg}
						borderColor={borderColor}
						_hover={{ borderColor: 'blue.500' }}
						_focus={{
							borderColor: 'blue.500',
							boxShadow: '0 0 0 1px blue.500',
						}}
						aria-label='Select year'
						type='number'
						sx={{
							'&::-webkit-inner-spin-button, &::-webkit-outer-spin-button': {
								display: 'none',
							},
							cursor: 'pointer',
						}}
					/>
				</FormControl>
			</Stack>
		</Box>
	);
};

export default MonthYearPicker;
