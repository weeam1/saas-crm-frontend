import { useState } from 'react';
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalCloseButton,
	Box,
	VStack,
	HStack,
	Text,
	Heading,
	Badge,
	Progress,
	Flex,
	Icon,
	SimpleGrid,
	Button,
	Avatar,
	Tooltip,
	Divider,
} from '@chakra-ui/react';

import {
	StarIcon,
	ViewIcon,
	CalendarIcon,
	ChevronRightIcon,
} from '@chakra-ui/icons';
import { FaUser } from 'react-icons/fa6';
import { useFetchItemsQuery } from 'api/apiSlice';
import Loader from 'components/loading/Loader';
import { constant } from 'constant';
import EvaluationModalSkeleton from './EvaluationShimmer';
import { useModalColors } from 'hooks/useModalColors';

// Evaluation Detail Modal
const EvaluationDetailModal = ({
	isOpen,
	onClose,
	evaluation,
	userDetails,
}) => {
	const colors = useModalColors();

	return (
		<Modal isOpen={isOpen} onClose={onClose} size='2xl' isCentered>
			<ModalOverlay bg={colors.overlayBg} backdropFilter='blur(4px)' />
			<ModalContent mx='2' borderRadius='2xl' boxShadow={colors.modalShadow} bg={colors.viewBg}>
				<ModalHeader
					bg={colors.viewHeaderBg}
					color={colors.viewHeaderText}
					borderTopRadius='2xl'
					py={4}
					borderBottom='1px'
					borderColor={colors.viewHeaderBorder}
				>
					<HStack spacing={3}>
						<Avatar
							size='sm'
							name={evaluation?.evaluator?.fullName}
							src={
								evaluation?.evaluator?.profileImage
									? `${constant.baseUrl}${evaluation?.evaluator?.profileImage}`
									: undefined
							}
						/>
						<VStack align='start' spacing={0}>
							<Text fontWeight='600' color={colors.viewHeaderText}>{evaluation?.evaluator?.fullName}</Text>
							<Text fontSize='sm' color={colors.mutedText}>Evaluation Details</Text>
						</VStack>
					</HStack>
				</ModalHeader>
				<ModalCloseButton color={colors.viewHeaderText} _hover={{ bg: colors.closeBtnHoverBg }} />
				<ModalBody py={6} bg={colors.viewBg}>
					<VStack
						spacing={6}
						p={2}
						align='stretch'
						maxH={{ base: '60vh', md: '70vh' }}
						overflowY='auto'
						scrollBehavior='smooth'
					>
						{/* Score Summary */}
						<SimpleGrid columns={3} spacing={4}>
							<Box textAlign='center'>
								<Text color={colors.mutedText}>Average Score</Text>
								<Text color={colors.bodyText}>
									{evaluation?.averageScore?.toFixed(1)}
								</Text>
							</Box>
							<Box textAlign='center'>
								<Text color={colors.mutedText}>Total Score</Text>
								<Text color={colors.bodyText}>
									{evaluation?.obtainedScore} / {evaluation?.totalScore}
								</Text>
							</Box>
							<Box textAlign='center'>
								<Text color={colors.mutedText}>Percentage</Text>
								<Text color={colors.bodyText}>
									{evaluation?.percentage?.toFixed(1)}%
								</Text>
							</Box>
						</SimpleGrid>

						{/* Attributes Breakdown */}
						<Box  bg={colors.bgInput} border='1px' p={2} borderColor={colors.borderColor} borderRadius='md'>
							<Box>
								<Text fontWeight='600' mb={4} color={colors.headingText}>
									Attribute Scores
								</Text>
								<VStack
									p={2}
									spacing={4}
									maxH='40vh'
									overflowY='auto'
									scrollBehavior='smooth'
									align='stretch'
								>
									{evaluation?.attributes?.map((attr, index) => (
										<Box key={index}>
											{index > 0 && <Divider my={3} borderColor={colors.borderColor} />}
											<VStack align='stretch' spacing={2}>
												<HStack justify='space-between'>
													<Text
														fontSize={{ base: 'sm', md: 'md' }}
														fontWeight='600'
														color={colors.bodyText}
													>
														{attr.name}
													</Text>
													<Badge
														bg={
															attr.score >= attr.maxScore * 0.8
																? colors.badgeSuccessBg
																: attr.score >= attr.maxScore * 0.6
																	? colors.badgeWarningBg
																	: colors.badgeErrorBg
														}
														color={
															attr.score >= attr.maxScore * 0.8
																? colors.badgeSuccessText
																: attr.score >= attr.maxScore * 0.6
																	? colors.badgeWarningText
																	: colors.badgeErrorText
														}
													>
														{attr.score}/{attr.maxScore}
													</Badge>
												</HStack>
												<Progress
													value={(attr.score / attr.maxScore) * 100}
													colorScheme={
														attr.score >= attr.maxScore * 0.8
															? 'green'
															: attr.score >= attr.maxScore * 0.6
																? 'orange'
																: 'red'
													}
													size='sm'
													w='100%'
													borderRadius='full'
												/>
											</VStack>
										</Box>
									))}
								</VStack>
							</Box>
						</Box>

						{/* Notes */}
						{evaluation?.notes && (
							<Box bg={colors.bgInput} border='1px' p={2} borderColor={colors.borderColor} borderRadius='md'>
								<Box>
									<Text fontWeight='600' mb={3} color={colors.headingText}>
										Evaluator Notes
									</Text>
									<Box
										p={3}
										bg={colors.bgDeep}
										borderRadius='md'
										borderLeft='4px'
										borderColor={colors.borderColor}
									>
										<Text color={colors.bodyText} fontStyle='italic'>
											"{evaluation.notes}"
										</Text>
									</Box>
								</Box>
							</Box>
						)}

						{/* Timeline */}
						<HStack justify='space-between' fontSize='sm' color={colors.mutedText}>
							<Text>
								Submitted:{' '}
								{new Date(evaluation?.createdAt).toLocaleDateString()}
							</Text>
							{evaluation?.updatedAt !== evaluation?.createdAt && (
								<Text>
									Updated:{' '}
									{new Date(evaluation?.updatedAt).toLocaleDateString()}
								</Text>
							)}
						</HStack>
					</VStack>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

// Main ViewEvaluation Modal
const ViewEvaluation = ({
	isOpen,
	onClose,
	data,
	selectedMonth,
	selectedYear,
}) => {
	const colors = useModalColors();
	const [selectedEvaluation, setSelectedEvaluation] = useState(null);
	const [isDetailOpen, setIsDetailOpen] = useState(false);

	const userId = data?._id;

	const { data: evaluationData, isLoading: userEvalLoading } =
		useFetchItemsQuery(
			{
				path: `/evaluation/users/user/${userId}`,
				params: { month: selectedMonth, year: selectedYear },
			},
			{
				skip: !userId,
				refetchOnMountOrArgChange: true,
				refetchOnFocus: true,
				refetchOnReconnect: true,
			}
		);

	const { doc, userDetails, month, year } = evaluationData || {};
	const {
		evaluations,
		finalPercentage,
		totalObtainedScore,
		totalScore,
		totalEvaluators,
	} = doc || {};

	// Get score color and label
	const getScoreColor = (percentage) => {
		if (percentage >= 80) return colors.badgeSuccessText;
		if (percentage >= 60) return colors.badgeWarningText;
		return colors.badgeErrorText;
	};

	const getScoreLabel = (percentage) => {
		if (percentage >= 80) return 'Excellent';
		if (percentage >= 60) return 'Good';
		if (percentage >= 40) return 'Average';
		return 'Needs Improvement';
	};

	const handleViewDetails = (evaluation) => {
		setSelectedEvaluation(evaluation);
		setIsDetailOpen(true);
	};

	const handleCloseDetail = () => {
		setIsDetailOpen(false);
		setSelectedEvaluation(null);
	};

	return (
		<>
			<Modal
				isOpen={isOpen}
				onClose={onClose}
				size='5xl'
				isCentered
				scrollBehavior='inside'
			>
				<ModalOverlay bg={colors.overlayBg} backdropFilter='blur(4px)' />
				<ModalContent mx='2' borderRadius='2xl' boxShadow={colors.modalShadow} maxH='90vh' bg={colors.viewBg}>
					{userEvalLoading ? (
						<EvaluationModalSkeleton />
					) : (
						<>
							<ModalHeader
								bg={colors.viewHeaderBg}
								color={colors.viewHeaderText}
								borderTopRadius='2xl'
								py={6}
								borderBottom='1px'
								borderColor={colors.viewHeaderBorder}
							>
								<VStack spacing={3} align='stretch'>
									<HStack justify='space-between'>
										<Text fontSize={{ base: 'md', md: 'lg' }} fontWeight='bold' color={colors.viewHeaderText}>
											Performance Evaluation
										</Text>
									</HStack>
									{userDetails && (
										<HStack spacing={4}>
											<Avatar
												size='md'
												name={userDetails?.fullName}
												src={
													userDetails?.profileImage
														? `${constant.baseUrl}${userDetails.profileImage}`
														: undefined
												}
											/>
											<VStack align='start' spacing={1}>
												<Text fontWeight='600' fontSize='xl' color={colors.viewHeaderText}>
													{userDetails?.fullName}
												</Text>
												<HStack spacing={3}>
													<Badge
														bg={colors.badgeInfoBg}
														color={colors.badgeInfoText}
														fontSize='.6em'
														px={4}
														py={2}
														borderRadius='full'
														textTransform='capitalize'
													>
														{userDetails?.roles?.[0]?.roleName}
													</Badge>
												</HStack>
											</VStack>
										</HStack>
									)}
								</VStack>
							</ModalHeader>

							<ModalCloseButton color={colors.viewHeaderText} _hover={{ bg: colors.closeBtnHoverBg }} />

							<ModalBody py={6} bg={colors.viewBg}>
								{!doc ? (
									<Box
										bg={colors.badgeErrorBg}
										color={colors.badgeErrorText}
										fontSize='lg'
										textAlign='center'
										p='4'
										borderRadius='md'
									>
										User Evaluation not found!
									</Box>
								) : (
									<VStack spacing={6} align='stretch'>
										{/* Overall Stats */}
										<SimpleGrid
											columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
											spacing={4}
										>
											<Box
												textAlign='center'
												p={4}
												bg={colors.bgInput}
												borderRadius='lg'
												border='1px'
												borderColor={colors.borderColor}
												boxShadow={colors.cardShadow}
											>
												<Text
													display='flex'
													alignItems='center'
													justifyContent='center'
													gap={2}
													color={colors.mutedText}
												>
													<Icon as={StarIcon} color={colors.bodyText} />
													Final Score
												</Text>
												<Text
													color={getScoreColor(finalPercentage)}
													fontSize='2xl'
												>
													{finalPercentage.toFixed(1)}%
												</Text>
												<Text color={colors.bodyText}>{getScoreLabel(finalPercentage)}</Text>
											</Box>

											<Box
												textAlign='center'
												p={4}
												bg={colors.bgInput}
												borderRadius='lg'
												border='1px'
												borderColor={colors.borderColor}
												boxShadow={colors.cardShadow}
											>
												<Text
													display='flex'
													alignItems='center'
													justifyContent='center'
													gap={2}
													color={colors.mutedText}
												>
													<Icon as={FaUser} color={colors.bodyText} />
													Evaluators
												</Text>
												<Text color={colors.bodyText} fontSize='2xl'>
													{totalEvaluators}
												</Text>
												<Text color={colors.bodyText}>Total assessments</Text>
											</Box>

											<Box
												textAlign='center'
												p={4}
												bg={colors.bgInput}
												borderRadius='lg'
												border='1px'
												borderColor={colors.borderColor}
												boxShadow={colors.cardShadow}
											>
												<Text
													display='flex'
													alignItems='center'
													justifyContent='center'
													gap={2}
													color={colors.mutedText}
												>
													<Icon as={CalendarIcon} color={colors.bodyText} />
													Total Points
												</Text>
												<Text color={colors.bodyText} fontSize='2xl'>
													{totalObtainedScore} / {totalScore}
												</Text>
												<Text color={colors.bodyText}>Accumulated score</Text>
											</Box>

											<Box
												textAlign='center'
												p={4}
												bg={colors.bgInput}
												borderRadius='lg'
												border='1px'
												borderColor={colors.borderColor}
												boxShadow={colors.cardShadow}
											>
												<Text
													display='flex'
													alignItems='center'
													justifyContent='center'
													gap={2}
													color={colors.mutedText}
												>
													<Icon as={ViewIcon} color={colors.bodyText} />
													Average
												</Text>
												<Text color={colors.bodyText} fontSize='2xl'>
													{doc.finalAvg?.toFixed(1)}
												</Text>
												<Text color={colors.bodyText}>Per attribute</Text>
											</Box>
										</SimpleGrid>

										{/* Overall Progress */}
										<Box
											bg={colors.bgInput}
											border='1px'
											borderColor={colors.borderColor}
											boxShadow={colors.cardShadow}
											p='2'
											borderRadius='md'
										>
											<Box rounded='md'>
												<VStack spacing={4} py='4' px='2' align='stretch'>
													<HStack justify='space-between'>
														<Text fontWeight='600' fontSize='lg' color={colors.headingText}>
															Overall Performance
														</Text>
														<Badge
															bg={
																finalPercentage >= 80
																	? colors.badgeSuccessBg
																	: finalPercentage >= 60
																		? colors.badgeWarningBg
																		: colors.badgeErrorBg
															}
															color={
																finalPercentage >= 80
																	? colors.badgeSuccessText
																	: finalPercentage >= 60
																		? colors.badgeWarningText
																		: colors.badgeErrorText
															}
															fontSize={{ base: 'xs', md: 'sm' }}
														>
															{finalPercentage.toFixed(1)}% -{' '}
															{getScoreLabel(finalPercentage)}
														</Badge>
													</HStack>
													<Progress
														value={finalPercentage}
														colorScheme={
															finalPercentage >= 80
																? 'green'
																: finalPercentage >= 60
																	? 'orange'
																	: 'red'
														}
														size='md'
														w='100%'
														borderRadius='full'
														hasStripe
														isAnimated
													/>
												</VStack>
											</Box>
										</Box>

										{/* Individual Evaluations */}
										<Box>
											<Heading size='md' mb={4} color={colors.headingText}>
												Individual Evaluations ({evaluations?.length})
											</Heading>
											<VStack spacing={4} align='stretch'>
												{evaluations?.map((evaluation, index) => (
													<Box
														key={evaluation._id}
														bg={colors.bgInput}
														border='1px'
														borderColor={colors.borderColor}
														boxShadow={colors.cardShadow}
														_hover={{
															boxShadow: colors.modalShadow,
															transform: 'translateY(-2px)',
														}}
														transition='all 0.2s'
														p='2'
														rounded='md'
													>
														<Box>
															<HStack
																flexDir={{ base: 'column', md: 'row' }}
																justify={{
																	base: 'stretch',
																	md: 'space-between',
																}}
																align={{ base: 'stretch', md: 'center' }}
															>
																<HStack spacing={4} flex={1}>
																	<HStack spacing={3}>
																		<Avatar
																			size='sm'
																			name={evaluation.evaluator?.fullName}
																			src={
																				evaluation.evaluator?.profileImage
																					? `${constant.baseUrl}${evaluation.evaluator?.profileImage}`
																					: undefined
																			}
																		/>
																		<VStack align='start' spacing={0}>
																			<Text fontWeight='600' color={colors.headingText}>
																				{evaluation.evaluator?.fullName}
																			</Text>
																			<Text fontSize='sm' color={colors.mutedText}>
																				{new Date(
																					evaluation.createdAt
																				).toLocaleDateString()}
																			</Text>
																		</VStack>
																	</HStack>
																</HStack>

																<HStack justify='space-between' spacing={4}>
																	<Box textAlign='center'>
																		<Text
																			fontSize={{
																				base: 'sm',
																				md: 'lg',
																				lg: 'xl',
																			}}
																			fontWeight='bold'
																			color={getScoreColor(
																				evaluation.percentage
																			)}
																		>
																			{evaluation.percentage.toFixed(1)}%
																		</Text>
																		<Text fontSize='sm' color={colors.mutedText}>
																			Score
																		</Text>
																	</Box>

																	<Button
																		variant='ghost'
																		rightIcon={<ChevronRightIcon />}
																		onClick={() =>
																			handleViewDetails(evaluation)
																		}
																		color={colors.bodyText}
																		_hover={{ color: colors.accentGold }}
																	>
																		View
																	</Button>
																</HStack>
															</HStack>
														</Box>
													</Box>
												))}
											</VStack>
										</Box>
									</VStack>
								)}
							</ModalBody>
						</>
					)}
				</ModalContent>
			</Modal>

			{/* Evaluation Detail Modal */}
			<EvaluationDetailModal
				isOpen={isDetailOpen}
				onClose={handleCloseDetail}
				evaluation={selectedEvaluation}
				userDetails={userDetails}
			/>
		</>
	);
};

export default ViewEvaluation;