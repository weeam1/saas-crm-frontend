import React, { useEffect, useState } from 'react';
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
import { leadValueFontSize } from './constants';
import { useSelector } from 'react-redux';

const Pagination = ({
	currentPage,
	totalPages,
	onPageChange,
	totalItems,
	itemsPerPage,
	setPageSize,
	refetching,
	loading,
	handlePageSize,
}) => {
	const [gotoPage, setGotoPage] = useState(currentPage ?? 1);

	const leads = useSelector((state) => state.leads);

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

	const handleGoToChange = (value) => {
		setGotoPage(value);
	};

	const handleGoToBlur = () => {
		const page = Math.max(1, Math.min(Number(gotoPage) || 1, totalPages));
		onPageChange(page);
		setGotoPage(page);
	};

	const buttonStyle = {
		size: 'xs',
		borderRadius: 'lg',
		_hover: { shadow: 'sm', transition: 'all 0.2s ease-in-out' },
		_active: { bg: 'softGray.500' },
		sx: { svg: { fill: 'brand.500' } },
	};

	return (
		<HStack
			spacing={3}
			p={2}
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
			fontSize={leadValueFontSize}
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
				{/* <NumberInput
					value={gotoPage ?? 1}
					onChange={(valueString) => {
						const value = Number(valueString) || '';
						if (value <= (totalPages ?? 999999999)) {
							setGotoPage(value);
						}
					}}
					onBlur={(e) => e.key === 'Enter' && handleGoToBlur()}
					min={1}
					max={totalPages ?? 999999999}
					size='sm'
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
						onKeyDown={(e) => e.key === 'Enter' && handleGoToBlur()}
						border='2px solid'
						borderColor='softGray.600'
						_focus={{
							outline: 'none',
							bg: 'softGray.50',
							border: '1px solid',
							borderColor: 'brand.500',
						}}
						_active={{ bg: 'softGray.400' }}
						isDisabled={refetching || loading} // Disable input when loading
					/>
				</NumberInput> */}

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
					size='sm'
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
			<Text color='gray.800' fontSize={leadValueFontSize} fontWeight='medium'>
				Showing {startIndex} - {endIndex} of {totalItems}
			</Text>

			{/* Next & Last Button */}
			<HStack flexDirection='row' flexWrap='wrap' justifyContent='center'>
				<Select
					size='sm'
					w={{ base: '32' }}
					value={itemsPerPage}
					color='gray.800'
					bg='softGray.400'
					borderRadius='md'
					border='2px solid'
					_focus={{ boxShadow: '0 0 0 1px softGray.500' }}
					onChange={handlePageSize}
					isDisabled={!leads?.totalLeads || loading || refetching}
				>
					{leads?.totalLeads > 0 ? (
						[
							6,
							12,
							32,
							50,
							60,
							80,
							100,
							leads.totalLeads < 200 ? leads.totalLeads : 200,
							leads.pageSize,
						]
							.filter(
								(size, index, self) =>
									size <= leads.totalLeads && self.indexOf(size) === index
							)
							.sort((a, b) => a - b) // Sorting in ascending order
							.map((size) => (
								<option key={size} value={size}>
									Show {size}
								</option>
							))
					) : (
						<option value='0'>""</option>
					)}
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

export default Pagination;
