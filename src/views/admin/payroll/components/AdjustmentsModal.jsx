import { useState } from 'react';
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	ModalFooter,
	VStack,
	HStack,
	Box,
	Badge,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	NumberIncrementStepper,
	NumberDecrementStepper,
	Select,
	Button,
	Divider,
	Text,
	Input,
	Textarea,
} from '@chakra-ui/react';

const PREDEFINED_ADJUSTMENTS = [
	{
		id: 'bonus',
		name: 'Bonus',
		type: 'BONUS',
		calculation: 'FIXED',
		amount: 0,
		days: 1,
	},
	{
		id: 'allowance',
		name: 'Allowance',
		type: 'ALLOWANCE',
		calculation: 'FIXED',
		amount: 0,
	},
	{
		id: 'overtime',
		name: 'Overtime',
		type: 'OVERTIME',
		calculation: 'FIXED',
		amount: 0,
	},
	{
		id: 'deduction',
		name: 'Deduction',
		type: 'DEDUCTION',
		calculation: 'FIXED',
		amount: 0,
		days: 1,
	},
];

const AdjustmentsModal = ({ isOpen, onClose, onSave }) => {
	const [adjustments, setAdjustments] = useState(PREDEFINED_ADJUSTMENTS);

	const handleChange = (id, field, value) => {
		setAdjustments((prev) =>
			prev.map((adj) =>
				adj.id === id
					? {
							...adj,
							[field]: value,
							...(field === 'calculation' && value === 'FIXED'
								? { days: 1 }
								: {}),
						}
					: adj
			)
		);
	};

	const calculateTotal = () => {
		return adjustments.reduce((total, adj) => {
			let amount = adj.amount || 0;
			if (
				(adj.type === 'BONUS' || adj.type === 'DEDUCTION') &&
				adj.calculation === 'PER_DAY'
			) {
				amount *= adj.days || 1;
			}
			return adj.type === 'DEDUCTION' ? total - amount : total + amount;
		}, 0);
	};

	const handleSave = () => {
		onSave({ adjustments });
		onClose();
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			size='xl'
			isCentered
			scrollBehavior='inside'
		>
			<ModalOverlay backdropFilter='blur(8px)' />
			<ModalContent
				mx={{ base: 3, md: 8 }}
				boxShadow='0 12px 45px rgba(0,0,0,0.25)'
				borderRadius='2xl'
			>
				<ModalHeader>Adjustments</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<VStack spacing={4} align='stretch'>
						{adjustments.map((adj) => (
							<Box key={adj.id} p={2} bg='gray.50' borderRadius='md'>
								<VStack spacing={1} align='stretch'>
									{/* Row: Name | Calculation | Amount */}
									<Badge
										colorScheme={
											adj.type === 'DEDUCTION'
												? 'red'
												: adj.type === 'BONUS'
													? 'blue'
													: adj.type === 'ALLOWANCE'
														? 'green'
														: 'orange'
										}
										width='fit-content'
										py='2'
										px='4'
									>
										{adj.name}
									</Badge>
									<HStack spacing={3} w='full'>
										{(adj.type === 'BONUS' || adj.type === 'DEDUCTION') && (
											<Select
												size='md'
												maxWidth='120px'
												value={adj.calculation}
												onChange={(e) =>
													handleChange(adj.id, 'calculation', e.target.value)
												}
											>
												<option value='FIXED'>Fixed</option>
												<option value='PER_DAY'>Per Day</option>
											</Select>
										)}

										{/* Days input if PER_DAY */}
										{(adj.type === 'BONUS' || adj.type === 'DEDUCTION') &&
											adj.calculation === 'PER_DAY' && (
												<NumberInput
													size='md'
													width='120px'
													min={1}
													max={30}
													value={adj.days || 1}
													onChange={(value) =>
														handleChange(adj.id, 'days', parseInt(value) || 1)
													}
												>
													<NumberInputField placeholder='Days' />
													<NumberInputStepper>
														<NumberIncrementStepper />
														<NumberDecrementStepper />
													</NumberInputStepper>
												</NumberInput>
											)}

										<NumberInput
											size='md'
											width='100px'
											flex='1'
											min={0}
											value={adj.amount}
											onChange={(value) =>
												handleChange(adj.id, 'amount', parseFloat(value))
											}
										>
											<NumberInputField placeholder='Amount' />
											<NumberInputStepper>
												<NumberIncrementStepper />
												<NumberDecrementStepper />
											</NumberInputStepper>
										</NumberInput>
									</HStack>

									{/* NOTE INPUT */}
									<Textarea
										value={adj.note || ''}
										onChange={(e) =>
											handleChange(adj.id, 'note', e.target.value)
										}
										placeholder='Optional note…'
										maxH='50px'
										resize='none'
										overflowY='auto'
										size='sm'
									/>
								</VStack>
							</Box>
						))}

						<Divider />
					</VStack>
				</ModalBody>

				<ModalFooter>
					<Button variant='outline' onClick={handleSave}>
						Skip & Generate
					</Button>
					<Button colorScheme='green' ml={6} onClick={handleSave}>
						Save & Generate
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default AdjustmentsModal;
