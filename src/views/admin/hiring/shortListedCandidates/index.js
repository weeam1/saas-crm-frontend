import { useEffect, useState } from 'react';
import { Box, Heading, Tag, TagCloseButton } from '@chakra-ui/react';
import { useFetchItemsQuery } from 'api/apiSlice';

import AdvancedSearch from '../candidates/components/AdvancedSearch';
import ErrorMessage from 'components/Message/ErrorMessage';
import Pagination from 'components/pagination/Pagination';
import ShortListed from './components/ShortListed';

const ShortListedCandidates = () => {
	const [advanceSearch, setAdvanceSearch] = useState(false);
	const [searchTags, setSearchTags] = useState([]);
	const [sortConfig, setSortConfig] = useState({
		key: null,
		direction: null,
	});

	const [data, setData] = useState([]);

	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(12); // Items per page
	const [queryParams, setQueryParams] = useState({
		page: currentPage,
		limit: pageSize,
	});

	const {
		data: shortListedData,
		error,
		isLoading,
		refetch,
	} = useFetchItemsQuery({
		path: `/applications/short-listed`,
		params: queryParams,
	});

	// Update queryParams only when necessary
	useEffect(() => {
		setQueryParams((prev) => ({
			...prev,
			page: currentPage, // Keep page in sync
		}));
	}, [currentPage]);

	useEffect(() => {
		setQueryParams((prev) => ({
			...prev,
			limit: pageSize, // Update limit when pageSize changes
		}));
	}, [pageSize]);

	// Automatically refetch when queryParams change
	useEffect(() => {
		refetch({
			path: '/applications',
			params: queryParams,
		});
	}, [queryParams, refetch]);

	useEffect(() => {
		if (shortListedData?.doc) {
			setData(shortListedData?.doc);
		}
	}, [shortListedData?.doc]);

	const handleSort = (key) => {
		let direction = 'asc';
		if (sortConfig.key === key && sortConfig.direction === 'asc') {
			direction = 'desc';
		}
		setSortConfig({ key, direction });

		const sortedData = [...shortListedData?.doc].sort((a, b) => {
			if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
			if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
			return 0;
		});
		setData(sortedData);
	};

	// Handle page changes
	const handlePageChange = (page) => {
		setCurrentPage(page);
	};

	const handleSearch = (params) => {
		// Filter out empty or undefined values
		const filteredParams = Object.entries(params)
			.filter(([_, value]) => value !== '' && value !== undefined)
			.reduce((acc, [key, value]) => {
				acc[key] = value;
				return acc;
			}, {});

		const { ...advancedSearch } = filteredParams;

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

		// Merge and update query parameters for refetch
		setQueryParams((prev) => ({ ...prev, ...queryParams }));
		// set current page 1
		setCurrentPage(1);
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

		const { ...advancedSearch } = updatedParams;

		// Prepare the query parameters
		const queryParams = {
			advancedSearch: JSON.stringify(advancedSearch),
			page: 1,
			limit: pageSize,
		};
		// update query parameters
		setQueryParams(queryParams);
		setCurrentPage(1);
	};

	// const [isApplicationOpen, setApplicationOpen] = useState(false);

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
				shadow='sm'
				p='1rem'
			>
				<Heading size='md' color='gray.800'>
					Short Listed Candidates
				</Heading>
			</Box>
			<Box mb={4}>
				{/* Display Search Tags */}
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
			<>
				<ShortListed
					data={data}
					totalDocs={shortListedData?.totalDocs}
					loading={isLoading}
					handleSort={handleSort}
					sortConfig={sortConfig}
					// setAdvanceSearch={setAdvanceSearch}
				/>
				{/* <Pagination
								currentPage={currentPage}
								totalPages={data.totalPages}
								onPageChange={handlePageChange}
							/> */}
			</>
			{/* Advanced Search Modal */}
			{/* {advanceSearch && (
				<AdvancedSearch
					isOpen={advanceSearch}
					onClose={() => setAdvanceSearch(false)}
					onSearch={handleSearch}
				/>
			)} */}
		</Box>
	);
};

export default ShortListedCandidates;
