import React, { useState, useEffect, useRef } from 'react';
import {
	HStack,
	Button,
	NumberInput,
	NumberInputField,
	Text,
	Flex,
	Box,
	Divider,
	Select,
	useDisclosure,
	IconButton,
} from '@chakra-ui/react';
import { FaPlay } from 'react-icons/fa';
import { IoPlaySkipForwardSharp } from 'react-icons/io5';
import SearchBox from 'views/admin/lead-v2/components/SearchBox';
import Tabs from './Tabs';
import RefreshButton from "components/refresh/RefreshButton";
import TabContent from './TabContent';
import { leadValueFontSize } from './constants';
import LeadsProgress from './LeadProgress';
import SearchTags from 'components/shared/SearchTags';
import DateFilter from 'views/admin/leadPool-v2/components/DateFilter';
import { formattedDate } from 'utils/helpers';
import DateFilterButton from 'views/admin/leadPool-v2/components/DateFilterButton';
import { CloseIcon } from '@chakra-ui/icons';
import AdvancedSearchModal from './AdvancedModal';
import CustomTooltip from 'components/shared/CustomTooltip';
import TopPagination from 'components/pagination/TopPagination';

const Pagination = ({
	leads,
	currentPage,
	setCurrentPage,
	totalPages,

	totalItems,
	pageSize,
	setPageSize,
	onPageSizeChange,
	activeTab,
	setActiveTab,
	loading,
	searchQuery,
	setSearchQuery,
	fetchAdvancedSearch,
	setSearchClear,
	setFormValues,
	isFormReset,
	setIsFormReset,
	tagValues,
	setGetTagValues,
	clearAdvancedSearch,
	approveChangeHandler,
	formValues = {},
	isAgent,
	isSuperAdmin,
}) => {
	const [gotoPage, setGotoPage] = useState(currentPage || 1);
	const [searchTags, setSearchTags] = useState([]);
	const [isAdvanceSearchOpen, setIsAdvanceSearchOpen] = useState(false);

	// Search ref for SearchBox component
	const searchTermRef = useRef(searchQuery || '');

	useEffect(() => {
		if (tagValues && tagValues.length > 0) {
			// Only set searchTags if they're different from current searchTags
			// This prevents unnecessary updates and re-adding removed tags
			const currentKeys = searchTags
				.map((t) => t.originalKey)
				.sort()
				.join(',');
			const newKeys = tagValues
				.map((t) => t.originalKey)
				.sort()
				.join(',');

			if (currentKeys !== newKeys) {
				setSearchTags(tagValues);
			}
		}
	}, [tagValues]);

	useEffect(() => {
		searchTermRef.current = searchQuery;
	}, [searchQuery]);

	// Update searchTags when formValues change (for date filters and other direct updates)
	useEffect(() => {
		// IMPORTANT: Don't process formValues if we have tagValues from modal
		// This prevents overwriting properly formatted tags
		if (tagValues && tagValues.length > 0) {
			return;
		}

		if (Object.keys(formValues).length > 0) {
			const tags = Object.entries(formValues)
				.filter(
					([_, value]) => value !== '' && value !== undefined && value !== null,
				)
				.map(([key, value]) => {
					let displayLabel = key;
					let displayValue = value;
					let originalKey = key;

					// Map technical keys to user-friendly labels
					const labelMap = {
						// Date fields
						Start: 'Start Date',
						End: 'End Date',
						startDate: 'Start Date',
						endDate: 'End Date',

						// Lead information
						leadName: 'Name',
						leadEmail: 'Email',
						nationality: 'Nationality',
						ip: 'Country Source',
						leadAddress: 'Lead Address',
						leadCampaign: 'Lead Campaign',
						leadSourceDetails: 'Source Content',
						leadSourceMedium: 'Source Medium',
						pageUrl: 'Campaign URL',
						r_u_in_uae: 'Are You in UAE?',
						leadLang: 'Lead Language',
						lastNote: 'Last Note',
						budget: 'Budget',
						timetocall: 'Time To Call',

						// Status fields
						eLeadStatus: 'Main Status',
						leadStatus: 'Status',
						agentAssigned: 'Agent',
						managerAssigned: 'Assigned To Manager',

						// Existing fields
						status: 'Status',
						leadSource: 'Lead Source',
						assignedTo: 'Assigned To',
						priority: 'Priority',
					};

					// Value mappings
					const getDisplayValue = (field, val) => {
						if (field === 'leadStatus') {
							const statusMap = {
								active: 'Interested',
								pending: 'Not Interested',
							};
							return statusMap[val] || val;
						}

						if (field === 'eLeadStatus') {
							const mainStatusMap = {};
							return val === '-1' ? 'No E.Status' : mainStatusMap[val] || val;
						}

						if (field === 'agentAssigned') {
							return val === '-1' ? 'No Agent' : val;
						}

						return val;
					};

					if (key === 'Start' || key === 'startDate') {
						displayLabel = 'Start Date';
						originalKey = 'startDate';
						displayValue = value;
					} else if (key === 'End' || key === 'endDate') {
						displayLabel = 'End Date';
						originalKey = 'endDate';
						displayValue = value;
					} else if (labelMap[key]) {
						displayLabel = labelMap[key];
						displayValue = getDisplayValue(key, value);
					} else {
						// Convert camelCase or snake_case to Title Case
						displayLabel = key
							.replace(/([A-Z])/g, ' $1')
							.replace(/_/g, ' ')
							.replace(/^./, (str) => str.toUpperCase())
							.trim();
						displayValue = getDisplayValue(key, value);
					}

					return {
						key: key,
						label: displayLabel,
						value: displayValue,
						originalKey: originalKey,
						originalValue: value,
					};
				});
			setSearchTags(tags);
		} else if (!tagValues || tagValues.length === 0) {
			setSearchTags([]);
		}
	}, [formValues, tagValues]);

	useEffect(() => {
		setGotoPage(currentPage);
	}, [currentPage, activeTab, pageSize]);

	// Calculate total pages based on totalItems and pageSize
	const totalPagesForTab = Math.max(1, Math.ceil(totalItems / pageSize));
	const startIndex = totalItems > 0 ? (currentPage - 1) * pageSize + 1 : 0;
	const endIndex = Math.min(currentPage * pageSize, totalItems);
	const isSearchActive = !!searchQuery || Object.keys(formValues).length > 0;

	// Pagination handlers
	const handleFirst = () => {
		setCurrentPage(1);
		setGotoPage(1);
	};

	const handlePrevious = () => {
		if (currentPage > 1) {
			setCurrentPage(currentPage - 1);
			setGotoPage(currentPage - 1);
		}
	};

	const handleNext = () => {
		if (currentPage < totalPagesForTab) {
			setCurrentPage(currentPage + 1);
			setGotoPage(currentPage + 1);
		}
	};

	const handleLast = () => {
		setCurrentPage(totalPagesForTab);
		setGotoPage(totalPagesForTab);
	};

	const handleGoToChange = (value) => {
		const numValue = Number(value);
		if (!isNaN(numValue)) {
			setGotoPage(numValue);
		}
	};

	const handleGoToBlur = () => {
		const page = Math.max(1, Math.min(Number(gotoPage) || 1, totalPagesForTab));
		setCurrentPage(page);
		setGotoPage(page);
	};

	const handlePageSizeChange = (event) => {
		if (loading) return;
		const newPageSize = Number(event.target.value);
		onPageSizeChange(newPageSize);
		setCurrentPage(1);
		setGotoPage(1);
	};

	// Handle search from SearchBox
	const handleSearchByName = () => {
		const term = searchTermRef.current.trim();
		setSearchQuery(term);
		setCurrentPage(1);
		setGotoPage(1);
	};

	// Open advanced search modal
	const handleOpenAdvancedSearch = () => {
		setIsAdvanceSearchOpen(true);
	};

	// Handle remove tag
	const removeTag = (tagToRemove) => {
		console.log('Removing tag:', tagToRemove);

		// Determine what we received - could be a string (key) or the full tag object
		let originalKey;
		let originalValue;

		if (typeof tagToRemove === 'string') {
			// If we received a string key, find the full tag object from searchTags
			const fullTag = searchTags.find((tag) => tag.key === tagToRemove);
			if (fullTag) {
				originalKey = fullTag.originalKey;
				originalValue = fullTag.originalValue;
			}
		} else {
			// If we received the full tag object
			originalKey = tagToRemove.originalKey;
			originalValue = tagToRemove.originalValue;
		}

		if (!originalKey) {
			console.error('Could not find originalKey for tag:', tagToRemove);
			return;
		}

		// Filter out the tag to remove from searchTags state
		const updatedTags = searchTags.filter((t) => t.originalKey !== originalKey);
		setSearchTags(updatedTags);

		// IMPORTANT: Also update tagValues prop to keep them in sync
		if (tagValues && tagValues.length > 0) {
			const updatedTagValues = tagValues.filter(
				(t) => t.originalKey !== originalKey,
			);
			setGetTagValues(updatedTagValues);
		}

		// Rebuild form values from remaining tags
		const updatedFormValues = updatedTags.reduce((acc, t) => {
			acc[t.originalKey] = t.originalValue;
			return acc;
		}, {});

		console.log('Updated form values:', updatedFormValues);

		setFormValues(updatedFormValues);
		setCurrentPage(1);
		setGotoPage(1);

		if (Object.keys(updatedFormValues).length === 0 && !searchQuery) {
			clearAdvancedSearch();
		} else {
			fetchAdvancedSearch(updatedFormValues, 1, pageSize);
		}
	};

	const clearAllTags = () => {
		setSearchTags([]);
		setFormValues({});
		setSearchQuery('');
		searchTermRef.current = '';
		setCurrentPage(1);
		setGotoPage(1);

		// IMPORTANT: Clear tagValues prop as well
		if (tagValues && tagValues.length > 0) {
			setGetTagValues([]);
		}

		clearAdvancedSearch();
	};
	// Clear all (both search and advanced)
	const handleClearAll = () => {
		setSearchTags([]);
		setFormValues({});
		setSearchQuery('');
		searchTermRef.current = '';
		setCurrentPage(1);
		setGotoPage(1);
		clearAdvancedSearch();
	};

	const buttonStyle = {
		size: { base: 'xs', sm: 'xs', md: 'sm' },
		borderRadius: 'lg',
		_hover: { shadow: 'sm', transition: 'all 0.2s ease-in-out' },
		_active: { bg: 'softGray.500' },
		sx: { svg: { fill: 'brand.500' } },
		px: { base: 1, sm: 1, md: 2 },
		fontFamily: 'DM Sans',
		fontSize: { base: 'sm', sm: 'xs', md: 'sm' },
	};

	const {
		isOpen: dateTimeIsOpen,
		onOpen: dateTimeOnOpen,
		onClose: dateTimeOnClose,
	} = useDisclosure();

	const dateFilterHandler = (from, to) => {
		dateTimeOnClose();

		const searchValues = {
			Start: formattedDate(from),
			End: formattedDate(to),
		};

		setFormValues(searchValues);
		setCurrentPage(1);
		setGotoPage(1);
		fetchAdvancedSearch({ from, to }, 1, pageSize);
	};

	return (
		<>
			<Box
				width='100%'
				bg='bg.surface'
				color='text.white'
				p={6}
				minHeight='100%'
				boxShadow='card'
				borderRadius='lg'
			>
				<LeadsProgress
					totalLeads={totalItems}
					searchQuery={searchQuery}
					formValues={formValues}
					isSearchActive={isSearchActive}
				/>

				<HStack
					flexDir={{ base: 'column', md: 'row' }}
					alignItems='flex-end'
					mb='2'
				>
					<Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
					<Flex gap='2' ml='auto' justifyContent='center' alignItems='center'>
						{/* <Box
            bg="softGray.100"
            border="1px solid"
            borderColor="softGray.600"
            borderRadius="md"
            p={{ base: 2, md: 3 }}
            minWidth={{ base: "full", lg: "200px" }}
            mt={{ base: 2, lg: 0 }}
          > */}
						<SearchBox
							setAdvanceSearch={handleOpenAdvancedSearch}
							handleSearchByName={handleSearchByName}
							searchTermRef={searchTermRef}
							onClear={handleClearAll}
						/>
						{/* </Box> */}
						<DateFilterButton onClick={dateTimeOnOpen} />
					<RefreshButton
	label="Refresh"
	onClick={() => {
		setCurrentPage(1);
		setGotoPage(1);
	}}
	isLoading={loading}
	isFetching={loading}
	size="sm"
/>
					</Flex>
				</HStack>

				<Box mt={4}>
					<TopPagination
						currentPage={currentPage}
						totalPages={totalPagesForTab}
						totalItems={totalItems}
						itemsPerPage={pageSize}
						refetching={loading}
						loading={loading}
						onPageChange={(page) => {
							setCurrentPage(page);
							setGotoPage(page);
							// fetchLeads(page);
						}}
						handlePageSize={(size) => {
							setPageSize(size);
							// fetchLeads(1, size);
						}}
						maximumPageSize={100}
					/>
				</Box>

				{/* <Flex
          flexDirection={{ base: "column", lg: "row" }}
          justifyContent="space-between"
          flexWrap="wrap"
          alignItems="center"
          width="full"
          gap="2"
        >
          <HStack
            spacing={3}
            p={2}
            gap="2"
            flex="1"
            flexDirection={{ base: "row", md: "row", lg: "row" }}
            flexWrap="wrap"
            bg="softGray.50"
            borderRadius="md"
            align="center"
            justifyContent={{
              base: "center",
              md: "space-between",
              lg: "space-between",
            }}
            width="100%"
            maxWidth="100%"
            fontSize={leadValueFontSize}
          >
            <HStack flexDirection="row" flexWrap="wrap" justifyContent="center">
              <Button
                {...buttonStyle}
                onClick={handleFirst}
                isDisabled={loading || currentPage === 1}
                variant="solid"
                bg="softGray.600"
                color="black"
                py="1"
                px="3"
                leftIcon={
                  <IoPlaySkipForwardSharp
                    style={{ transform: "rotate(180deg)" }}
                  />
                }
                aria-label="First Page"
              >
                First
              </Button>

              <Button
                {...buttonStyle}
                onClick={handlePrevious}
                isDisabled={loading || currentPage === 1}
                variant="solid"
                py="1"
                px="3"
                bg="softGray.600"
                color="black"
                leftIcon={<FaPlay style={{ transform: "rotate(180deg)" }} />}
                aria-label="Previous Page"
              >
                Previous
              </Button>
            </HStack>

            <HStack fontWeight="medium" color="gray.800" spacing={1}>
              <Text fontSize="12px">Go to</Text>
              <NumberInput
                value={gotoPage}
                onChange={handleGoToChange}
                onBlur={handleGoToBlur}
                min={1}
                max={totalPagesForTab}
                size="sm"
                borderRadius="md"
                width="5rem"
                bg="softGray.50"
                border="1px solid softGray.600"
                allowMouseWheel={false}
                clampValueOnBlur={false}
                isDisabled={loading}
              >
                <NumberInputField
                  aria-label="Go to page"
                  textAlign="center"
                  borderRadius="md"
                  onKeyDown={(e) => e.key === "Enter" && handleGoToBlur()}
                  border="2px solid"
                  borderColor="softGray.600"
                  _focus={{
                    outline: "none",
                    bg: "softGray.50",
                    border: "1px solid",
                    borderColor: "brand.500",
                  }}
                  _active={{ bg: "softGray.400" }}
                  isDisabled={loading}
                />
              </NumberInput>
              <Text>of {totalPagesForTab.toLocaleString()}</Text>
            </HStack>

            <Text color="gray.800" fontSize="12px">
              Showing {startIndex.toLocaleString()} -{" "}
              {endIndex.toLocaleString()} of {totalItems.toLocaleString()}
            </Text>
            <HStack flexDirection="row" flexWrap="wrap" justifyContent="center">
              <Select
                size="sm"
                w={{ base: "32" }}
                value={pageSize}
                color="gray.800"
                bg="softGray.400"
                borderRadius="md"
                border="2px solid"
                _focus={{ boxShadow: "0 0 0 1px softGray.500" }}
                onChange={(e) => {
                  onPageSizeChange(Number(e.target.value));
                }}
                isDisabled={loading}
              >
                {[25, 50, 80, 100].map((size) => (
                  <option key={size} value={size}>
                    Show {size}
                  </option>
                ))}
              </Select>

              <Button
                {...buttonStyle}
                onClick={handleNext}
                isDisabled={loading || currentPage === totalPagesForTab}
                variant="solid"
                bg="softGray.600"
                py="1"
                px="3"
                color="black"
                rightIcon={<FaPlay />}
                aria-label="Next Page"
              >
                Next
              </Button>

              <Button
                {...buttonStyle}
                onClick={handleLast}
                isDisabled={loading || currentPage === totalPagesForTab}
                variant="solid"
                bg="softGray.600"
                color="black"
                py="1"
                px="3"
                rightIcon={<IoPlaySkipForwardSharp />}
                aria-label="Last Page"
              >
                Last
              </Button>
            </HStack>
          </HStack>


        </Flex> */}

				{/* Search Tags - Show when there are active filters */}
				{(searchTags.length > 0 || searchQuery) && (
					<SearchTags
						removeTag={removeTag}
						searchTags={searchTags}
						clearAllTags={clearAllTags}
					/>
				)}

				<Divider borderColor='#E7E7E7' my={4} borderWidth='1.5px' />

				<Box mt={4} flex='1' overflow='auto' fontFamily='DM Sans'>
					<TabContent
						activeTab={activeTab}
						leadsdata={leads}
						loading={loading || !leads}
						approveChangeHandler={approveChangeHandler}
						pageSize={pageSize}
					/>
				</Box>
			</Box>

			{/* Advanced Search Modal - Pass correct props */}
			<AdvancedSearchModal
				setAdvaceSearch={setIsAdvanceSearchOpen}
				advaceSearch={isAdvanceSearchOpen}
				isLoading={loading}
				fetchAdvancedSearch={fetchAdvancedSearch}
				setSearchClear={setSearchClear}
				setFormValues={setFormValues}
				isFormReset={isFormReset}
				setIsFormReset={setIsFormReset}
				pageSize={pageSize}
				setGetTagValues={setGetTagValues}
			/>

			{/* Date time filter */}
			{dateTimeIsOpen && (
				<DateFilter
					onClose={dateTimeOnClose}
					isOpen={dateTimeIsOpen}
					dateFitlerHanlder={dateFilterHandler}
				/>
			)}
		</>
	);
};

export default Pagination;
