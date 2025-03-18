import { Grid } from '@chakra-ui/react';
import CandidateCard from './CandidateCard';

const Applications = ({ candidates, refetch }) => {
	return (
		<div>
			<Grid
				templateColumns={{
					base: '1fr',
					md: 'repeat(2, 1fr)',
					lg: 'repeat(4, 1fr)',
				}}
				gap={4}
			>
				{candidates.map((candidate) => (
					<CandidateCard
						key={candidate._id}
						candidate={candidate}
						refetch={refetch}
					/>
				))}
			</Grid>
		</div>
	);
};

export default Applications;
