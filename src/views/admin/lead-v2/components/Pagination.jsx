import React, { useState } from 'react';
import {
	HStack,
	Button,
	NumberInput,
	NumberInputField,
	Text,
} from '@chakra-ui/react';
import { FaAngleLeft, FaAngleRight, FaPlay } from 'react-icons/fa';
import { IoPlaySkipForwardSharp } from 'react-icons/io5';

const Pagination = ({
	currentPage,
	totalPages,
	onPageChange,
	totalItems,
	itemsPerPage,
}) => {
	const [gotoPage, setGotoPage] = useState(currentPage || '');

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

	const handleGoToChange = (value) => {
		setGotoPage(value);
	};

	const handleGoToBlur = () => {
		const page = Math.max(1, Math.min(Number(gotoPage) || 1, totalPages));
		onPageChange(page);
		setGotoPage(page);
	};

	const buttonStyle = {
		size: 'sm',
		borderRadius: 'lg',
		_hover: { shadow: 'sm', transition: 'all 0.2s ease-in-out' },
		_active: { bg: 'softGray.500' },
		sx: { svg: { fill: 'brand.500' } }, // ✅ Only changes icon color
	};

	return (
		<HStack
			spacing={3}
			p={2}
			gap='2'
			flexDirection={{ base: 'column', md: 'row' }}
			bg='softGray.50'
			border='1px solid'
			borderColor='softGray.600'
			borderRadius='md'
			align='center'
			width='fit-content'
		>
			{/* First Button */}
			<Button
				{...buttonStyle}
				onClick={handleFirst}
				isDisabled={currentPage === 1}
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

			{/* Previous Button */}
			<Button
				{...buttonStyle}
				onClick={handlePrevious}
				isDisabled={currentPage === 1}
				variant='solid'
				bg='softGray.600' // ✅ Same color as Next
				color='black'
				leftIcon={<FaPlay style={{ transform: 'rotate(180deg)' }} />}
				aria-label='Previous Page'
			>
				Previous
			</Button>

			{/* Go To Page */}
			<HStack fontWeight='medium' color='gray.800' spacing={1}>
				<Text>Go to</Text>
				<NumberInput
					value={gotoPage}
					onChange={(valueString) => setGotoPage(Number(valueString) || '')} // Instantly update value
					onBlur={handleGoToBlur} // Triggers when input loses focus
					min={1}
					// max={totalPages > 0 ? totalPages : null}
					size='sm'
					borderRadius='md'
					width='5rem'
					bg='softGray.50'
					border='1px solid softGray.600'
					allowMouseWheel={false}
					clampValueOnBlur={false} // Prevents auto-clamping before blur
				>
					<NumberInputField
						aria-label='Go to page'
						textAlign='center'
						borderRadius='md'
						onKeyDown={(e) => {
							if (e.key === 'Enter') {
								handleGoToBlur(); // Manually call onBlur function when Enter is pressed
							}
						}}
						border='2px solid'
						borderColor='softGray.600'
						_focus={{
							outline: 'none',
							bg: 'softGray.50',
							border: '1px solid',
							borderColor: 'brand.500',
						}}
						_active={{ bg: 'softGray.400' }}
					/>
				</NumberInput>

				<Text>of {Number(totalPages).toLocaleString()}</Text>
			</HStack>

			{/* Showing start-end of totalItems */}
			<Text color='gray.800' fontSize='sm' fontWeight='medium'>
				Showing {startIndex} - {endIndex} of {totalItems}
			</Text>

			{/* Next Button */}
			<Button
				{...buttonStyle}
				onClick={handleNext}
				isDisabled={currentPage === totalPages}
				variant='solid'
				bg='softGray.600' // ✅ Same color as Previous
				color='black'
				rightIcon={<FaPlay />}
				aria-label='Next Page'
			>
				Next
			</Button>

			{/* Last Button */}
			<Button
				{...buttonStyle}
				onClick={handleLast}
				isDisabled={currentPage === totalPages}
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
	);
};

export default Pagination;
