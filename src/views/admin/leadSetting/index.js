// import {
// 	Box,
// 	Button,
// 	Flex,
// 	HStack,
// 	IconButton,
// 	Text,
// 	useDisclosure,
// } from '@chakra-ui/react';
// import { useMemo, useState } from 'react';
// import { FaEdit, FaPlus, FaUsers } from 'react-icons/fa';
// import TopPagination from 'components/pagination/TopPagination';
// import { buttonStyle } from 'utils/btn';
// import { BiX } from 'react-icons/bi';
// import CountUpComponent from 'components/countUpComponent/countUpComponent';
// import { useLeadSettings } from './useLeadSettings';
// import UserLeadLimitTable from './UserLeadLimitTable';
// import AddUserLeadLimit from './AddUserLeadLimit';
// import LeadLimitModal from './LeadSettingModal';
// import { FiChevronLeft } from 'react-icons/fi';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import { useUpdateItemMutation } from 'api/apiSlice';
// import LeadSettingsModal from '../leadAdmin/components/LeadSettingsModal';

// const UserLeadLimit = () => {
// 	const {
// 		queryParams,
// 		data,
// 		leadSettings,
// 		totalPages,
// 		totalRecords,
// 		setAgencyId,
// 		isLoading,
// 		isFetching,
// 		refreshLeadSettings,
// 		handlePageChange,
// 		handlePageSize,
// 		updateData,
// 		setPagination,
// 		removeItem,
// 	} = useLeadSettings();

// 	const navigate = useNavigate();

// 	const [updateItem] = useUpdateItemMutation();

// 	const [clearFilters, setClearFilters] = useState(false);
// 	const [editData, setEditData] = useState(null);

// 	const {
// 		isOpen: leadLimitIsOpen,
// 		onClose: leadLimitOnClose,
// 		onOpen: leadLimitOpen,
// 	} = useDisclosure();
// 	const {
// 		isOpen: defaultLimitIsOpen,
// 		onClose: defaultLimitOnClose,
// 		onOpen: defaultLimitOpen,
// 	} = useDisclosure();

// 	const handleOpenAdd = () => {
// 		setEditData(null);
// 		leadLimitOpen();
// 	};

// 	const handleOpenEdit = (leadLimit) => {
// 		setEditData(leadLimit);
// 		leadLimitOpen();
// 	};

// 	const handleClear = () => {
// 		setClearFilters(false);
// 		setAgencyId(null);
// 		setPagination((prev) => ({ ...prev, page: 1 }));
// 	};

// 	const handleResetLimit = async (data) => {
// 		try {
// 			const payload = {
// 				limit: leadSettings?.agentLeadLimit || 0,
// 			};

// 			if (data?.limit === payload.limit) {
// 				return toast.info('User lead limit is already set to default');
// 			}

// 			if (!data?.user) {
// 				return toast.error('User is required');
// 			}

// 			const res = await updateItem({
// 				path: `/lead/user-lead-limits/${data.user._id}`,
// 				body: payload,
// 			}).unwrap();

// 			toast.success(`User lead limit reset successfully`);

// 			let doc = res?.doc;
// 			if (doc?._id) {
// 				updateData?.(doc?._id, doc, 'update');
// 			}
// 		} catch (err) {
// 			toast.error(err?.data?.message || 'Failed to reset lead limit');
// 		}
// 	};

// 	return (
// 		<Box p={6} bg='white' borderRadius='md' boxShadow='sm'>
// 			<IconButton
// 				aria-label='Go back'
// 				icon={<FiChevronLeft />}
// 				onClick={() => navigate(-1)}
// 				size='md'
// 				isRound
// 			/>
// 			<Box
// 				bg='white'
// 				border='1px solid'
// 				borderColor='gray.200'
// 				borderRadius='lg'
// 				p={{ base: 4, md: 6 }}
// 				mb={6}
// 				mt={2}
// 				boxShadow='sm'
// 			>
// 				<Flex
// 					align={{ base: 'flex-start', md: 'center' }}
// 					justify='space-between'
// 					flexDirection={{ base: 'column', md: 'row' }}
// 					gap={{ base: 4, md: 0 }}
// 					w='full'
// 				>
// 					{/* Left: Icon + Info */}
// 					<Flex align='center' gap={4}>
// 						{/* Icon with circle + shadow */}
// 						<Box
// 							bg='brand.500'
// 							color='white'
// 							p={3}
// 							borderRadius='full'
// 							boxShadow='md'
// 							display='flex'
// 							alignItems='center'
// 							justifyContent='center'
// 						>
// 							<FaUsers size={20} />
// 						</Box>

