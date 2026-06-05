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
	Text,
	Tag,
	Box,
	Divider,
	Button,
	useColorModeValue,
	Avatar,
	Progress,
	Icon,
	Flex,
	Badge,
	Tooltip,
} from '@chakra-ui/react';
import { format, formatDistanceToNow } from 'date-fns';
import {
	FiClock,
	FiCheckCircle,
	FiXCircle,
	FiUser,
	FiCalendar,
	FiMessageSquare,
	FiChevronRight,
} from 'react-icons/fi';
import { formatPostDate } from 'utils/helpers';
import { useModalColors } from 'hooks/useModalColors';

const statusConfig = {
	'not eligible': {
		color: 'red',
		icon: FiClock,
		label: 'Not Eligible',
		description: 'Candidate has not eligible',
	},
	applied: {
		color: 'orange',
		icon: FiClock,
		label: 'Applied',
		description: 'Candidate has submitted application',
	},
	pending: {
		color: 'yellow',
		icon: FiClock,
		label: 'Under Review',
		description: 'Application is being reviewed',
	},
	interview: {
		color: 'blue',
		icon: FiCalendar,
		label: 'Interview',
		description: 'Interview scheduled or completed',
	},
	invited: {
		color: 'teal',
		icon: FiUser,
		label: 'Invited',
		description: 'Candidate invited for next stage',
	},
	eligible: {
		color: 'purple',
		icon: FiCheckCircle,
		label: 'Eligible',
		description: 'Candidate meets requirements',
	},
	feedback: {
		color: 'brand',
		icon: FiUser,
		label: 'Feedback',
		description: 'Candidate feedback',
	},
	rejected: {
		color: 'red',
		icon: FiXCircle,
		label: 'Rejected',
		description: 'Candidate not selected',
	},
	hired: {
		color: 'green',
		icon: FiCheckCircle,
		label: 'Hired',
		description: 'Candidate has been hired',
	},
};

const statusOrder = [
	'applied',
	'pending',
	'eligible',
	'invited',
	'interview',
	'hired',
	'rejected',
];

