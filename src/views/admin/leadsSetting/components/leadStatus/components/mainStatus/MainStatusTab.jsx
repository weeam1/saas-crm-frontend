import React, { useMemo, useState, useEffect } from 'react';
import {
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	IconButton,
	Badge,
	Text,
	HStack,
	Tooltip,
	TableContainer,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import NoData from 'components/Message/NoData';
import TableSkeleton from '../../../TableSkeleton';
import StatusBadge from '../../../StatusBadge';
import DeleteConfirmationModal from '../../DeleteModal';
import { useFetchItemsQuery } from 'api/apiSlice';
import MainStatusCoinEdit from './MainStatsCoinEdit';
import { useModalColors } from 'hooks/useModalColors';

const MainStatusTab = ({
	mainStatuses,
	isLoading,
	onEdit,
	onDelete,
	generateBgColor,
	isDeleting,
	deletingId,
	isUpdating,
	updateData,
	refetchMainStatuses,
}) => {
	const colors = useModalColors();
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [selectedStatus, setSelectedStatus] = useState(null);
	const [availableReplacements, setAvailableReplacements] = useState([]);

	const columns = useMemo(
		() => [
			{ Header: 'Order', accessor: 'order', width: 80 },
			{ Header: 'Name', accessor: 'label', width: 150 },
			{ Header: 'Coin Cost', accessor: 'coinCost', width: 120 },
			{ Header: 'Meta Status', accessor: 'metaStatus', width: 180 },
			{ Header: 'Actions', accessor: 'actions', width: 100 },
		],
		[],
	);

	// Fetch all main statuses for replacements
	const { data: replacementsData, isLoading: isLoadingReplacements } =
		useFetchItemsQuery(
			{
				path: '/lead/main-status',
				params: { includeSubStatuses: true, limit: 100 },
			},
			{
				refetchOnMountOrArgChange: false,
				skip: !deleteModalOpen && !selectedStatus,
			},
		);

	// Process the replacements data when it's received
	useEffect(() => {
		if (replacementsData?.doc && selectedStatus) {
			const filtered = replacementsData.doc.filter(
				(status) => status._id !== selectedStatus._id,
			);
			setAvailableReplacements(filtered);
		} else {
			setAvailableReplacements([]);
		}
	}, [replacementsData, selectedStatus]);

	const hasReplacements = availableReplacements.length > 0;

	const handleDeleteClick = (status) => {
		setSelectedStatus(status);
		setDeleteModalOpen(true);
	};

	const handleConfirmDelete = (replacementId) => {
		if (selectedStatus) {
			onDelete(selectedStatus._id, selectedStatus.label, replacementId);
		}
		setDeleteModalOpen(false);
		setSelectedStatus(null);
		setAvailableReplacements([]);
	};

	const handleCancelDelete = () => {
		setDeleteModalOpen(false);
		setSelectedStatus(null);
		setAvailableReplacements([]);
	};

	return (
		<TableContainer
			maxHeight='70vh'
			minH='60vh'
			overflowY='auto'
			overflowX='auto'
			border='1px solid'
			borderColor={colors.borderColor}
			borderRadius='lg'
		>
			<Table variant='simple' size='sm'>
				<Thead position='sticky' top={0} bg={colors.bg} zIndex={1}>
					<Tr>
						{columns.map((col) => (
							<Th
								key={col.accessor}
								width={col?.width ? `${col.width}px` : 'auto'}
								minWidth={col?.width ? `${col.width}px` : '100px'}
								textAlign='center'
								py={3}
								fontSize='sm'
								fontWeight='semibold'
								color={colors.headingText}
								textTransform='capitalize'
								borderBottom='2px solid'
								borderColor={colors.borderColor}
								whiteSpace='nowrap'
							>
								{col.Header}
							</Th>
						))}
					</Tr>
				</Thead>

				<Tbody>
					{isLoading ? (
						<TableSkeleton columns={columns} rowCount={5} />
					) : mainStatuses.length > 0 ? (
						mainStatuses.map((status) => (
							<Tr
								key={status._id}
								borderBottom={`1px solid ${colors.borderColor}`}
								// bg={colors.bgInput}
								_hover={{ bg: colors.bgInputHover }}
								opacity={isDeleting && deletingId === status._id ? 0.5 : 1}
								transition='opacity 0.2s ease'
							>
								<Td textAlign='center' color={colors.bodyText} py={3}>
									{status.order || '-'}
								</Td>
								<Td textAlign='center' py={3}>
									<StatusBadge
										status={status}
										generateBgColor={generateBgColor}
									/>
								</Td>

								<Td textAlign='center' py={3}>
									<MainStatusCoinEdit
										status={status}
										updateData={updateData}
										refetchMainStatuses={refetchMainStatuses}
									/>
								</Td>

								<Td textAlign='center' py={3}>
									{status.metaStatus ? (
										<Badge
											bg={`rgba(212, 175, 55, 0.15)`}
											color={colors.accentGold}
											textTransform='none'
											px={2}
											py={1}
											borderRadius='full'
											fontSize='xs'
											fontWeight='medium'
										>
											{typeof status.metaStatus === 'object'
												? status.metaStatus.label
												: status.metaStatus}
										</Badge>
									) : (
										<Text fontSize='xs' color={colors.mutedText}>
											—
										</Text>
									)}
								</Td>

								<Td textAlign='center' py={3}>
									<HStack spacing={1} justify='center'>
										<Tooltip label='Edit main status' hasArrow>
											<IconButton
												icon={<EditIcon />}
												size='xs'
												variant='ghost'
												onClick={() => onEdit(status)}
												aria-label='Edit status'
												isLoading={isUpdating && deletingId === status._id}
												isDisabled={
													isDeleting ||
													['deal', 'new', 'show'].includes(status.value)
												}
												color={colors.accentGold}
												_hover={{
													bg: `rgba(212, 175, 55, 0.1)`,
													color: colors.goldLight,
													transform: 'scale(1.1)',
												}}
												transition='all 0.2s ease'
											/>
										</Tooltip>

										<Tooltip label='Delete main status' hasArrow>
											<IconButton
												icon={<DeleteIcon />}
												size='xs'
												variant='ghost'
												onClick={() => handleDeleteClick(status)}
												aria-label='Delete status'
												isLoading={isDeleting && deletingId === status._id}
												isDisabled={
													isDeleting ||
													['deal', 'new', 'show'].includes(status.value)
												}
												color={colors.badgeErrorText}
												_hover={{
													bg: colors.badgeErrorBg,
													color: colors.badgeErrorText,
													transform: 'scale(1.1)',
												}}
												transition='all 0.2s ease'
											/>
										</Tooltip>
									</HStack>
								</Td>
							</Tr>
						))
					) : (
						<Tr>
							<Td colSpan={columns.length} py={10} textAlign='center'>
								<NoData label='main statuses' />
							</Td>
						</Tr>
					)}
				</Tbody>
			</Table>

			{/* Delete Confirmation Modal */}
			<DeleteConfirmationModal
				isOpen={deleteModalOpen}
				onClose={handleCancelDelete}
				onConfirm={handleConfirmDelete}
				title='Delete Main Status'
				itemName={selectedStatus?.label}
				mainStatusName='Main Status'
				itemType='main status'
				availableReplacements={availableReplacements}
				isLoading={isLoadingReplacements || isDeleting}
				warningType={!hasReplacements ? 'error' : 'warning'}
				confirmText='Delete Status'
			/>
		</TableContainer>
	);
};

export default MainStatusTab;