// 						{/* Text info */}
// 						<Box>
// 							<Text
// 								fontSize={{ base: 'sm', md: 'md' }}
// 								color='gray.600'
// 								fontWeight='500'
// 							>
// 								Default Lead Limit
// 							</Text>
// 							<Text
// 								fontSize={{ base: 'md', md: 'lg', lg: 'xl' }}
// 								fontWeight='bold'
// 								lineHeight='1.2'
// 								color='gray.800'
// 							>
// 								{leadSettings?.agentLeadLimit?.toLocaleString() ?? 0}
// 							</Text>
// 							<Text fontSize={{ base: 'xs', md: 'sm' }} color='gray.500' mt={1}>
// 								This value is applied when a user does not have a custom lead
// 								limit.
// 							</Text>
// 						</Box>
// 					</Flex>

// 					{/* Right: Edit button */}
// 					<HStack gap='2'>
// 						<IconButton
// 							icon={<FaEdit />}
// 							size='md'
// 							colorScheme='brand'
// 							variant='outline'
// 							borderColor='gray.300'
// 							aria-label='Edit default lead limit'
// 							alignSelf={{ base: 'flex-start', md: 'center' }}
// 							_hover={{ bg: 'brand.50' }}
// 							onClick={defaultLimitOpen}
// 						/>

// 						<LeadSettingsModal />
// 					</HStack>
// 				</Flex>
// 			</Box>

// 			<Flex
// 				flexDir={{ base: 'column', md: 'row' }}
// 				justify='space-between'
// 				align='center'
// 				mb={4}
// 			>
// 				<Flex alignSelf='flex-start' fontSize='lg' fontWeight='bold' gap='2'>
// 					<Text>User Lead Limits</Text>

// 					<CountUpComponent key={totalRecords} targetNumber={totalRecords} />
// 				</Flex>

// 				<HStack gap='2' alignItems='center'>
// 					<Button
// 						alignSelf='flex-end'
// 						leftIcon={<FaPlus size='1em' />}
// 						colorScheme='brand'
// 						size='sm'
// 						rounded='md'
// 						px={4}
// 						shadow='md'
// 						onClick={handleOpenAdd}
// 					>
// 						Add User Limit
// 					</Button>

// 					{clearFilters && (
// 						<Button
// 							{...buttonStyle}
// 							variant='solid'
// 							bg='softGray.100'
// 							w='fit-content'
// 							color='gray.800'
// 							sx={{
// 								svg: {
// 									fill: 'gray.800',
// 								},
// 							}}
// 							_active={{ bg: 'gray.200' }}
// 							leftIcon={<BiX />}
// 							aria-label='Clear'
// 							onClick={handleClear}
// 						>
// 							Clear
// 						</Button>
// 					)}
// 				</HStack>
// 			</Flex>

// 			{!isLoading && (
// 				<TopPagination
// 					currentPage={queryParams.page}
// 					totalPages={totalPages}
// 					onPageChange={handlePageChange}
// 					totalItems={totalRecords}
// 					itemsPerPage={queryParams.limit}
// 					refetching={isFetching}
// 					loading={isLoading}
// 					handlePageSize={handlePageSize}
// 				/>
// 			)}

// 			<UserLeadLimitTable
// 				data={data || []}
// 				updateData={updateData}
// 				removeItem={removeItem}
// 				leadSettings={leadSettings}
// 				handleOpenEdit={handleOpenEdit}
// 				handleResetLimit={handleResetLimit}
// 				isLoading={isLoading || isFetching}
// 			/>

