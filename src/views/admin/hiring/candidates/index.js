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

	// Watch for changes in queryParams and trigger refetch
	useEffect(() => {
		refetch({
			path: '/applications',
			params: queryParams,
		});

		setCurrentPage(1);
	}, [queryParams, refetch]);

	const handleSearch = (params) => {
		// Filter out empty or undefined values
		const filteredParams = Object.entries(params)
			.filter(([_, value]) => value !== '' && value !== undefined)
			.reduce((acc, [key, value]) => {
				acc[key] = value;
				return acc;
			}, {});

		// Separate status from the filteredParams
		const { status, ...advancedSearch } = filteredParams;

		// Update tags for UI display (all filtered params including status)
		const tags = Object.entries(filteredParams).map(([key, value]) => ({
			key,
			value,
		}));
		setSearchTags(tags);

		// Prepare the query parameters
		const queryParams = {
			advancedSearch: JSON.stringify(advancedSearch),
			page: 1,
			limit: pageSize,
		};

		// Add status directly to queryParams if it exists
		if (status) {
			queryParams.status = status;
		}

		// Merge and update query parameters for refetch
		setQueryParams((prev) => ({ ...prev, ...queryParams }));
	};

	const removeTag = (key) => {
		// Remove the tag with the specified key
		const updatedTags = searchTags.filter((tag) => tag.key !== key);
		setSearchTags(updatedTags);

		console.log({ updatedTags });

		// Convert the updated tags back into query parameters
		const updatedParams = updatedTags.reduce(
			(acc, { key, value }) => ({ ...acc, [key]: value }),
			{}
		);

		// Separate status from other advanced search fields
		const { status, ...advancedSearch } = updatedParams;

		// Prepare the query parameters
		const queryParams = {
			advancedSearch: JSON.stringify(advancedSearch),
			page: 1,
			limit: pageSize,
		};
		console.log({ updatedParams, queryParams });

		console.log({ status });

		// Add status back directly if it exists in updatedParams
		if (status) {
			queryParams.status = status;
		}

		// update query parameters
		setQueryParams(queryParams);
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

			{/* Display Search Tags */}
			{isLoading || isFetching ? (
				<Box textAlign='center' mt='4'>
					<Spinner size='md' />
					<Text mt='4'>Loading...</Text>
				</Box>
			) : (
				<>
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
