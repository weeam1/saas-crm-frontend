import React, { useState } from 'react';
import {
	Box,
	Flex,
	Text,
	Button,
	useDisclosure,
	HStack,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { useMainStatus } from '../../../../hooks/useMainStatus';
import MainStatusTab from './MainStatusTab';
import StatusModal from './StatusModal';
import TopPagination from 'components/pagination/TopPagination';
import CountUpComponent from 'components/countUpComponent/countUpComponent';
import SearchBox from 'views/admin/payroll/components/SearchBox';
import RefreshButton from 'components/refresh/RefreshButton';
import { useMetaStatus } from 'views/admin/leadsSetting/hooks/useMetaStatus';
import { useModalColors } from 'hooks/useModalColors';

const MainStatusTabContainer = () => {
	const colors = useModalColors();
	const { metaStatuses } = useMetaStatus();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [editingItem, setEditingItem] = useState(null);
	const [formData, setFormData] = useState({
		label: '',
		color: colors.accentGold,
		bgColor: colors.accentGold,
		textColor: colors.accentGold,
		coinCost: 50,
		metaStatus: null,
	});
	const [formErrors, setFormErrors] = useState({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [deletingId, setDeletingId] = useState(null);

	const {
		mainStatuses,
		setMainStatuses,
		isLoading,
		pagination,
		totalPages,
		totalCount,
		handlePageChange,
		handlePageSizeChange,
		createStatus,
		updateStatus,
		deleteStatus,
		refetch,
		isCreating,
		isUpdating,
		isDeleting,
		searchTerm,
		handleSearchTermChange,
		handleSearch,
		clearSearch,
	} = useMainStatus(1, 20);

	// Function to update data locally after coin edit
	const updateDataLocally = (id, updatedData, type = 'update') => {
		if (type === 'update') {
			setMainStatuses((prev) =>
				prev.map((item) =>
					item._id === id ? { ...item, ...updatedData } : item,
				),
			);
		}
	};

	const handleAddNew = () => {
		setEditingItem(null);
		setFormData({
			label: '',
			color: colors.accentGold,
			bgColor: generateBgColor(colors.accentGold, 80),
			textColor: colors.accentGold,
			coinCost: 50,
			metaStatus: null,
		});
		setFormErrors({});
		onOpen();
	};

	const handleEdit = (item) => {
		setEditingItem(item);
		setFormData({
			label: item.label || '',
			color: item.color || colors.accentGold,
			bgColor: item.bgColor || colors.accentGold,
			textColor: item.textColor || colors.accentGold,
			coinCost: item.coinCost || 0,
			metaStatus: item.metaStatus?._id || item.metaStatus || null,
		});
		setFormErrors({});
		onOpen();
	};

	const handleDelete = async (id, label, replacementId) => {
		console.log('Delete confirmed with ID:', id, 'replacement:', replacementId);
		setDeletingId(id);
		try {
			await deleteStatus(id, replacementId);
		} catch (error) {
			console.error('Error deleting:', error);
		} finally {
			setDeletingId(null);
		}
	};

	const handleSubmit = async () => {
		const errors = {};
		if (!formData.label?.trim()) errors.label = 'Name is required';

		if (Object.keys(errors).length > 0) {
			setFormErrors(errors);
			return;
		}

		setIsSubmitting(true);

		const finalFormData = {
			...formData,
			value: formData.label.toLowerCase().replace(/\s+/g, '_'),
		};

		try {
			if (editingItem) {
				await updateStatus(editingItem._id, finalFormData);
			} else {
				await createStatus(finalFormData);
			}
			onClose();
			setFormErrors({});
			refetch();
		} catch (error) {
			console.error('Error submitting form:', error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const generateBgColor = (hex, percent = 80) => {
		const cleanHex = hex.replace('#', '');
		const r = parseInt(cleanHex.substring(0, 2), 16);
		const g = parseInt(cleanHex.substring(2, 4), 16);
		const b = parseInt(cleanHex.substring(4, 6), 16);
		const newR = Math.round(r + (255 - r) * (percent / 100));
		const newG = Math.round(g + (255 - g) * (percent / 100));
		const newB = Math.round(b + (255 - b) * (percent / 100));
		return `#${[newR, newG, newB].map((x) => x.toString(16).padStart(2, '0')).join('')}`;
	};

	const getRandomColor = () => {
		const colorsList = [
			'#D4AF37', // gold
			'#F5D67B', // gold light
			'#C9A227', // gold dark
			'#4A7BA3', // navy 300
			'#2E5C87', // navy 400
			'#7AAAC4', // navy 200
		];
		return colorsList[Math.floor(Math.random() * colorsList.length)];
	};

	const buttonStyle = {
		size: 'sm',
		borderRadius: 'md',
		_hover: {
			shadow: 'sm',
			transition: 'all 0.2s ease-in-out',
			bg: colors.goldLight,
			transform: 'translateY(-1px)',
		},
		_active: { bg: colors.goldDark },
		color: colors.headerText,
		fontWeight: 'medium',
		bg: colors.accentGold,
		sx: {
			svg: {
				fill: colors.headerText,
				bg: 'transparent',
				borderRadius: 'full',
				p: '.5px',
			},
		},
	};

	const handleSearchClick = (term) => {
		handleSearch(term);
	};

	return (
		<Box display='flex' flexDirection='column' gap={4}>
			<Flex
				justify='space-between'
				align='center'
				p={4}
				flexWrap='wrap'
				gap={4}
			>
				<Text color={colors.headingText} fontSize='20px' fontWeight='500'>
					<span style={{ marginRight: '4px' }}>Main Status</span>
					<CountUpComponent targetNumber={totalCount} />
				</Text>

				<HStack spacing={4} flexWrap='wrap'>
					<RefreshButton
						label='Refresh'
						onClick={refetch}
						isLoading={isLoading}
						isFetching={isLoading}
					/>

					<SearchBox
						searchTerm={searchTerm}
						setSearchTerm={handleSearchTermChange}
						onSearchTermChange={handleSearchClick}
						isLoading={isLoading}
					/>

					<Button
						{...buttonStyle}
						leftIcon={<AddIcon />}
						variant='solid'
						py='2'
						px='5'
						size='sm'
						onClick={handleAddNew}
						isLoading={isCreating}
						loadingText='Adding'
					>
						Add Main Status
					</Button>
				</HStack>
			</Flex>

			<TopPagination
				currentPage={pagination.page}
				totalPages={totalPages}
				onPageChange={handlePageChange}
				totalItems={totalCount}
				itemsPerPage={pagination.limit}
				loading={isLoading}
				handlePageSize={handlePageSizeChange}
			/>

			<MainStatusTab
				mainStatuses={mainStatuses}
				isLoading={isLoading}
				onEdit={handleEdit}
				onDelete={handleDelete}
				generateBgColor={generateBgColor}
				isDeleting={isDeleting}
				deletingId={deletingId}
				isUpdating={isUpdating}
				updateData={updateDataLocally}
				refetchMainStatuses={refetch}
			/>

			<StatusModal
				isOpen={isOpen}
				onClose={onClose}
				editingItem={editingItem}
				formData={formData}
				setFormData={setFormData}
				formErrors={formErrors}
				setFormErrors={setFormErrors}
				onSubmit={handleSubmit}
				getRandomColor={getRandomColor}
				generateBgColor={generateBgColor}
				metaStatuses={metaStatuses}
				isSubmitting={isSubmitting || isCreating || isUpdating}
			/>
		</Box>
	);
};

export default MainStatusTabContainer;