// 			{leadLimitIsOpen && (
// 				<AddUserLeadLimit
// 					isOpen={leadLimitIsOpen}
// 					onClose={leadLimitOnClose}
// 					initialData={editData}
// 					onSuccess={updateData}
// 				/>
// 			)}

// 			{/* Modal */}
// 			{defaultLimitIsOpen && (
// 				<LeadLimitModal
// 					isOpen={defaultLimitIsOpen}
// 					onClose={defaultLimitOnClose}
// 					defaultLeadLimit={leadSettings?.agentLeadLimit}
// 					onSuccess={refreshLeadSettings}
// 				/>
// 			)}
// 		</Box>
// 	);
// };

// export default UserLeadLimit;

import {
	Box,
	Button,
	Flex,
	HStack,
	IconButton,
	Text,
	useDisclosure,
	Tooltip,
} from '@chakra-ui/react';
import { useMemo, useState, useCallback } from 'react';
import {
	FaEdit,
	FaPlus,
	FaUsers,
	FaUndoAlt,
	FaChevronLeft,
} from 'react-icons/fa';
import TopPagination from 'components/pagination/TopPagination';
import { BiX } from 'react-icons/bi';
import CountUpComponent from 'components/countUpComponent/countUpComponent';
import { useLeadSettings } from './useLeadSettings';
import UserLeadLimitTable from './UserLeadLimitTable';
import AddUserLeadLimit from './AddUserLeadLimit';
import DefaultLeadLimitModal from './DefaultLeadLimitModal';
import { FiChevronLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useUpdateItemMutation } from 'api/apiSlice';
import LeadSettingsModal from './LeadSettingsModal';
import AppButton from 'components/shared/AppButton';