const CandidateStatusHistory = ({ isOpen, onClose, candidate }) => {
	const colors = useModalColors();
	const history = candidate?.statusHistory || [];

	// Sort history by date, most recent first
	const sortedHistory = [...history].sort(
		(a, b) => new Date(b.changedAt) - new Date(a.changedAt)
	);

	// Get current status info
	const currentStatus =
		sortedHistory.length > 0 ? sortedHistory[0].status.toLowerCase() : 'status';
	const statusInfo = statusConfig[currentStatus] || statusConfig.applied;

	// Calculate progress in the hiring pipeline
	const calculateProgress = () => {
		if (!sortedHistory.length) return 0;

		const currentIndex = statusOrder.indexOf(currentStatus);
		return Math.round((currentIndex / (statusOrder.length - 1)) * 100);
	};

	const progressValue = calculateProgress();

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			size='xl'
			isCentered
			scrollBehavior='inside'
			motionPreset='slideInBottom'
		>
			<ModalOverlay bg={colors.overlayBg} backdropFilter='blur(5px)' />
			<ModalContent rounded='xl' overflow='hidden' shadow={colors.modalShadow} bg={colors.viewBg}>
				<ModalHeader py={4} bg={colors.viewHeaderBg}>
					<VStack align='flex-start' spacing={1}>
						<HStack>
							<Text fontSize='lg' fontWeight='bold' color={colors.viewHeaderText}>
								{candidate?.name || 'Candidate'}
							</Text>
						</HStack>
						<Text fontSize='sm' color={colors.mutedText} fontWeight='normal'>
							Status History Timeline
						</Text>
					</VStack>
				</ModalHeader>
				<ModalCloseButton
					color={colors.closeBtnColor}
					_hover={{ bg: colors.closeBtnHoverBg }}
					top={4}
					right={4}
				/>

				<ModalBody py={4}>
					{/* Current Status Overview */}
					{/* <Box
						p={4}
						mb={6}
						bg={colors.bgInput}
						rounded='lg'
						borderWidth='1px'
						borderColor={colors.borderColor}
						shadow='sm'
					>
						<HStack justify='space-between' mb={2}>
							<HStack>
								<Icon as={statusInfo.icon} color={colors.accentGold} />
								<Text fontWeight='medium' color={colors.headingText}>Current Status</Text>
							</HStack>
							<Badge
								bg={`rgba(212, 175, 55, 0.15)`}
								color={colors.accentGold}
								px={2}
								py={1}
								rounded='md'
								fontSize='sm'
							>
								{statusInfo.label}
							</Badge>
						</HStack>

						<Text fontSize='sm' color={colors.bodyText} mb={3}>
							{statusInfo.description}
						</Text>

						<Box mt={4}>
							<HStack justify='space-between' mb={1}>
								<Text fontSize='xs' fontWeight='medium' color={colors.bodyText}>
									Application Progress
								</Text>
								<Text fontSize='xs' color={colors.mutedText}>
									{progressValue}%
								</Text>
							</HStack>
							<Progress
								value={progressValue}
								size='sm'
								colorScheme='yellow'
								rounded='full'
								hasStripe={
									currentStatus !== 'hired' && currentStatus !== 'rejected'
								}
								bg={colors.bgDeep}
							/>
						</Box>
					</Box> */}

					{/* History Timeline */}
					<VStack align='stretch' spacing={0} position='relative'>
						<Box
							position='absolute'
							left='16px'
							top='0'
							bottom='0'
							width='2px'
							bg={colors.borderColor}
							zIndex={1}
						/>

						{sortedHistory.length === 0 ? (
							<Box
								p={6}
								textAlign='center'
								bg={colors.bgInput}
								rounded='lg'
								borderWidth='1px'
								borderColor={colors.borderColor}
							>
								<Icon as={FiClock} boxSize={6} color={colors.mutedText} mb={2} />
								<Text color={colors.bodyText}>No status history available</Text>
							</Box>
						) : (
							sortedHistory.map((item, idx) => {
								const statusKey = item.status.toLowerCase();
								const config = statusConfig[statusKey] || statusConfig.applied;
								const isLatest = idx === 0;

								return (
									<HStack
										key={idx}
										align='flex-start'
										spacing={4}
										py={2}
										position='relative'
										zIndex={2}
									>
										<Box flexShrink={0} position='relative'>
											<Box
												w='32px'
												h='32px'
												rounded='full'
												bg={isLatest ? `${config.color}.500` : 'transparent'}
												borderWidth={isLatest ? '0' : '2px'}
												borderColor={`${config.color}.500`}
												display='flex'
												alignItems='center'
												justifyContent='center'
											>
												<Icon
													as={config.icon}
													color={isLatest ? 'white' : `${config.color}.500`}
													boxSize={4}
												/>
											</Box>
										</Box>

										<Box
											flex='1'
											bg={colors.bgInput}
											// bg={isLatest ? `${config.color}.50` : colors.bgInput}
											p={4}
											rounded='lg'
											borderWidth='1px'
											borderColor={
												isLatest ? `${config.color}.200` : colors.borderColor
											}
											shadow={isLatest ? 'sm' : 'none'}
										>
											<HStack justify='space-between' mb={2}>
												<Badge
													colorScheme={config.color}
													variant={isLatest ? 'solid' : 'subtle'}
													textTransform='capitalize'
												>
													{config.label}
												</Badge>

												<Text fontSize='xs' color={colors.mutedText}>
													{formatPostDate(item.changedAt)}
												</Text>
											</HStack>

											{item.note && (
												<>
													<HStack spacing={1} mb={1}>
														<Icon
															as={FiMessageSquare}
															boxSize={3}
															color={colors.mutedText}
														/>
														<Text
															fontSize='xs'
															fontWeight='medium'
															color={colors.headingText}
														>
															Note:
														</Text>
													</HStack>
													<Text fontSize='sm' color={colors.bodyText} pl={4}>
														{item.note}
													</Text>
												</>
											)}

											{item.interviewer && (
												<HStack spacing={2} mt={2}>
													<Icon as={FiUser} boxSize={3} color={colors.mutedText} />
													<Text fontSize='xs' color={colors.bodyText}>
														With {item.interviewer}
													</Text>
												</HStack>
											)}
										</Box>
									</HStack>
								);
							})
						)}
					</VStack>
				</ModalBody>

				<Divider borderColor={colors.borderColor} />

				<ModalFooter py={3}>
					<Button
						onClick={onClose}
						rounded='lg'
						px={6}
						variant='outline'
						_hover={{
							bg: colors.secondaryBtnHoverBg,
							color: colors.accentGold,
						}}
					>
						Close
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default CandidateStatusHistory;