import {
	Box,
	Button,
	Flex,
	HStack,
	Text,
	useDisclosure,
} from '@chakra-ui/react';
import { useMemo, useState } from 'react';
import { FaPlus, FaSearch } from 'react-icons/fa';
import TopPagination from 'components/pagination/TopPagination';
import DateFilter from 'views/admin/attendance/components/DateFilter';
import { FiFilter } from 'react-icons/fi';
import { buttonStyle } from 'utils/btn';
import { BiX } from 'react-icons/bi';
import CountUpComponent from 'components/countUpComponent/countUpComponent';
import { useFetchUsers } from './hooks/useFetchUsers';
import UserTable from './components/UserTable';
import SearchBox from '../payroll/components/SearchBox';
import UserModal from './components/AddUserModal';

const User = () => {
	const {
		isAgenciesAllowed,
		agencies,
		queryParams,
		data,
		totalPages,
		totalRecords,
		agencyId,
		setAgencyId,
		isLoading,
		isFetching,
		handlePageChange,
		handlePageSize,
		onDateFilterChange,
		updateData,
		filters,
		setFilters,
		setPagination,
	} = useFetchUsers();

	console.log({ user: data?.[5] });

	const selectedAgency = useMemo(
		() => agencies.find((a) => a._id === agencyId) || null,
		[agencies, agencyId]
	);

	const [clearFilters, setClearFilters] = useState(false);
	const [selectedUser, setSelectedUser] = useState(null);
	const [searchTerm, setSearchTerm] = useState('');
	const [modalMode, setModalMode] = useState('add');

	const {
		isOpen: agencyFilterIsOpen,
		onOpen: agencyFilterOnOpen,
		onClose: agencyFilterOnClose,
	} = useDisclosure();

	const {
		isOpen: userIsOpen,
		onClose: userOnClose,
		onOpen: userOpen,
	} = useDisclosure();

	const handleAddUser = () => {
		setModalMode('add');
		setSelectedUser(null);
		userOpen();
	};

	const handleEditUser = (user) => {
		console.log({ user });
		setModalMode('edit');
		setSelectedUser(user);
		userOpen();
	};

	const handleAgencyFilter = (value) => {
		setAgencyId(value);

		if (value) {
			setClearFilters(true);
			setPagination((prev) => ({ ...prev, page: 1 }));
		} else setClearFilters(false);
	};

	const handleClear = () => {
		setClearFilters(false);
		setAgencyId(null);
		setPagination((prev) => ({ ...prev, page: 1 }));
	};

	const handleSearchTermChange = (searchQuery) => {
		const trimmed = searchQuery?.trim() || '';

		if (trimmed !== '') {
			setFilters((prev) => ({
				...prev,
				search: trimmed,
			}));
			setClearFilters(true);
			setPagination((prev) => ({ ...prev, page: 1 }));
		} else {
			// remove search key from filters
			setFilters((prev) => {
				const updated = { ...prev };
				delete updated.search;
				return updated;
			});
			setPagination((prev) => ({ ...prev, page: 1 }));
			setClearFilters(false);
		}
	};

	return (
		<Box p={6} bg='white' borderRadius='md' boxShadow='sm'>
			<Flex
				flexDir={{ base: 'column', md: 'row' }}
				justify='space-between'
				align='center'
				mb={4}
			>
				<Flex alignSelf='flex-start' fontSize='lg' fontWeight='bold' gap='2'>
					<Text>{selectedAgency?.name || 'All '} Users</Text>

					<CountUpComponent key={totalRecords} targetNumber={totalRecords} />
				</Flex>

				<HStack gap='2' alignItems='center'>
					{/* {isAgenciesAllowed && (
						<IconButton
							icon={<FiFilter />}
							onClick={agencyFilterOnOpen}
							aria-label='Filter agency'
							colorScheme='brand'
							variant='solid'
							size='sm'
							borderRadius='full'
							boxShadow='md'
						/>
					)} */}

					{/* Search + Filters Row */}
					<Flex
						justify={{ base: 'flex-start', md: 'flex-end' }}
						align='center'
						mb={2}
						gap={3}
						flexWrap='wrap'
					>
						{/* Search Input */}
						<SearchBox
							onSearchTermChange={handleSearchTermChange}
							setSearchTerm={setSearchTerm}
							searchTerm={searchTerm}
						/>

						<Button
							leftIcon={<FaPlus size={14} />}
							bg='gray.50'
							color='gray.800'
							border='1px solid #D0D5DD'
							size='md'
							borderRadius='12px'
							fontWeight='600'
							px={5}
							mt={{ base: 2, md: 0 }} // spacing on mobile
							_hover={{ bg: 'gray.100' }}
							boxShadow='0px 1px 3px rgba(0,0,0,0.08)'
							onClick={handleAddUser}
						>
							New User
						</Button>
						{/* Filter Toggle Button */}
						{/* <Button
							leftIcon={<FiFilter />}
							bg={showFilters ? 'gray.100' : 'gray.50'}
							border='1px solid #D0D5DD'
							color='gray.800'
							borderRadius='12px'
							fontWeight='600'
							px={4}
							_hover={{ bg: showFilters ? 'gray.200' : 'gray.100' }}
							boxShadow={
								showFilters
									? '0 2px 6px rgba(0,0,0,0.08)'
									: '0px 1px 3px rgba(0,0,0,0.08)'
							}
							onClick={() => setShowFilters((prev) => !prev)}
							mt={{ base: 2, md: 0 }} // spacing on mobile
						>
							Filters
						</Button> */}
					</Flex>

					{clearFilters && (
						<Button
							{...buttonStyle}
							variant='solid'
							bg='softGray.100'
							w='fit-content'
							color='gray.800'
							sx={{
								svg: {
									fill: 'gray.800',
								},
							}}
							_active={{ bg: 'gray.200' }}
							leftIcon={<BiX />}
							aria-label='Clear'
							onClick={handleClear}
						>
							Clear
						</Button>
					)}
				</HStack>
			</Flex>

			{!isLoading && (
				<TopPagination
					currentPage={queryParams.page}
					totalPages={totalPages}
					onPageChange={handlePageChange}
					totalItems={totalRecords}
					itemsPerPage={queryParams.limit}
					refetching={isFetching}
					loading={isLoading}
					handlePageSize={handlePageSize}
				/>
			)}

			<UserTable
				data={data || []}
				updateData={updateData}
				handleEditUser={handleEditUser}
				isLoading={isLoading || isFetching}
			/>

			{/* {viewBalance?.modal && (
				<ViewBalance
					data={viewBalance.data}
					isOpen={viewBalance.modal}
					onClose={() => setViewBalance({ modal: false, data: null })}
				/>
			)} */}

			{userIsOpen && (
				<UserModal
					isOpen={userIsOpen}
					onClose={userOnClose}
					mode={modalMode}
					userData={selectedUser}
					agencies={agencies}
					updateData={updateData}
				/>
			)}

			{/* {userIsOpen && (
				<UpsertIncomingBalance
					isOpen={userIsOpen}
					onClose={userOnClose}
					initialData={editData}
					updateData={updateData}
					mode='Add'
					selectedMonth={month}
					selectedYear={year}
					isAgenciesAllowed={isAgenciesAllowed}
				/>
			)} */}

			{/* {agencyFilterIsOpen && (
				<AgencyFilterModal
					isOpen={agencyFilterIsOpen}
					onClose={agencyFilterOnClose}
					handleFilter={handleAgencyFilter}
					storeKey='outgoingAgency'
				/>
			)} */}
		</Box>
	);
};

export default User;
