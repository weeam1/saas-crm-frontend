import React from 'react';
import { Box, Text, Button, VStack, Grid, Heading } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import CountUpComponent from 'components/countUpComponent/countUpComponent';

const RunningInterviews = ({ interviews, totals }) => {
	const navigate = useNavigate();

	const handleJoinInterview = (id) => {
		navigate(`/hiring/interview/${id}?phase=hiring-info`);
	};

	return (
		<Box bg='white' p='8' m='4' rounded='md' shadow='sm'>
			<Heading size='md' px={5} color='gray.800'>
				Running Interviews
				<span style={{ marginLeft: '6px' }}>
					({<CountUpComponent targetNumber={totals || 0} />})
				</span>
			</Heading>

			<Grid
				templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }}
				gap={3}
				w='full'
				p={6}
			>
				{interviews.map((interview) => (
					<InterviewCard
						key={interview._id}
						candidateName={interview.candidate.name}
						role={interview.candidate.position}
						onJoin={() => handleJoinInterview(interview._id)}
					/>
				))}
			</Grid>
		</Box>
	);
};

const InterviewCard = ({ candidateName, role, onJoin }) => {
	return (
		<Box
			borderRadius='lg'
			p={4}
			bg='white'
			boxShadow='md'
			_hover={{ boxShadow: 'lg' }}
		>
			<VStack spacing={4} align='start'>
				<Text fontSize='md' fontWeight='bold' color='gray.700'>
					{candidateName}
				</Text>
				<Text fontSize='md' color='gray.600'>
					Role: {role}
				</Text>
				<Button
					onClick={onJoin}
					fontSize='md'
					fontWeight='semibold'
					color='softGray.100'
					bg='green.400'
					_hover={{ bg: 'green.600', shadow: 'sm' }}
					transition='0.2 s all'
					width='fit-content'
					py={2}
					px={4}
					mr={2}
					rounded='md'
				>
					Join Interview
				</Button>
			</VStack>
		</Box>
	);
};

export default RunningInterviews;
