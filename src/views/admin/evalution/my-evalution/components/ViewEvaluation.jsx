// import { useState } from 'react';
// import {
// 	Modal,
// 	ModalOverlay,
// 	ModalContent,
// 	ModalHeader,
// 	ModalBody,
// 	ModalCloseButton,
// 	Box,
// 	VStack,
// 	HStack,
// 	Text,
// 	Heading,
// 	Badge,
// 	Progress,
// 	Flex,
// 	Icon,
// 	SimpleGrid,
// 	Button,
// 	Avatar,
// 	Tooltip,
// 	useColorModeValue,
// 	Divider,
// } from '@chakra-ui/react';

// import {
// 	StarIcon,
// 	ViewIcon,
// 	CalendarIcon,
// 	ChevronRightIcon,
// } from '@chakra-ui/icons';
// import { FaUser } from 'react-icons/fa6';
// import { useFetchItemsQuery } from 'api/apiSlice';
// import Loader from 'components/loading/Loader';
// import { constant } from 'constant';
// import EvaluationModalSkeleton from './EvaluationShimmer';

// // Evaluation Detail Modal
// const EvaluationDetailModal = ({
// 	isOpen,
// 	onClose,
// 	evaluation,
// 	userDetails,
// }) => {
// 	const cardBg = useColorModeValue('white', 'gray.700');
// 	const borderColor = useColorModeValue('gray.200', 'gray.600');
// 	const headerBg = useColorModeValue('gray.50', 'gray.600');

// 	return (
// 		<Modal isOpen={isOpen} onClose={onClose} size='2xl' isCentered>
// 			<ModalOverlay backdropFilter='blur(4px)' bg='blackAlpha.600' />
// 			<ModalContent mx='2' borderRadius='2xl' boxShadow='2xl'>
// 				<ModalHeader
// 					bg={headerBg}
// 					borderTopRadius='2xl'
// 					py={4}
// 					borderBottom='1px'
// 					borderColor={borderColor}
// 				>
// 					<HStack spacing={3}>
// 						<Avatar
// 							size='sm'
// 							name={evaluation?.evaluator?.fullName}
// 							src={
// 								evaluation?.evaluator?.profileImage
// 									? `${constant.baseUrl}${evaluation?.evaluator?.profileImage}`
// 									: undefined
// 							}
// 						/>
// 						<VStack align='start' spacing={0}>
// 							<Text fontWeight='600'>{evaluation?.evaluator?.fullName}</Text>
// 							<Text fontSize='sm' color='gray.500'>
// 								Evaluation Details
// 							</Text>
// 						</VStack>
// 					</HStack>
// 				</ModalHeader>
// 				<ModalCloseButton />
// 				<ModalBody py={6}>
// 					<VStack
// 						spacing={6}
// 						p={2}
// 						align='stretch'
// 						maxH={{ base: '60vh', md: '70vh' }}
// 						overflow='scroll'
// 						scrollBehavior='smooth'
// 					>
// 						{/* Score Summary */}
// 						<SimpleGrid columns={3} spacing={4}>
// 							<Box textAlign='center'>
// 								<Text>Average Score</Text>
// 								<Text color='blue.500'>
// 									{evaluation?.averageScore?.toFixed(1)}
// 								</Text>
// 							</Box>
// 							<Box textAlign='center'>
// 								<Text>Total Score</Text>
// 								<Text color='green.500'>
// 									{evaluation?.obtainedScore} / {evaluation?.totalScore}
// 								</Text>
// 							</Box>
// 							<Box textAlign='center'>
// 								<Text>Percentage</Text>
// 								<Text color='purple.500'>
// 									{evaluation?.percentage?.toFixed(1)}%
// 								</Text>
// 							</Box>
// 						</SimpleGrid>

