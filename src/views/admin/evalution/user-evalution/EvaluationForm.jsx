import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
	Box,
	VStack,
	HStack,
	Text,
	Heading,
	Button,
	FormControl,
	FormLabel,
	Input,
	Textarea,
	Slider,
	SliderTrack,
	SliderFilledTrack,
	SliderThumb,
	Tooltip,
	Alert,
	AlertIcon,
	useColorModeValue,
	Flex,
	Spinner,
	Divider,
	Badge,
	Icon,
	useDisclosure,
	Progress,
	SimpleGrid,
	Collapse,
	Thead,
	Tr,
	Th,
	Tbody,
	Td,
	IconButton,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCreateItemMutation, useFetchItemsQuery } from 'api/apiSlice';
import useUserSession from 'hooks/useUserSession';
import { toast } from 'react-toastify';
import { getBadgeColors } from 'utils/colorUtils';

import {
	ChevronDownIcon,
	ChevronUpIcon,
	InfoOutlineIcon,
	StarIcon,
	TimeIcon,
	ViewIcon,
	WarningTwoIcon,
} from '@chakra-ui/icons';
import ErrorMessageBox from './components/ErrorMessageBox';
import ErrorMessage from './../../../../components/Message/ErrorMessage';
import { FiChevronLeft } from 'react-icons/fi';

