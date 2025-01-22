import React, { useState, useEffect } from 'react';
import { Box, Heading, Button } from '@chakra-ui/react';
import { toast } from 'react-toastify';
import { getApplications } from 'api';
import AdvancedSearch from './components/AdvanceSearch';
import Applications from './components/Applications';

// Candidates Component
const Candidates = () => {
	const [candidates, setCandidates] = useState([]);
	const [loading, setLoading] = useState(true);

	const [currentPage, setCurrentPage] = useState(1);
	const [candidatesPerPage] = useState(12); // Number of candidates to show per page
	const [totalPages, setTotalPages] = useState(0); // Total number of pages

	const [advanceSearch, setAdvanceSearch] = useState(false);

	// Fetch data from the backend with pagination
	const fetchData = async (page) => {
		setLoading(true);
		try {
			const data = await getApplications(page, candidatesPerPage);
			setCandidates(data?.doc || []);
			setTotalPages(data.totalPages || 0);
		} catch (error) {
			toast.error(error.data.message || 'Something went wrong!');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData(currentPage);
	}, [currentPage]); // Fetch data whenever currentPage changes

	// Handle page change
	const handlePageChange = (page) => {
		setCurrentPage(page);
	};

	// Fetch data from the backend
	// useEffect(() => {
	// 	const fetchData = async () => {
	// 		try {
	// 			const data = await getApplications();
	// 			setCandidates(data || []);
	// 			setLoading(false);
	// 		} catch (error) {
	// 			toast.error(error.data.message || 'Something went wrong!');
	// 			setLoading(false);
	// 		}
	// 	};

	// 	fetchData();
	// }, []);

	const handleAdvanceSearch = () => {
		setAdvanceSearch(true);
	};

	const handleCloseAdvanceSearch = () => {
		setAdvanceSearch(false);
	};

	const fetchAdvancedSearch = (params) => {
		console.log('search');
	};

	return (
		<>
			<Box>
				{/* Header */}
				<Box
					display='flex'
					justifyContent='space-between'
					alignItems='center'
					mb={6}
					bg='white'
					rounded='md'
					shadow='md'
					p='1rem'
				>
					<Heading size='lg' color='gray.800'>
						Candidates
					</Heading>
					<Button
						colorScheme='brand'
						variant='solid'
						onClick={handleAdvanceSearch}
					>
						Advanced Search
					</Button>
				</Box>

				<Applications
					loading={loading}
					candidates={candidates}
					handlePageChange={handlePageChange}
					currentPage={currentPage}
					totalPages={totalPages}
				/>
			</Box>

			{advanceSearch && (
				<AdvancedSearch
					isOpen={advanceSearch}
					onClose={handleCloseAdvanceSearch}
					fetchAdvancedSearch={fetchAdvancedSearch}
					setAdvaceSearch={setAdvanceSearch}
				/>
			)}
		</>
	);
};

export default Candidates;
