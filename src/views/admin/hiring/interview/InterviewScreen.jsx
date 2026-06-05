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
import { getCurrentInterviewRound } from '../helpers';
import { useModalColors } from 'hooks/useModalColors';

const InterviewScreen = memo(() => {
	const colors = useModalColors();
	const { interviewId } = useParams();
	const navigate = useNavigate();

	// Store user in useMemo to avoid parsing on every render
	const user = useMemo(() => JSON.parse(localStorage.getItem('user')), []);

	const [searchParams, setSearchParams] = useSearchParams();
	const [activeTabIndex, setActiveTabIndex] = useState(0);
	const [interviewersSelected, setInterviewersSelected] = useState(false);
	const [isRefetching, setIsRefetching] = useState(false);

	// Memoize phases array
	const phases = useMemo(
		() => ['select-interviewers', 'evaluation-points', 'hiring-info'],
		[]
	);

	useEffect(() => {
		const timer = setTimeout(() => setIsRefetching(false), 3000);
		return () => clearTimeout(timer);
	}, []);

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
	} = useFetchItemsQuery(
		{ path: `/interviews/${interviewId}` },
		{ refetchOnMountOrArgChange: true }
	);

	const currentRound = getCurrentInterviewRound(interview?.doc);

	const isLeadInterviewer = useMemo(
		() => currentRound?.leadInterviewer?._id === user?._id,
		[currentRound?.leadInterviewer?._id, user?._id]
	);

	const isCreatedBy = useMemo(
		() => currentRound?.createdBy?._id === user?._id,
		[currentRound?.createdBy?._id, user?._id]
	);

	const isInterviewerSubmittedPoints = useMemo(() => {
		const points = currentRound?.evaluations?.find(
			(item) => item.interviewer?._id === user?._id
		);
		return points?.status ?? false;
	}, [currentRound?.evaluations, user?._id]);

	const isInterviewerValid = useMemo(() => {
		const isValid = currentRound?.evaluations?.find(
			(item) => item.interviewer?._id === user?._id
		);
		return isValid ? true : false;
	}, [currentRound?.evaluations, user?._id]);

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

		const isInterviewCompleted = ['end', 'canceled', 'rejected'].includes(
			interview?.doc?.status
		);

		const isFinalStatusAsLead =
			isLeadInterviewer &&
			['final', 'rejected', 'end', 'next-round'].includes(
				interview?.doc?.status
			);

		if (isInterviewCompleted || isFinalStatusAsLead) {
			toast.error('This interview has already completed.');
			navigate('/hiring');
		}
	}, [interview?.doc, isLeadInterviewer, navigate]);

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

	// Render content
	return isRefetching || interviewLoading || cancellingInterview ? (
		<Loader />
	) : interview && interview?.doc ? (
		<Box bg={colors.bgDeep} minH="100vh" p={4}>
			<Button
				variant="ghost"
				borderRadius='5px'
				size={{ base: 'sm', md: 'md' }}
				px={{ base: 4, md: 6 }}
				py={{ base: 2, md: 3 }}
				fontSize={{ base: 'sm', md: 'md' }}
				leftIcon={<Icon as={IoArrowBack} boxSize={4} />}
				onClick={() => navigate('/hiring')}
				mb={4}
				color={colors.bodyText}
				_hover={{
					color: colors.accentGold,
					bg: colors.secondaryBtnHoverBg,
				}}
			>
				Back
			</Button>

			{/* Header Section */}
			<HStack
				bg={colors.bg}
				rounded='md'
				shadow={colors.cardShadow}
				p='1rem'
				justifyContent='space-between'
				alignItems='center'
				mb={2}
				transition='.3s ease-in-out'
				border="1px solid"
				borderColor={colors.borderColor}
			>
				<HStack gap={2}>
					<Heading size='md' color={colors.headingText}>
						Interview Started
					</Heading>
				</HStack>

				{isLeadInterviewer && (
					<Button
						bg={colors.accentGold}
						color={colors.headerText}
						h='8'
						py='2'
						px='4'
						fontSize='sm'
						fontWeight='normal'
						shadow='sm'
						rounded='md'
						_hover={{ bg: colors.goldLight }}
						_active={{ bg: colors.goldDark }}
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
						interview={interview?.doc}
						interviewRefetch={interviewRefetch}
						user={user}
						isLeadInterviewer={isLeadInterviewer}
						isCreatedBy={isCreatedBy}
						isInterviewerSubmittedPoints={isInterviewerSubmittedPoints}
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