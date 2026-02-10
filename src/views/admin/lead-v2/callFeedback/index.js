import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
	Box,
	VStack,
	useColorModeValue,
	SimpleGrid,
	Text,
	Icon,
	Spinner,
	Center,
} from '@chakra-ui/react';
import { FiPhone } from 'react-icons/fi';
import { useFetchCallFeedback } from './hooks/useFetchCallFeedback';
import { CallFeedbackCard } from './components/FeedBackCard';
import { CallFeedbackSummary } from './components/FeedBackOverview';
import CallFeedbackDetailModal from './components/CallFeedbackDetailModal';
import { CallFeedbackHeader } from './components/FeedBackHeader';
import { CallFeedbackSkeleton } from './components/skeleton';
import TopPagination from 'components/pagination/TopPagination';
import dayjs from 'dayjs';
import NoData from 'components/Message/NoData';

const CallFeedback = () => {
	const bgColor = useColorModeValue('gray.50', 'gray.900');

	// Filters
	const [search, setSearch] = useState('');
	const [appliedSearch, setAppliedSearch] = useState('');

	// Advanced filters - all as text fields
	const [advancedFilters, setAdvancedFilters] = useState({
		leadName: '',
		leadIntId: '',
		callMedium: '',
		callQuality: '',
		reason: '',
		// userId: "",
		extension: '',
	});

	// Modal state
	const [selectedFeedback, setSelectedFeedback] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const {
		data: callFeedbackData,
		isLoading,
		isFetching,
		stats,
		setStats,
		pagination,
		setPagination,
		totalPages,
		totalRecords,
		handlePageChange,
		handlePageSize,
		month,
		setMonth,
		filters,
		setFilters,
		refetch,
		queryParams,
	} = useFetchCallFeedback();

	// Handle search on Enter key press
	const handleSearch = useCallback(
		(term) => {
			setAppliedSearch(term);
			setPagination((prev) => ({ ...prev, page: 1 }));
		},
		[setPagination],
	);

	// Handle advanced search
	const handleAdvancedSearch = useCallback(
		(filters) => {
			setAdvancedFilters(filters);
			setPagination((prev) => ({ ...prev, page: 1 }));
		},
		[setPagination],
	);

	// Handle clear all filters
	// const handleClear = useCallback(() => {
	//   setSearch("");
	//   setAppliedSearch("");
	//   setAdvancedFilters({
	//     leadName: "",
	//     leadIntId: "",
	//     callMedium: "",
	//     callQuality: "",
	//     reason: "",
	//     // userId: "",
	//     extension: "",
	//   });
	//   setMonth(dayjs().format("YYYY-MM"));
	//   setPagination((prev) => ({ ...prev, page: 1 }));
	// }, [setPagination]);
	const handleClear = useCallback(() => {
		// Reset all local states
		setSearch('');
		setAppliedSearch('');
		setAdvancedFilters({
			leadName: '',
			leadIntId: '',
			callMedium: '',
			callQuality: '',
			reason: '',
			extension: '',
		});
		setMonth(dayjs().format('YYYY-MM'));

		// Reset hook filters
		setFilters({});

		// Reset pagination
		setPagination((prev) => ({ ...prev, page: 1 }));
	}, [setPagination, setFilters]);

	// Update filters in hook when local filters change
	// useEffect(() => {
	//   const newFilters = {
	//     ...(appliedSearch && { q: appliedSearch }),
	//     ...(month && { month: month }),
	//     ...advancedFilters,
	//   };

	//   // Clean up empty values
	//   const cleanedFilters = Object.keys(newFilters).reduce((acc, key) => {
	//     if (newFilters[key] && newFilters[key].trim() !== "") {
	//       acc[key] = newFilters[key].trim();
	//     }
	//     return acc;
	//   }, {});

	//   setFilters(cleanedFilters);
	// }, [appliedSearch, month, advancedFilters, setFilters]);

	useEffect(() => {
		const newFilters = {
			...(appliedSearch && { q: appliedSearch }),
			...advancedFilters,
		};

		const cleanedFilters = Object.keys(newFilters).reduce((acc, key) => {
			if (newFilters[key] && newFilters[key].trim() !== '') {
				acc[key] = newFilters[key].trim();
			}
			return acc;
		}, {});

		setFilters(cleanedFilters);
	}, [appliedSearch, advancedFilters, setFilters]);

	// Reset page when filters change
	// useEffect(() => {
	//   setPagination((prev) => ({ ...prev, page: 1 }));
	// }, [appliedSearch, month, advancedFilters, setPagination]);

	// Modal handlers
	const handleViewDetails = useCallback((feedback) => {
		setSelectedFeedback(feedback);
		setIsModalOpen(true);
	}, []);

	const handleCloseModal = useCallback(() => {
		setIsModalOpen(false);
		setSelectedFeedback(null);
	}, []);

	console.log(callFeedbackData, 'check feed data');

	// Show loading state
	return (
		<Box bg={bgColor}>
			<Box>
				<VStack spacing={4} align='stretch'>
					{isLoading || isFetching ? (
						<CallFeedbackSkeleton />
					) : (
						<>
							{/* Summary */}
							<CallFeedbackSummary
								month={month}
								year={dayjs(month).year()}
								data={stats || []}
								totalRecords={totalRecords}
							/>

							{/* Header with Filters */}
							<CallFeedbackHeader
								setAppliedSearch={setAppliedSearch}
								setAdvancedFilters={setAdvancedFilters}
								search={search}
								setSearch={setSearch}
								onSearch={handleSearch}
								onAdvancedSearch={handleAdvancedSearch}
								onClear={handleClear}
								month={month}
								setMonth={setMonth}
								advancedFilters={advancedFilters}
								// Pagination props
								filters={filters}
								setFilters={setFilters}
								currentPage={pagination.page}
								totalPages={totalPages}
								onPageChange={handlePageChange}
								totalItems={totalRecords}
								itemsPerPage={pagination.limit}
								refetching={isFetching}
								loading={isLoading}
								handlePageSize={handlePageSize}
								refetch={refetch}
							/>

							{/* Feedback Cards */}
							<Box
							// overflowY="auto" maxHeight="calc(80vh)" pr={2}
							>
								{callFeedbackData.length == 0 ? (
									<NoData label='Feedback' />
								) : (
									<SimpleGrid
										columns={{ base: 1, md: 2, lg: 2, xl: 3, '2xl': 4 }}
										spacing={6}
									>
										{callFeedbackData?.map((feedback) => (
											<CallFeedbackCard
												key={feedback._id}
												feedback={feedback}
												onViewDetails={handleViewDetails}
											/>
										))}
									</SimpleGrid>
								)}
							</Box>
						</>
					)}
				</VStack>
			</Box>

			{/* Detail Modal */}
			<CallFeedbackDetailModal
				isOpen={isModalOpen}
				onClose={handleCloseModal}
				feedback={selectedFeedback}
			/>
		</Box>
	);
};

export default CallFeedback;
