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

const TopPagination = ({
	currentPage,
	totalPages,
	onPageChange,
	totalItems,
	itemsPerPage,
	refetching,
	loading,
	handlePageSize,
	sizeMedium =false
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
		size: sizeMedium ? 'xx-small':'xs',
		borderRadius: 'lg',
		_hover: { shadow: 'sm', transition: 'all 0.2s ease-in-out' },
		_active: { bg: 'softGray.500' },
		sx: { svg: { fill: 'brand.500' } },
	};

	const generatePageSizeOptions = (
		totalItems,
		currentPageSize = 10,
		maxLimit = 100
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

		// Deduplicate, filter and sort
		return [...new Set(steps)]
			.filter((n) => n <= max && n > 0)
			.sort((a, b) => a - b);
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
		[handlePageSize]
	);

	return (
		<HStack
			spacing={3}
			p={sizeMedium? 0 : 2}
			gap='2'
			flexDirection={{ base: 'row', md: 'row', lg: 'row' }}
			flexWrap='wrap'
			bg='softGray.50'
			border='1px solid'
			borderColor='softGray.600'
			borderRadius='md'
			align='center'
			justifyContent={{
				base: 'center',
				md: 'space-between',
				lg: 'space-between',
			}}
			width='100%'
			maxWidth='100%'
			fontSize={sizeMedium ? 'xx-small':'sm'}	
		>
			{/* First & Previous Button */}
			<HStack flexDirection='row' flexWrap='wrap' justifyContent='center'>
				<Button
					{...buttonStyle}
					onClick={handleFirst}
					isDisabled={currentPage === 1 || refetching}
					variant='solid'
					bg='softGray.600'
					color='black'
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
					variant='solid'
					bg='softGray.600'
					color='black'
					leftIcon={<FaPlay style={{ transform: 'rotate(180deg)' }} />}
					aria-label='Previous Page'
				>
					Previous
				</Button>
			</HStack>

			{/* Go To Page */}
			<HStack fontWeight='medium' color='gray.800' spacing={1}>
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
					size={sizeMedium ? 'xx-small':'sm'}
					borderRadius='md'
					width='5rem'
					bg='softGray.50'
					border='1px solid softGray.600'
					allowMouseWheel={false}
					clampValueOnBlur={false}
					isDisabled={refetching || loading}
				>
					<NumberInputField
						aria-label='Go to page'
						textAlign='center'
						borderRadius='md'
						border='2px solid'
						borderColor='softGray.600'
						onKeyDown={(e) => e.key === 'Enter' && handleGoToBlur()}
						_focus={{
							outline: 'none',
							bg: 'softGray.50',
							border: '1px solid',
							borderColor: 'brand.500',
						}}
						_active={{ bg: 'softGray.400' }}
						isDisabled={refetching || loading}
					/>
				</NumberInput>

				<Text>of {Number(totalPages).toLocaleString()}</Text>
			</HStack>

			{/* Showing start-end of totalItems */}
			<Text color='gray.800' fontSize={sizeMedium ? 'xx-small':'sm'}fontWeight='medium'>
				Showing {startIndex} - {endIndex} of {totalItems}
			</Text>

			{/* Next & Last Button */}
			<HStack flexDirection='row' flexWrap='wrap' justifyContent='center'>
				<Select
					size={sizeMedium ? 'xs': "sm"}
					w={{ base: '32' }}
					value={itemsPerPage}
					// value={
					// 	generatePageSizeOptions(totalItems, itemsPerPage).includes(
					// 		itemsPerPage
					// 	)
					// 		? itemsPerPage
					// 		: Math.min(totalItems, 100)
					// }
					color='gray.800'
					bg='softGray.400'
					borderRadius='md'
					border='2px solid'
					_focus={{ boxShadow: '0 0 0 1px softGray.500' }}
					onChange={onPageSizeChange}
					isDisabled={!totalItems || loading || refetching}
				>
					{generatePageSizeOptions(totalItems, itemsPerPage).map((size) => (
						<option key={size} value={size}>
							Show {size}
						</option>
					))}
					{/* <option key={10} value={10}>
						Show 10
					</option>
					<option key={20} value={20}>
						Show 20
					</option>
					<option key={50} value={50}>
						Show 50
					</option>
					<option key={60} value={60}>
						Show 60
					</option>
					<option key={80} value={80}>
						Show 80
					</option>
					<option key={100} value={100}>
						Show 100
					</option> */}
				</Select>

				<Button
					{...buttonStyle}
					onClick={handleNext}
					isDisabled={currentPage === totalPages || refetching}
					variant='solid'
					bg='softGray.600'
					color='black'
					rightIcon={<FaPlay />}
					aria-label='Next Page'
				>
					Next
				</Button>

				<Button
					{...buttonStyle}
					onClick={handleLast}
					isDisabled={currentPage === totalPages || refetching}
					variant='solid'
					bg='softGray.600'
					color='black'
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
