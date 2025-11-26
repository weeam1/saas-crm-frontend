import React, { useState, useEffect } from 'react';
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	ModalFooter,
	FormControl,
	FormLabel,
	VStack,
	HStack,
	Text,
	Flex,
	Input,
	Button,
	useColorModeValue,
} from '@chakra-ui/react';
import * as yup from 'yup';

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

const LateDeductionRuleModal = ({
	isOpen,
	onClose,
	editingRuleIndex,
	ruleForm,
	setRuleForm,
	formErrors,
	handleSaveRule,
}) => {
	const [realTimeErrors, setRealTimeErrors] = useState({});
	const [touchedFields, setTouchedFields] = useState({});

	const bgColor = useColorModeValue("white", "gray.800");
	const headerBg = useColorModeValue("brand.300", "brand.100");
	const headerText = useColorModeValue("brand.700", "brand.900");
	const footerBg = useColorModeValue("gray.50", "gray.700");
	const borderColor = useColorModeValue("gray.200", "gray.600");

	useEffect(() => {
		const validateField = async (fieldName, value) => {
			if (!touchedFields[fieldName]) return;

			try {
				await ruleValidationSchema.validateAt(fieldName, { [fieldName]: value });
				setRealTimeErrors(prev => ({ ...prev, [fieldName]: '' }));
			} catch (error) {
				setRealTimeErrors(prev => ({ ...prev, [fieldName]: error.message }));
			}
		};

		Object.keys(ruleForm).forEach(field => {
			validateField(field, ruleForm[field]);
		});
	}, [ruleForm, touchedFields]);

	const handleFieldChange = (fieldName, value) => {
		setRuleForm(prev => ({ ...prev, [fieldName]: value }));
		
		if (!touchedFields[fieldName]) {
			setTouchedFields(prev => ({ ...prev, [fieldName]: true }));
		}
	};

	const handleDeductionChange = (value) => {
		const numValue = parseFloat(value);
		handleFieldChange('deduction', isNaN(numValue) ? '' : numValue);
	};

	const handleFieldBlur = (fieldName) => {
		setTouchedFields(prev => ({ ...prev, [fieldName]: true }));
	};

	const getFieldError = (fieldName) => {
		return realTimeErrors[fieldName] || formErrors[fieldName];
	};

	const handleClose = () => {
		setRealTimeErrors({});
		setTouchedFields({});
		onClose();
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			size="lg"
			isCentered
			scrollBehavior="inside"
			motionPreset="slideInBottom"
		>
			<ModalOverlay />
			<ModalContent
				bg={bgColor}
				borderRadius="2xl"
				shadow="2xl"
				maxW={{ base: "full", sm: "90vw", md: "500px" }}
				overflow="hidden"
				mx={{ base: 3, md: 0 }}
			>
				<ModalHeader p={0} borderBottom="1px solid" borderColor={borderColor}>
					<Flex
						bg={headerBg}
						color={headerText}
						px={6}
						py={3}
						position="sticky"
						top="0"
						zIndex="10"
						boxShadow="md"
					>
						<Text fontSize={{ base: "md", md: "lg" }} fontWeight="bold">
							{editingRuleIndex !== null ? 'Edit Rule' : 'Add New Rule'}
						</Text>
						<ModalCloseButton
							position="absolute"
							right="12px"
							top="10px"
							color={headerText}
							_hover={{ bg: "whiteAlpha.200" }}
						/>
					</Flex>
				</ModalHeader>

				<ModalBody
					p={5}
					overflowY="auto"
					maxH="65vh"
					borderBottom="1px solid"
					borderColor={borderColor}
				>
					<VStack spacing={4} align="stretch">
						<FormControl isInvalid={!!getFieldError('name')}>
							<FormLabel fontWeight="semibold">Rule Name</FormLabel>
							<Input
								value={ruleForm.name}
								onChange={(e) => handleFieldChange('name', e.target.value)}
								onBlur={() => handleFieldBlur('name')}
								placeholder="e.g., Quarter Deduction Rule"
								borderColor={getFieldError('name') ? 'red.300' : 'gray.200'}
								focusBorderColor={getFieldError('name') ? 'red.300' : 'brand.500'}
							/>
							{getFieldError('name') && (
								<Text color="red.500" fontSize="sm" mt={1}>
									{getFieldError('name')}
								</Text>
							)}
						</FormControl>

						<HStack spacing={4}>
							<FormControl isInvalid={!!getFieldError('from')}>
								<FormLabel fontWeight="semibold">From Time</FormLabel>
								<TimePicker
									value={ruleForm.from}
									onChange={(time) => handleFieldChange('from', time)}
								/>
								{getFieldError('from') && (
									<Text color="red.500" fontSize="sm" mt={1}>
										{getFieldError('from')}
									</Text>
								)}
							</FormControl>

							<FormControl isInvalid={!!getFieldError('to')}>
								<FormLabel fontWeight="semibold">To Time</FormLabel>
								<TimePicker
									value={ruleForm.to}
									onChange={(time) => handleFieldChange('to', time)}
								/>
								{getFieldError('to') && (
									<Text color="red.500" fontSize="sm" mt={1}>
										{getFieldError('to')}
									</Text>
								)}
							</FormControl>
						</HStack>

						{formErrors.time && (
							<Text color="red.500" fontSize="sm" mt={1}>
								{formErrors.time}
							</Text>
						)}

						<FormControl isInvalid={!!getFieldError('deduction')}>
							<FormLabel fontWeight="semibold">Deduction Percentage</FormLabel>
							<Input
								type="number"
								value={ruleForm.deduction}
								onChange={(e) => handleDeductionChange(e.target.value)}
								onBlur={() => handleFieldBlur('deduction')}
								min={0}
								max={100}
								borderColor={getFieldError('deduction') ? 'red.300' : 'gray.200'}
								focusBorderColor={getFieldError('deduction') ? 'red.300' : 'brand.500'}
							/>
							{getFieldError('deduction') && (
								<Text color="red.500" fontSize="sm" mt={1}>
									{getFieldError('deduction')}
								</Text>
							)}
						</FormControl>
					</VStack>
				</ModalBody>

				<ModalFooter
					position="sticky"
					bottom="0"
					bg={footerBg}
					borderTop="1px solid"
					borderColor={borderColor}
					py={3}
					px={5}
					zIndex="10"
					justifyContent="flex-end"
					gap={3}
				>
					<Button
						variant="outline"
						colorScheme="gray"
						size="sm"
						onClick={handleClose}
						borderRadius="md"
					>
						Cancel
					</Button>
					<Button
						colorScheme="brand"
						size="sm"
						borderRadius="md"
						onClick={handleSaveRule}
					>
						{editingRuleIndex !== null ? 'Update Rule' : 'Add Rule'}
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default LateDeductionRuleModal;