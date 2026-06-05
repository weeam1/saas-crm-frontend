import React, { useCallback, useEffect, useState } from 'react';
import {
	HStack,
	Button,
	NumberInput,
	NumberInputField,
	Text,
	Select,
} from '@chakra-ui/react';
import { FaPlay } from 'react-icons/fa';
import { IoPlaySkipForwardSharp } from 'react-icons/io5';
import { ChevronDownIcon } from '@chakra-ui/icons';
const TopPagination = ({
	currentPage,
	totalPages,
	onPageChange,
	totalItems,
	itemsPerPage,
	refetching,
	loading,
	handlePageSize,
	sizeMedium = false,
	pageLimit = true,
}) => {
	const [gotoPage, setGotoPage] = useState(currentPage ?? 1);

	// console.log({
	// 	currentPage,
	// 	totalPages,
	// 	onPageChange,
	// 	totalItems,
	// 	itemsPerPage,
	// 	refetching,
	// 	loading,
	// 	handlePageSize,
	// });

	useEffect(() => {
		setGotoPage(currentPage);
	}, [currentPage]);

	// Calculate indices for the summary
	const startIndex = (currentPage - 1) * itemsPerPage + 1;
	const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

	// Handlers
	const handleFirst = () => {
		onPageChange(1);
		setGotoPage(1);
	};
	const handlePrevious = () => {
		if (currentPage > 1) {
			onPageChange(currentPage - 1);
			setGotoPage(currentPage - 1);
		}
	};
	const handleNext = () => {
		if (currentPage < totalPages) {
			onPageChange(currentPage + 1);
			setGotoPage(currentPage + 1);
		}
	};
	const handleLast = () => {
		onPageChange(totalPages);
		setGotoPage(totalPages);
	};

	// const handleGoToChange = (value) => {
	// 	setGotoPage(value);
	// };

	const handleGoToBlur = () => {
		const page = Math.max(1, Math.min(Number(gotoPage) || 1, totalPages));
		onPageChange(page);
		setGotoPage(page);
	};

	const buttonStyle = {
		size: sizeMedium ? 'xx-small' : 'xs',
		borderRadius: 'lg',
		_hover: { shadow: 'sm', transition: 'all 0.2s ease-in-out' },
		_active: { bg: 'softGray.500' },
	};

	const generatePageSizeOptions = (
		totalItems,
		currentPageSize = 10,
		maxLimit = 100,
	) => {
		const steps = [10, 20];
		const max = Math.min(totalItems || currentPageSize, maxLimit);

		for (let i = 30; i <= max; i += 10) {
			steps.push(i);
		}

		steps.push(currentPageSize);
		if (totalItems && totalItems <= maxLimit) {
			steps.push(totalItems);
		}

		// Special case: if total > 1000, ensure 200 is present
		if (totalItems > 1000) {
			steps.push(200);
		}

		// Deduplicate, filter and sort
		return [...new Set(steps)].filter((n) => n > 0).sort((a, b) => a - b);
	};

	const onPageSizeChange = useCallback(
		(e) => {
			const limit = Number(e.target.value);
			// if (limit <= totalItems)
			handlePageSize?.(limit);
			const opts = generatePageSizeOptions(totalItems, limit, 100);
			if (!opts.includes(limit)) {
				handlePageSize?.(Math.max(...opts.filter(Boolean))); // or default to 10
			}
		},
		[handlePageSize],
	);

	return (
		<HStack
			spacing={3}
			p={sizeMedium ? 0 : 2}
			gap='2'
			flexWrap='wrap'
			bg='bg.surface'
			border='1px solid'
			borderColor='border.default'
			borderRadius='lg'
			align='center'
			justifyContent={{
				base: 'center',
				md: 'space-between',
			}}
			width='100%'
			fontSize={sizeMedium ? 'xs' : 'sm'}
		>
			{/* First & Previous Button */}
			<HStack flexDirection='row' flexWrap='wrap' justifyContent='center'>
				<Button
					{...buttonStyle}
					onClick={handleFirst}
					isDisabled={currentPage === 1 || refetching}
					variant='outline'
					py='2'
					px='5'
					leftIcon={
						<IoPlaySkipForwardSharp style={{ transform: 'rotate(180deg)' }} />
					}
					aria-label='First Page'
				>
					First
				</Button>

				<Button
					{...buttonStyle}
					onClick={handlePrevious}
					isDisabled={currentPage === 1 || refetching}
					variant='outline'
					leftIcon={<FaPlay style={{ transform: 'rotate(180deg)' }} />}
					aria-label='Previous Page'
					py={2}
					px={5}
				>
					Previous
				</Button>
			</HStack>

			{/* Go To Page */}
			<HStack fontWeight='medium' color='text.body' spacing={1}>
				<Text>Go to</Text>

				<NumberInput
					value={gotoPage ?? 1}
					onChange={(valueString) => {
						const value = Number(valueString) || '';
						if (value <= (totalPages ?? 999999999)) {
							setGotoPage(value);
						}
					}}
					onBlur={handleGoToBlur}
					min={1}
					max={totalPages ?? 999999999}
					size={sizeMedium ? 'xx-small' : 'sm'}
					width='5rem'
					variant='outline'
					allowMouseWheel={false}
					clampValueOnBlur={false}
					isDisabled={refetching || loading}
				>
					<NumberInputField
						aria-label='Go to page'
						textAlign='center'
						variant='outline'
						onKeyDown={(e) => e.key === 'Enter' && handleGoToBlur()}
						_active={{ bg: 'bg.elevated' }}
						_focus={{ borderColor: 'border.focus', boxShadow: 'goldGlow' }}
						isDisabled={refetching || loading}
					/>
				</NumberInput>

				<Text>of {Number(totalPages).toLocaleString()}</Text>
			</HStack>

			{/* Showing start-end of totalItems */}
			<Text
				color='text.body'
				fontSize={sizeMedium ? 'xx-small' : 'sm'}
				fontWeight='medium'
			>
				Showing {startIndex} - {endIndex} of {totalItems}
			</Text>

			{/* Next & Last Button */}
			<HStack flexDirection='row' flexWrap='wrap' justifyContent='center'>
			{/* Page Size Select - Updated to match AnalyticsHeader styling */}
{pageLimit && (
	<Select
		size={sizeMedium ? 'xs' : 'sm'}
		w={{ base: '32' }}
		value={itemsPerPage}
		variant='outline'
		bg='bg.input'
		borderColor='border.default'
		color='text.body'
		fontSize='sm'
		fontWeight='medium'
		borderRadius='lg'
		icon={<ChevronDownIcon />}
		_hover={{
			borderColor: 'border.gold',
			bg: 'bg.elevated',
			color: 'text.accent',
			cursor: 'pointer',
		}}
		_focus={{
			borderColor: 'border.focus',
			boxShadow: 'goldGlow',
		}}
		transition='all 0.2s ease'
		onChange={onPageSizeChange}
		isDisabled={!totalItems || loading || refetching}
	>
		{generatePageSizeOptions(totalItems, itemsPerPage).map((size) => (
			<option
				key={size}
				value={size}
				style={{
					background: '#10273A', // bg.surface
					color: '#B0B0B0', // text.muted
				}}
			>
				Show {size}
			</option>
		))}
	</Select>
)}

				<Button
					{...buttonStyle}
					onClick={handleNext}
					isDisabled={currentPage === totalPages || refetching}
					variant='outline'
					rightIcon={<FaPlay />}
					aria-label='Next Page'
					py={2}
					px={5}
				>
					Next
				</Button>

				<Button
					{...buttonStyle}
					onClick={handleLast}
					isDisabled={currentPage === totalPages || refetching}
					variant='outline'
					py='2'
					px='5'
					rightIcon={<IoPlaySkipForwardSharp />}
					aria-label='Last Page'
				>
					Last
				</Button>
			</HStack>
		</HStack>
	);
};

export default TopPagination;
