import React, { useState } from 'react';
import {
	Box,
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	Button,
	IconButton,
	FormControl,
	FormLabel,
	VStack,
	HStack,
	Text,
	Flex,
	useDisclosure,
	Select,
	Badge,
	AlertIcon,
	Alert,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import moment from 'moment-timezone';
import * as yup from 'yup';
import LateDeductionRuleModal from './LateDeductionRuleModal';
import { isRuleOverlapping } from '../agencyUtils';
import { toast } from 'react-toastify';
import { useModalColors } from 'hooks/useModalColors';

const ruleValidationSchema = yup.object().shape({
	name: yup.string().required('Rule name is required'),
	fromMinutes: yup
		.number()
		.typeError('From minutes must be a number')
		.min(0, 'Minimum 0 minutes')
		.required('From minutes is required'),
	toMinutes: yup
		.number()
		.typeError('To minutes must be a number')
		.moreThan(yup.ref('fromMinutes'), 'To must be greater than From')
		.required('To minutes is required'),
	deduction: yup
		.number()
		.typeError('Deduction must be a number')
		.min(0, 'Deduction must be at least 0%')
		.max(100, 'Deduction cannot exceed 100%')
		.required('Deduction is required'),
});

const EarlyDeductionSettings = ({
	earlyCheckoutDeductionSettings,
	setEarlyCheckoutDeductionSettings,
}) => {
	const colors = useModalColors();
	const {
		isOpen: isModalOpen,
		onOpen: onModalOpen,
		onClose: onModalClose,
	} = useDisclosure();
	const [editingRuleIndex, setEditingRuleIndex] = useState(null);
	const [formErrors, setFormErrors] = useState({});

	const [ruleForm, setRuleForm] = useState({
		name: '',
		fromMinutes: 0,
		toMinutes: 0,
		deduction: 0,
	});

	const getLateBadgeColor = (minutes, type) => {
		if (minutes <= 20) return 'green';
		if (minutes <= 60) return 'yellow';
		if (minutes <= 120) return 'red';
		return 'red';
	};

	const resetForm = () => {
		setRuleForm({
			name: '',
			fromMinutes: 0,
			toMinutes: 0,
			deduction: 0,
		});
		setEditingRuleIndex(null);
		setFormErrors({});
	};

	const handleOpenAddModal = () => {
		resetForm();
		onModalOpen();
	};

	const handleOpenEditModal = (index) => {
		const rule =
			earlyCheckoutDeductionSettings.earlyCheckoutDeductionRules[index];
		setRuleForm({
			name: rule.name,
			fromMinutes: rule.fromMinutes,
			toMinutes: rule.toMinutes,
			deduction: rule.deduction,
		});
		setEditingRuleIndex(index);
		onModalOpen();
	};

	const validateForm = async () => {
		try {
			await ruleValidationSchema.validate(ruleForm, { abortEarly: false });
			setFormErrors({});
			return true;
		} catch (error) {
			const errors = {};
			error.inner.forEach((err) => {
				errors[err.path] = err.message;
			});
			setFormErrors(errors);
			return false;
		}
	};

	const handleSaveRule = async () => {
		const isValid = await validateForm();
		if (!isValid) return;

		const newRule = {
			...ruleForm,
			fromMinutes: Number(ruleForm.fromMinutes),
			toMinutes: Number(ruleForm.toMinutes),
		};

		const existingRules =
			earlyCheckoutDeductionSettings.earlyCheckoutDeductionRules;

		if (isRuleOverlapping(newRule, existingRules, editingRuleIndex)) {
			toast.error('This rule overlaps with an existing rule');
			return;
		}

		let updatedRules;

		if (editingRuleIndex !== null) {
			updatedRules = [...existingRules];
			updatedRules[editingRuleIndex] = newRule;
		} else {
			updatedRules = [...existingRules, newRule];
		}

		updatedRules.sort((a, b) => a.fromMinutes - b.fromMinutes);

		setEarlyCheckoutDeductionSettings({
			...earlyCheckoutDeductionSettings,
			earlyCheckoutDeductionRules: updatedRules,
		});

		onModalClose();
		resetForm();
	};

	const handleDeleteRule = (index) => {
		const updatedRules =
			earlyCheckoutDeductionSettings.earlyCheckoutDeductionRules.filter(
				(_, i) => i !== index,
			);
		setEarlyCheckoutDeductionSettings({
			...earlyCheckoutDeductionSettings,
			earlyCheckoutDeductionRules: updatedRules,
		});
	};

	const tableHeaders = [
		{ label: 'Rule Name' },
		{ label: 'Early Leave From (min)' },
		{ label: 'Early Leave To (min)' },
		{ label: 'Deduction (%)' },
		{ label: 'Actions', width: '120px' },
	];

	return (
		<Box>
			<VStack spacing={6} align='stretch'>
				<Box>
					<Flex
						justifyContent='space-between'
						alignItems={{ base: 'stretch', md: 'center' }}
						flexDir={{ base: 'column', md: 'row' }}
						gap={4}
					>
						<Text fontSize='md' fontWeight='semibold' mb={3} color={colors.headingText}>
							Early Checkout Rules
						</Text>
						<Box alignSelf={{ base: 'stretch', md: 'center' }}>
							<Button
								leftIcon={<AddIcon />}
								variant='brand'
								onClick={handleOpenAddModal}
								size='sm'
								borderRadius='md'
								width={{ base: '100%', md: 'auto' }}
							>
								Add New Rule
							</Button>
						</Box>
					</Flex>
				</Box>

				<Box
					borderWidth='1px'
					borderRadius='lg'
					overflow='hidden'
					boxShadow={colors.cardShadow}
					overflowX='auto'
					borderColor={colors.borderColor}
				>
					<Table variant='simple' bg={colors.bg} minWidth='600px'>
						<Thead bg={colors.bgDeep} position='sticky' top={0} zIndex={2}>
							<Tr>
								{tableHeaders.map((header, index) => (
									<Th
										key={index}
										whiteSpace='nowrap'
										py={4}
										fontSize='14px'
										fontWeight='600'
										color={colors.headingText}
										textTransform='capitalize'
										width={header.width || 'auto'}
										bg={colors.bgDeep}
										borderColor={colors.borderColor}
									>
										{header.label}
									</Th>
								))}
							</Tr>
						</Thead>

						<Tbody>
							{earlyCheckoutDeductionSettings.earlyCheckoutDeductionRules
								.length === 0 ? (
								<Tr>
									<Td colSpan={5} textAlign='center' color={colors.mutedText} py={8} borderColor={colors.borderColor}>
										No early deduction rules added yet
									</Td>
								</Tr>
							) : (
								earlyCheckoutDeductionSettings.earlyCheckoutDeductionRules.map(
									(rule, index) => (
										<Tr key={index} _hover={{ bg: colors.bgDeep }} borderColor={colors.borderColor}>
											<Td fontWeight='medium' whiteSpace='nowrap' color={colors.bodyText} borderColor={colors.borderColor}>
												{rule.name}
											</Td>
											<Td whiteSpace='nowrap' borderColor={colors.borderColor}>
												<Badge
													bg={colors.badgeInfoBg}
													color={colors.badgeInfoText}
													fontSize='sm'
													px={3}
													py={1}
													borderRadius='full'
												>
													{`${rule.fromMinutes} minutes`}
												</Badge>
											</Td>
											<Td whiteSpace='nowrap' borderColor={colors.borderColor}>
												<Badge
													bg={colors.badgeInfoBg}
													color={colors.badgeInfoText}
													fontSize='sm'
													px={3}
													py={1}
													borderRadius='full'
												>
													{`${rule.toMinutes} minutes`}
												</Badge>
											</Td>
											<Td fontWeight='bold' whiteSpace='nowrap' color={colors.accentGold} borderColor={colors.borderColor}>
												{rule.deduction}%
											</Td>
											<Td whiteSpace='nowrap' borderColor={colors.borderColor}>
												<HStack spacing={2}>
													<IconButton
														icon={<EditIcon />}
														variant='ghost'
														size='sm'
														onClick={() => handleOpenEditModal(index)}
														aria-label='Edit rule'
														color={colors.bodyText}
														_hover={{ color: colors.accentGold, bg: colors.bgDeep }}
													/>
													<IconButton
														icon={<DeleteIcon />}
														variant='ghost'
														size='sm'
														onClick={() => handleDeleteRule(index)}
														aria-label='Delete rule'
														color={colors.badgeErrorText}
														_hover={{ bg: colors.badgeErrorBg, color: colors.badgeErrorText }}
													/>
												</HStack>
											</Td>
										</Tr>
									),
								)
							)}
						</Tbody>
					</Table>
				</Box>
			</VStack>

			<LateDeductionRuleModal
				isOpen={isModalOpen}
				onClose={onModalClose}
				editingRuleIndex={editingRuleIndex}
				ruleForm={ruleForm}
				setRuleForm={setRuleForm}
				formErrors={formErrors}
				handleSaveRule={handleSaveRule}
			/>
		</Box>
	);
};

export default EarlyDeductionSettings;