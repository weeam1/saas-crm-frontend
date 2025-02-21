import { Box, Flex } from '@chakra-ui/react';
import LeftCard from './subComponents/card/LeftCard';
import RightCard from './subComponents/card/RightCard';

const LeadCard = ({ lead }) => {
	return (
		<Box
			fontFamily="'DM Sans', sans-serif"
			borderWidth='1px'
			borderRadius='md'
			p={2}
			bg='white'
			maxWidth='fit-content'
		>
			<Flex justifyContent='space-between' alignContent='flex-start' gap={2}>
				{/* Left Column */}
				<LeftCard lead={lead} />
				{/* Right Column */}
				<RightCard lead={lead} />
			</Flex>
		</Box>
	);
};

export default LeadCard;