// 						{/* Attributes Breakdown */}
// 						<Box bg={cardBg} border='1px' p={2} borderColor={borderColor}>
// 							<Box>
// 								<Text fontWeight='600' mb={4}>
// 									Attribute Scores
// 								</Text>
// 								<VStack
// 									p={2}
// 									spacing={4}
// 									maxH='40vh'
// 									overflow='scroll'
// 									scrollBehavior='smooth'
// 									align='stretch'
// 								>
// 									{evaluation?.attributes?.map((attr, index) => (
// 										<Box key={index}>
// 											{index > 0 && <Divider my={3} />}
// 											<VStack align='stretch' spacing={2}>
// 												<HStack justify='space-between'>
// 													<Text
// 														fontSize={{ base: 'sm', md: 'md' }}
// 														fontWeight='600'
// 													>
// 														{attr.name}
// 													</Text>
// 													<Badge
// 														colorScheme={
// 															attr.score >= attr.maxScore * 0.8
// 																? 'green'
// 																: attr.score >= attr.maxScore * 0.6
// 																	? 'orange'
// 																	: 'red'
// 														}
// 													>
// 														{attr.score}/{attr.maxScore}
// 													</Badge>
// 												</HStack>
// 												{/* <Text fontSize='sm' color='gray.600'>
// 													{attr.description}
// 												</Text> */}
// 												<Progress
// 													value={(attr.score / attr.maxScore) * 100}
// 													colorScheme={
// 														attr.score >= attr.maxScore * 0.8
// 															? 'green'
// 															: attr.score >= attr.maxScore * 0.6
// 																? 'orange'
// 																: 'red'
// 													}
// 													size='sm'
// 													w='100%'
// 													borderRadius='full'
// 												/>
// 											</VStack>
// 										</Box>
// 									))}
// 								</VStack>
// 							</Box>
// 						</Box>

// 						{/* Notes */}
// 						{evaluation?.notes && (
// 							<Box bg={cardBg} border='1px' p={2} borderColor={borderColor}>
// 								<Box>
// 									<Text fontWeight='600' mb={3}>
// 										Evaluator Notes
// 									</Text>
// 									<Box
// 										p={3}
// 										bg={headerBg}
// 										borderRadius='md'
// 										borderLeft='4px'
// 										borderColor='blue.500'
// 									>
// 										<Text color='gray.700' fontStyle='italic'>
// 											"{evaluation.notes}"
// 										</Text>
// 									</Box>
// 								</Box>
// 							</Box>
// 						)}

// 						{/* Timeline */}
// 						<HStack justify='space-between' fontSize='sm' color='gray.500'>
// 							<Text>
// 								Submitted:{' '}
// 								{new Date(evaluation?.createdAt).toLocaleDateString()}
// 							</Text>
// 							{evaluation?.updatedAt !== evaluation?.createdAt && (
// 								<Text>
// 									Updated:{' '}
// 									{new Date(evaluation?.updatedAt).toLocaleDateString()}
// 								</Text>
// 							)}
// 						</HStack>
// 					</VStack>
// 				</ModalBody>
// 			</ModalContent>
// 		</Modal>
// 	);
// };

// // Main ViewEvaluation Modal
// const ViewEvaluation = ({
// 	isOpen,
// 	onClose,
// 	data,
// 	selectedMonth,
// 	selectedYear,
// }) => {
// 	const [selectedEvaluation, setSelectedEvaluation] = useState(null);
// 	const [isDetailOpen, setIsDetailOpen] = useState(false);

// 	const userId = data?._id;

// 	// Colors
// 	const cardBg = useColorModeValue('white', 'gray.700');
// 	const borderColor = useColorModeValue('gray.200', 'gray.600');
// 	const headerBg = useColorModeValue('brand.200', 'gray.600');
// 	const successColor = useColorModeValue('green.500', 'green.300');
// 	const warningColor = useColorModeValue('orange.500', 'orange.300');
// 	const dangerColor = useColorModeValue('red.500', 'red.300');

// 	const { data: evaluationData, isLoading: userEvalLoading } =
// 		useFetchItemsQuery(
// 			{
// 				path: `/evaluation/users/user/${userId}`,
// 				params: { month: selectedMonth, year: selectedYear },
// 			},
// 			{
// 				skip: !userId,
// 				refetchOnMountOrArgChange: true,
// 				refetchOnFocus: true,
// 				refetchOnReconnect: true,
// 			}
// 		);

// 	const { doc, userDetails, month, year } = evaluationData || {};
// 	const {
// 		evaluations,
// 		finalPercentage,
// 		totalObtainedScore,
// 		totalScore,
// 		totalEvaluators,
// 	} = doc || {};

