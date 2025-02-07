import { Box, Button, Heading, HStack, Icon } from '@chakra-ui/react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import CandidateCard from '../candidates/components/CandidateCard';
import { useFetchItemsQuery, useUpdateItemMutation } from 'api/apiSlice';
import Loader from 'components/loading/Loader';
import InterviewTabs from './components/InterviewTabs';
import ErrorMessage from 'components/Message/ErrorMessage';
import { useEffect, useState, useMemo, useCallback, memo } from 'react';
import { toast } from 'react-toastify';
import { IoArrowBack } from 'react-icons/io5';

// const InterviewScreen = () => {
// 	const { interviewId } = useParams();
// 	const user = JSON.parse(localStorage.getItem('user'));
// 	const navigate = useNavigate();

// 	const [searchParams, setSearchParams] = useSearchParams();
// 	const [activeTabIndex, setActiveTabIndex] = useState(0);
// 	const [interviewersSelected, setInterviewersSelected] = useState(false);
// 	const phases = useMemo(
// 		() => ['select-interviewers', 'hiring-info', 'evaluation-points'],
// 		[]
// 	);

// 	useEffect(() => {
// 		const phase = searchParams.get('phase');
// 		const phaseIndex = phases.indexOf(phase);
// 		if (phaseIndex !== -1) {
// 			setActiveTabIndex(phaseIndex);
// 		}
// 	}, [searchParams, phases]);

// 	const handleTabChange = (index) => {
// 		if (interviewersSelected && index === 0) return;

// 		setSearchParams({ phase: phases[index] });
// 		setActiveTabIndex(index); // Update the active tab index
// 	};

// 	const {
// 		data: interview,
// 		isLoading: interviewLoading,
// 		error,
// 		refetch: interviewRefetch,
// 	} = useFetchItemsQuery({
// 		path: `/interviews/${interviewId}`,
// 	});

// 	const [updateItemMutation, { isLoading: cancellingInterview }] =
// 		useUpdateItemMutation();

// 	useEffect(() => {
// 		if (
// 			interview?.doc &&
// 			(interview?.doc?.status === 'end' ||
// 				interview?.doc?.status === 'canceled')
// 		) {
// 			toast.error('This interview has already ended.');
// 			navigate('/');
// 		}
// 	}, [interview?.doc, navigate]);

// 	const handleCancelInterview = async (interviewId) => {
// 		try {
// 			await updateItemMutation({
// 				path: `/interviews/status/${interviewId}`,
// 				body: { status: 'canceled' },
// 			});
// 			toast.success('Interview cancelled successfully');
// 			navigate('/hiring');
// 		} catch (error) {
// 			toast.error(error?.data?.message || 'Failed to cancel interview');
// 		}
// 	};

// 	const isLeadInterviewer = interview?.doc?.leadInterviewer._id === user._id;

// 	return interviewLoading || cancellingInterview ? (
// 		<Loader />
// 	) : interview && interview?.doc ? (
// 		<Box>
// 			{/* Header Section*/}
// 			<HStack
// 				bg='white'
// 				rounded='md'
// 				shadow='sm'
// 				p='1rem'
// 				justifyContent='space-between'
// 				alignItems='center'
// 				mb={2}
// 				transition={'.3s ease-in-out'}
// 			>
// 				<HStack gap={2}>
// 					<Heading size='md' color='gray.800'>
// 						Interview Started
// 					</Heading>
// 				</HStack>

// 				{isLeadInterviewer && (
// 					<Button
// 						bg='#EDC270'
// 						color='gray.800'
// 						h='8'
// 						py='2'
// 						px='4'
// 						fontSize='sm'
// 						fontWeight='normal'
// 						shadow='sm'
// 						rounded='md'
// 						_hover={{ bg: '#E0B960' }}
// 						_active={{ bg: '#D4AC50' }}
// 						onClick={() => handleCancelInterview(interview?.doc?._id)}
// 					>
// 						Cancel
// 					</Button>
// 				)}
// 			</HStack>

// 			{interview?.doc?.candidate ? (
// 				<>
// 					<Box pt='2' pb='4' px='4' rounded='md' bg='softGray.100' mb='4'>
// 						<Box width='fit-content'>
// 							<CandidateCard
// 								candidate={interview?.doc?.candidate}
// 								mode='interview'
// 							/>
// 						</Box>
// 					</Box>
// 					<InterviewTabs
// 						handleTabChange={handleTabChange}
// 						activeTabIndex={activeTabIndex}
// 						interview={interview.doc}
// 						interviewRefetch={interviewRefetch}
// 						user={user}
// 						isLeadInterviewer={isLeadInterviewer}
// 						interviewersSelected={interviewersSelected}
// 						setInterviewersSelected={setInterviewersSelected}
// 					/>
// 				</>
// 			) : (
// 				<ErrorMessage message={'Interview Candidate not found'} />
// 			)}
// 		</Box>
// 	) : (
// 		<ErrorMessage message={error?.data?.message || 'Something went wrong!'} />
// 	);
// };