const EvaluationForm = () => {
	const { roleId, userId } = useParams();
	const navigate = useNavigate();
	const { user: loggedInUser } = useUserSession();

	// States
	const [errorMessage, setErrorMessage] = useState(null);
	const [template, setTemplate] = useState(null);
	const [loading, setLoading] = useState(true);
	const [scores, setScores] = useState({});
	const [showTooltip, setShowTooltip] = useState({});

	// Colors
	const cardBg = useColorModeValue('white', 'gray.700');
	const borderColor = useColorModeValue('gray.200', 'gray.600');
	const headerBg = useColorModeValue('gray.50', 'gray.600');
	const focusColor = useColorModeValue('brand.500', 'brand.300');

	// Fetch template data
	const { data: templateData, isLoading: templateLoading } = useFetchItemsQuery(
		{
			path: `/evaluation/templates/roles`,
			params: { role: roleId },
		},
		{
			skip: !roleId,
			refetchOnMountOrArgChange: true,
			refetchOnFocus: true,
			refetchOnReconnect: true,
		}
	);

	// fetch user evaluation details
	const { data: userEval, isLoading: userEvalLoading } = useFetchItemsQuery(
		{
			path: `/evaluation/users/user/${userId}`,
		},
		{
			skip: !userId,
			refetchOnMountOrArgChange: true,
		}
	);

	// check if user already submitted the evalution
	useEffect(() => {
		if (userEval?.doc && userEval?.doc?.evaluations) {
			const alreadySubmitted = userEval?.doc?.evaluations?.find(
				(item) => item?.evaluator?._id === loggedInUser?._id
			);

			if (alreadySubmitted) {
				setErrorMessage({
					type: 'info',
					title: 'Evaluation Points',
					message: 'You already submitted the evaluation points!',
				});
			}
		}
	}, [loggedInUser, loggedInUser?._id, userEval?.doc]);

	// Create evaluation mutation
	const [createEvaluation, { isLoading: creating }] = useCreateItemMutation();

	// Initialize form with dynamic validation
	const evaluationSchema = yup.object().shape({
		notes: yup
			.string()
			.max(500, 'Notes cannot exceed 500 characters')
			.required('Evaluation notes are required'),
		// Dynamic validation for attributes will be handled separately
	});

	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
		watch,
		setValue,
	} = useForm({
		mode: 'onChange',
		resolver: yupResolver(evaluationSchema),
		defaultValues: {
			notes: '',
		},
	});

	const notesLength = watch('notes')?.length || 0;

	// Process template data
	useEffect(() => {
		if (templateData?.doc?.[0]?.hasTemplate) {
			const templateInfo = templateData.doc[0];
			setTemplate(templateInfo.template);

			// Initialize scores with 0 for all attributes
			const initialScores = {};
			templateInfo.template.attributes.forEach((attr) => {
				initialScores[attr.name] = 0;
			});
			setScores(initialScores);
		}

		setTimeout(() => {
			setLoading(false);
		}, 1000);
	}, [templateData]);

	// Handle score change
	const handleScoreChange = (attributeName, value) => {
		setScores((prev) => ({
			...prev,
			[attributeName]: value,
		}));
	};

	// Calculate total score
	const calculateTotalScore = () => {
		return Object.values(scores).reduce((total, score) => total + score, 0);
	};

	// Calculate maximum possible score
	const calculateMaxScore = () => {
		if (!template?.attributes) return 0;
		return template.attributes.reduce(
			(total, attr) => total + attr.maxScore,
			0
		);
	};

	// Submit handler
	const submitHandler = async (formData) => {
		try {
			// Prepare attributes array with scores
			const evaluationAttributes = template.attributes.map((attr) => ({
				name: attr.name,
				description: attr.description,
				score: scores[attr.name] || 0,
				maxScore: attr.maxScore,
			}));

			// Get current month and year
			const now = new Date();
			const month = now.getMonth() + 1;
			const year = now.getFullYear();

			// Get evaluator ID (assuming from auth context)
			const evaluatorId = loggedInUser?._id || '676e5a6a44f974166590fe6a'; // This should come from your auth context

			const payload = {
				userId: userId,
				month: month,
				year: year,
				evaluations: [
					{
						evaluator: evaluatorId,
						attributes: evaluationAttributes,
						notes: formData.notes.trim(),
						// status: "submitted" // You can add this if needed
					},
				],
			};

			const res = await createEvaluation({
				path: '/evaluation/users',
				body: payload,
			}).unwrap();

			toast.success('User evaluation has been submitted successfully.');

			// Navigate back or to success page
			navigate(-1);
		} catch (error) {
			console.error('Evaluation submission error:', error);
			toast.error(
				error?.data?.errors?.[0]?.msg || 'Failed to submit evaluation'
			);
		}
	};

	const roleName = templateData?.doc[0]?.roleName.replace(/^./, (c) =>
		c.toUpperCase()
	);

	const { bg: roleBg, text: roleText } = getBadgeColors(roleName);

	// Loading state
	if (loading || templateLoading || userEvalLoading) {
		return (
			<Flex justify='center' align='center' minH='400px'>
				<VStack spacing={4}>
					<Spinner size='xl' color='brand.500' />
					<Text>Loading evaluation template...</Text>
				</VStack>
			</Flex>
		);
	}

	// No template found
	if (!template) {
		return (
			<Box maxW='3xl' mx='auto' mt={20} p={6} textAlign='center'>
				<Box
					bg='yellow.50'
					border='1px solid'
					borderColor='yellow.200'
					borderRadius='xl'
					p={8}
					boxShadow='md'
				>
					<WarningTwoIcon boxSize={14} color='yellow.500' mb={4} />
					<Text fontSize='xl' fontWeight='semibold' mb={2}>
						No Evaluation Template Found
					</Text>
					<Text fontSize='md' color='gray.600'>
						This role doesn't have an evaluation template yet. You might need to
						create one or pick a different role.
					</Text>

					<Button mt={6} colorScheme='brand' onClick={() => navigate(-1)}>
						Go Back
					</Button>
				</Box>
			</Box>
		);
	}

	if (errorMessage) {
		return (
			<Box maxW='3xl' mx='auto' mt={20} p={6} textAlign='center'>
				<Box
					bg='yellow.50'
					border='1px solid'
					borderColor='yellow.200'
					borderRadius='xl'
					p={8}
					boxShadow='md'
				>
					<WarningTwoIcon boxSize={14} color='yellow.500' mb={4} />
					<Text fontSize='xl' fontWeight='semibold' mb={2}>
						{errorMessage?.title}
					</Text>
					<Text fontSize='md' color='gray.600'>
						{errorMessage?.message}
					</Text>

					<Button mt={6} colorScheme='brand' onClick={() => navigate(-1)}>
						Go Back
					</Button>
				</Box>
			</Box>
		);
	}

	return (
		<Box
			maxW={{ base: 'full', md: '5xl' }}
			rounded='lg'
			shadow='md'
			bg='white'
			mx='auto'
			p={8}
		>
			<IconButton
				aria-label='Go back'
				icon={<FiChevronLeft />}
				onClick={() => navigate(-1)}
				// variant='ghost'
				size='md'
				isRound
			/>

			{/* Header */}
			<VStack spacing={4} align='stretch' mb={8}>
				<Heading textTransform='capitalize' size='md' color='gray.700'>
					{userEval?.userDetails?.fullName} Evaluation
				</Heading>
				<Text color='gray.600' fontSize='md'>
					Role:{' '}
					<Badge
						bg={roleBg}
						color={roleText}
						variant='subtle'
						fontSize='.8em'
						px={4}
						py={2}
						borderRadius='full'
						textTransform='capitalize'
					>
						{roleName}
					</Badge>
				</Text>
				{/* <Text color='gray.500'>{templateData.doc[0].description}</Text> */}
			</VStack>

			<form onSubmit={handleSubmit(submitHandler)}>
				<VStack spacing={4} align='stretch'>
					{/* Evaluation Attributes */}
					<Box
						bg={cardBg}
						border='1px'
						rounded='md'
						borderColor={borderColor}
						shadow='sm'
					>
						<Box p={6}>
							<VStack spacing={4} align='stretch'>
								<Heading size='md' color='gray.700'>
									Evaluation Criteria
								</Heading>

								{template.attributes.map((attribute, index) => (
									<Box key={attribute.name}>
										{index > 0 && <Divider my={3} />}

										<FormControl>
											<HStack justify='space-between'>
												<FormLabel
													fontWeight='600'
													fontSize='lg'
													color='gray.700'
													mb={1}
												>
													{attribute.name}
												</FormLabel>
												<Badge colorScheme='green' fontSize='sm'>
													Score: {scores[attribute.name] || 0}/
													{attribute.maxScore}
												</Badge>
											</HStack>

											<Text
												color='gray.400'
												mb={4}
												fontSize='sm'
												display='flex'
												alignItems='flex-start'
												gap={2}
											>
												{/* <Icon
													as={InfoIcon}
													color='blue.500'
													mt={0.5}
													boxSize={3}
												/> */}
												{attribute.description}
											</Text>

											<Box px={2}>
												<Slider
													value={scores[attribute.name] || 0}
													min={0}
													max={attribute.maxScore}
													step={1}
													onChange={(val) =>
														handleScoreChange(attribute.name, val)
													}
													onMouseEnter={() =>
														setShowTooltip((prev) => ({
															...prev,
															[attribute.name]: true,
														}))
													}
													onMouseLeave={() =>
														setShowTooltip((prev) => ({
															...prev,
															[attribute.name]: false,
														}))
													}
													colorScheme='brand'
												>
													<SliderTrack
														bg='gray.200'
														h='10px'
														borderRadius='full'
														transition='all 0.3s ease'
														shadow='sm'
													>
														<SliderFilledTrack
															bg='brand.500'
															transition='width 0.25s ease'
														/>
													</SliderTrack>

													<Tooltip
														hasArrow
														bg='brand.600'
														color='white'
														placement='top'
														isOpen={showTooltip[attribute.name]}
														label={`${scores[attribute.name] || 0}`}
													>
														<SliderThumb
															boxSize={6}
															bg='white'
															border='3px solid'
															borderColor='brand.500'
															shadow='md'
															transition='all 0.2s ease'
															_hover={{
																// transform: 'scale(1.15)',
																shadow: 'lg',
																borderColor: 'brand.600',
															}}
															_focus={{
																boxShadow: '0 0 0 4px rgba(0, 0, 0, 0.15)',
															}}
														/>
													</Tooltip>
												</Slider>
											</Box>

											{/* <Box px={2}>
												<Slider
													value={scores[attribute.name] || 0}
													min={0}
													max={attribute.maxScore}
													step={1}
													onChange={(val) =>
														handleScoreChange(attribute.name, val)
													}
													onMouseEnter={() =>
														setShowTooltip((prev) => ({
															...prev,
															[attribute.name]: true,
														}))
													}
													onMouseLeave={() =>
														setShowTooltip((prev) => ({
															...prev,
															[attribute.name]: false,
														}))
													}
													colorScheme='brand'
												>
													<SliderTrack bg='gray.200' shadow='sm'>
														<SliderFilledTrack />
													</SliderTrack>
													<Tooltip
														hasArrow
														bg='brand.500'
														color='white'
														placement='top'
														isOpen={showTooltip[attribute.name]}
														label={`${scores[attribute.name] || 0}`}
													>
														<SliderThumb
															boxSize={6}
															color='gray.100'
															shadow='sm'
														/>
													</Tooltip>
												</Slider>
											</Box> */}

											<HStack justify='space-between' mt={1}>
												<Text fontSize='xs' color='gray.500'>
													0
												</Text>
												<Text fontSize='xs' color='gray.500'>
													Max: {attribute.maxScore}
												</Text>
											</HStack>
										</FormControl>
									</Box>
								))}

								{/* Total Score Summary */}
								<Box
									mt={4}
									p={4}
									bg={headerBg}
									borderRadius='lg'
									border='1px'
									borderColor={borderColor}
								>
									<HStack justify='space-between'>
										<Text fontWeight='600' color='gray.700'>
											Total Score
										</Text>
										<Badge colorScheme='blue' fontSize='md' px={3} py={1}>
											{calculateTotalScore()} / {calculateMaxScore()}
										</Badge>
									</HStack>
									<Text fontSize='sm' color='gray.600' mt={2}>
										Overall performance rating based on all criteria
									</Text>
								</Box>
							</VStack>
						</Box>
					</Box>

					{/* Evaluation Notes */}
					<Box
						bg={cardBg}
						border='1px'
						borderColor={borderColor}
						rounded='md'
						shadow='sm'
					>
						<Box p={6}>
							<FormControl isInvalid={!!errors.notes} isRequired>
								<FormLabel
									fontWeight='600'
									fontSize='lg'
									color='gray.700'
									display='flex'
									alignItems='center'
									gap={2}
								>
									<Icon as={StarIcon} color='yellow.500' />
									Evaluation Notes
								</FormLabel>
								<Text color='gray.600' mb={3}>
									Provide overall feedback and comments for the employee
								</Text>

								<Textarea
									placeholder='Write your evaluation notes, feedback, and recommendations...'
									resize='vertical'
									minH='120px'
									focusBorderColor={focusColor}
									borderColor={borderColor}
									bg='white'
									{...register('notes')}
								/>

								<Flex justify='space-between' mt={2}>
									{errors.notes ? (
										<Text fontSize='sm' color='red.500'>
											{errors.notes.message}
										</Text>
									) : (
										<Text fontSize='xs' color='gray.500'>
											{notesLength}/500 characters
										</Text>
									)}
								</Flex>
							</FormControl>
						</Box>
					</Box>

					{/* Action Buttons */}
					<HStack justify='flex-end' spacing={4} pt={4}>
						<Button
							variant='outline'
							onClick={() => navigate(-1)}
							size='lg'
							rounded='lg'
							isDisabled={creating}
						>
							Cancel
						</Button>

						<Button
							size='lg'
							rounded='lg'
							colorScheme='brand'
							type='submit'
							isLoading={creating}
							isDisabled={!isValid || creating}
							px={8}
						>
							Submit Evaluation
						</Button>
					</HStack>
				</VStack>
			</form>
		</Box>
	);
};

export default EvaluationForm;
