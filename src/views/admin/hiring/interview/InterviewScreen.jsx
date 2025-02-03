import { Box, Button, Heading, HStack } from '@chakra-ui/react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import CandidateCard from '../candidates/components/CandidateCard';
import { useFetchItemsQuery, useUpdateItemMutation } from 'api/apiSlice';
import Loader from 'components/loading/Loader';
import InterviewTabs from './components/InterviewTabs';
import ErrorMessage from 'components/Message/ErrorMessage';
import { useEffect, useState, useMemo } from 'react';
import { toast } from 'react-toastify';

const InterviewScreen = () => {
	const { interviewId } = useParams();
	const user = JSON.parse(localStorage.getItem('user'));
	const navigate = useNavigate();

	const [searchParams, setSearchParams] = useSearchParams();
	const [activeTabIndex, setActiveTabIndex] = useState(0);
	const phases = useMemo(
		() => ['select-interviewers', 'hiring-info', 'evaluation-points'],
		[]
	);

	useEffect(() => {
		const phase = searchParams.get('phase');
		const phaseIndex = phases.indexOf(phase);
		if (phaseIndex !== -1) {
			setActiveTabIndex(phaseIndex);
		}
	}, [searchParams, phases]);

	const handleTabChange = (index) => {
		console.log({ IDEX: index });
		console.log({ phase: phases[index] });
		setSearchParams({ phase: phases[index] });
		setActiveTabIndex(index); // Update the active tab index
	};

	const {
		data: interview,
		isLoading: interviewLoading,
		error,
	} = useFetchItemsQuery({
		path: `/interviews/${interviewId}`,
	});

	const [updateItemMutation, { isLoading: cancellingInterview }] =
		useUpdateItemMutation();

	useEffect(() => {
		if (
			interview?.doc &&
			(interview?.doc?.status === 'end' ||
				interview?.doc?.status === 'canceled')
		) {
			toast.error('This interview has already ended.');
			navigate('/');
		}
	}, [interview?.doc, navigate]);

	const handleCancelInterview = async (interviewId) => {
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
	};

	const isLeadInterviewer = interview?.doc?.leadInterviewer._id === user._id;

	return interviewLoading || cancellingInterview ? (
		<Loader />
	) : interview && interview?.doc ? (
		<Box>
			{/* Header Section*/}
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

			{interview?.doc?.candidate ? (
				<>
					<Box pt='2' pb='4' px='4' rounded='md' bg='softGray.100' mb='4'>
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
						user={user}
						isLeadInterviewer={isLeadInterviewer}
					/>
				</>
			) : (
				<ErrorMessage message={'Interview Candidate not found'} />
			)}
		</Box>
	) : (
		<ErrorMessage message={error?.data?.message || 'Something went wrong!'} />
	);
};

export default InterviewScreen;
