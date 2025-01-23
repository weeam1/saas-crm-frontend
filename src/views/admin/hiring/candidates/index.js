import { useEffect, useState } from 'react';
import {
	Box,
	Button,
	Heading,
	Spinner,
	Tag,
	TagCloseButton,
	Text,
} from '@chakra-ui/react';
import { useFetchItemsQuery } from 'api/apiSlice';

import Applications from './components/Applications';
import AdvancedSearch from './components/AdvancedSearch';
import Pagination from './components/Pagination';
import ErrorMessage from 'components/Message/ErrorMessage';
import NotFoundMessage from 'components/Message/NotFoundMessage';

const Candidates = () => {
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize] = useState(12); // Items per page
	const [advanceSearch, setAdvanceSearch] = useState(false);

	const [searchTags, setSearchTags] = useState([]);

	const [queryParams, setQueryParams] = useState({
		page: currentPage,
		limit: pageSize,
	});

	const { data, error, isLoading, refetch, isFetching } = useFetchItemsQuery({
		path: '/applications',
		params: queryParams,
	});

	const handlePageChange = (page) => setCurrentPage(page);

	useEffect(() => {
		setCurrentPage(1);
	}, [data]);

	const handleSearch = (params) => {
		// Filter out empty or undefined values
		const filteredParams = Object.entries(params)
			.filter(([_, value]) => value !== '' && value !== undefined)
			.reduce((acc, [key, value]) => {
				// Handle status as an exact match
				if (key === 'status') {
					// Skip adding status to advancedSearch and directly include it in queryParams
					acc['status'] = value;
				} else {
					acc[key] = value;
				}
				return acc;
			}, {});

		// Update tags for UI display
		const tags = Object.entries(filteredParams).map(([key, value]) => ({
			key,
			value,
		}));
		setSearchTags(tags);

		// Prepare the query parameters
		const queryParams = {
			advancedSearch: JSON.stringify(filteredParams), // Add other filters to advanced search
			page: 1,
			limit: pageSize,
		};

		// Check if status exists and add it directly to queryParams
		if (filteredParams.status) {
			queryParams.status = filteredParams.status;
		}

		// Merge and update query parameters for refetch
		setQueryParams((prev) => ({ ...prev, ...queryParams }));

		// Trigger the API call with the updated query params
		refetch({
			path: '/applications',
			params: queryParams,
		});
	};

	const removeTag = (key) => {
		// Remove the tag with the specified key
		const updatedTags = searchTags.filter((tag) => tag.key !== key);
		setSearchTags(updatedTags);

		// Convert the updated tags back into query parameters
		const updatedParams = updatedTags.reduce(
			(acc, { key, value }) => ({ ...acc, [key]: value }),
			{}
		);

		// Update the advancedSearch object
		const advancedSearch = Object.entries(updatedParams).reduce(
			(acc, [key, value]) => {
				acc[key] = value; // Keep the key-value pair
				return acc;
			},
			{}
		);

		// Prepare the query parameters
		const queryParams = {
			advancedSearch: JSON.stringify(advancedSearch), // Updated advanced search filters
			page: 1,
			limit: pageSize,
		};

		// Merge and update query parameters for refetch
		setQueryParams((prev) => ({ ...prev, ...queryParams }));

		// Refetch with the updated parameters
		refetch({
			path: '/applications',
			params: queryParams,
		});
	};

	if (error) {
		return (
			<ErrorMessage message={error?.data?.message || 'Something went wrong!'} />
		);
	}

	return (
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
				<Button colorScheme='brand' onClick={() => setAdvanceSearch(true)}>
					Advanced Search
				</Button>
			</Box>

			{/* Display Search Tags */}
			{isLoading || isFetching ? (
				<Box textAlign='center' mt='4'>
					<Spinner size='md' />
					<Text mt='4'>Loading Candidates...</Text>
				</Box>
			) : (
				<>
					<Box mb={4}>
						{searchTags.map(({ key, value }) => (
							<Tag
								key={key}
								size='sm'
								colorScheme='brand'
								borderRadius='full'
								m={1}
								p='1'
								onClick={() => removeTag(key)}
							>
								{key}: {value} <TagCloseButton onClick={() => removeTag(key)} />
							</Tag>
						))}
					</Box>

					{/* Content */}
					{data?.doc?.length ? (
						<>
							<Applications candidates={data.doc} refetch={refetch} />
							<Pagination
								currentPage={currentPage}
								totalPages={data.totalPages}
								onPageChange={handlePageChange}
							/>
						</>
					) : (
						<NotFoundMessage message='No candidates found!' />
					)}
				</>
			)}

			{/* Advanced Search Modal */}
			{advanceSearch && (
				<AdvancedSearch
					isOpen={advanceSearch}
					onClose={() => setAdvanceSearch(false)}
					onSearch={handleSearch}
				/>
			)}
		</Box>
	);
};

export default Candidates;
