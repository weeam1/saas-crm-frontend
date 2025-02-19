import React from 'react';
import { useEffect, useState } from 'react';
import { Box, Button, Icon } from '@chakra-ui/react';
import { useFetchItemsQuery } from 'api/apiSlice';
import ErrorMessage from 'components/Message/ErrorMessage';
import Loader from 'components/loading/Loader';
import Interviewed from './Interviewed';
import AdvancedSearch from '../candidates/components/AdvancedSearch';
import { IoArrowBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import SearchTags from 'components/shared/SearchTags';

const InterviewedCandidates = () => {
	const [showContent, setShowContent] = useState(false);
	const [advanceSearch, setAdvanceSearch] = useState(false);
	const [searchTags, setSearchTags] = useState([]);
	const [sortConfig, setSortConfig] = useState({
		key: null,
		direction: null,
	});

	const user = JSON.parse(localStorage.getItem('user'));
	const isAdmin = user?.role === 'superAdmin';

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

	const { data: positionOptions } = useFetchItemsQuery({
		path: `/positions/options`,
	});

	const { data: agencies } = useFetchItemsQuery(
		{
			path: '/agencies',
		},
		{
			skip: !isAdmin,
		}
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

	// const handleSearch = (params) => {
	// 	// Filter out empty or undefined values
	// 	const filteredParams = Object.entries(params)
	// 		.filter(([_, value]) => value !== '' && value !== undefined)
	// 		.reduce((acc, [key, value]) => {
	// 			acc[key] = value;
	// 			return acc;
	// 		}, {});

	// 	let { ...advancedSearch } = filteredParams;

	// 	// Update tags for UI display (all filtered params including status)
	// 	const tags = Object.entries(filteredParams).map(([key, value]) => {
	// 		let formattedValue = value;

	// 		// If the key is "position", map value through positionOptions
	// 		if (key === 'position') {
	// 			const matchedOption = positionOptions?.doc?.find(
	// 				(option) => option._id === value
	// 			);

	// 			formattedValue = matchedOption ? matchedOption.label : value; // Use label if found, else fallback to value

	// 			// Update advancedSearch to store label instead of ID
	// 			advancedSearch = { ...advancedSearch, position: formattedValue };
	// 		}

	// 		return {
	// 			key: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize first letter
	// 			value: formattedValue,
	// 		};
	// 	});

	// 	setSearchTags(tags);

	// 	// Prepare the query parameters
	// 	const queryParams = {
	// 		advancedSearch: JSON.stringify(advancedSearch),
	// 		page: 1,
	// 		limit: pageSize,
	// 	};

	// 	// Merge and update query parameters for refetch
	// 	setQueryParams((prev) => ({ ...prev, ...queryParams }));
	// 	// set current page 1
	// 	setCurrentPage(1);
	// };

	// const removeTag = (key) => {
	// 	// Remove the tag with the specified key
	// 	const updatedTags = searchTags.filter((tag) => tag.key !== key);
	// 	setSearchTags(updatedTags);

	// 	console.log({ updatedTags });

	// 	// Convert the updated tags back into query parameters
	// 	const updatedParams = updatedTags.reduce(
	// 		(acc, { key, value }) => ({ ...acc, [key]: value }),
	// 		{}
	// 	);

	// 	const { ...advancedSearch } = updatedParams;

	// 	// Prepare the query parameters
	// 	const queryParams = {
	// 		advancedSearch: JSON.stringify(advancedSearch),
	// 		page: 1,
	// 		limit: pageSize,
	// 	};
	// 	// update query parameters
	// 	setQueryParams(queryParams);
	// 	setCurrentPage(1);
	// };

	const handleSearch = (params) => {
		// Filter out empty or undefined values
		const filteredParams = Object.entries(params)
			.filter(([_, value]) => value !== '' && value !== undefined)
			.reduce((acc, [key, value]) => {
				acc[key] = value;
				return acc;
			}, {});

		let advancedSearch = { ...filteredParams };

		// Generate UI tags and update advancedSearch
		const tags = Object.entries(filteredParams).map(([key, value]) => {
			let formattedValue = value;
			let originalKey = key; // Keep original lowercase key

			// If key is "position", replace value with label for UI, but keep ID in search
			if (key === 'position') {
				const matchedOption = positionOptions?.doc?.find(
					(option) => option._id === value
				);

				if (matchedOption) {
					formattedValue = matchedOption.label; // Use label for UI
					advancedSearch.position = matchedOption.label; // Keep ID for actual search
				}
			}

			// If key is "agency", replace value with label for UI, but keep ID in search
			if (key === 'agency') {
				const matchedOption = agencies?.doc?.find(
					(option) => option._id === value
				);

				if (matchedOption) {
					formattedValue = matchedOption.name; // Use label for UI
					advancedSearch.agency = matchedOption._id; // Keep ID for actual search
				}
			}

			return {
				key: originalKey.charAt(0).toUpperCase() + originalKey.slice(1), // Capitalized for UI
				value: formattedValue,
				originalKey, // Store original key for removal reference
			};
		});

		setSearchTags(tags);

		// Prepare query parameters
		const queryParams = {
			advancedSearch: JSON.stringify(advancedSearch),
			page: 1,
			limit: pageSize,
		};

		// Update search query and pagination
		setQueryParams((prev) => ({ ...prev, ...queryParams }));
		setCurrentPage(1);
	};

	const removeTag = (key) => {
		// Find the exact key (case-sensitive)
		const removedTag = searchTags.find((tag) => tag.key === key);
		if (!removedTag) return; // If tag is not found, exit

		const updatedTags = searchTags.filter((tag) => tag.key !== key);
		setSearchTags(updatedTags);

		// Rebuild search parameters after removal
		const updatedParams = updatedTags.reduce((acc, { originalKey, value }) => {
			acc[originalKey] = value; // Use originalKey to prevent case mismatches
			return acc;
		}, {});

		let advancedSearch = { ...updatedParams };

		// Ensure position stays as ID in search
		if (advancedSearch.position) {
			const matchedOption = positionOptions?.doc?.find(
				(option) => option.label === advancedSearch.position
			);
			if (matchedOption) {
				advancedSearch.position = matchedOption.label;
			}
		}

		// Prepare updated query parameters
		const queryParams = {
			advancedSearch: JSON.stringify(advancedSearch),
			page: 1,
			limit: pageSize,
		};

		// Update query and reset pagination
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
			{/* <Box mb={4}>
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
			</Box> */}
			<SearchTags removeTag={removeTag} searchTags={searchTags} />
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
					type='interviewed'
				/>
			)}
		</Box>
	);
};

export default InterviewedCandidates;
