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
	Select,
	FormControl,
	FormLabel,
	VStack,
	HStack,
	Text,
	useToast,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import moment from 'moment-timezone';
import NormalTimePicker from 'components/customDatePicker/Simple/NormalTimePicker';

// TimePicker component (you can replace this with your actual NormalTimePicker)
const TimePicker = ({ value, onChange }) => {
	return (
		<input
			type='time'
			value={value}
			onChange={(e) => onChange(e.target.value)}
			style={{
				border: '1px solid #E2E8F0',
				borderRadius: '4px',
				padding: '8px',
				width: '100%',
			}}
		/>
	);
};

const LateDeductionRulesTable = ({
	lateDeductionSettings,
	setLateDeductionSettings,
}) => {
	// Initialize with empty rule for adding new ones
	const [newRule, setNewRule] = useState({
		name: '',
		from: '09:00',
		to: '17:00',
		deduction: 0.25,
	});

	const daysOfWeek = [
		{ value: null, label: 'No important day' },
		{ value: 0, label: 'Sunday' },
		{ value: 1, label: 'Monday' },
		{ value: 2, label: 'Tuesday' },
		{ value: 3, label: 'Wednesday' },
		{ value: 4, label: 'Thursday' },
		{ value: 5, label: 'Friday' },
		{ value: 6, label: 'Saturday' },
	];

	const deductionOptions = [
		{ value: 0.25, label: '0.25 (Quarter Day)' },
		{ value: 0.5, label: '0.5 (Half Day)' },
		{ value: 0.75, label: '0.75 (Three Quarters)' },
		{ value: 1, label: '1 (Full Day)' },
	];

	const handleAddRule = () => {
		if (!newRule.name.trim()) {
			// toast({
			// 	title: 'Error',
			// 	description: 'Please enter a rule name',
			// 	status: 'error',
			// 	duration: 3000,
			// 	isClosable: true,
			// });
			return;
		}

		if (newRule.from >= newRule.to) {
			// toast({
			// 	title: 'Error',
			// 	description: '"From" time must be before "To" time',
			// 	status: 'error',
			// 	duration: 3000,
			// 	isClosable: true,
			// });
			return;
		}

		const updatedRules = [
			...lateDeductionSettings.lateDeductionRules,
			{
				...newRule,
				from: formatTimeForDisplay(newRule.from),
				to: formatTimeForDisplay(newRule.to),
			},
		];

		setLateDeductionSettings({
			...lateDeductionSettings,
			lateDeductionRules: updatedRules,
		});

		// Reset new rule form
		setNewRule({
			name: '',
			from: '09:00',
			to: '17:00',
			deduction: 0.25,
		});

		// toast({
		// 	title: 'Rule added',
		// 	status: 'success',
		// 	duration: 2000,
		// 	isClosable: true,
		// });
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
		return moment(`${time}`).format('hh:mm A');
	};

	const parseTimeForInput = (timeString) => {
		return moment(timeString, 'hh:mm A').format('HH:mm');
	};

	return (
		<Box>
			<VStack spacing={6} align='stretch'>
				{/* Important Day Selection */}
				<FormControl>
					<FormLabel fontWeight='bold'>Important Day</FormLabel>
					<Select
						value={lateDeductionSettings.importantDay ?? 'null'}
						onChange={(e) => handleImportantDayChange(e.target.value)}
						maxW='300px'
					>
						{daysOfWeek.map((day) => (
							<option key={day.value} value={day.value}>
								{day.label}
							</option>
						))}
					</Select>
				</FormControl>

				{/* Add New Rule Form */}
				<Box borderWidth='1px' borderRadius='lg' p={4}>
					<Text fontWeight='bold' mb={4}>
						Add New Late Deduction Rule
					</Text>
					<HStack spacing={4} align='flex-end'>
						<FormControl>
							<FormLabel fontSize='sm'>Rule Name</FormLabel>
							<input
								type='text'
								value={newRule.name}
								onChange={(e) =>
									setNewRule({ ...newRule, name: e.target.value })
								}
								placeholder='e.g., Quarter Deduction'
								style={{
									border: '1px solid #E2E8F0',
									borderRadius: '4px',
									padding: '8px',
									width: '100%',
								}}
							/>
						</FormControl>

						<FormControl>
							<FormLabel fontSize='sm'>From Time</FormLabel>
							<TimePicker
								value={newRule.from}
								onChange={(time) => setNewRule({ ...newRule, from: time })}
							/>
						</FormControl>

						<FormControl>
							<FormLabel fontSize='sm'>To Time</FormLabel>
							<TimePicker
								value={newRule.to}
								onChange={(time) => setNewRule({ ...newRule, to: time })}
							/>
						</FormControl>

						<FormControl maxW='200px'>
							<FormLabel fontSize='sm'>Deduction</FormLabel>
							<Select
								value={newRule.deduction}
								onChange={(e) =>
									setNewRule({
										...newRule,
										deduction: parseFloat(e.target.value),
									})
								}
							>
								{deductionOptions.map((option) => (
									<option key={option.value} value={option.value}>
										{option.label}
									</option>
								))}
							</Select>
						</FormControl>

						<Button
							leftIcon={<AddIcon />}
							colorScheme='blue'
							onClick={handleAddRule}
						>
							Add Rule
						</Button>
					</HStack>
				</Box>

				{/* Rules Table */}
				<Box borderWidth='1px' borderRadius='lg' overflow='hidden'>
					<Table variant='simple'>
						<Thead bg='gray.50'>
							<Tr>
								<Th>Rule Name</Th>
								<Th>From Time</Th>
								<Th>To Time</Th>
								<Th>Deduction</Th>
								<Th width='100px'>Actions</Th>
							</Tr>
						</Thead>

						<Tbody>
							{lateDeductionSettings.lateDeductionRules.length === 0 ? (
								<Tr>
									<Td colSpan={5} textAlign='center' color='gray.500'>
										No late deduction rules added yet
									</Td>
								</Tr>
							) : (
								lateDeductionSettings.lateDeductionRules.map((rule, index) => (
									<Tr key={index}>
										{/* Editable Rule Name */}
										<Td>
											<input
												value={rule.name}
												onChange={(e) => {
													const updatedRules = [
														...lateDeductionSettings.lateDeductionRules,
													];
													updatedRules[index].name = e.target.value;
													setLateDeductionSettings({
														...lateDeductionSettings,
														lateDeductionRules: updatedRules,
													});
												}}
												style={{
													border: '1px solid #E2E8F0',
													borderRadius: '4px',
													padding: '6px',
													width: '100%',
												}}
											/>
										</Td>

										{/* Editable From Time */}
										<Td>
											<NormalTimePicker
												value={parseTimeForInput(rule.from)}
												onChange={(time) => {
													const updatedRules = [
														...lateDeductionSettings.lateDeductionRules,
													];
													updatedRules[index].from = formatTimeForDisplay(time);
													setLateDeductionSettings({
														...lateDeductionSettings,
														lateDeductionRules: updatedRules,
													});
												}}
											/>
										</Td>

										{/* Editable To Time */}
										<Td>
											<NormalTimePicker
												value={parseTimeForInput(rule.to)}
												onChange={(time) => {
													const updatedRules = [
														...lateDeductionSettings.lateDeductionRules,
													];
													updatedRules[index].to = formatTimeForDisplay(time);
													setLateDeductionSettings({
														...lateDeductionSettings,
														lateDeductionRules: updatedRules,
													});
												}}
											/>
										</Td>

										{/* Editable Deduction */}
										<Td>
											<Select
												value={rule.deduction}
												onChange={(e) => {
													const updatedRules = [
														...lateDeductionSettings.lateDeductionRules,
													];
													updatedRules[index].deduction = parseFloat(
														e.target.value
													);
													setLateDeductionSettings({
														...lateDeductionSettings,
														lateDeductionRules: updatedRules,
													});
												}}
												maxW='150px'
											>
												{deductionOptions.map((opt) => (
													<option key={opt.value} value={opt.value}>
														{opt.label}
													</option>
												))}
											</Select>
										</Td>

										{/* Delete */}
										<Td>
											<IconButton
												icon={<DeleteIcon />}
												colorScheme='red'
												variant='ghost'
												size='sm'
												onClick={() => handleDeleteRule(index)}
												aria-label='Delete rule'
											/>
										</Td>
									</Tr>
								))
							)}
						</Tbody>
					</Table>
				</Box>

				{/* Summary */}
				{lateDeductionSettings.lateDeductionRules.length > 0 && (
					<Box bg='blue.50' p={3} borderRadius='md'>
						<Text fontSize='sm' fontWeight='medium'>
							Total Rules: {lateDeductionSettings.lateDeductionRules.length} |
							Important Day:{' '}
							{daysOfWeek.find(
								(d) => d.value === lateDeductionSettings.importantDay
							)?.label || 'None'}
						</Text>
					</Box>
				)}
			</VStack>
		</Box>
	);
};

export default LateDeductionRulesTable;