const InterviewScreen = memo(() => {
	const { interviewId } = useParams();
	const navigate = useNavigate();

	// Store user in useMemo to avoid parsing on every render
	const user = useMemo(() => JSON.parse(localStorage.getItem('user')), []);

	const [searchParams, setSearchParams] = useSearchParams();
	const [activeTabIndex, setActiveTabIndex] = useState(0);
	const [interviewersSelected, setInterviewersSelected] = useState(false);

	// Memoize phases array
	const phases = useMemo(
		() => ['select-interviewers', 'hiring-info', 'evaluation-points'],
		[]
	);

	// Optimize tab switching logic
	useEffect(() => {
		const phase = searchParams.get('phase');
		const phaseIndex = phases.indexOf(phase);
		if (phaseIndex !== -1 && phaseIndex !== activeTabIndex) {
			setActiveTabIndex(phaseIndex);
		}
	}, [searchParams]);

	// Fetch interview details
	const {
		data: interview,
		isLoading: interviewLoading,
		error,
		refetch: interviewRefetch,
	} = useFetchItemsQuery({ path: `/interviews/${interviewId}` });

	// Memoize isLeadInterviewer check
	const isLeadInterviewer = useMemo(
		() => interview?.doc?.leadInterviewer._id === user._id,
		[interview, user]
	);

	const [updateItemMutation, { isLoading: cancellingInterview }] =
		useUpdateItemMutation();

	// Optimize tab change handler
	const handleTabChange = useCallback(
		(index) => {
			if (interviewersSelected && index === 0) return;
			setSearchParams({ phase: phases[index] });
			setActiveTabIndex(index);
		},
		[interviewersSelected, setSearchParams, phases]
	);

	// Handle interview status change
	useEffect(() => {
		if (!interview?.doc) return;

		if (['end', 'canceled'].includes(interview.doc.status)) {
			toast.error('This interview has already ended.');
			navigate('/');
		}
	}, [interview, navigate]);

	// Optimize cancellation function
	const handleCancelInterview = useCallback(
		async (interviewId) => {
			try {
				await updateItemMutation({
					path: `/interviews/status/${interviewId}`,
					body: { status: 'canceled' },
				});
				toast.success('Interview cancelled successfully');
				navigate('/hiring');
			} catch (error) {
				toast.error(error?.data?.message || 'Failed to cancel interview');
			}
		},
		[updateItemMutation, navigate]
	);

	// Conditional loading
	if (interviewLoading || cancellingInterview) return <Loader />;

	// Render content
	return interview && interview?.doc ? (
		<Box>
			<Button
				colorScheme='gray'
				borderRadius='5px'
				size={{ base: 'sm', md: 'md' }}
				px={{ base: 4, md: 6 }}
				py={{ base: 2, md: 3 }}
				fontSize={{ base: 'sm', md: 'md' }}
				leftIcon={<Icon as={IoArrowBack} boxSize={4} />}
				onClick={() => navigate('/hiring')}
				mb={4}
			>
				Back
			</Button>
			{/* Header Section */}
			<HStack
				bg='white'
				rounded='md'
				shadow='sm'
				p='1rem'
				justifyContent='space-between'
				alignItems='center'
				mb={2}
				transition={'.3s ease-in-out'}
			>
				<HStack gap={2}>
					<Heading size='md' color='gray.800'>
						Interview Started
					</Heading>
				</HStack>

				{isLeadInterviewer && (
					<Button
						bg='#EDC270'
						color='gray.800'
						h='8'
						py='2'
						px='4'
						fontSize='sm'
						fontWeight='normal'
						shadow='sm'
						rounded='md'
						_hover={{ bg: '#E0B960' }}
						_active={{ bg: '#D4AC50' }}
						onClick={() => handleCancelInterview(interview?.doc?._id)}
					>
						Cancel
					</Button>
				)}
			</HStack>

			{/* Candidate Section */}
			{interview?.doc?.candidate ? (
				<>
					<Box pt='2' pb='4' px='4' rounded='md' mb='4'>
						<Box width='fit-content'>
							<CandidateCard
								candidate={interview?.doc?.candidate}
								mode='interview'
							/>
						</Box>
					</Box>

					<InterviewTabs
						handleTabChange={handleTabChange}
						activeTabIndex={activeTabIndex}
						interview={interview.doc}
						interviewRefetch={interviewRefetch}
						user={user}
						isLeadInterviewer={isLeadInterviewer}
						interviewersSelected={interviewersSelected}
						setInterviewersSelected={setInterviewersSelected}
					/>
				</>
			) : (
				<ErrorMessage message={'Interview Candidate not found'} />
			)}
		</Box>
	) : (
		<ErrorMessage message={error?.data?.message || 'Something went wrong!'} />
	);
});

export default InterviewScreen;