// 	// Get score color and label
// 	const getScoreColor = (percentage) => {
// 		if (percentage >= 80) return successColor;
// 		if (percentage >= 60) return warningColor;
// 		return dangerColor;
// 	};

// 	const getScoreLabel = (percentage) => {
// 		if (percentage >= 80) return 'Excellent';
// 		if (percentage >= 60) return 'Good';
// 		if (percentage >= 40) return 'Average';
// 		return 'Needs Improvement';
// 	};

// 	const handleViewDetails = (evaluation) => {
// 		setSelectedEvaluation(evaluation);
// 		setIsDetailOpen(true);
// 	};

// 	const handleCloseDetail = () => {
// 		setIsDetailOpen(false);
// 		setSelectedEvaluation(null);
// 	};

// 	return (
// 		<>
// 			<Modal
// 				isOpen={isOpen}
// 				onClose={onClose}
// 				size='5xl'
// 				isCentered
// 				scrollBehavior='inside'
// 			>
// 				<ModalOverlay backdropFilter='blur(4px)' bg='blackAlpha.600' />
// 				<ModalContent mx='2' borderRadius='2xl' boxShadow='2xl' maxH='90vh'>
// 					{userEvalLoading ? (
// 						<EvaluationModalSkeleton />
// 					) : (
// 						<>
// 							<ModalHeader
// 								bg={headerBg}
// 								borderTopRadius='2xl'
// 								py={6}
// 								borderBottom='1px'
// 								borderColor={borderColor}
// 							>
// 								<VStack spacing={3} align='stretch'>
// 									<HStack justify='space-between'>
// 										<Text fontSize={{ base: 'md', md: 'lg' }} fontWeight='bold'>
// 											Performance Evaluation
// 										</Text>
// 										{/* <Badge colorScheme='blue' fontSize='lg' px={3} py={1}>
// 									{month}/{year}
// 								</Badge> */}
// 									</HStack>
// 									{userDetails && (
// 										<HStack spacing={4}>
// 											<Avatar
// 												size='md'
// 												name={userDetails?.fullName}
// 												src={
// 													userDetails?.profileImage
// 														? `${constant.baseUrl}${userDetails.profileImage}`
// 														: undefined
// 												}
// 											/>
// 											<VStack align='start' spacing={1}>
// 												<Text fontWeight='600' fontSize='xl'>
// 													{userDetails?.fullName}
// 												</Text>
// 												<HStack spacing={3}>
// 													<Badge
// 														colorScheme='purple'
// 														variant='subtle'
// 														fontSize='.6em'
// 														px={4}
// 														py={2}
// 														borderRadius='full'
// 														textTransform='capitalize'
// 													>
// 														{userDetails?.roles?.[0]?.roleName}
// 													</Badge>
// 													{/* <Badge colorScheme='gray'>
// 											{userDetails?.agency?.name}
// 										</Badge> */}
// 												</HStack>
// 											</VStack>
// 										</HStack>
// 									)}
// 								</VStack>
// 							</ModalHeader>

// 							<ModalCloseButton />

// 							<ModalBody py={6}>
// 								{!doc ? (
// 									<Box
// 										bg='red.50'
// 										color='red.600'
// 										fontSize='lg'
// 										textAlign='center'
// 										p='4'
// 									>
// 										User Evaluation not found!
// 									</Box>
// 								) : (
// 									<VStack spacing={6} align='stretch'>
// 										{/* Overall Stats */}
// 										<SimpleGrid
// 											columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
// 											spacing={4}
// 										>
// 											<Box
// 												textAlign='center'
// 												p={4}
// 												bg={cardBg}
// 												borderRadius='lg'
// 												border='1px'
// 												borderColor={borderColor}
// 												shadow='sm'
// 											>
// 												<Text
// 													display='flex'
// 													alignItems='center'
// 													justifyContent='center'
// 													gap={2}
// 												>
// 													<Icon as={StarIcon} color='yellow.500' />
// 													Final Score
// 												</Text>
// 												<Text
// 													color={getScoreColor(finalPercentage)}
// 													fontSize='2xl'
// 												>
// 													{finalPercentage.toFixed(1)}%
// 												</Text>
// 												<Text>{getScoreLabel(finalPercentage)}</Text>
// 											</Box>

