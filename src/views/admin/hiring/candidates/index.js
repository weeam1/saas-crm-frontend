import { useEffect, useState } from 'react';
import {
	Box,
	Button,
	Heading,
	Icon,
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
import CountUpComponent from 'components/countUpComponent/countUpComponent';
import { useNavigate } from 'react-router-dom';
import Loader from 'components/loading/Loader';
import { IoArrowBack } from 'react-icons/io5';

const Candidates = () => {
	const [advanceSearch, setAdvanceSearch] = useState(false);
	const [searchTags, setSearchTags] = useState([]);
	const navigate = useNavigate();

	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(12); // Items per page
	const [queryParams, setQueryParams] = useState({
		page: currentPage,
		limit: pageSize,
	});

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

	const handleSearch = (params) => {
		// Filter out empty or undefined values
		const filteredParams = Object.entries(params)
			.filter(([_, value]) => value !== '' && value !== undefined)
			.reduce((acc, [key, value]) => {
				acc[key] = value;
				return acc;
			}, {});

		// Separate status from the filteredParams
		// const { status, ...advancedSearch } = filteredParams;
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

		// Add status directly to queryParams if it exists
		// if (status) {
		// 	queryParams.status = status;
		// }

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

		// Separate status from other advanced search fields
		// const { status, ...advancedSearch } = updatedParams;
		const { ...advancedSearch } = updatedParams;

		// Prepare the query parameters
		const queryParams = {
			advancedSearch: JSON.stringify(advancedSearch),
			page: 1,
			limit: pageSize,
		};
		// Add status back directly if it exists in updatedParams
		// if (status) {
		// 	queryParams.status = status;
		// }

		// update query parameters
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
					Candidates
					{data && (
						<span style={{ marginLeft: '6px' }}>
							({<CountUpComponent targetNumber={data?.totalDocs} />})
						</span>
					)}
				</Heading>
				<Button
					colorScheme='brand'
					rounded='full'
					onClick={() => setAdvanceSearch(true)}
				>
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
