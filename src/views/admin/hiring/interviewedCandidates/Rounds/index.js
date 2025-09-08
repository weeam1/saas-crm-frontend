import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Box } from '@chakra-ui/react';
import { useFetchItemsQuery } from 'api/apiSlice';

import ErrorMessage from 'components/Message/ErrorMessage';
import Loader from 'components/loading/Loader';
import SearchTags from 'components/shared/SearchTags';

import { experienceYearsOptions } from '../../helpers';
import InterviewedRound from './InterviewedRound';
import AdvancedSearch from '../../candidates/components/AdvancedSearch';
import useUserSession from 'hooks/useUserSession';

const InterviewedCandidates = () => {
	const [showContent, setShowContent] = useState(false);
	const [advanceSearch, setAdvanceSearch] = useState(false);
	const [searchTags, setSearchTags] = useState([]);
	const [sortConfig, setSortConfig] = useState({
		key: null,
		direction: null,
	});

	const { isSuperAdmin } = useUserSession();

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
			path: `/interviews/next-rounds`,
			params: queryParams,
		},
		{ refetchOnMountOrArgChange: true }
	);

	const { data: allData } = useFetchItemsQuery(
		{
			path: `/interviews/next-rounds`,
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
			skip: !isSuperAdmin,
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
			path: `/interviews/next-rounds`,
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
	const clearAllTags = () => {
		setSearchTags([]);

		const queryParams = {
			advancedSearch: JSON.stringify({}),
			page: 1,
			limit: pageSize,
		};

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
		<Box fontFamily="'DM Sans', sans-serif">
			<SearchTags
				removeTag={removeTag}
				searchTags={searchTags}
				clearAllTags={clearAllTags}
			/>

			<InterviewedRound
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
