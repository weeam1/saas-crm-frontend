import LeftCard from './subComponents/card/LeftCard';
import RightCard from './subComponents/card/RightCard';
import React, { useState, useEffect } from 'react';
import { Box, Flex, Skeleton, useBreakpointValue } from '@chakra-ui/react';

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
		sm: '48%', // Two cards per row on small screens
		md: '33.33%', // Three cards per row on medium screens
		lg: '32%', // Three cards per row on larger screens
	});

	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsLoaded(true);
		}, 1000); // 1 second delay
		return () => clearTimeout(timer);
	}, [lead]);

	return (
		<Box
			fontFamily="'DM Sans', sans-serif"
			borderWidth='1px'
			borderRadius='md'
			p={1}
			bg='white'
			width='100%'
			flexBasis={cardWidth}
			boxShadow='md'
			_hover={{ boxShadow: 'lg' }}
			transition='all 0.2s ease-in-out'
		>
			<Skeleton
				borderRadius='4px' // Rounded corners
				startColor='gray.100'
				endColor='gray.200' // Gradient shimmer effect
				isLoaded={isLoaded}
				fadeDuration={0.4}
			>
				<Flex
					justify='space-between'
					align='stretch'
					wrap='wrap'
					gap={{ base: 2, md: 3 }}
				>
					{/* Replace these with your actual content components */}
					<LeftCard lead={lead} />
					<RightCard lead={lead} />
				</Flex>
			</Skeleton>
		</Box>
	);
};

export default LeadCard;
