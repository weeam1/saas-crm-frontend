import { formattedDate } from 'utils/helpers';
import { leadlabelFontSize } from './constants';
import LeftCard from './subComponents/card/LeftCard';
import RightCard from './subComponents/card/RightCard';
import { Box, Flex, Text, useBreakpointValue } from '@chakra-ui/react';

// const LeadCard = ({ lead }) => {
// 	const cardWidth = useBreakpointValue({
// 		base: '100%', // Full width on mobile
// 		sm: '48%', // Two cards per row on small screens
// 		md: '33.33%', // Three cards per row on medium screens
// 		lg: '32%', // Three cards per row on larger screens
// 	});

// 	return (
// 		<Box
// 			fontFamily="'DM Sans', sans-serif"
// 			borderWidth='1px'
// 			borderRadius='md'
// 			p={{ base: 2, md: 3 }} // Adjust padding for smaller screens
// 			bg='white'
// 			width='100%'
// 			flexBasis={cardWidth} // Distributes evenly across available space
// 			boxShadow='md'
// 			_hover={{ boxShadow: 'lg' }} // Adds an interactive feel
// 			transition='all 0.2s ease-in-out'
// 		>
// 			<Flex
// 				justify='space-between'
// 				align='stretch'
// 				wrap='wrap'
// 				gap={{ base: 2, md: 3 }} // Adjusts spacing dynamically
// 			>
// 				{/* Left Column */}
// 				<LeftCard lead={lead} />

// 				{/* Right Column */}
// 				<RightCard lead={lead} />
// 			</Flex>
// 		</Box>
// 	);
// };

const LeadCard = ({ lead }) => {
	const cardWidth = useBreakpointValue({
		base: '100%', // Full width on mobile
		// sm: '48%', // Two cards per row on small screens
		md: '33.33%', // Three cards per row on medium screens
		lg: '25%', // Three cards per row on larger screens
	});

	return (
		<Box
			fontFamily="'DM Sans', sans-serif"
			borderWidth='1px'
			borderRadius='md'
			p={2}
			bg='white'
			width='100%'
			flexBasis={cardWidth}
			boxShadow='md'
			_hover={{ boxShadow: 'lg' }}
			transition='all 0.2s ease-in-out'
		>
			<Flex
				justify='space-between'
				align='stretch'
				wrap='wrap'
				gap={{ base: 2, md: 3 }}
			>
				<LeftCard lead={lead} />
				<RightCard lead={lead} />
				<Box
					textAlign='right'
					width='full'
					fontSize={leadlabelFontSize}
					color='gray.900'
				>
					<span style={{ color: '#D3D3D3', marginRight: '4px' }}>
						Lead time
					</span>
					{formattedDate(lead?.createdDate) || 'N/A'}
				</Box>
			</Flex>
		</Box>
	);
};

export default LeadCard;
