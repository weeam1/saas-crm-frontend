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
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	NumberIncrementStepper,
	NumberDecrementStepper,
} from '@chakra-ui/react';
import { FaPalette } from 'react-icons/fa';
import Select from 'react-select';
import { useFetchItemsQuery } from 'api/apiSlice';
import { useModalColors } from 'hooks/useModalColors';

const StatusModal = ({
	isOpen,
	onClose,
	editingItem,
	formData,
	setFormData,
	formErrors,
	setFormErrors,
	onSubmit,
	getRandomColor,
	generateBgColor,
	metaStatuses: initialMetaStatuses,
	isSubmitting,
}) => {
	const colors = useModalColors();
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedOption, setSelectedOption] = useState(null);
	const searchTimeoutRef = useRef(null);

	// Handle input change with debounce
	const handleInputChange = (inputValue) => {
		if (searchTimeoutRef.current) {
			clearTimeout(searchTimeoutRef.current);
		}

		searchTimeoutRef.current = setTimeout(() => {
			setSearchTerm(inputValue);
		}, 500);
	};

	// Cleanup timeout on unmount
	useEffect(() => {
		return () => {
			if (searchTimeoutRef.current) {
				clearTimeout(searchTimeoutRef.current);
			}
		};
	}, []);

	// Fetch meta statuses with search
	const { data, isLoading, isFetching } = useFetchItemsQuery(
		{
			path: '/lead/meta-status',
			params: {
				...(searchTerm && { search: searchTerm }),
				limit: 20,
			},
		},
		{
			skip: !isOpen,
			refetchOnMountOrArgChange: true,
		},
	);

	// Prepare options from API data
	const options = data?.doc
		? data.doc.map((status) => ({
				value: status._id,
				label: status.label || status.key,
			}))
		: [];

	// Set initial selected option when editing
	useEffect(() => {
		if (editingItem?.metaStatus && initialMetaStatuses) {
			const metaStatus = initialMetaStatuses.find(
				(ms) => ms._id === editingItem.metaStatus,
			);

			if (metaStatus) {
				setSelectedOption({
					value: metaStatus._id,
					label: metaStatus.label || metaStatus.key,
				});
			}
		} else if (!editingItem) {
			setSelectedOption(null);
			setSearchTerm('');
		}
	}, [editingItem, initialMetaStatuses]);

	// Update formData when selected option changes
	const handleChange = (option) => {
		setSelectedOption(option);
		setFormData({
			...formData,
			metaStatus: option ? option.value : null,
		});
	};

	const handleClose = () => {
		setFormErrors({});
		setSearchTerm('');
		setSelectedOption(null);
		if (searchTimeoutRef.current) {
			clearTimeout(searchTimeoutRef.current);
		}
		onClose();
	};

	const handleColorChange = (color) => {
		setFormData({
			...formData,
			color: color,
			bgColor: generateBgColor(color, 80),
			textColor: color,
		});
	};

	const handleRandomColor = () => {
		const randomColor = getRandomColor('main');
		setFormData({
			...formData,
			color: randomColor,
			bgColor: generateBgColor(randomColor, 80),
			textColor: randomColor,
		});
	};

	// Custom styles for react-select to match Chakra UI theme
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

	const previewBgColor = formData.bgColor;

	return (
		<Modal isOpen={isOpen} onClose={handleClose} size='lg' isCentered>
			<ModalOverlay bg={colors.overlayBg} />
			<ModalContent
				bg={colors.bg}
				borderRadius='xl'
				boxShadow={colors.modalShadow}
			>
				{/* Gold Gradient Header - Primary Action */}
				<ModalHeader
					bg={colors.headerBg}
					color={colors.headerText}
					borderTopRadius='xl'
					fontSize='lg'
					fontWeight='600'
					py={4}
					px={6}
				>
					{editingItem ? 'Edit Main Status' : 'Add Main Status'}
				</ModalHeader>

				<ModalCloseButton
					color={colors.closeBtnColor}
					bg={colors.closeBtnBg}
					_hover={{
						bg: colors.closeBtnHoverBg,
						transform: 'scale(1.05)',
					}}
					transition='all 0.2s ease'
					top={3}
					right={3}
				/>

				<ModalBody pt={6} pb={4} px={6}>
					<FormControl isInvalid={formErrors.label} mb={4} isRequired>
						<FormLabel color={colors.bodyText} fontSize='sm' fontWeight='500'>
							Name
						</FormLabel>
						<Input
							size='sm'
							value={formData.label}
							onChange={(e) => {
								const value = e.target.value;

								setFormErrors((prev) => ({
									...prev,
									label: !value?.trim() ? 'Name is required' : '',
								}));
								setFormData({ ...formData, label: value });
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

					<FormControl mb={4}>
						<FormLabel color={colors.bodyText} fontSize='sm' fontWeight='500'>
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

					{/* Coin Cost Field */}
					<FormControl mb={4}>
						<FormLabel color={colors.bodyText} fontSize='sm' fontWeight='500'>
							Coin Cost
						</FormLabel>
						<NumberInput
							size='sm'
							value={formData.coinCost || 0}
							onChange={(valueString) =>
								setFormData({
									...formData,
									coinCost: parseInt(valueString) || 0,
								})
							}
							min={0}
							step={1}
						>
							<NumberInputField
								placeholder='Enter coin cost'
								bg={colors.bgInput}
								borderColor={colors.borderColor}
								color={colors.headingText}
								_hover={{ borderColor: colors.accentGold }}
								_focus={{
									borderColor: colors.accentGold,
									boxShadow: `0 0 0 1px ${colors.accentGold}`,
								}}
							/>
							<NumberInputStepper>
								<NumberIncrementStepper
									borderColor={colors.borderColor}
									color={colors.bodyText}
									_hover={{ bg: colors.bgInputHover }}
								/>
								<NumberDecrementStepper
									borderColor={colors.borderColor}
									color={colors.bodyText}
									_hover={{ bg: colors.bgInputHover }}
								/>
							</NumberInputStepper>
						</NumberInput>
						<Text fontSize='xs' color={colors.mutedText} mt={1}>
							Number of coins required for this status
						</Text>
					</FormControl>

					<FormControl mb={4}>
						<FormLabel color={colors.bodyText} fontSize='sm' fontWeight='500'>
							Meta Status (Optional)
						</FormLabel>
						<Select
							options={options}
							value={selectedOption}
							onChange={handleChange}
							onInputChange={handleInputChange}
							isLoading={isFetching || isLoading}
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
					bg={colors.bgDeep}
					borderTop={`1px solid ${colors.borderColor}`}
					borderBottomRadius='xl'
					gap={3}
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

export default StatusModal;
