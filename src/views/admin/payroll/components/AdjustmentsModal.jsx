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
import { Icon, RepeatIcon } from 'lucide-react';

const PREDEFINED_ADJUSTMENTS = [
	{
		type: 'BONUS',
		calculation: 'FIXED',
		amount: 0,
		days: 0,
		note: '',
	},
	{
		type: 'ALLOWANCE',
		calculation: 'FIXED',
		amount: 0,
		note: '',
	},
	{
		type: 'OVERTIME',
		calculation: 'FIXED',
		amount: 0,
		note: '',
	},
	{
		type: 'DEDUCTION',
		calculation: 'FIXED',
		amount: 0,
		days: 0,
		note: '',
	},
];

const mergeAdjustments = (employeeAdjustments = []) => {
	const map = new Map(employeeAdjustments.map((a) => [a.type, a]));

	return PREDEFINED_ADJUSTMENTS.map((def) => ({
		...def,
		...(map.get(def.type) || {}),
	}));
};

const AdjustmentsModal = ({
	isOpen,
	onClose,
	onSave,
	employeeAdjustments = [],
	currency = 'AED',
}) => {
	const [adjustments, setAdjustments] = useState(() =>
		employeeAdjustments?.length
			? mergeAdjustments(employeeAdjustments)
			: PREDEFINED_ADJUSTMENTS,
	);

	const handleChange = (type, field, value) => {
		setAdjustments((prev) =>
			prev.map((adj) =>
				adj.type === type
					? {
							...adj,
							[field]: value,
							...(field === 'calculation' && value === 'FIXED'
								? { days: 1 }
								: {}),
						}
					: adj,
			),
		);
	};

	function normalizeAdjustments(adjustments = []) {
		return (
			// .filter((a) => Number(a.amount) > 0) // drop zeros
			adjustments.map((a) => {
				const out = {
					type: a.type, // BONUS | DEDUCTION | ...
					calculation: a.calculation, // FIXED | PER_DAY
					amount: Number(a.amount),
					note: a?.note || '',
				};

				if (a.calculation === 'PER_DAY') {
					out.days = Math.max(1, Math.min(30, Number(a.days || 1)));
				}

				return out;
			})
		);
	}

	const handleSave = (mode = 'save') => {
		const finalAdjustments =
			mode === 'save'
				? normalizeAdjustments(adjustments) || []
				: employeeAdjustments;

		onSave({ adjustments: finalAdjustments });
		onClose();
	};

	const handleReset = () => {
		setAdjustments(PREDEFINED_ADJUSTMENTS);
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
						<HStack justifyContent='space-between'>
							<Text fontSize='sm' color='gray.600'>
								Currency:{' '}
								<Text as='span' fontWeight='semibold'>
									{currency}
								</Text>
							</Text>

							<Button
								size='sm'
								variant='ghost'
								colorScheme='cyan'
								onClick={handleReset}
								leftIcon={<RepeatIcon />}
							>
								Reset
							</Button>
						</HStack>

						{adjustments?.map((adj) => (
							<Box key={adj.type} p={2} bg='gray.50' borderRadius='md'>
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
										{adj.type}
									</Badge>
									<HStack spacing={3} w='full'>
										{(adj.type === 'BONUS' || adj.type === 'DEDUCTION') && (
											<Select
												size='md'
												maxWidth='120px'
												value={adj.calculation}
												onChange={(e) =>
													handleChange(adj.type, 'calculation', e.target.value)
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
													min={0}
													value={adj.days || 1}
													onChange={(value) =>
														handleChange(adj.type, 'days', parseInt(value) || 1)
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
												handleChange(adj.type, 'amount', parseFloat(value))
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
											handleChange(adj.type, 'note', e.target.value)
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
					<Button variant='outline' onClick={() => handleSave('skip')}>
						Skip & Generate
					</Button>
					<Button colorScheme='green' ml={6} onClick={() => handleSave('save')}>
						Save & Generate
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default AdjustmentsModal;
