import { Box, Flex } from '@chakra-ui/react';
import LeftCard from './subComponents/card/LeftCard';
import RightCard from './subComponents/card/RightCard';

const LeadCard = ({ lead }) => {
	return (
		<Box
			fontFamily="'DM Sans', sans-serif"
			borderWidth='1px'
			borderRadius='md'
			p={3}
			bg='white'
			width='100%'
			minWidth='300px' // Ensures cards don’t shrink too much
			maxWidth={{ base: '100%', md: '33.33%', lg: '32%' }} // Distributes evenly across available space
			// Adjust as needed
		>
			<Flex
				justifyContent='space-between'
				alignItems='stretch'
				flexWrap='wrap'
				gap={3}
			>
				{/* Left Column */}
				<LeftCard lead={lead} />

				{/* Right Column */}
				<RightCard lead={lead} />
			</Flex>
		</Box>
	);
};

export default LeadCard;
