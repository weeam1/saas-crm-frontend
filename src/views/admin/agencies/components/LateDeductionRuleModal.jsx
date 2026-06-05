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
	NumberInput,
	NumberInputStepper,
	NumberIncrementStepper,
	NumberDecrementStepper,
	NumberInputField,
} from '@chakra-ui/react';
import * as yup from 'yup';
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

const LateDeductionRuleModal = ({
	isOpen,
	onClose,
	editingRuleIndex,
	ruleForm,
	setRuleForm,
	formErrors,
	handleSaveRule,
}) => {
	const colors = useModalColors();
	const [realTimeErrors, setRealTimeErrors] = useState({});
	const [touchedFields, setTouchedFields] = useState({});

	useEffect(() => {
		const validateField = async (fieldName, value) => {
			if (!touchedFields[fieldName]) return;

			try {
				await ruleValidationSchema.validateAt(fieldName, ruleForm);
				setRealTimeErrors((prev) => ({ ...prev, [fieldName]: '' }));
			} catch (error) {
				setRealTimeErrors((prev) => ({ ...prev, [fieldName]: error.message }));
			}
		};

		Object.keys(ruleForm).forEach((field) => {
			validateField(field, ruleForm[field]);
		});
	}, [ruleForm, touchedFields]);

	const handleFieldChange = (fieldName, value) => {
		setRuleForm((prev) => ({ ...prev, [fieldName]: value }));

		if (!touchedFields[fieldName]) {
			setTouchedFields((prev) => ({ ...prev, [fieldName]: true }));
		}
	};

	const handleDeductionChange = (value) => {
		const numValue = parseFloat(value);
		handleFieldChange('deduction', isNaN(numValue) ? '' : numValue);
	};

	const handleFieldBlur = (fieldName) => {
		setTouchedFields((prev) => ({ ...prev, [fieldName]: true }));
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
			size='lg'
			isCentered
			scrollBehavior='inside'
			motionPreset='slideInBottom'
		>
			<ModalOverlay bg={colors.overlayBg} backdropFilter='blur(4px)' />
			<ModalContent
				bg={colors.bg}
				borderRadius='2xl'
				boxShadow={colors.modalShadow}
				maxW={{ base: 'full', sm: '90vw', md: '500px' }}
				overflow='hidden'
				mx={{ base: 3, md: 0 }}
				border='1px solid'
				borderColor={colors.borderColor}
			>
				<ModalHeader p={0} borderBottom='1px solid' borderColor={colors.borderColor}>
					<Flex
						bg={colors.headerBg}
						color={colors.headerText}
						px={6}
						py={3}
						position='sticky'
						top='0'
						zIndex='10'
						boxShadow='sm'
					>
						<Text color={colors.headerText} fontSize={{ base: 'md', md: 'lg' }} fontWeight='bold'>
							{editingRuleIndex !== null ? 'Edit Rule' : 'Add New Rule'}
						</Text>
						<ModalCloseButton
							position='absolute'
							right='12px'
							top='10px'
							color={colors.headerText}
							_hover={{ bg: colors.closeBtnHoverBg }}
						/>
					</Flex>
				</ModalHeader>

				<ModalBody
					p={5}
					overflowY='auto'
					maxH='65vh'
					borderBottom='1px solid'
					borderColor={colors.borderColor}
					bg={colors.bg}
				>
					<VStack spacing={4} align='stretch'>
						<FormControl isInvalid={!!getFieldError('name')}>
							<FormLabel fontWeight='semibold' color={colors.labelColor}>Rule Name</FormLabel>
							<Input
								value={ruleForm.name}
								onChange={(e) => handleFieldChange('name', e.target.value)}
								onBlur={() => handleFieldBlur('name')}
								placeholder='e.g., Quarter Deduction Rule'
								borderColor={getFieldError('name') ? colors.badgeErrorText : colors.borderColor}
								bg={colors.bgInput}
								color={colors.headingText}
								_placeholder={{ color: colors.mutedText }}
								_hover={{ borderColor: colors.accentGold }}
								_focus={{
									borderColor: getFieldError('name') ? colors.badgeErrorText : colors.accentGold,
									boxShadow: `0 0 0 1px ${getFieldError('name') ? colors.badgeErrorText : colors.accentGold}`,
								}}
							/>
							{getFieldError('name') && (
								<Text color={colors.badgeErrorText} fontSize='sm' mt={1}>
									{getFieldError('name')}
								</Text>
							)}
						</FormControl>

						<HStack spacing={4} alignItems='flex-start'>
							<FormControl isInvalid={!!getFieldError('fromMinutes')}>
								<FormLabel fontWeight='semibold' color={colors.labelColor}>From Minutes</FormLabel>

								<NumberInput
									value={ruleForm.fromMinutes}
									onChange={(valueString, valueNumber) =>
										handleFieldChange('fromMinutes', valueNumber)
									}
									onBlur={() => handleFieldBlur('fromMinutes')}
									min={0}
									max={1440}
									step={1}
									clampValueOnBlur
								>
									<NumberInputField
										placeholder='e.g. 15'
										borderColor={getFieldError('fromMinutes') ? colors.badgeErrorText : colors.borderColor}
										bg={colors.bgInput}
										color={colors.headingText}
										_hover={{ borderColor: colors.accentGold }}
										_focus={{
											borderColor: getFieldError('fromMinutes') ? colors.badgeErrorText : colors.accentGold,
											boxShadow: `0 0 0 1px ${getFieldError('fromMinutes') ? colors.badgeErrorText : colors.accentGold}`,
										}}
									/>
									<NumberInputStepper>
										<NumberIncrementStepper />
										<NumberDecrementStepper />
									</NumberInputStepper>
								</NumberInput>

								{getFieldError('fromMinutes') && (
									<Text color={colors.badgeErrorText} fontSize='sm' mt={1}>
										{getFieldError('fromMinutes')}
									</Text>
								)}
							</FormControl>

							<FormControl isInvalid={!!getFieldError('toMinutes')}>
								<FormLabel fontWeight='semibold' color={colors.labelColor}>To Minutes</FormLabel>

								<NumberInput
									value={ruleForm.toMinutes}
									onChange={(valueString, valueNumber) =>
										handleFieldChange('toMinutes', valueNumber)
									}
									onBlur={() => handleFieldBlur('toMinutes')}
									min={ruleForm.fromMinutes + 1}
									max={1440}
									step={1}
									clampValueOnBlur
								>
									<NumberInputField
										placeholder='e.g. 60'
										borderColor={getFieldError('toMinutes') ? colors.badgeErrorText : colors.borderColor}
										bg={colors.bgInput}
										color={colors.headingText}
										_hover={{ borderColor: colors.accentGold }}
										_focus={{
											borderColor: getFieldError('toMinutes') ? colors.badgeErrorText : colors.accentGold,
											boxShadow: `0 0 0 1px ${getFieldError('toMinutes') ? colors.badgeErrorText : colors.accentGold}`,
										}}
									/>
									<NumberInputStepper>
										<NumberIncrementStepper />
										<NumberDecrementStepper />
									</NumberInputStepper>
								</NumberInput>

								{getFieldError('toMinutes') && (
									<Text color={colors.badgeErrorText} fontSize='sm' mt={1}>
										{getFieldError('toMinutes')}
									</Text>
								)}
							</FormControl>
						</HStack>

						{formErrors.range && (
							<Text color={colors.badgeErrorText} fontSize='sm' mt={1}>
								{formErrors.range}
							</Text>
						)}

						{ruleForm.fromMinutes !== '' && ruleForm.toMinutes !== '' && (
							<Text fontSize='sm' color={colors.mutedText}>
								Late between <b>{ruleForm.fromMinutes}</b> and{' '}
								<b>{ruleForm.toMinutes}</b> minutes
							</Text>
						)}

						<FormControl isInvalid={!!getFieldError('deduction')}>
							<FormLabel fontWeight='semibold' color={colors.labelColor}>Deduction Percentage</FormLabel>
							<Input
								type='number'
								value={ruleForm.deduction}
								onChange={(e) => handleDeductionChange(e.target.value)}
								onBlur={() => handleFieldBlur('deduction')}
								min={0}
								max={100}
								borderColor={getFieldError('deduction') ? colors.badgeErrorText : colors.borderColor}
								bg={colors.bgInput}
								color={colors.headingText}
								_placeholder={{ color: colors.mutedText }}
								_hover={{ borderColor: colors.accentGold }}
								_focus={{
									borderColor: getFieldError('deduction') ? colors.badgeErrorText : colors.accentGold,
									boxShadow: `0 0 0 1px ${getFieldError('deduction') ? colors.badgeErrorText : colors.accentGold}`,
								}}
							/>
							{getFieldError('deduction') && (
								<Text color={colors.badgeErrorText} fontSize='sm' mt={1}>
									{getFieldError('deduction')}
								</Text>
							)}
						</FormControl>
					</VStack>
				</ModalBody>

				<ModalFooter
					position='sticky'
					bottom='0'
					bg={colors.footerBg}
					borderTop='1px solid'
					borderColor={colors.borderColor}
					py={3}
					px={5}
					zIndex='10'
					justifyContent='flex-end'
					gap={3}
				>
					<Button
						variant='outline'
						size='sm'
						onClick={handleClose}
						borderRadius='md'
					>
						Cancel
					</Button>
					<Button
						variant='brand'
						size='sm'
						borderRadius='md'
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