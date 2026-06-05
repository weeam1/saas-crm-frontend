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
import { useModalColors } from 'hooks/useModalColors';

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
	const colors = useModalColors();
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
		return adjustments.map((a) => {
			const out = {
				type: a.type,
				calculation: a.calculation,
				amount: Number(a.amount),
				note: a?.note || '',
			};

			if (a.calculation === 'PER_DAY') {
				out.days = Math.max(1, Math.min(30, Number(a.days || 1)));
			}

			return out;
		});
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

	// Get badge color based on adjustment type
	const getBadgeColors = (type) => {
		switch (type) {
			case 'DEDUCTION':
				return { bg: colors.badgeErrorBg, color: colors.badgeErrorText };
			case 'BONUS':
				return { bg: colors.badgeSuccessBg, color: colors.badgeSuccessText };
			case 'ALLOWANCE':
				return { bg: colors.badgeInfoBg, color: colors.badgeInfoText };
			default:
				return { bg: colors.badgeWarningBg, color: colors.badgeWarningText };
		}
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			size='xl'
			isCentered
			scrollBehavior='inside'
		>
			<ModalOverlay bg={colors.overlayBg} backdropFilter='blur(4px)' />
			<ModalContent
				mx={{ base: 3, md: 8 }}
				boxShadow={colors.modalShadow}
				borderRadius='2xl'
				bg={colors.bg}
				border='1px solid'
				borderColor={colors.borderColor}
				overflow='hidden'
			>
				<ModalHeader
					bg={colors.headerBg}
					color={colors.headerText}
					borderBottom='1px solid'
					borderColor={colors.borderColor}
				>
					Adjustments
				</ModalHeader>
				<ModalCloseButton
					color={colors.headerText}
					_hover={{ bg: colors.closeBtnHoverBg }}
				/>
				<ModalBody py={4}>
					<VStack spacing={4} align='stretch'>
						<HStack justifyContent='space-between'>
							<Text fontSize='sm' color={colors.mutedText}>
								Currency:{' '}
								<Text as='span' fontWeight='semibold' color={colors.headingText}>
									{currency}
								</Text>
							</Text>

							<Button
								size='sm'
								variant='ghost'
								onClick={handleReset}
								leftIcon={<RepeatIcon />}
								color={colors.bodyText}
								_hover={{ color: colors.accentGold, bg: colors.bgDeep }}
							>
								Reset
							</Button>
						</HStack>

						{adjustments?.map((adj) => {
							const badgeColors = getBadgeColors(adj.type);
							return (
								<Box
									key={adj.type}
									p={3}
									bg={colors.bgInput}
									borderRadius='md'
									border='1px solid'
									borderColor={colors.borderColor}
								>
									<VStack spacing={3} align='stretch'>
										{/* Row: Name | Calculation | Amount */}
										<Badge
											bg={badgeColors.bg}
											color={badgeColors.color}
											width='fit-content'
											py='1'
											px='3'
											borderRadius='full'
										>
											{adj.type}
										</Badge>

										<HStack spacing={3} w='full' flexWrap='wrap'>
											{(adj.type === 'BONUS' || adj.type === 'DEDUCTION') && (
												<Select
													size='md'
													maxWidth='120px'
													value={adj.calculation}
													onChange={(e) =>
														handleChange(adj.type, 'calculation', e.target.value)
													}
													bg={colors.bg}
													borderColor={colors.borderColor}
													color={colors.headingText}
													_hover={{ borderColor: colors.accentGold }}
													_focus={{
														borderColor: colors.accentGold,
														boxShadow: `0 0 0 1px ${colors.accentGold}`,
													}}
												>
													<option value='FIXED' style={{ background: colors.bg, color: colors.headingText }}>Fixed</option>
													<option value='PER_DAY' style={{ background: colors.bg, color: colors.headingText }}>Per Day</option>
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
														<NumberInputField
															bg={colors.bg}
															borderColor={colors.borderColor}
															color={colors.headingText}
															_hover={{ borderColor: colors.accentGold }}
															_focus={{
																borderColor: colors.accentGold,
																boxShadow: `0 0 0 1px ${colors.accentGold}`,
															}}
														/>
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
												<NumberInputField
													bg={colors.bg}
													borderColor={colors.borderColor}
													color={colors.headingText}
													placeholder='Amount'
													_hover={{ borderColor: colors.accentGold }}
													_focus={{
														borderColor: colors.accentGold,
														boxShadow: `0 0 0 1px ${colors.accentGold}`,
													}}
												/>
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
											bg={colors.bg}
											borderColor={colors.borderColor}
											color={colors.headingText}
											_placeholder={{ color: colors.mutedText }}
											_hover={{ borderColor: colors.accentGold }}
											_focus={{
												borderColor: colors.accentGold,
												boxShadow: `0 0 0 1px ${colors.accentGold}`,
											}}
										/>
									</VStack>
								</Box>
							);
						})}
						<Divider borderColor={colors.borderColor} />
					</VStack>
				</ModalBody>

				<ModalFooter
					bg={colors.footerBg}
					borderTop='1px solid'
					borderColor={colors.borderColor}
					gap={3}
				>
					<Button
						variant='outline'
						onClick={() => handleSave('skip')}
					>
						Skip & Generate
					</Button>
					<Button
						variant='brand'
						onClick={() => handleSave('save')}
					>
						Save & Generate
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default AdjustmentsModal;