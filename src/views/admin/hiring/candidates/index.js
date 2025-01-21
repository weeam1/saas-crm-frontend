import React, { useState, useEffect } from 'react';
import {
	Box,
	Grid,
	Heading,
	Button,
	Spinner,
	useToast,
	Text,
} from '@chakra-ui/react';
import axios from 'axios';
import CandidateCard from './components/CandidateCard';
import keys from 'config/keys';
import { toast } from 'react-toastify';
import { getApplications } from 'api';

// Candidates Component
const Candidates = () => {
	const [candidates, setCandidates] = useState([]);
	const [loading, setLoading] = useState(true);

	// Fetch data from the backend
	useEffect(() => {
		const fetchData = async () => {
			try {
				const data = await getApplications();
				setCandidates(data || []);
				setLoading(false);
			} catch (error) {
				toast.error(error.data.message || 'Something went wrong!');
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	return (
		<Box>
			{/* Header */}
			<Box
				display='flex'
				justifyContent='space-between'
				alignItems='center'
				mb={6}
				bg='white'
				rounded='md'
				shadow='md'
				p='1rem'
			>
				<Heading size='lg' color='gray.800'>
					Candidates
				</Heading>
				<Button
					colorScheme='brand'
					variant='solid'
					onClick={() => console.log('Advanced Search')}
				>
					Advanced Search
				</Button>
			</Box>

			{/* Candidate Cards */}
			{loading ? (
				<Spinner size='xl' />
			) : candidates?.length ? (
				<Grid
					templateColumns={{
						base: '1fr',
						md: 'repeat(2, 1fr)',
						lg: 'repeat(4, 1fr)',
					}}
					gap={4}
				>
					{candidates.map((candidate) => (
						<CandidateCard key={candidate._id} candidate={candidate} />
					))}
				</Grid>
			) : (
				<Text>Applications not found</Text>
			)}
		</Box>
	);
};

export default Candidates;
