import React from 'react';
import { useEffect, useState } from 'react';
import { Box, Button, Icon, Tag, TagCloseButton } from '@chakra-ui/react';
import { useFetchItemsQuery } from 'api/apiSlice';
import ErrorMessage from 'components/Message/ErrorMessage';
import Loader from 'components/loading/Loader';
import Interviewed from './Interviewed';
import AdvancedSearch from '../candidates/components/AdvancedSearch';
import { IoArrowBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

const InterviewedCandidates = () => {
	const [showContent, setShowContent] = useState(false);
	const [advanceSearch, setAdvanceSearch] = useState(false);
	const [searchTags, setSearchTags] = useState([]);
	const [sortConfig, setSortConfig] = useState({
		key: null,
		direction: null,
	});

	const [data, setData] = useState([]);

	const navigate = useNavigate();

	const [currentPage, setCurrentPage] = useState(1);
	const [gopageValue, setGopageValue] = useState(1);
	const [pageSize, setPageSize] = useState(10);

	const [queryParams, setQueryParams] = useState({
		page: currentPage,
		limit: pageSize,
		sort: '-updatedAt',
	});

	const {
		data: invitedData,
		error,
		isLoading,
		refetch,
	} = useFetchItemsQuery(
		{
			path: `/interviews/interviewed-candidates`,
			params: queryParams,
		},
		{ refetchOnMountOrArgChange: true }
	);

	const { data: allData } = useFetchItemsQuery(
		{
			path: `/interviews/interviewed-candidates`,
		},
		{ refetchOnMountOrArgChange: true }
	);

	const handleGotoPage = (page) => {
		setCurrentPage(page + 1);
	};

	const handlePageSizeChange = (size) => {
		setPageSize(size);
		setCurrentPage(1); // Reset to first page
	};

	// Single useEffect for updating queryParams and fetching data
	useEffect(() => {
		setQueryParams((prev) => ({
			...prev, // Preserve existing query parameters
			page: currentPage,
			limit: pageSize,
		}));
	}, [currentPage, pageSize]);

	// Automatically refetch when queryParams change
	useEffect(() => {
		refetch({
			path: `/interviews/interviewed-candidates`,
			params: queryParams,
		});
	}, [queryParams, refetch]);

	useEffect(() => {
		if (invitedData?.doc) {
			setData(invitedData?.doc);
		}
	}, [invitedData?.doc]);

	const handleSort = (key) => {
		let direction = 'asc';
		if (sortConfig.key === key && sortConfig.direction === 'asc') {
			direction = 'desc';
		}
		setSortConfig({ key, direction });

		const sortedData = [...invitedData?.doc].sort((a, b) => {
			if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
			if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
			return 0;
		});
		setData(sortedData);
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
		const tags = Object.entries(filteredParams)?.map(([key, value]) => ({
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

	if (error) {
		return (
			<ErrorMessage message={error?.data?.message || 'Something went wrong!'} />
		);
	}

	return showContent ? (
		<Loader />
	) : (
		<Box>
			<Button
				colorScheme='gray'
				borderRadius='5px'
				size={{ base: 'sm', md: 'md' }}
				px={{ base: 4, md: 6 }}
				py={{ base: 2, md: 3 }}
				fontSize={{ base: 'sm', md: 'md' }}
				leftIcon={<Icon as={IoArrowBack} boxSize={4} />}
				onClick={() => navigate('/hiring')}
				mb={4}
			>
				Back
			</Button>
			<Box mb={4}>
				{/* Display Search Tags */}
				{searchTags?.map(({ key, value }) => (
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
			<Interviewed
				allData={allData}
				data={data}
				totalDocs={invitedData?.totalDocs}
				loading={isLoading}
				handleSort={handleSort}
				sortConfig={sortConfig}
				refetch={refetch}
				totalPages={invitedData?.totalPages}
				currentPage={currentPage}
				pageSize={pageSize}
				handlePageSizeChange={handlePageSizeChange}
				handleGotoPage={handleGotoPage}
				gopageValue={gopageValue}
				setGopageValue={setGopageValue}
				setAdvanceSearch={setAdvanceSearch}
			/>

			{advanceSearch && (
				<AdvancedSearch
					isOpen={advanceSearch}
					onClose={() => setAdvanceSearch(false)}
					onSearch={handleSearch}
					type='invited'
				/>
			)}
		</Box>
	);
};

export default InterviewedCandidates;
