import {
	Box,
	Button,
	Flex,
	HStack,
	IconButton,
	Text,
	useDisclosure,
} from '@chakra-ui/react';
import { useMemo, useState } from 'react';
import { FaEdit, FaPlus, FaUsers } from 'react-icons/fa';
import TopPagination from 'components/pagination/TopPagination';
import { buttonStyle } from 'utils/btn';
import { BiX } from 'react-icons/bi';
import CountUpComponent from 'components/countUpComponent/countUpComponent';
import { useLeadSettings } from './useLeadSettings';
import UserLeadLimitTable from './UserLeadLimitTable';
import AddUserLeadLimit from './AddUserLeadLimit';
import LeadLimitModal from './LeadSettingModal';

const UserLeadLimit = () => {
	const {
		queryParams,
		data,
		leadSettings,
		refreshLeadSettings,
		totalPages,
		totalRecords,
		setAgencyId,
		isLoading,
		isFetching,
		handlePageChange,
		handlePageSize,
		updateData,
		setPagination,
		removeItem,
	} = useLeadSettings();

	const [clearFilters, setClearFilters] = useState(false);
	const {
		isOpen: leadLimitIsOpen,
		onClose: leadLimitOnClose,
		onOpen: leadLimitOpen,
	} = useDisclosure();
	const {
		isOpen: defaultLimitIsOpen,
		onClose: defaultLimitOnClose,
		onOpen: defaultLimitOpen,
	} = useDisclosure();

	const [editData, setEditData] = useState(null);

	const handleOpenAdd = () => {
		setEditData(null);
		leadLimitOpen();
	};

	const handleOpenEdit = (leadLimit) => {
		setEditData(leadLimit);
		leadLimitOpen();
	};

	const handleClear = () => {
		setClearFilters(false);
		setAgencyId(null);
		setPagination((prev) => ({ ...prev, page: 1 }));
	};

	return (
		<Box p={6} bg='white' borderRadius='md' boxShadow='sm'>
			<Box
				bg='white'
				border='1px solid'
				borderColor='gray.200'
				borderRadius='lg'
				p={{ base: 4, md: 6 }}
				mb={6}
				boxShadow='sm'
			>
				<Flex
					align={{ base: 'flex-start', md: 'center' }}
					justify='space-between'
					flexDirection={{ base: 'column', md: 'row' }}
					gap={{ base: 4, md: 0 }}
					w='full'
				>
					{/* Left: Icon + Info */}
					<Flex align='center' gap={4}>
						{/* Icon with circle + shadow */}
						<Box
							bg='brand.500'
							color='white'
							p={3}
							borderRadius='full'
							boxShadow='md'
							display='flex'
							alignItems='center'
							justifyContent='center'
						>
							<FaUsers size={20} />
						</Box>

						{/* Text info */}
						<Box>
							<Text
								fontSize={{ base: 'sm', md: 'md' }}
								color='gray.600'
								fontWeight='500'
							>
								Default Lead Limit
							</Text>
							<Text
								fontSize={{ base: 'md', md: 'lg', lg: 'xl' }}
								fontWeight='bold'
								lineHeight='1.2'
								color='gray.800'
							>
								{leadSettings?.agentLeadLimit ?? 0}
							</Text>
							<Text fontSize={{ base: 'xs', md: 'sm' }} color='gray.500' mt={1}>
								This value is applied when a user does not have a custom lead
								limit.
							</Text>
						</Box>
					</Flex>

					{/* Right: Edit button */}
					<IconButton
						icon={<FaEdit />}
						size='md'
						colorScheme='brand'
						variant='outline'
						borderColor='gray.300'
						aria-label='Edit default lead limit'
						alignSelf={{ base: 'flex-start', md: 'center' }}
						_hover={{ bg: 'brand.50' }}
						onClick={defaultLimitOpen}
					/>
				</Flex>
			</Box>

			<Flex
				flexDir={{ base: 'column', md: 'row' }}
				justify='space-between'
				align='center'
				mb={4}
			>
				<Flex alignSelf='flex-start' fontSize='lg' fontWeight='bold' gap='2'>
					<Text>User Lead Limits</Text>

					<CountUpComponent key={totalRecords} targetNumber={totalRecords} />
				</Flex>

				<HStack gap='2' alignItems='center'>
					<Button
						alignSelf='flex-end'
						leftIcon={<FaPlus size='1em' />}
						colorScheme='brand'
						size='sm'
						rounded='md'
						px={4}
						shadow='md'
						onClick={handleOpenAdd}
					>
						Add User Limit
					</Button>

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

			<UserLeadLimitTable
				data={data || []}
				updateData={updateData}
				removeItem={removeItem}
				handleOpenEdit={handleOpenEdit}
				isLoading={isLoading || isFetching}
			/>

			{leadLimitIsOpen && (
				<AddUserLeadLimit
					isOpen={leadLimitIsOpen}
					onClose={leadLimitOnClose}
					initialData={editData}
					onSuccess={updateData}
				/>
			)}

			{/* Modal */}
			{defaultLimitIsOpen && (
				<LeadLimitModal
					isOpen={defaultLimitIsOpen}
					onClose={defaultLimitOnClose}
					defaultLeadLimit={leadSettings?.agentLeadLimit}
					onSuccess={refreshLeadSettings}
				/>
			)}
		</Box>
	);
};

export default UserLeadLimit;
