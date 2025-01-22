import React, { useState } from 'react';
import {
	PaginationRoot,
	PaginationPageText,
	PaginationPrevTrigger,
	PaginationNextTrigger,
} from '@chakra-ui/pagination'; // Adjust import based on the Chakra pagination package you're using
import { HStack, Input, Button } from '@chakra-ui/react';

const Pagination = ({ totalItems, totalPages, pageSize, onPageChange }) => {
	const [currentPage, setCurrentPage] = useState(1);
	const [inputValue, setInputValue] = useState('');

	const handlePageChange = (page) => {
		if (page >= 1 && page <= totalPages) {
			setCurrentPage(page);
			onPageChange(page);
		}
	};

	const handleInputChange = (e) => {
		const value = e.target.value;
		if (!isNaN(value) && value !== '') {
			setInputValue(parseInt(value, 10));
		} else {
			setInputValue('');
		}
	};

	const handleGoToPage = () => {
		if (inputValue >= 1 && inputValue <= totalPages) {
			handlePageChange(inputValue);
		}
	};

	return (
		<PaginationRoot count={totalItems} pageSize={pageSize} page={currentPage}>
			<HStack gap='4'>
				<PaginationPageText format='long' flex='1' />
				<PaginationPrevTrigger
					onClick={() => handlePageChange(currentPage - 1)}
				/>
				<PaginationNextTrigger
					onClick={() => handlePageChange(currentPage + 1)}
				/>
			</HStack>
			<HStack mt={4} gap='2'>
				<Input
					placeholder='Enter page number'
					value={inputValue}
					onChange={handleInputChange}
					maxW='100px'
				/>
				<Button onClick={handleGoToPage} colorScheme='blue'>
					Go
				</Button>
			</HStack>
		</PaginationRoot>
	);
};

export default Pagination;
