import React, { useState, useEffect, useRef } from 'react';
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	ModalCloseButton,
	FormControl,
	FormLabel,
	Input,
	FormErrorMessage,
	Button,
	Flex,
	Box,
	Text,
	HStack,
} from '@chakra-ui/react';
import { FaPalette } from 'react-icons/fa';
import Select from 'react-select';
import { useFetchItemsQuery } from 'api/apiSlice';
import { useModalColors } from 'hooks/useModalColors';

const SubStatusModal = ({
	isOpen,
	onClose,
	editingItem,
	formData,
	setFormData,
	formErrors,
	setFormErrors,
	onSubmit,
	isSubmitting,
	getRandomColor,
	generateBgColor,
	mainStatuses: initialMainStatuses = [],
	metaStatuses: initialMetaStatuses = [],
}) => {
	const colors = useModalColors();
	const [mainStatusSearchTerm, setMainStatusSearchTerm] = useState('');
	const [metaStatusSearchTerm, setMetaStatusSearchTerm] = useState('');
	const [selectedMainStatus, setSelectedMainStatus] = useState(null);
	const [selectedMetaStatus, setSelectedMetaStatus] = useState(null);

	const mainStatusTimeoutRef = useRef(null);
	const metaStatusTimeoutRef = useRef(null);

	// Fetch main statuses with search
	const {
		data: mainStatusData,
		isLoading: isLoadingMainStatuses,
		isFetching: isFetchingMainStatuses,
	} = useFetchItemsQuery(
		{
			path: '/lead/main-status',
			params: {
				...(mainStatusSearchTerm && { search: mainStatusSearchTerm }),
				limit: 20,
			},
		},
		{
			skip: !isOpen,
			refetchOnMountOrArgChange: true,
		},
	);

	// Fetch meta statuses with search
	const {
		data: metaStatusData,
		isLoading: isLoadingMetaStatuses,
		isFetching: isFetchingMetaStatuses,
	} = useFetchItemsQuery(
		{
			path: '/lead/meta-status',
			params: {
				...(metaStatusSearchTerm && { search: metaStatusSearchTerm }),
				limit: 20,
			},
		},
		{
			skip: !isOpen,
			refetchOnMountOrArgChange: true,
		},
	);

	// Prepare options from API data
	const mainStatusOptions = mainStatusData?.doc
		? mainStatusData.doc.map((status) => ({
				value: status._id,
				label: status.label,
			}))
		: [];

	const metaStatusOptions = metaStatusData?.doc
		? metaStatusData.doc.map((status) => ({
				value: status._id,
				label: status.label || status.key,
			}))
		: [];

	// Handle main status input change with debounce
	const handleMainStatusInputChange = (inputValue) => {
		if (mainStatusTimeoutRef.current) {
			clearTimeout(mainStatusTimeoutRef.current);
		}

		mainStatusTimeoutRef.current = setTimeout(() => {
			setMainStatusSearchTerm(inputValue);
		}, 500);
	};

	// Handle meta status input change with debounce
	const handleMetaStatusInputChange = (inputValue) => {
		if (metaStatusTimeoutRef.current) {
			clearTimeout(metaStatusTimeoutRef.current);
		}

		metaStatusTimeoutRef.current = setTimeout(() => {
			setMetaStatusSearchTerm(inputValue);
		}, 500);
	};

	// Set initial selected options when editing
	useEffect(() => {
		if (editingItem) {
			// Set main status
			if (editingItem.mainStatusId || editingItem.mainStatus) {
				const mainStatusId =
					editingItem.mainStatus?._id || editingItem.mainStatus;
				const mainStatus = initialMainStatuses.find(
					(ms) => ms._id === mainStatusId,
				);

				if (mainStatus) {
					setSelectedMainStatus({
						value: mainStatus._id,
						label: mainStatus.label,
					});
				}
			}

			// Set meta status
			if (editingItem.metaStatusId || editingItem.metaStatus) {
				const metaStatusId =
					editingItem.metaStatus?._id || editingItem.metaStatus;
				const metaStatus = initialMetaStatuses.find(
					(ms) => ms._id === metaStatusId,
				);

				if (metaStatus) {
					setSelectedMetaStatus({
						value: metaStatus._id,
						label: metaStatus.label || metaStatus.key,
					});
				}
			}
		} else {
			setSelectedMainStatus(null);
			setSelectedMetaStatus(null);
			setMainStatusSearchTerm('');
			setMetaStatusSearchTerm('');
		}
	}, [editingItem, initialMainStatuses, initialMetaStatuses]);

	// Update formData when main status changes
	const handleMainStatusChange = (option) => {
		setSelectedMainStatus(option);
		setFormData({
			...formData,
			mainStatus: option ? option.value : '',
		});

		// real-time validation
		setFormErrors((prev) => ({
			...prev,
			mainStatus: option ? '' : 'Main Status is required',
		}));
	};

	// Update formData when meta status changes
	const handleMetaStatusChange = (option) => {
		setSelectedMetaStatus(option);
		setFormData({
			...formData,
			metaStatus: option ? option.value : null,
		});
	};

	const handleClose = () => {
		setFormErrors({});
		setMainStatusSearchTerm('');
		setMetaStatusSearchTerm('');
		setSelectedMainStatus(null);
		setSelectedMetaStatus(null);

		if (mainStatusTimeoutRef.current) {
			clearTimeout(mainStatusTimeoutRef.current);
		}
		if (metaStatusTimeoutRef.current) {
			clearTimeout(metaStatusTimeoutRef.current);
		}

		onClose();
	};

	const handleColorChange = (color) => {
		setFormData({
			...formData,
			color: color,
			bgColor: generateBgColor(color),
			textColor: color,
		});
	};

	const handleRandomColor = () => {
		const randomColor = getRandomColor('sub');
		setFormData({
			...formData,
			color: randomColor,
			bgColor: generateBgColor(randomColor),
			textColor: randomColor,
		});
	};

	// Custom styles for react-select with theme colors
	const customStyles = {
		control: (provided, state) => ({
			...provided,
			backgroundColor: colors.bgInput,
			borderColor: state.isFocused ? colors.accentGold : colors.borderColor,
			boxShadow: state.isFocused ? `0 0 0 1px ${colors.accentGold}` : 'none',
			minHeight: '32px',
			fontSize: '14px',
			borderRadius: '10px',
			'&:hover': {
				borderColor: colors.accentGold,
			},
		}),
		menu: (provided) => ({
			...provided,
			backgroundColor: colors.bg,
			border: `1px solid ${colors.borderColor}`,
			borderRadius: '12px',
			boxShadow: colors.cardShadow,
			zIndex: 9999,
		}),
		option: (provided, state) => ({
			...provided,
			backgroundColor: state.isSelected
				? colors.accentGold
				: state.isFocused
					? colors.bgInput
					: colors.bg,
			color: state.isSelected ? colors.headerText : colors.bodyText,
			fontSize: '14px',
			cursor: 'pointer',
			'&:hover': {
				backgroundColor: colors.bgInputHover,
			},
		}),
		placeholder: (provided) => ({
			...provided,
			color: colors.mutedText,
			fontSize: '14px',
		}),
		singleValue: (provided) => ({
			...provided,
			color: colors.headingText,
			fontSize: '14px',
		}),
		input: (provided) => ({
			...provided,
			color: colors.headingText,
			fontSize: '14px',
		}),
		loadingIndicator: (provided) => ({
			...provided,
			color: colors.accentGold,
		}),
		clearIndicator: (provided) => ({
			...provided,
			color: colors.mutedText,
			'&:hover': {
				color: colors.accentGold,
			},
		}),
		dropdownIndicator: (provided) => ({
			...provided,
			color: colors.mutedText,
			'&:hover': {
				color: colors.accentGold,
			},
		}),
	};

	const previewBgColor = formData.bgColor || `${formData.color}20`;

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			size='lg'
			isCentered
			scrollBehavior='inside'
		>
			<ModalOverlay bg={colors.overlayBg} />
			<ModalContent
				bg={colors.bg}
				borderRadius='lg'
				overflow='hidden'
				maxH='90vh'
				boxShadow={colors.modalShadow}
			>
				<ModalHeader
					bg={colors.accentGold}
					color={colors.headerText}
					py={{ base: 3, md: 4 }}
					px={{ base: 4, md: 6 }}
					borderBottom='1px solid'
					borderColor={colors.borderColor}
				>
					<HStack justify='space-between' align='center'>
						<Text
							color={colors.headerText}
							fontSize={{ base: 'md', md: 'lg' }}
							fontWeight='600'
						>
							{editingItem ? 'Edit Sub Status' : 'Add Sub Status'}
						</Text>
					</HStack>
				</ModalHeader>

				<ModalCloseButton
					color={colors.headerText}
					position='relative'
					top='0'
					_hover={{ bg: 'rgba(0,0,0,0.1)' }}
				/>

				<ModalBody
					px={{ base: 4, md: 8 }}
					py={6}
					maxH='60vh'
					overflowY='auto'
					bg={colors.bgDeep}
				>
					{/* Parent Main Status - Required */}
					<FormControl isInvalid={formErrors.mainStatus} mb={4} isRequired>
						<FormLabel
							fontSize='sm'
							fontWeight='600'
							color={colors.bodyText}
							mb='1'
						>
							Main Status
						</FormLabel>
						<Select
							options={mainStatusOptions}
							value={selectedMainStatus}
							onChange={handleMainStatusChange}
							onInputChange={handleMainStatusInputChange}
							isLoading={isFetchingMainStatuses || isLoadingMainStatuses}
							placeholder='Search main status...'
							isClearable={false}
							styles={customStyles}
							noOptionsMessage={({ inputValue }) =>
								inputValue ? 'No results found' : 'Start typing to search'
							}
							loadingMessage={() => 'Searching...'}
						/>
						<FormErrorMessage color={colors.badgeErrorText}>
							{formErrors.mainStatus}
						</FormErrorMessage>
					</FormControl>

					{/* Label - Required */}
					<FormControl isInvalid={formErrors.label} mb={4} isRequired>
						<FormLabel
							fontSize='sm'
							fontWeight='600'
							color={colors.bodyText}
							mb='1'
						>
							Name
						</FormLabel>
						<Input
							size='sm'
							value={formData.label}
							onChange={(e) => {
								const value = e.target.value;

								setFormData((prev) => ({
									...prev,
									label: value,
								}));

								// real-time validation
								setFormErrors((prev) => ({
									...prev,
									label: !value.trim() ? 'Name is required' : '',
								}));
							}}
							placeholder='Enter Name'
							bg={colors.bgInput}
							borderColor={colors.borderColor}
							color={colors.headingText}
							_hover={{ borderColor: colors.accentGold }}
							_focus={{
								borderColor: colors.accentGold,
								boxShadow: `0 0 0 1px ${colors.accentGold}`,
							}}
							_placeholder={{ color: colors.mutedText }}
						/>
						<FormErrorMessage color={colors.badgeErrorText}>
							{formErrors.label}
						</FormErrorMessage>
					</FormControl>

					{/* Color */}
					<FormControl mb={4}>
						<FormLabel
							fontSize='sm'
							fontWeight='600'
							color={colors.bodyText}
							mb='1'
						>
							Color
						</FormLabel>
						<Flex gap={4} align='center'>
							<Input
								type='color'
								value={formData.color || colors.accentGold}
								onChange={(e) => handleColorChange(e.target.value)}
								w='100px'
								h='35px'
								p={1}
								borderRadius='md'
								cursor='pointer'
							/>
							<Button
								size='sm'
								leftIcon={<FaPalette />}
								onClick={handleRandomColor}
								variant='outline'
								borderColor={colors.accentGold}
								color={colors.accentGold}
								_hover={{
									bg: colors.bgInput,
									borderColor: colors.goldLight,
									color: colors.goldLight,
								}}
							>
								Random
							</Button>
						</Flex>

						{formData.color && (
							<Box
								mt={2}
								p={3}
								bg={colors.bgInput}
								borderRadius='md'
								border={`1px solid ${colors.borderColor}`}
							>
								<Text fontSize='sm' mb={2} color={colors.bodyText}>
									Preview:
								</Text>
								<Flex align='center' gap={3}>
									<Box
										w='30px'
										h='30px'
										borderRadius='md'
										bg={formData.color}
										border='1px solid'
										borderColor={colors.borderColor}
									/>
									<Box
										w='30px'
										h='30px'
										borderRadius='md'
										bg={previewBgColor}
										border='1px solid'
										borderColor={colors.borderColor}
									/>
									<Text
										fontSize='xs'
										color={colors.bodyText}
										fontFamily='monospace'
									>
										{formData.color}
									</Text>
								</Flex>
							</Box>
						)}
					</FormControl>

					{/* Meta Status - Optional */}
					<FormControl mb={4}>
						<FormLabel
							fontSize='sm'
							fontWeight='600'
							color={colors.bodyText}
							mb='1'
						>
							Meta Status (Optional)
						</FormLabel>
						<Select
							options={metaStatusOptions}
							value={selectedMetaStatus}
							onChange={handleMetaStatusChange}
							onInputChange={handleMetaStatusInputChange}
							isLoading={isFetchingMetaStatuses || isLoadingMetaStatuses}
							placeholder='Search meta status...'
							isClearable
							styles={customStyles}
							noOptionsMessage={({ inputValue }) =>
								inputValue ? 'No results found' : 'Start typing to search'
							}
							loadingMessage={() => 'Searching...'}
						/>
						<Text fontSize='xs' color={colors.mutedText} mt={1}>
							Link this lead status to a Meta Pixel event for better tracking
							and categorization.
						</Text>
					</FormControl>
				</ModalBody>

				<ModalFooter
					gap={3}
					borderTop='1px solid'
					borderColor={colors.borderColor}
					bg={colors.bg}
					py={4}
					px={6}
				>
					<Button
						variant='ghost'
						size='sm'
						onClick={handleClose}
						color={colors.bodyText}
						_hover={{
							bg: colors.bgInput,
							color: colors.headingText,
						}}
					>
						Cancel
					</Button>
					<Button
						bg={colors.accentGold}
						color={colors.headerText}
						size='sm'
						onClick={onSubmit}
						isLoading={isSubmitting}
						loadingText={editingItem ? 'Updating...' : 'Saving...'}
						_hover={{
							bg: colors.goldLight,
							transform: 'translateY(-1px)',
							boxShadow: colors.goldGlow,
						}}
						_active={{
							bg: colors.goldDark,
							transform: 'translateY(0)',
						}}
						transition='all 0.2s ease'
					>
						{editingItem ? 'Update' : 'Save'}
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default SubStatusModal;
