import { Box, Text } from '@chakra-ui/react';
import { getInterviewStatusConfig } from '../helpers';

const InterviewStatusBadge = ({ interview }) => {
	const resolveStatus = (item) => {
		if (item?.offerStatus === 'rejected') return 'offer_rejected';
		if (item?.offerStatus === 'accepted') return 'accepted';
		if (item?.status === 'rejected') return 'rejected';
		if (item?.isOffer) return 'offer_sent';
		return 'in_progress';
	};

	const status = resolveStatus(interview);

	const config = getInterviewStatusConfig(status);

	return (
		<Box display='inline-flex' px={3} py={1} rounded='full' bg={config.color}>
			<Text fontSize='xs' fontWeight='bold' color={config.textColor}>
				{config.text}
			</Text>
		</Box>
	);
};

export default InterviewStatusBadge;
