import React from 'react';
import { Box, Text, Button, VStack, Grid, Heading } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import CountUpComponent from 'components/countUpComponent/countUpComponent';
import { format } from 'date-fns';
import { useModalColors } from 'hooks/useModalColors';

const RunningInterviews = ({ interviews, totals }) => {
	const colors = useModalColors();
	const navigate = useNavigate();

	const handleJoinInterview = (id) => {
		navigate(`/hiring/interview/${id}`);
	};

	return (
		<Box
			bg={colors.bg}
			p='6'
			m='4'
			rounded='md'
			shadow={colors.cardShadow}
			border="1px solid"
			borderColor={colors.borderColor}
		>
			<Heading size='md' px={5} color={colors.headingText}>
				Running Interviews
				<span style={{ marginLeft: '6px' }}>
					(<CountUpComponent targetNumber={totals || 0} />)
				</span>
			</Heading>

			<Grid
				templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)', xl: 'repeat(4, 1fr)' }}
				gap={4}
				w='full'
				p={6}
			>
				{interviews?.map((interview) => (
					<InterviewCard
						key={interview._id}
						candidateName={interview.candidate?.name}
						interviewDate={interview.createdAt}
						role={interview.candidate?.position?.name}
						onJoin={() => handleJoinInterview(interview._id)}
					/>
				))}
			</Grid>
		</Box>
	);
};

const InterviewCard = ({ candidateName, interviewDate, role, onJoin }) => {
	const colors = useModalColors();

	return (
		<Box
			borderRadius='lg'
			p={5}
			bg={colors.bgInput}
			boxShadow='sm'
			border="1px solid"
			borderColor={colors.borderColor}
			transition='all 0.3s ease'
			_hover={{
				boxShadow: colors.cardShadow,
				borderColor: colors.accentGold,
				transform: 'translateY(-2px)',
			}}
			maxW='100%'
			overflow='hidden'
			height='100%'
		>
			<VStack spacing={3} align='start'>
				<Text fontSize='md' fontWeight='bold' color={colors.headingText}>
					{candidateName || 'N/A'}
				</Text>
				<Text fontSize='sm' color={colors.bodyText}>
					Role: {role || 'N/A'}
				</Text>
				<Text fontSize='xs' color={colors.mutedText}>
					Started at:
					<span style={{ marginLeft: '4px' }}>
						{interviewDate ? format(new Date(interviewDate), 'EEE, MMM d, yyyy h:mm a') : 'N/A'}
					</span>
				</Text>
				<Box w='full' display='flex' justifyContent='center' pt={2}>
					<Button
						onClick={onJoin}
						fontSize='sm'
						fontWeight='semibold'
						bg={colors.accentGold}
						color={colors.headerText}
						_hover={{
							bg: colors.goldLight,
							shadow: colors.goldGlow,
							transform: 'translateY(-1px)',
						}}
						_active={{ bg: colors.goldDark }}
						transition='all 0.2s ease'
						width='fit-content'
						py={2}
						px={5}
						rounded='md'
					>
						Join Interview
					</Button>
				</Box>
			</VStack>
		</Box>
	);
};

export default RunningInterviews;