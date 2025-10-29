import React, { useState } from 'react';
import {
	Flex,
	Box,
	Text,
	Stack,
	useDisclosure,
	Tooltip,
} from '@chakra-ui/react';
import TopPagination from 'components/pagination/TopPagination';
import CustomDatePicker from 'components/datetime/CustomDatePicker';
import DateFilterButton from 'views/admin/lead-v2/components/DateFilterButton';
import DateFilter from './FilterComponent/DateFilter';
import { formatDNS } from 'utils/helpers';
import SearchTags from 'components/search/SearchTags';
import ViewToggle from 'components/toggle/ViewToggle';

const FilterSearch = ({
	currentPage,
	totalPages,
	onPageChange,
	totalItems,
	pageSize,
	setPageSize,
	handlePageSizeChange,
	isLoading,
	startDate,
	endDate,
	setStartDate,
	setEndDate,
	setSearchTags,
	searchTags,
	view,
	handleViewChange,
}) => {
	const [openCalendar, setOpenCalendar] = useState(null);
	const [forceTooltip, setForceTooltip] = useState(false);

	const toggleCalendar = (calendar) => {
		setOpenCalendar((prev) => (prev === calendar ? null : calendar));
	};

	// const dateTimeOnOpen = (data) => {
	// 	console.log(data);
	// };
	const {
		isOpen: isModalOpen,
		onOpen: openModal,
		onClose: closeModal,
	} = useDisclosure();

	const showTooltipBriefly = () => {
		setForceTooltip(true);
		setTimeout(() => setForceTooltip(false), 1500);
	};

	const handleModalClose = () => {
		closeModal();
		showTooltipBriefly();
	};

	const handleApply = ({ from, to }) => {
		setSearchTags([`Start: ${formatDNS(from)}`, `End: ${formatDNS(to)}`]);
		setStartDate(from);
		setEndDate(to);
		handleModalClose();
		onPageChange(1);
	};

	const handleClear = () => {
		setStartDate(null);
		setEndDate(null);
		setSearchTags(null);
	};

	return (
		<Box>
			<Flex
				justifyContent='space-between'
				alignItems={{ base: 'normal', sm: 'normal', md: 'center' }}
				p={3}
				flexDir={{ base: 'column', sm: 'column', md: 'row' }}
			>
				<Text fontSize='20px' fontWeight='bold' color='black' p={3}>
					All Surveys
				</Text>

				<Box
					gap={2}
					display='flex'
					alignItems='center'
					flexDir={{ base: 'column', sm: 'column', md: 'row' }}
					justifyContent={{ base: 'center', sm: 'center', md: 'normal' }}
				>
					<DateFilterButton onClick={openModal} isForceOpen={forceTooltip} />
					<ViewToggle
						view={view}
						handleView={handleViewChange}
						moduleView='surveysView'
					/>
					{isModalOpen && (
						<DateFilter
							isOpen={isModalOpen}
							onClose={handleModalClose}
							dateFitlerHanlder={handleApply}
						/>
					)}
				</Box>
			</Flex>
			<Flex
				justifyContent='space-between'
				my={2}
				alignItems={'center'}
				flexDir={{ base: 'column', sm: 'column', md: 'row' }}
			>
				{searchTags && <SearchTags searchTags={searchTags} />}
				{/* Clear Button */}
				{(endDate || startDate) && (
					<Box>
						<Text
							as='button'
							fontSize='sm'
							color='red.500'
							fontWeight='medium'
							borderColor='red.500'
							borderWidth='1px'
							px={3}
							py={1}
							borderRadius='full'
							_hover={{ bg: 'red.50' }}
						>
							Clear
						</Text>
					</Box>
				)}
			</Flex>
			<Box
				width={{ base: '100%', md: 'auto' }}
				display='flex'
				justifyContent={{ base: 'center', md: 'flex-start' }}
			>
				<TopPagination
					currentPage={currentPage}
					totalPages={totalPages}
					onPageChange={onPageChange}
					totalItems={totalItems}
					itemsPerPage={pageSize}
					setPageSize={setPageSize}
					handlePageSize={handlePageSizeChange}
					refetching={isLoading}
					loading={isLoading}
				/>
			</Box>
		</Box>
	);
};

export default FilterSearch;
