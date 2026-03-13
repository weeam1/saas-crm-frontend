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

// const ruleValidationSchema = yup.object().shape({
// 	name: yup.string().required('Rule name is required'),
// 	from: yup.string().required('From time is required'),
// 	to: yup.string().required('To time is required'),
// 	deduction: yup
// 		.number()
// 		.typeError('Deduction must be a number')
// 		.min(0, 'Deduction must be at least 0%')
// 		.max(100, 'Deduction cannot exceed 100%')
// 		.required('Deduction is required'),
// });

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
		if (minutes <= 20) return 'green'; // small delay
		if (minutes <= 60) return 'yellow'; // moderate late
		if (minutes <= 120) return 'red'; // serious late
		return 'red'; // very late
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
			...rule,
			from: parseTimeForInput(rule.from),
			to: parseTimeForInput(rule.to),
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
			// setFormErrors({
			// 	range: 'This rule overlaps with an existing rule',
			// });

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

		// sort rules for safety
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

	const handleImportantDayChange = (day) => {
		setEarlyCheckoutDeductionSettings({
			...earlyCheckoutDeductionSettings,
			importantDay: day === 'null' ? null : parseInt(day),
		});
	};

	const formatTimeForDisplay = (time) => {
		return moment(`${time}`, 'HH:mm').format('hh:mm A');
	};

	const parseTimeForInput = (timeString) => {
		return moment(timeString, 'hh:mm A').format('HH:mm');
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
						<Text fontSize='md' fontWeight='semibold' mb={3} color='gray.700'>
							Early Checkout Rules
						</Text>
						<Box alignSelf={{ base: 'stretch', md: 'center' }}>
							<Button
								leftIcon={<AddIcon />}
								colorScheme='brand'
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
					boxShadow='sm'
					overflowX='auto'
				>
					<Table variant='simple' bg='white' minWidth='600px'>
						<Thead bg='brand.200' position='sticky' top={0} zIndex={2}>
							<Tr>
								{tableHeaders.map((header, index) => (
									<Th
										key={index}
										whiteSpace='nowrap'
										py={4}
										fontSize='14px'
										fontWeight='600'
										color='gray.700'
										textTransform='capitalize'
										width={header.width || 'auto'}
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
									<Td colSpan={5} textAlign='center' color='gray.500' py={8}>
										No early deduction rules added yet
									</Td>
								</Tr>
							) : (
								earlyCheckoutDeductionSettings.earlyCheckoutDeductionRules.map(
									(rule, index) => (
										<Tr key={index} _hover={{ bg: 'gray.50' }}>
											<Td fontWeight='medium' whiteSpace='nowrap'>
												{rule.name}
											</Td>
											<Td whiteSpace='nowrap'>
												<Badge
													colorScheme={getLateBadgeColor(
														rule.fromMinutes,
														'from',
													)}
													fontSize='sm'
													px={3}
													py={1}
												>
													{`${rule.fromMinutes} minutes`}
												</Badge>
											</Td>
											<Td whiteSpace='nowrap'>
												<Badge
													colorScheme={getLateBadgeColor(rule.toMinutes, 'to')}
													fontSize='sm'
													px={3}
													py={1}
												>
													{`${rule.toMinutes} minutes`}
												</Badge>
											</Td>
											<Td fontWeight='bold' whiteSpace='nowrap'>
												{rule.deduction}%
											</Td>
											<Td whiteSpace='nowrap'>
												<HStack spacing={2}>
													<IconButton
														icon={<EditIcon />}
														colorScheme='teal'
														variant='ghost'
														size='sm'
														onClick={() => handleOpenEditModal(index)}
														aria-label='Edit rule'
													/>
													<IconButton
														icon={<DeleteIcon />}
														colorScheme='red'
														variant='ghost'
														size='sm'
														onClick={() => handleDeleteRule(index)}
														aria-label='Delete rule'
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
