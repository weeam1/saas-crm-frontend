import { useEffect, useState } from 'react';
import {
	Box,
	Button,
	Heading,
	HStack,
	Icon,
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
import CountUpComponent from 'components/countUpComponent/countUpComponent';
import { useNavigate } from 'react-router-dom';
import Loader from 'components/loading/Loader';
import { IoArrowBack } from 'react-icons/io5';
import SearchTags from 'components/shared/SearchTags';
import { experienceYearsOptions } from '../helpers';

const Candidates = () => {
	const [advanceSearch, setAdvanceSearch] = useState(false);
	const [searchTags, setSearchTags] = useState([]);
	const navigate = useNavigate();

	const user = JSON.parse(localStorage.getItem('user'));
	const isAdmin = user?.role === 'superAdmin';

	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(12); // Items per page
	const [queryParams, setQueryParams] = useState({
		page: currentPage,
		limit: pageSize,
	});

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

	const { data, error, isLoading, refetch, isFetching } = useFetchItemsQuery({
		path: '/applications',
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

	// Handle page changes
	const handlePageChange = (page) => {
		setCurrentPage(page);
	};

	// const handleSearch = (params) => {
	// 	// Filter out empty or undefined values
	// 	const filteredParams = Object.entries(params)
	// 		.filter(([_, value]) => value !== '' && value !== undefined)
	// 		.reduce((acc, [key, value]) => {
	// 			acc[key] = value;
	// 			return acc;
	// 		}, {});

	// 	// Separate status from the filteredParams
	// 	// const { status, ...advancedSearch } = filteredParams;
	// 	const { ...advancedSearch } = filteredParams;

	// 	// Update tags for UI display (all filtered params including status)
	// 	const tags = Object.entries(filteredParams).map(([key, value]) => {
	// 		let formattedValue = value;

	// 		// If the key is "position", map value through positionOptions
	// 		if (key === 'position') {
	// 			const matchedOption = positionOptions?.doc?.find(
	// 				(option) => option._id === value
	// 			);

	// 			formattedValue = matchedOption ? matchedOption.label : value; // Use label if found, else fallback to value
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

	// 	// Add status directly to queryParams if it exists
	// 	// if (status) {
	// 	// 	queryParams.status = status;
	// 	// }

	// 	// Merge and update query parameters for refetch
	// 	setQueryParams((prev) => ({ ...prev, ...queryParams }));
	// 	// set current page 1
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
					advancedSearch.position = matchedOption._id; // Keep ID for actual search
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

			if (key === 'experienceYears') {
				const matchedOption = experienceYearsOptions?.find(
					(option) => option.value === value
				);

				if (matchedOption) {
					formattedValue = matchedOption.label; // Use label for UI
					advancedSearch.experienceYears = matchedOption.value; // Keep ID for actual search
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
				advancedSearch.position = matchedOption._id;
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

	return (
		<Box>
			{/* <Button
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
			</Button> */}
			{/* Header */}
			<Box
				display='flex'
				justifyContent='space-between'
				alignItems='center'
				mb={6}
				bg='white'
				// rounded='md'
				shadow='sm'
				p='1rem'
				marginTop={'-16px'}
				marginLeft={'-4px'}
				fontFamily="'DM Sans', sans-serif"
			>
				<Heading size='md' color='gray.800'>
					Candidates
					{data && (
						<span style={{ marginLeft: '6px' }}>
							({<CountUpComponent targetNumber={data?.totalDocs} />})
						</span>
					)}
				</Heading>
				<HStack>
					{data?.results && (
						<Text fontSize='sm' color='gray.500'>
							({data?.results} showing)
						</Text>
					)}

					<Button
						colorScheme='brand'
						rounded='full'
						onClick={() => setAdvanceSearch(true)}
					>
						Advanced Search
					</Button>
				</HStack>
			</Box>

			<SearchTags removeTag={removeTag} searchTags={searchTags} />

			{/* Display Search Tags */}
			{isLoading ? (
				<Loader />
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