const UserLeadLimit = () => {
	const {
		queryParams,
		data,
		leadSettings,
		totalPages,
		totalRecords,
		setAgencyId,
		isLoading,
		isFetching,
		refreshLeadSettings,
		handlePageChange,
		handlePageSize,
		updateData,
		setPagination,
		removeItem,
	} = useLeadSettings();

	const navigate = useNavigate();
	const [updateItem] = useUpdateItemMutation();

	const [clearFilters, setClearFilters] = useState(false);
	const [editData, setEditData] = useState(null);

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

	const handleOpenAdd = useCallback(() => {
		setEditData(null);
		leadLimitOpen();
	}, [leadLimitOpen]);

	const handleOpenEdit = useCallback(
		(leadLimit) => {
			setEditData(leadLimit);
			leadLimitOpen();
		},
		[leadLimitOpen],
	);

	const handleClear = useCallback(() => {
		setClearFilters(false);
		setAgencyId(null);
		setPagination((prev) => ({ ...prev, page: 1 }));
	}, [setAgencyId, setPagination]);

	const handleResetLimit = useCallback(
		async (data) => {
			try {
				const payload = {
					limit: leadSettings?.agentLeadLimit || 0,
				};

				if (data?.limit === payload.limit) {
					return toast.info('User lead limit is already set to default');
				}

				if (!data?.user) {
					return toast.error('User is required');
				}

				const res = await updateItem({
					path: `/lead/user-lead-limits/${data.user._id}`,
					body: payload,
				}).unwrap();

				toast.success(`User lead limit reset successfully`);

				const doc = res?.doc;
				if (doc?._id) {
					updateData?.(doc._id, doc, 'update');
				}
			} catch (err) {
				toast.error(err?.data?.message || 'Failed to reset lead limit');
			}
		},
		[leadSettings, updateItem, updateData],
	);

	return (
		<Box>
			{/* Back Button */}
			<AppButton
				leftIcon={<FaChevronLeft />}
				onClick={() => navigate(-1)}
				mb={4}
				variant='ghost'
				size='sm'
			>
				Back
			</AppButton>

			{/* Main Container */}
			<Box
				bg='bg.surface'
				border='1px solid'
				borderColor='border.default'
				borderRadius='xl'
				overflow='hidden'
				boxShadow='card'
			>
				{/* Default Lead Limit Card */}
				<Box
					borderBottom='1px solid'
					borderBottomColor='border.default'
					p={{ base: 4, md: 5 }}
				>
					<Flex
						align={{ base: 'flex-start', md: 'center' }}
						justify='space-between'
						flexDir={{ base: 'column', md: 'row' }}
						gap={{ base: 4, md: 0 }}
					>
						{/* Left: Icon + Info */}
						<Flex align='center' gap={4}>
							<Box
								bg='rgba(212, 175, 55, 0.1)'
								color='gold.primary'
								p={3}
								borderRadius='full'
								display='flex'
								alignItems='center'
								justifyContent='center'
							>
								<FaUsers size={20} />
							</Box>

							<Box>
								<Text
									fontSize='xs'
									color='text.muted'
									fontWeight='medium'
									letterSpacing='wide'
								>
									DEFAULT LEAD LIMIT
								</Text>
								<Text
									fontSize={{ base: '2xl', md: '3xl' }}
									fontWeight='bold'
									color='text.heading'
								>
									{leadSettings?.agentLeadLimit?.toLocaleString() ?? 0}
								</Text>
								<Text fontSize='xs' color='text.muted' mt={1}>
									Applied when user has no custom lead limit
								</Text>
							</Box>
						</Flex>

						{/* Right: Edit Button */}
						<HStack spacing={2}>
							<Tooltip label='Edit default lead limit' placement='top' hasArrow>
								<IconButton
									icon={<FaEdit />}
									size='sm'
									variant='outline'
									aria-label='Edit default lead limit'
									borderRadius='lg'
									_hover={{
										bg: 'rgba(212, 175, 55, 0.1)',
										borderColor: 'gold.primary',
										color: 'gold.primary',
									}}
									onClick={defaultLimitOpen}
								/>
							</Tooltip>

							<LeadSettingsModal />
						</HStack>
					</Flex>
				</Box>

				{/* User Lead Limits Section */}
				<Box p={{ base: 4, md: 5 }}>
					{/* Header */}
					<Flex
						flexDir={{ base: 'column', sm: 'row' }}
						justify='space-between'
						align={{ base: 'flex-start', sm: 'center' }}
						gap={4}
						mb={4}
					>
						<HStack spacing={2}>
							<Text fontSize='md' fontWeight='bold' color='text.heading'>
								User Lead Limits
							</Text>

							<CountUpComponent
								key={totalRecords}
								targetNumber={totalRecords}
							/>
						</HStack>

						<HStack spacing={3}>
							{clearFilters && (
								<Button
									leftIcon={<BiX />}
									size='sm'
									variant='ghost'
									onClick={handleClear}
									borderRadius='lg'
									_hover={{ bg: 'bg.elevated', color: 'red.400' }}
								>
									Clear Filters
								</Button>
							)}

							<Tooltip
								label='Add custom lead limit for user'
								placement='top'
								hasArrow
							>
								<Button
									leftIcon={<FaPlus />}
									variant='brand'
									size='sm'
									borderRadius='lg'
									onClick={handleOpenAdd}
								>
									Add User Limit
								</Button>
							</Tooltip>
						</HStack>
					</Flex>

					{/* Pagination */}
					{!isLoading && (
						<Box mb={4}>
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
						</Box>
					)}

					{/* Table */}
					<UserLeadLimitTable
						data={data || []}
						updateData={updateData}
						removeItem={removeItem}
						leadSettings={leadSettings}
						handleOpenEdit={handleOpenEdit}
						handleResetLimit={handleResetLimit}
						isLoading={isLoading || isFetching}
					/>
				</Box>
			</Box>

			{/* Add/Edit Modal */}
			{leadLimitIsOpen && (
				<AddUserLeadLimit
					isOpen={leadLimitIsOpen}
					onClose={leadLimitOnClose}
					initialData={editData}
					onSuccess={updateData}
				/>
			)}

			{/* Default Limit Modal */}
			{defaultLimitIsOpen && (
				<DefaultLeadLimitModal
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
