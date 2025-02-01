import { Box, Button, Heading, HStack } from '@chakra-ui/react';
import { Outlet, useParams } from 'react-router-dom';
import CandidateCard from '../candidates/components/CandidateCard';
import { useFetchItemsQuery } from 'api/apiSlice';
import Loader from 'components/loading/Loader';

const InterviewScreen = () => {
	const { interviewId } = useParams();

	const { data: interview, isLoading: interviewLoading } = useFetchItemsQuery({
		path: `/interviews/${interviewId}`,
	});

	return interviewLoading ? (
		<Loader />
	) : (
		<Box>
			{/* Header Section - Click to Toggle */}
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
					{/* <Icon as={FaClock} w={5} h={5} /> */}
					<Heading size='md' color='gray.800'>
						Interview Started
					</Heading>
				</HStack>

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
					// onClick={() => handleStartInterview(item._id)}
				>
					Cancel
				</Button>
			</HStack>

			{interview?.doc?.candidate && (
				<Box pt='2' pb='4' px='4' rounded='md' bg='softGray.100' mb='4'>
					<Box width='fit-content'>
						<CandidateCard
							candidate={interview?.doc?.candidate}
							type='meeting'
						/>
					</Box>
				</Box>
			)}

			{/* Dynamic screen */}
			<Box bg='white' p={4} rounded='md' shadow='sm'>
				<Outlet />
			</Box>
		</Box>
	);
};

export default InterviewScreen;
