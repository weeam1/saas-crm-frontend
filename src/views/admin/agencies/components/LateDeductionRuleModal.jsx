import React from 'react';
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
    ColorTimePicker
}) => {
	const bgColor = useColorModeValue("white", "gray.800");
	const headerBg = useColorModeValue("brand.300", "brand.100");
	const headerText = useColorModeValue("brand.700", "brand.900");
	const footerBg = useColorModeValue("gray.50", "gray.700");
	const borderColor = useColorModeValue("gray.200", "gray.600");

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
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
						<FormControl isInvalid={formErrors.name}>
							<FormLabel fontWeight="semibold">Rule Name</FormLabel>
							<Input
								value={ruleForm.name}
								onChange={(e) => setRuleForm({ ...ruleForm, name: e.target.value })}
								placeholder="e.g., Quarter Deduction Rule"
								borderColor={formErrors.name ? 'red.300' : 'gray.200'}
								focusBorderColor={formErrors.name ? 'red.300' : 'brand.500'}
							/>
							{formErrors.name && (
								<Text color="red.500" fontSize="sm" mt={1}>
									{formErrors.name}
								</Text>
							)}
						</FormControl>

						<HStack spacing={4}>
							<FormControl isInvalid={formErrors.from}>
								<FormLabel fontWeight="semibold">From Time</FormLabel>
								<TimePicker
									value={ruleForm.from}
									onChange={(time) => setRuleForm({ ...ruleForm, from: time })}
								/>
								{formErrors.from && (
									<Text color="red.500" fontSize="sm" mt={1}>
										{formErrors.from}
									</Text>
								)}
							</FormControl>

							<FormControl isInvalid={formErrors.to}>
								<FormLabel fontWeight="semibold">To Time</FormLabel>
								<TimePicker
									value={ruleForm.to}
									onChange={(time) => setRuleForm({ ...ruleForm, to: time })}
								/>
								{formErrors.to && (
									<Text color="red.500" fontSize="sm" mt={1}>
										{formErrors.to}
									</Text>
								)}
							</FormControl>
						</HStack>

						{formErrors.time && (
							<Text color="red.500" fontSize="sm" mt={1}>
								{formErrors.time}
							</Text>
						)}

						<FormControl isInvalid={formErrors.deduction}>
							<FormLabel fontWeight="semibold">Deduction Percentage</FormLabel>
							<Input
								type="number"
								value={ruleForm.deduction}
								onChange={(e) => setRuleForm({ ...ruleForm, deduction: parseFloat(e.target.value) || 0 })}
								min={0}
								max={100}
								step={0.5}
								borderColor={formErrors.deduction ? 'red.300' : 'gray.200'}
								focusBorderColor={formErrors.deduction ? 'red.300' : 'brand.500'}
							/>
							{formErrors.deduction && (
								<Text color="red.500" fontSize="sm" mt={1}>
									{formErrors.deduction}
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
						onClick={onClose}
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