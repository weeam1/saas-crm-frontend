import ShortListed from './ShortListed';
import { useEffect, useState } from 'react';
import { Box, Tag, TagCloseButton } from '@chakra-ui/react';
import { useFetchItemsQuery } from 'api/apiSlice';
import ErrorMessage from 'components/Message/ErrorMessage';
import AdvancedSearch from '../candidates/components/AdvancedSearch';
import SearchTags from 'components/shared/SearchTags';
import { experienceYearsOptions } from '../helpers';

const ShortListedData = ({ invitedRefetch }) => {
	const [advanceSearch, setAdvanceSearch] = useState(false);

	const [searchTags, setSearchTags] = useState([]);
	const [sortConfig, setSortConfig] = useState({
		key: null,
		direction: null,
	});

	const user = JSON.parse(localStorage.getItem('user'));
	const isAdmin = user?.role === 'superAdmin';

	const [data, setData] = useState([]);

	const [currentPage, setCurrentPage] = useState(1);
	const [gopageValue, setGopageValue] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [queryParams, setQueryParams] = useState({
		page: currentPage,
		limit: pageSize,
		sort: '-updatedAt',
	});

	const {
		data: shortListedData,
		error,
		isLoading,
		isFetching,
		refetch,
	} = useFetchItemsQuery({
		path: `/applications/short-listed`,
		params: queryParams,
	});

	const { data: allData } = useFetchItemsQuery({
		path: `/applications/short-listed`,
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

	const handleGotoPage = (page) => {
		setCurrentPage(page + 1);
	};

	const handlePageSizeChange = (size) => {
		setPageSize(size);
		setCurrentPage(1);
	};

	// Single useEffect for updating queryParams and fetching data
	useEffect(() => {
		setQueryParams((prev) => ({
			...prev, // Preserve existing query parameters
			page: currentPage,
			limit: pageSize,
		}));
	}, [currentPage, pageSize]);

	useEffect(() => {
		refetch({
			path: '/applications/short-listed',
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
					formattedValue = matchedOption.label;
					advancedSearch.position = matchedOption._id;
				}
			}

			if (key === 'agency') {
				const matchedOption = agencies?.doc?.find(
					(option) => option._id === value
				);

				if (matchedOption) {
					formattedValue = matchedOption.name;
					advancedSearch.agency = matchedOption._id;
				}
			}

			if (key === 'experienceYears') {
				const matchedOption = experienceYearsOptions?.find(
					(option) => option.value === value
				);

				if (matchedOption) {
					formattedValue = matchedOption.label;
					advancedSearch.experienceYears = matchedOption.value;
				}
			}

			return {
				key: originalKey.charAt(0).toUpperCase() + originalKey.slice(1),
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
			<SearchTags removeTag={removeTag} searchTags={searchTags} />

			<ShortListed
				allData={allData}
				data={data}
				totalDocs={shortListedData?.totalDocs}
				loading={isLoading}
				isFetching={isFetching}
				handleSort={handleSort}
				sortConfig={sortConfig}
				refetch={refetch}
				totalPages={shortListedData?.totalPages}
				currentPage={currentPage}
				pageSize={pageSize}
				handlePageSizeChange={handlePageSizeChange}
				handleGotoPage={handleGotoPage}
				gopageValue={gopageValue}
				setGopageValue={setGopageValue}
				setAdvanceSearch={setAdvanceSearch}
				invitedRefetch={invitedRefetch}
			/>

			{advanceSearch && (
				<AdvancedSearch
					isOpen={advanceSearch}
					onClose={() => setAdvanceSearch(false)}
					onSearch={handleSearch}
					type='short-listed'
				/>
			)}
		</Box>
	);
};

export default ShortListedData;