// 											<Box
// 												textAlign='center'
// 												p={4}
// 												bg={cardBg}
// 												borderRadius='lg'
// 												border='1px'
// 												borderColor={borderColor}
// 												shadow='sm'
// 											>
// 												<Text
// 													display='flex'
// 													alignItems='center'
// 													justifyContent='center'
// 													gap={2}
// 												>
// 													<Icon as={FaUser} color='blue.500' />
// 													Evaluators
// 												</Text>
// 												<Text color='blue.500' fontSize='2xl'>
// 													{totalEvaluators}
// 												</Text>
// 												<Text>Total assessments</Text>
// 											</Box>

// 											<Box
// 												textAlign='center'
// 												p={4}
// 												bg={cardBg}
// 												borderRadius='lg'
// 												border='1px'
// 												borderColor={borderColor}
// 												shadow='sm'
// 											>
// 												<Text
// 													display='flex'
// 													alignItems='center'
// 													justifyContent='center'
// 													gap={2}
// 												>
// 													<Icon as={CalendarIcon} color='green.500' />
// 													Total Points
// 												</Text>
// 												<Text color='green.500' fontSize='2xl'>
// 													{totalObtainedScore} / {totalScore}
// 												</Text>
// 												<Text>Accumulated score</Text>
// 											</Box>

// 											<Box
// 												textAlign='center'
// 												p={4}
// 												bg={cardBg}
// 												borderRadius='lg'
// 												border='1px'
// 												borderColor={borderColor}
// 												shadow='sm'
// 											>
// 												<Text
// 													display='flex'
// 													alignItems='center'
// 													justifyContent='center'
// 													gap={2}
// 												>
// 													<Icon as={ViewIcon} color='purple.500' />
// 													Average
// 												</Text>
// 												<Text color='purple.500' fontSize='2xl'>
// 													{doc.finalAvg?.toFixed(1)}
// 												</Text>
// 												<Text>Per attribute</Text>
// 											</Box>
// 										</SimpleGrid>

// 										{/* Overall Progress */}
// 										<Box
// 											bg={cardBg}
// 											border='1px'
// 											borderColor={borderColor}
// 											shadow='sm'
// 											p='2'
// 										>
// 											<Box rounded='md'>
// 												<VStack spacing={4} py='4' px='2' align='stretch'>
// 													<HStack justify='space-between'>
// 														<Text fontWeight='600' fontSize='lg'>
// 															Overall Performance
// 														</Text>
// 														<Badge
// 															colorScheme={
// 																finalPercentage >= 80
// 																	? 'green'
// 																	: finalPercentage >= 60
// 																		? 'orange'
// 																		: 'red'
// 															}
// 															fontSize={{ base: 'xs', md: 'sm' }}
// 														>
// 															{finalPercentage.toFixed(1)}% -{' '}
// 															{getScoreLabel(finalPercentage)}
// 														</Badge>
// 													</HStack>
// 													<Progress
// 														value={finalPercentage}
// 														colorScheme={
// 															finalPercentage >= 80
// 																? 'green'
// 																: finalPercentage >= 60
// 																	? 'orange'
// 																	: 'red'
// 														}
// 														size='md'
// 														w='100%'
// 														borderRadius='full'
// 														hasStripe
// 														isAnimated
// 													/>
// 													{/* <HStack
// 														justify='space-between'
// 														fontSize='sm'
// 														color='gray.600'
// 													>
// 														<Text>Needs Improvement</Text>
// 														<Text>Excellent</Text>
// 													</HStack> */}
// 												</VStack>
// 											</Box>
// 										</Box>

