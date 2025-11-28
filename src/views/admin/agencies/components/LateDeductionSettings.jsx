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

const ruleValidationSchema = yup.object().shape({
	name: yup.string().required('Rule name is required'),
	from: yup.string().required('From time is required'),
	to: yup.string().required('To time is required'),
	deduction: yup
		.number()
		.typeError('Deduction must be a number')
		.min(0, 'Deduction must be at least 0%')
		.max(100, 'Deduction cannot exceed 100%')
		.required('Deduction is required'),
});

const LateDeductionRulesTable = ({
	lateDeductionSettings,
	setLateDeductionSettings,
}) => {
	const {
		isOpen: isModalOpen,
		onOpen: onModalOpen,
		onClose: onModalClose,
	} = useDisclosure();
	const [editingRuleIndex, setEditingRuleIndex] = useState(null);
	const [formErrors, setFormErrors] = useState({});

	const importantDaysOptions = [
		{ value: null, label: 'No important day' },
		{ value: 0, label: 'Sunday' },
		{ value: 1, label: 'Monday' },
		{ value: 2, label: 'Tuesday' },
		{ value: 3, label: 'Wednesday' },
		{ value: 4, label: 'Thursday' },
		{ value: 5, label: 'Friday' },
		{ value: 6, label: 'Saturday' },
	];

	const [ruleForm, setRuleForm] = useState({
		name: '',
		from: '09:00',
		to: '17:00',
		deduction: 25,
	});

	const getTimeBadgeColor = (time, type) => {
		const hour = moment(time, 'hh:mm A').hours();
		if (type === 'from') {
			if (hour < 12) return 'green';
			if (hour < 17) return 'blue';
			return 'purple';
		} else {
			if (hour < 12) return 'orange';
			if (hour < 17) return 'red';
			return 'pink';
		}
	};

	const resetForm = () => {
		setRuleForm({
			name: '',
			from: '09:00',
			to: '17:00',
			deduction: 25,
		});
		setEditingRuleIndex(null);
		setFormErrors({});
	};

	const handleOpenAddModal = () => {
		resetForm();
		onModalOpen();
	};

	const handleOpenEditModal = (index) => {
		const rule = lateDeductionSettings.lateDeductionRules[index];
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

		if (ruleForm.from >= ruleForm.to) {
			setFormErrors({
				...formErrors,
				time: '"From" time must be before "To" time',
			});
			return;
		}

		const ruleData = {
			...ruleForm,
			from: formatTimeForDisplay(ruleForm.from),
			to: formatTimeForDisplay(ruleForm.to),
		};

		let updatedRules;
		if (editingRuleIndex !== null) {
			updatedRules = [...lateDeductionSettings.lateDeductionRules];
			updatedRules[editingRuleIndex] = ruleData;
		} else {
			updatedRules = [...lateDeductionSettings.lateDeductionRules, ruleData];
		}

		setLateDeductionSettings({
			...lateDeductionSettings,
			lateDeductionRules: updatedRules,
		});

		onModalClose();
		resetForm();
	};

	const handleDeleteRule = (index) => {
		const updatedRules = lateDeductionSettings.lateDeductionRules.filter(
			(_, i) => i !== index
		);
		setLateDeductionSettings({
			...lateDeductionSettings,
			lateDeductionRules: updatedRules,
		});
	};

	const handleImportantDayChange = (day) => {
		setLateDeductionSettings({
			...lateDeductionSettings,
			importantDay: day === 'null' ? null : parseInt(day),
		});
	};

	const formatTimeForDisplay = (time) => {
		return moment(`${time}`, 'HH:mm').format('hh:mm A');
	};

	const parseTimeForInput = (timeString) => {
		return moment(timeString, 'hh:mm A').format('HH:mm');
	};

	return (
		<Box>
			<VStack spacing={6} align='stretch'>
				<Box>
					<Text fontSize='20px' fontWeight='bold' color='black' mb={4}>
						Late Deduction Rules
					</Text>

					{/* Information Message */}
					<Alert status='info' mb={4} borderRadius='md' fontSize='sm'>
						<AlertIcon />
						<Box>
							<Text fontWeight='medium'>Important Day Notice</Text>
							<Text fontSize='xs'>
								Late deductions on important day are applied at double the rate.
								For example: 50% deduction will become 100% on important days.
							</Text>
						</Box>
					</Alert>

					<Flex
						justifyContent='space-between'
						alignItems={{ base: 'stretch', md: 'center' }}
						flexDir={{ base: 'column', md: 'row' }}
						gap={4}
					>
						<FormControl maxW='300px'>
							<FormLabel fontWeight='semibold' mb={2}>
								Important Day
							</FormLabel>
							<Select
								value={lateDeductionSettings.importantDay ?? 'null'}
								onChange={(e) => handleImportantDayChange(e.target.value)}
								bg='white'
								borderColor='gray.200'
								_focus={{
									borderColor: 'brand.500',
									boxShadow: '0 0 0 1px brand.500',
								}}
							>
								{importantDaysOptions.map((day) => (
									<option key={day.value} value={day.value}>
										{day.label}
									</option>
								))}
							</Select>
						</FormControl>

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
				{/* <Box>
					<Text fontSize="20px" fontWeight="bold" color="black" mb={4}>
						Late Deduction Rules
					</Text>
					
					<Flex 
						justifyContent="space-between" 
						alignItems={{ base: "stretch", md: "center" }}
						flexDir={{ base: "column", md: "row" }}
						gap={4}
					>
						<FormControl maxW="300px">
							<FormLabel fontWeight="semibold" mb={2}>
								Important Day
							</FormLabel>
							<Select
								value={lateDeductionSettings.importantDay ?? 'null'}
								onChange={(e) => handleImportantDayChange(e.target.value)}
								bg="white"
								borderColor="gray.200"
								_focus={{ borderColor: "brand.500", boxShadow: "0 0 0 1px brand.500" }}
							>
								{importantDaysOptions.map((day) => (
									<option key={day.value} value={day.value}>
										{day.label}
									</option>
								))}
							</Select>
						</FormControl>

						<Box alignSelf={{ base: "stretch", md: "center" }}>
							<Button
								leftIcon={<AddIcon />}
								colorScheme="brand"
								onClick={handleOpenAddModal}
								size="sm"
								borderRadius="md"
								width={{ base: "100%", md: "auto" }}
							>
								Add New Rule
							</Button>
						</Box>
					</Flex>
				</Box> */}

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
								<Th whiteSpace='nowrap' py={4}>
									<Text fontSize='14px' fontWeight='600' color='gray.700'>
										Rule Name
									</Text>
								</Th>
								<Th whiteSpace='nowrap' py={4}>
									<Text fontSize='14px' fontWeight='600' color='gray.700'>
										From Time
									</Text>
								</Th>
								<Th whiteSpace='nowrap' py={4}>
									<Text fontSize='14px' fontWeight='600' color='gray.700'>
										To Time
									</Text>
								</Th>
								<Th whiteSpace='nowrap' py={4}>
									<Text fontSize='14px' fontWeight='600' color='gray.700'>
										Deduction (%)
									</Text>
								</Th>
								<Th width='120px' whiteSpace='nowrap' py={4}>
									<Text fontSize='14px' fontWeight='600' color='gray.700'>
										Actions
									</Text>
								</Th>
							</Tr>
						</Thead>

						<Tbody>
							{lateDeductionSettings.lateDeductionRules.length === 0 ? (
								<Tr>
									<Td colSpan={5} textAlign='center' color='gray.500' py={8}>
										No late deduction rules added yet
									</Td>
								</Tr>
							) : (
								lateDeductionSettings.lateDeductionRules.map((rule, index) => (
									<Tr key={index} _hover={{ bg: 'gray.50' }}>
										<Td fontWeight='medium' whiteSpace='nowrap'>
											{rule.name}
										</Td>
										<Td whiteSpace='nowrap'>
											<Badge
												colorScheme={getTimeBadgeColor(rule.from, 'from')}
												fontSize='sm'
												px={3}
												py={1}
											>
												{rule.from}
											</Badge>
										</Td>
										<Td whiteSpace='nowrap'>
											<Badge
												colorScheme={getTimeBadgeColor(rule.to, 'to')}
												fontSize='sm'
												px={3}
												py={1}
											>
												{rule.to}
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
								))
							)}
						</Tbody>
					</Table>
				</Box>

				{/* {lateDeductionSettings.lateDeductionRules.length > 0 && (
					<Box bg='blue.50' p={3} borderRadius='md'>
						<Text fontSize='sm' fontWeight='medium'>
							Total Rules: {lateDeductionSettings.lateDeductionRules.length} |
							Important Day:{' '}
							{importantDaysOptions.find(
								(d) => d.value === lateDeductionSettings.importantDay
							)?.label || 'None'}
						</Text>
					</Box>
				)} */}
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

export default LateDeductionRulesTable;
