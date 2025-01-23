import { Box, Button, HStack } from '@chakra-ui/react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
	const handlePrevious = () => {
		if (currentPage > 1) onPageChange(currentPage - 1);
	};

	const handleNext = () => {
		if (currentPage < totalPages) onPageChange(currentPage + 1);
	};

	return (
		<HStack spacing='4' justify='center' mt='6'>
			<Button
				onClick={handlePrevious}
				isDisabled={currentPage === 1}
				colorScheme='brand'
				variant='outline'
				size='sm'
			>
				Previous
			</Button>
			<Box>
				Page {currentPage} of {totalPages}
			</Box>
			<Button
				onClick={handleNext}
				isDisabled={currentPage === totalPages}
				colorScheme='brand'
				variant='outline'
				size='sm'
			>
				Next
			</Button>
		</HStack>
	);
};

export default Pagination;