// 										{/* Individual Evaluations */}
// 										<Box>
// 											<Heading size='md' mb={4}>
// 												Individual Evaluations ({evaluations?.length})
// 											</Heading>
// 											<VStack spacing={4} align='stretch'>
// 												{evaluations?.map((evaluation, index) => (
// 													<Box
// 														key={evaluation._id}
// 														bg={cardBg}
// 														border='1px'
// 														borderColor={borderColor}
// 														shadow='sm'
// 														_hover={{
// 															shadow: 'md',
// 															transform: 'translateY(-2px)',
// 														}}
// 														transition='all 0.2s'
// 														p='2'
// 														rounded='md'
// 													>
// 														<Box>
// 															<HStack
// 																flexDir={{ base: 'column', md: 'row' }}
// 																justify={{
// 																	base: 'stretch',
// 																	md: 'space-between',
// 																}}
// 																align={{ base: 'stretch', md: 'center' }}
// 															>
// 																<HStack spacing={4} flex={1}>
// 																	{/* <Box
// 																w={5}
// 																h={5}
// 																bg='blue.500'
// 																color='white'
// 																borderRadius='full'
// 																display='flex'
// 																alignItems='center'
// 																justifyContent='center'
// 																fontWeight='bold'
// 																fontSize='sm'
// 															>
// 																{index + 1}
// 															</Box> */}
// 																	<HStack spacing={3}>
// 																		<Avatar
// 																			size='sm'
// 																			name={evaluation.evaluator?.fullName}
// 																			src={
// 																				evaluation.evaluator?.profileImage
// 																					? `${constant.baseUrl}${evaluation.evaluator?.profileImage}`
// 																					: undefined
// 																			}
// 																		/>
// 																		<VStack align='start' spacing={0}>
// 																			<Text fontWeight='600'>
// 																				{evaluation.evaluator?.fullName}
// 																			</Text>
// 																			<Text fontSize='sm' color='gray.500'>
// 																				{/* {evaluation.evaluatorRole} •{' '} */}
// 																				{new Date(
// 																					evaluation.createdAt
// 																				).toLocaleDateString()}
// 																			</Text>
// 																		</VStack>
// 																	</HStack>
// 																</HStack>

// 																<HStack justify='space-between' spacing={4}>
// 																	<Box textAlign='center'>
// 																		<Text
// 																			fontSize={{
// 																				base: 'sm',
// 																				md: 'lg',
// 																				lg: 'xl',
// 																			}}
// 																			fontWeight='bold'
// 																			color={getScoreColor(
// 																				evaluation.percentage
// 																			)}
// 																		>
// 																			{evaluation.percentage.toFixed(1)}%
// 																		</Text>
// 																		<Text fontSize='sm' color='gray.500'>
// 																			Score
// 																		</Text>
// 																	</Box>

// 																	<Button
// 																		variant='ghost'
// 																		colorScheme='blue'
// 																		rightIcon={<ChevronRightIcon />}
// 																		onClick={() =>
// 																			handleViewDetails(evaluation)
// 																		}
// 																	>
// 																		View
// 																	</Button>
// 																</HStack>
// 															</HStack>
// 														</Box>
// 													</Box>
// 												))}
// 											</VStack>
// 										</Box>
// 									</VStack>
// 								)}
// 							</ModalBody>
// 						</>
// 					)}
// 				</ModalContent>
// 			</Modal>

// 			{/* Evaluation Detail Modal */}
// 			<EvaluationDetailModal
// 				isOpen={isDetailOpen}
// 				onClose={handleCloseDetail}
// 				evaluation={selectedEvaluation}
// 				userDetails={userDetails}
// 			/>
// 		</>
// 	);
// };

// export default ViewEvaluation;

import { useState } from "react";
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
  useColorModeValue,
  Divider,
} from "@chakra-ui/react";

