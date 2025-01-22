import { Button, Flex, Grid, Spinner, Text } from '@chakra-ui/react';
import React from 'react';
import CandidateCard from './CandidateCard';

const Applications = (props) => {
	const { loading, candidates, currentPage, totalPages, handlePageChange } =
		props;

	return (
		<div>
			{/* Candidate Cards */}
			{loading ? (
				<Flex
					justifyContent={'center'}
					alignItems={'center'}
					width='100%'
					height={'100vh'}
				>
					<Spinner size='md' colorScheme='brand' />
				</Flex>
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

			{/* Pagination Controls */}
			<Flex justifyContent={'center'} mt={4}>
				{Array.from({ length: totalPages }, (_, index) => (
					<Button
						key={index + 1}
						colorSchema='brand'
						onClick={() => handlePageChange(index + 1)}
						mx={1}
						rounded='full'
						colorScheme={currentPage === index + 1 ? 'brand' : 'gray'}
					>
						{index + 1}
					</Button>
				))}
			</Flex>
		</div>
	);
};

export default Applications;
