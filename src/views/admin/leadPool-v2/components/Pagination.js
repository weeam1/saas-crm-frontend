import React, { useState, useEffect } from 'react';
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
} from '@chakra-ui/react';
import { FaPlay } from 'react-icons/fa';
import { IoPlaySkipForwardSharp } from 'react-icons/io5';
import SearchBox from './Search';
import Tabs from './Tabs';
import TabContent from './TabContent';
import LeadsProgress from './LeadProgress';
import { CloseIcon } from '@chakra-ui/icons';
import DateFilterButton from './DateFilterButton';
import DateFilter from './DateFilter';
import { formattedDate } from 'utils/helpers';

const Pagination = ({
	data,
	totalPages,
	totalLeads,
	isLoading,
	hasFetched,
	fetchData,
	fetchSearchedData,
	fetchAdvancedSearch,
	setCurrentState,
	currentState,
	pageSize,
	userData,
	user,
	dateTime,
	activeTab,
	setActiveTab,
	currentPage,
	setCurrentPage,
	setPageSize,
	setData,
	setTotalPages,
	setTotalLeads,
	setIsLoading,
	displaySearchData,
	setDisplaySearchData,
	setDisplayAdvSearchData,
	displayAdvSearchData,
	sendRequest,
	cancelRequest,
	buyLoading,
	isPurchasing,
	isCancelling,
	setDateTime,
}) => {
	const [gotoPage, setGotoPage] = useState(currentPage || 1);
	const [searchTerm, setSearchTerm] = useState('');
	const [tags, setTags] = useState([]);
	const [queryData, setQueryData] = useState([]);

	const generatePageOptions = (totalLeads, pageSize) => {
		const maxAllowed = 100;
		const baseOptions = [10, 20, 50, 100];
		const intermediateSteps = [20, 40, 60, 80];

		// Always include these:
		const options = new Set([
			...baseOptions,
			pageSize, // current page size must always be available
			...intermediateSteps.filter((step) => step <= totalLeads),
			Math.min(totalLeads, maxAllowed), // cap at maxAllowed
		]);

		// Convert to array and sort
		return Array.from(options)
			.filter((size) => size <= totalLeads || size === pageSize)
			.sort((a, b) => a - b);
	};

	const pageSizeOptions = generatePageOptions(totalLeads, pageSize);

	useEffect(() => {
		if (!data && !isLoading && hasFetched) {
			setIsLoading(true);
			fetchData(activeTab || 'Buy Leads', currentPage || 1, pageSize || 50);
		}
	}, [
		data,
		isLoading,
		fetchData,
		activeTab,
		currentPage,
		pageSize,
		setIsLoading,
		hasFetched,
	]);

	useEffect(() => {
		setGotoPage(currentPage);
	}, [currentPage]);

	const startIndex = totalLeads > 0 ? (currentPage - 1) * pageSize + 1 : 0;
	const endIndex = Math.min(currentPage * pageSize, totalLeads);
	const totalPagesForTab = Math.max(1, Math.ceil(totalLeads / pageSize));

	const fetchLeads = (page, size = pageSize) => {
		try {
			setIsLoading(true);

			if (displayAdvSearchData) {
				fetchAdvancedSearch(queryData, page, size);
			} else if (displaySearchData) {
				fetchSearchedData(searchTerm, page, size);
			} else {
				fetchData(activeTab, page, size);
			}
		} catch (error) {
			console.error('Navigation error:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleNavigation = async (page, func) => {
		if (isLoading) return;
		setIsLoading(true);
		setCurrentPage(page);
		setGotoPage(page);
		try {
			await func();
		} catch (error) {
			console.error('Navigation error:', error);
		} finally {
			setIsLoading(false);
		}
	};

	// Pagination handlers
	const handleFirst = () => {
		setCurrentPage(1);
		setGotoPage(1);
		fetchLeads(1);
	};

	const handlePrevious = () => {
		if (currentPage > 1) {
			setCurrentPage(currentPage - 1);
			setGotoPage(currentPage - 1);
			fetchLeads(currentPage - 1);
		}
	};

	const handleNext = () => {
		if (currentPage < totalPagesForTab) {
			setCurrentPage(currentPage + 1);
			setGotoPage(currentPage + 1);
			fetchLeads(currentPage + 1);
		}
	};

	const handleLast = () => {
		setCurrentPage(totalPagesForTab);
		setGotoPage(totalPagesForTab);
		fetchLeads(totalPagesForTab);
	};

	const handleGoToChange = (value) => {
		const numValue = Number(value);

		if (numValue <= (totalPages ?? 999999999)) {
			setGotoPage(value);
			// fetchLeads(numValue);
		}
	};

	const handleGoToBlur = () => {
		// setCurrentPage(page);

		const page = Math.max(1, Math.min(Number(gotoPage) || 1, totalPages));
		setGotoPage(page);
		fetchLeads(page);
	};

	const handlePageSizeChange = (event) => {
		if (isLoading) return;
		const newPageSize = Number(event.target.value);
		setPageSize(newPageSize);
		fetchLeads(1, newPageSize);
	};

	const handleClearSearch = () => {
		if (isLoading) return;
		// setData([]);
		setTotalPages(0);
		setSearchTerm('');
		setTotalLeads(0);
		setDisplaySearchData(false);
		setDisplayAdvSearchData(false);
		setQueryData([]);
		setTags([]);
		setCurrentPage(1);
		setDateTime('');
		setPageSize(50);
		setActiveTab('Buy Leads');
		handleNavigation(1, () => fetchData('Buy Leads', 1, 50));
		fetchLeads(1);
	};

	const buttonStyle = {
		size: 'sm',
		borderRadius: 'lg',
		_hover: { shadow: 'sm', transition: 'all 0.2s ease-in-out' },
		_active: { bg: 'softGray.500' },
		sx: { svg: { fill: 'brand.500' } },
		fontFamily: 'DM Sans',
		fontSize: { base: 'xs', md: 'sm', lg: '14px' },
	};

	const {
		isOpen: dateTimeIsOpen,
		onOpen: dateTimeOnOpen,
		onClose: dateTimeOnClose,
	} = useDisclosure();

	const dateFitlerHanlder = (from, to) => {
		setIsLoading(true);
		dateTimeOnClose();
		// const dateTime = from && to ? `${from}|${to}` : from || to;

		const searchValues = [
			`Start: ${formattedDate(from)}`,
			`End: ${formattedDate(to)}`,
		];
		setSearchTerm('');
		setTags(searchValues);
		setQueryData({ from, to });
		fetchAdvancedSearch({ from, to }, 1, pageSize);
		setDisplaySearchData(true);
	};

	return (
		<>
			<Box width='100%' bg='white' p={5} borderRadius='10px'>
				<LeadsProgress totalLeads={totalLeads} userData={userData} />
				<HStack
					flexDir={{ base: 'column', md: 'row' }}
					alignItems='flex-end'
					mb='2'
				>
					<Tabs
						userData={userData}
						activeTab={activeTab}
						setActiveTab={(tab) => {
							if (tab !== activeTab && !isLoading) {
								setData([]);
								setActiveTab(tab);
								setCurrentPage(1);
								setDisplaySearchData(false);
								handleNavigation(1, () => fetchData(tab, 1, pageSize));
							}
						}}
						isLoading={isLoading}
					/>
					<DateFilterButton onClick={dateTimeOnOpen} />
				</HStack>

				<Flex
					direction={{ base: 'column', lg: 'row' }}
					justifyContent='space-between'
					alignItems='center'
					gap={3}
					width='100%'
					flexWrap='wrap'
				>
					<Box
						bg='softGray.50'
						border='1px solid'
						borderColor='softGray.600'
						borderRadius='md'
						p={{ base: 1, md: 2 }}
						flex='1'
						minWidth={{ base: '100%', lg: '300px' }}
						overflow='auto'
						fontFamily='DM Sans'
					>
						<HStack
							spacing={3}
							p={2}
							gap='2'
							flexDirection={{ base: 'row', md: 'row', lg: 'row' }}
							flexWrap='wrap'
							bg='softGray.50'
							borderRadius='md'
							align='center'
							justifyContent={{
								base: 'center',
								md: 'space-between',
								lg: 'space-between',
							}}
							width='100%'
							maxWidth='100%'
						>
							<HStack
								flexDirection='row'
								flexWrap='wrap'
								justifyContent='center'
							>
								<Button
									{...buttonStyle}
									onClick={handleFirst}
									isDisabled={isLoading || currentPage === 1}
									variant='solid'
									bg='softGray.600'
									color='black'
									py='1'
									px='3'
									leftIcon={
										<IoPlaySkipForwardSharp
											style={{ transform: 'rotate(180deg)' }}
										/>
									}
									aria-label='First Page'
								>
									First
								</Button>

								<Button
									{...buttonStyle}
									onClick={handlePrevious}
									isDisabled={isLoading || currentPage === 1}
									variant='solid'
									bg='softGray.600'
									color='black'
									py='1'
									px='3'
									leftIcon={<FaPlay style={{ transform: 'rotate(180deg)' }} />}
									aria-label='Previous Page'
								>
									Previous
								</Button>
							</HStack>

							<HStack fontWeight='medium' color='gray.800' spacing={1}>
								<Text fontSize='12px'>Go to</Text>
								<NumberInput
									value={gotoPage ?? 1}
									onChange={handleGoToChange}
									onBlur={handleGoToBlur}
									min={1}
									max={totalPages}
									size='sm'
									borderRadius='md'
									width='5rem'
									bg='softGray.50'
									border='1px solid softGray.600'
									allowMouseWheel={false}
									clampValueOnBlur={false}
									isDisabled={isLoading}
								>
									<NumberInputField
										aria-label='Go to page'
										textAlign='center'
										borderRadius='md'
										onKeyDown={(e) => e.key === 'Enter' && handleGoToBlur()}
										border='2px solid'
										borderColor='softGray.600'
										_focus={{
											outline: 'none',
											bg: 'softGray.50',
											border: '1px solid',
											borderColor: 'brand.500',
										}}
										_active={{ bg: 'softGray.400' }}
										isDisabled={isLoading}
									/>
								</NumberInput>
								<Text fontSize='12px'>
									of {totalPagesForTab.toLocaleString()}
								</Text>
							</HStack>

							<Text color='gray.800' fontWeight='medium' fontSize='12px'>
								Showing {startIndex.toLocaleString()} -{' '}
								{endIndex.toLocaleString()} of {totalLeads.toLocaleString()}
							</Text>

							<HStack
								flexDirection='row'
								flexWrap='wrap'
								justifyContent='center'
							>
								<Select
									size='sm'
									w={{ base: '32' }}
									value={pageSize}
									color='gray.800'
									bg='softGray.400'
									borderRadius='md'
									border='2px solid'
									_focus={{ boxShadow: '0 0 0 1px softGray.500' }}
									onChange={handlePageSizeChange}
									isDisabled={isLoading || totalLeads === 0}
								>
									{pageSizeOptions.map((size) => (
										<option key={size} value={size}>
											Show {size}
										</option>
									))}
								</Select>

								<Button
									{...buttonStyle}
									onClick={handleNext}
									isDisabled={isLoading || currentPage >= totalPagesForTab}
									variant='solid'
									bg='softGray.600'
									color='black'
									py='1'
									px='3'
									rightIcon={<FaPlay />}
									aria-label='Next Page'
								>
									Next
								</Button>

								<Button
									{...buttonStyle}
									onClick={handleLast}
									isDisabled={isLoading || currentPage >= totalPagesForTab}
									variant='solid'
									bg='softGray.600'
									color='black'
									py='1'
									px='3'
									rightIcon={<IoPlaySkipForwardSharp />}
									aria-label='Last Page'
								>
									Last
								</Button>
							</HStack>
						</HStack>
					</Box>

					<Box
						bg='softGray.50'
						border='1px solid'
						borderColor='softGray.600'
						borderRadius='md'
						p={{ base: 2, md: 3 }}
						flex='1'
						minWidth={{ base: '100%', lg: '200px' }}
						maxWidth={{ lg: '470px' }}
						mt={{ base: 2, lg: 0 }}
					>
						<SearchBox
							fetchSearchedData={fetchSearchedData}
							fetchAdvancedSearch={fetchAdvancedSearch}
							pageSize={pageSize}
							setData={setData}
							setTotalPages={setTotalPages}
							setTotalLeads={setTotalLeads}
							setIsLoading={setIsLoading}
							setDisplaySearchData={setDisplaySearchData}
							onClearSearch={handleClearSearch}
							isLoading={isLoading}
							setSearchTerm={setSearchTerm}
							setTags={setTags}
							searchTerm={searchTerm}
							setDateTime={setDateTime}
							setQueryData={setQueryData}
						/>
					</Box>
				</Flex>

				{displaySearchData && (
					<Flex justifyContent='space-between' alignItems='center' p={3}>
						<HStack spacing={2}>
							<Text
								fontFamily='DM Sans'
								fontSize={{ base: 'sm', md: 'md', lg: '14px' }}
								fontWeight='medium'
								color='gray.800'
							>
								Lead Search:
							</Text>
							<Text
								fontFamily='DM Sans'
								fontSize={{ base: 'xs', md: 'sm', lg: '14px' }}
								color='gray.600'
							>
								{searchTerm ||
									(tags.length > 0 ? tags.join(', ') : 'No filters applied')}
							</Text>
						</HStack>
						<Button
							bg='#f56565'
							color='white'
							w='80px'
							h='35px'
							borderRadius='5px'
							_hover={{
								bg: '#e53e3e',
							}}
							fontWeight='normal'
							variant='solid'
							size='sm'
							onClick={handleClearSearch}
							isDisabled={isLoading}
							fontFamily='DM Sans'
							fontSize={{ base: 'xs', md: 'sm', lg: '14px' }}
							display='flex'
							alignItems='center'
							justifyContent='center'
							lineHeight='1'
						>
							<CloseIcon fontSize='9px' color='white' mr={2} />
							Clear
						</Button>
					</Flex>
				)}

				<Divider borderColor='#E7E7E7' my={4} />
				<TabContent
					activeTab={activeTab}
					data={data || []}
					isLoading={isLoading}
					hasFetched={hasFetched}
					userData={userData}
					pageSize={pageSize}
					sendRequest={sendRequest}
					cancelRequest={cancelRequest}
					buyLoading={buyLoading}
					displaySearchData={displaySearchData}
					isPurchasing={isPurchasing}
					isCancelling={isCancelling}
				/>
			</Box>

			{/* Date time filter */}
			{dateTimeIsOpen && (
				<DateFilter
					onClose={dateTimeOnClose}
					isOpen={dateTimeIsOpen}
					setRefetchLoading={setIsLoading}
					dateFitlerHanlder={dateFitlerHanlder}
				/>
			)}
		</>
	);
};

export default Pagination;