import {
  StarIcon,
  ViewIcon,
  CalendarIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import { FaUser } from "react-icons/fa6";
import { constant } from "constant";
import EvaluationModalSkeleton from "./EvaluationShimmer";

// Evaluation Detail Modal
const EvaluationDetailModal = ({
  isOpen,
  onClose,
  evaluation,
  userDetails,
}) => {
  const cardBg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const headerBg = useColorModeValue("gray.50", "gray.600");

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" isCentered>
      <ModalOverlay backdropFilter="blur(4px)" bg="blackAlpha.600" />
      <ModalContent mx="2" borderRadius="2xl" boxShadow="2xl">
        <ModalHeader
          bg={headerBg}
          borderTopRadius="2xl"
          py={4}
          borderBottom="1px"
          borderColor={borderColor}
        >
          <HStack spacing={3}>
            <Avatar
              size="sm"
              name={evaluation?.evaluator?.fullName}
              src={
                evaluation?.evaluator?.profileImage
                  ? `${constant.baseUrl}${evaluation?.evaluator?.profileImage}`
                  : undefined
              }
            />
            <VStack align="start" spacing={0}>
              <Text fontWeight="600">{evaluation?.evaluator?.fullName}</Text>
              <Text fontSize="sm" color="gray.500">
                Evaluation Details
              </Text>
            </VStack>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody py={6}>
          <VStack
            spacing={6}
            p={2}
            align="stretch"
            maxH={{ base: "60vh", md: "70vh" }}
            overflow="scroll"
            scrollBehavior="smooth"
          >
            {/* Score Summary */}
            <SimpleGrid columns={3} spacing={4}>
              <Box textAlign="center">
                <Text>Average Score</Text>
                <Text color="blue.500">
                  {evaluation?.averageScore?.toFixed(1)}
                </Text>
              </Box>
              <Box textAlign="center">
                <Text>Total Score</Text>
                <Text color="green.500">
                  {evaluation?.obtainedScore} / {evaluation?.totalScore}
                </Text>
              </Box>
              <Box textAlign="center">
                <Text>Percentage</Text>
                <Text color="purple.500">
                  {evaluation?.percentage?.toFixed(1)}%
                </Text>
              </Box>
            </SimpleGrid>

            {/* Attributes Breakdown */}
            <Box bg={cardBg} border="1px" p={2} borderColor={borderColor}>
              <Box>
                <Text fontWeight="600" mb={4}>
                  Attribute Scores
                </Text>
                <VStack
                  p={2}
                  spacing={4}
                  maxH="40vh"
                  overflow="scroll"
                  scrollBehavior="smooth"
                  align="stretch"
                >
                  {evaluation?.attributes?.map((attr, index) => (
                    <Box key={index}>
                      {index > 0 && <Divider my={3} />}
                      <VStack align="stretch" spacing={2}>
                        <HStack justify="space-between">
                          <Text
                            fontSize={{ base: "sm", md: "md" }}
                            fontWeight="600"
                          >
                            {attr.name}
                          </Text>
                          <Badge
                            colorScheme={
                              attr.score >= attr.maxScore * 0.8
                                ? "green"
                                : attr.score >= attr.maxScore * 0.6
                                  ? "orange"
                                  : "red"
                            }
                          >
                            {attr.score}/{attr.maxScore}
                          </Badge>
                        </HStack>
                        <Progress
                          value={(attr.score / attr.maxScore) * 100}
                          colorScheme={
                            attr.score >= attr.maxScore * 0.8
                              ? "green"
                              : attr.score >= attr.maxScore * 0.6
                                ? "orange"
                                : "red"
                          }
                          size="sm"
                          w="100%"
                          borderRadius="full"
                        />
                      </VStack>
                    </Box>
                  ))}
                </VStack>
              </Box>
            </Box>

            {/* Notes */}
            {evaluation?.notes && (
              <Box bg={cardBg} border="1px" p={2} borderColor={borderColor}>
                <Box>
                  <Text fontWeight="600" mb={3}>
                    Evaluator Notes
                  </Text>
                  <Box
                    p={3}
                    bg={headerBg}
                    borderRadius="md"
                    borderLeft="4px"
                    borderColor="blue.500"
                  >
                    <Text color="gray.700" fontStyle="italic">
                      "{evaluation.notes}"
                    </Text>
                  </Box>
                </Box>
              </Box>
            )}

            {/* Timeline */}
            <HStack justify="space-between" fontSize="sm" color="gray.500">
              <Text>
                Submitted:{" "}
                {new Date(evaluation?.createdAt).toLocaleDateString()}
              </Text>
              {evaluation?.updatedAt !== evaluation?.createdAt && (
                <Text>
                  Updated:{" "}
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
  data, // This is the row data passed from UserEvaluationTable
  selectedMonth,
  selectedYear,
}) => {
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Colors
  const cardBg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const headerBg = useColorModeValue("brand.200", "gray.600");
  const successColor = useColorModeValue("green.500", "green.300");
  const warningColor = useColorModeValue("orange.500", "orange.300");
  const dangerColor = useColorModeValue("red.500", "red.300");

  // Use the passed data directly - NO API call needed!
  const doc = data; // This already contains all the evaluation data
  const userDetails = data?.user; // User details are in data.user

  // Destructure the data
  const {
    evaluations = [],
    finalPercentage = 0,
    totalObtainedScore = 0,
    totalScore = 0,
    totalEvaluators = 0,
    finalAvg = 0,
    month,
    year,
  } = doc || {};

  // Get score color and label
  const getScoreColor = (percentage) => {
    if (percentage >= 80) return successColor;
    if (percentage >= 60) return warningColor;
    return dangerColor;
  };

  const getScoreLabel = (percentage) => {
    if (percentage >= 80) return "Excellent";
    if (percentage >= 60) return "Good";
    if (percentage >= 40) return "Average";
    return "Needs Improvement";
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
        size="5xl"
        isCentered
        scrollBehavior="inside"
      >
        <ModalOverlay backdropFilter="blur(4px)" bg="blackAlpha.600" />
        <ModalContent mx="2" borderRadius="2xl" boxShadow="2xl" maxH="90vh">
          {!doc ? (
            <EvaluationModalSkeleton />
          ) : (
            <>
              <ModalHeader
                bg={headerBg}
                borderTopRadius="2xl"
                py={6}
                borderBottom="1px"
                borderColor={borderColor}
              >
                <VStack spacing={3} align="stretch">
                  <HStack justify="space-between" position="relative">
                    <Text fontSize={{ base: "md", md: "lg" }} fontWeight="bold">
                      Performance Evaluation
                    </Text>
                    <Badge
                      colorScheme="blue"
                      position="absolute"
                      right="10"
                      fontSize="lg"
                      px={3}
                      py={1}
                    >
                      {month}/{year}
                    </Badge>
                  </HStack>
                  {userDetails && (
                    <HStack spacing={4}>
                      <Avatar
                        size="md"
                        name={userDetails?.fullName}
                        src={
                          userDetails?.profileImage
                            ? `${constant.baseUrl}${userDetails.profileImage}`
                            : undefined
                        }
                      />
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="600" fontSize="xl">
                          {userDetails?.fullName}
                        </Text>
                        <HStack spacing={3}>
                          <Badge
                            colorScheme="purple"
                            variant="subtle"
                            fontSize=".6em"
                            px={4}
                            py={2}
                            borderRadius="full"
                            textTransform="capitalize"
                          >
                            {userDetails?.roles?.[0]?.roleName}
                          </Badge>
                        </HStack>
                      </VStack>
                    </HStack>
                  )}
                </VStack>
              </ModalHeader>

              <ModalCloseButton />

              <ModalBody py={6}>
                <VStack spacing={6} align="stretch">
                  {/* Overall Stats */}
                  <SimpleGrid
                    columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
                    spacing={4}
                  >
                    <Box
                      textAlign="center"
                      p={4}
                      bg={cardBg}
                      borderRadius="lg"
                      border="1px"
                      borderColor={borderColor}
                      shadow="sm"
                    >
                      <Text
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        gap={2}
                      >
                        <Icon as={StarIcon} color="yellow.500" />
                        Final Score
                      </Text>
                      <Text
                        color={getScoreColor(finalPercentage)}
                        fontSize="2xl"
                      >
                        {finalPercentage.toFixed(1)}%
                      </Text>
                      <Text>{getScoreLabel(finalPercentage)}</Text>
                    </Box>

                    <Box
                      textAlign="center"
                      p={4}
                      bg={cardBg}
                      borderRadius="lg"
                      border="1px"
                      borderColor={borderColor}
                      shadow="sm"
                    >
                      <Text
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        gap={2}
                      >
                        <Icon as={FaUser} color="blue.500" />
                        Evaluators
                      </Text>
                      <Text color="blue.500" fontSize="2xl">
                        {totalEvaluators}
                      </Text>
                      <Text>Total assessments</Text>
                    </Box>

                    <Box
                      textAlign="center"
                      p={4}
                      bg={cardBg}
                      borderRadius="lg"
                      border="1px"
                      borderColor={borderColor}
                      shadow="sm"
                    >
                      <Text
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        gap={2}
                      >
                        <Icon as={CalendarIcon} color="green.500" />
                        Total Points
                      </Text>
                      <Text color="green.500" fontSize="2xl">
                        {totalObtainedScore} / {totalScore}
                      </Text>
                      <Text>Accumulated score</Text>
                    </Box>

                    <Box
                      textAlign="center"
                      p={4}
                      bg={cardBg}
                      borderRadius="lg"
                      border="1px"
                      borderColor={borderColor}
                      shadow="sm"
                    >
                      <Text
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        gap={2}
                      >
                        <Icon as={ViewIcon} color="purple.500" />
                        Average
                      </Text>
                      <Text color="purple.500" fontSize="2xl">
                        {finalAvg?.toFixed(1)}
                      </Text>
                      <Text>Per attribute</Text>
                    </Box>
                  </SimpleGrid>

                  {/* Overall Progress */}
                  <Box
                    bg={cardBg}
                    border="1px"
                    borderColor={borderColor}
                    shadow="sm"
                    p="2"
                  >
                    <Box rounded="md">
                      <VStack spacing={4} py="4" px="2" align="stretch">
                        <HStack justify="space-between">
                          <Text fontWeight="600" fontSize="lg">
                            Overall Performance
                          </Text>
                          <Badge
                            colorScheme={
                              finalPercentage >= 80
                                ? "green"
                                : finalPercentage >= 60
                                  ? "orange"
                                  : "red"
                            }
                            fontSize={{ base: "xs", md: "sm" }}
                          >
                            {finalPercentage.toFixed(1)}% -{" "}
                            {getScoreLabel(finalPercentage)}
                          </Badge>
                        </HStack>
                        <Progress
                          value={finalPercentage}
                          colorScheme={
                            finalPercentage >= 80
                              ? "green"
                              : finalPercentage >= 60
                                ? "orange"
                                : "red"
                          }
                          size="md"
                          w="100%"
                          borderRadius="full"
                          hasStripe
                          isAnimated
                        />
                      </VStack>
                    </Box>
                  </Box>

                  {/* Individual Evaluations */}
                  <Box>
                    <Heading size="md" mb={4}>
                      Individual Evaluations ({evaluations?.length})
                    </Heading>
                    <VStack spacing={4} align="stretch">
                      {evaluations?.map((evaluation, index) => (
                        <Box
                          key={evaluation._id || index}
                          bg={cardBg}
                          border="1px"
                          borderColor={borderColor}
                          shadow="sm"
                          _hover={{
                            shadow: "md",
                            transform: "translateY(-2px)",
                          }}
                          transition="all 0.2s"
                          p="2"
                          rounded="md"
                        >
                          <Box>
                            <HStack
                              flexDir={{ base: "column", md: "row" }}
                              justify={{
                                base: "stretch",
                                md: "space-between",
                              }}
                              align={{ base: "stretch", md: "center" }}
                            >
                              <HStack spacing={4} flex={1}>
                                <HStack spacing={3}>
                                  <Avatar
                                    size="sm"
                                    name={evaluation?.evaluator?.fullName}
                                    src={
                                      evaluation.evaluator?.profileImage
                                        ? `${constant.baseUrl}${evaluation.evaluator?.profileImage}`
                                        : undefined
                                    }
                                  />
                                  <VStack align="start" spacing={0}>
                                    <Text fontWeight="600">
                                      {evaluation?.evaluator?.fullName}
                                    </Text>
                                    <Text fontSize="sm" color="gray.500">
                                      {new Date(
                                        evaluation?.createdAt,
                                      ).toLocaleDateString()}
                                    </Text>
                                  </VStack>
                                </HStack>
                              </HStack>

                              <HStack justify="space-between" spacing={4}>
                                <Box textAlign="center">
                                  <Text
                                    fontSize={{
                                      base: "sm",
                                      md: "lg",
                                      lg: "xl",
                                    }}
                                    fontWeight="bold"
                                    color={getScoreColor(
                                      evaluation?.percentage,
                                    )}
                                  >
                                    {evaluation?.percentage?.toFixed(1)}%
                                  </Text>
                                  <Text fontSize="sm" color="gray.500">
                                    Score
                                  </Text>
                                </Box>

                                <Button
                                  variant="ghost"
                                  colorScheme="blue"
                                  rightIcon={<ChevronRightIcon />}
                                  onClick={() => handleViewDetails(evaluation)}
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
