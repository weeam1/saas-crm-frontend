// import { Box, Button, Flex } from '@chakra-ui/react';

// const Tabs = ({ activeTab, setActiveTab }) => {
// 	const tabs = ['All', 'Pending', 'Approved', 'Rejected'];

// 	return (
// 		<Box width="100%">
// 			<Flex
// 				width="100%"
// 				flexWrap="wrap"
// 				justifyContent={{ base: 'center', md: 'flex-start' }}
// 				p={2}
// 			>
// 				{tabs.map((tab, index) => (
// 					<Button
// 					key={index}
// 					variant="unstyled"
// 					onClick={() => setActiveTab(tab)}
// 					bg={activeTab === tab ? "#EDD199" : "softGray.50"}
// 					color={activeTab === tab ? "black" : "gray.500"}
// 					fontWeight={activeTab === tab ? "semi-bold" : "normal"}
// 					borderTop={
// 					  activeTab === tab
// 						? "4px solid #B79045"
// 						: "4px solid transparent"
// 					}
// 					borderRadius="0"
// 					h="42px"
// 					minW="100px"
// 					_focus={{ outline: "none" }}
// 					outline="none"
// 					fontFamily="DM Sans"
// 				  >
// 					{tab}
// 				  </Button>
// 				))}
// 			</Flex>
// 		</Box>
// 	);
// };

// export default Tabs;

import { useRef, useEffect, useState } from 'react';
import { Box, Flex, Button } from '@chakra-ui/react';

const Tabs = ({ activeTab, setActiveTab }) => {
	const tabs = ['All', 'Pending', 'Approved', 'Rejected'];
	// const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
	// const buttonRefs = useRef({});

	const goldGradient =
		'linear-gradient(135deg, #F5D67B 0%, #D4AF37 50%, #C9A227 100%)';

	// useEffect(() => {
	// 	const activeButton = buttonRefs.current[activeTab];
	// 	if (activeButton) {
	// 		const { offsetLeft, offsetWidth } = activeButton;
	// 		setIndicatorStyle({
	// 			left: offsetLeft,
	// 			width: offsetWidth,
	// 		});
	// 	}
	// }, [activeTab]);

	return (
		// <Box width='100%'>
		// 	<Flex
		// 		width='100%'
		// 		flexWrap='wrap'
		// 		justifyContent={{ base: 'center', md: 'flex-start' }}
		// 		bg='rgba(212, 175, 55, 0.06)'
		// 		borderRadius='full'
		// 		p={1}
		// 		maxW='fit-content'
		// 		position='relative'
		// 	>
		// 		{/* Sliding Indicator */}
		// 		<Box
		// 			position='absolute'
		// 			top='4px'
		// 			bottom='4px'
		// 			left={`${indicatorStyle.left}px`}
		// 			width={`${indicatorStyle.width}px`}
		// 			bgGradient={goldGradient}
		// 			borderRadius='full'
		// 			transition='left 0.3s cubic-bezier(0.2, 0.95, 0.4, 1.05), width 0.3s cubic-bezier(0.2, 0.95, 0.4, 1.05)'
		// 			zIndex={0}
		// 			boxShadow='0 2px 8px rgba(212, 175, 55, 0.3)'
		// 		/>

		// 		{tabs.map((tab) => (
		// 			<Button
		// 				key={tab}
		// 				ref={(el) => (buttonRefs.current[tab] = el)}
		// 				variant='unstyled'
		// 				onClick={() => setActiveTab(tab)}
		// 				px={5}
		// 				py={2}
		// 				minW='90px'
		// 				h='40px'
		// 				fontSize='sm'
		// 				fontWeight={activeTab === tab ? 'semibold' : 'medium'}
		// 				borderRadius='full'
		// 				transition='none'
		// 				cursor='pointer'
		// 				_focus={{ outline: 'none' }}
		// 				outline='none'
		// 				position='relative'
		// 				zIndex={1}
		// 				bg='transparent'
		// 				color={activeTab === tab ? '#000000' : 'gray.200'}
		// 				_hover={{
		// 					color: activeTab === tab ? '#000000' : 'gold.primary',
		// 				}}
		// 				whiteSpace='nowrap'
		// 				overflow='hidden'
		// 			>
		// 				<Flex align='center' justify='center' gap={1.5}>
		// 					<Box as='span'>{tab}</Box>
		// 				</Flex>
		// 			</Button>
		// 		))}
		// 	</Flex>
		// </Box>

		<Box
			width='100%'
			overflowX='auto'
			overflowY='hidden'
			css={{
				'&::-webkit-scrollbar': {
					display: 'none',
				},
				scrollbarWidth: 'none',
			}}
		>
			<Flex
				minW='max-content'
				borderBottom='1px solid'
				borderColor='whiteAlpha.200'
				gap={6}
				px={1}
			>
				{tabs.map((tab) => {
					const isActive = activeTab === tab;

					return (
						<Button
							key={tab}
							variant='unstyled'
							onClick={() => setActiveTab(tab)}
							position='relative'
							h='48px'
							// px={1}
							fontSize={{ base: 'sm', md: 'md' }}
							fontWeight={isActive ? '600' : '500'}
							color={isActive ? 'gold.400' : 'gray.400'}
							whiteSpace='nowrap'
							borderRadius='0'
							transition='color 0.2s ease'
							_hover={{
								color: 'gold.400',
							}}
							_after={{
								content: '""',
								position: 'absolute',
								bottom: 0,
								left: 0,
								width: '100%',
								height: '2px',
								bg: isActive ? 'gold.400' : 'transparent',
								// borderRadius: 'full',
								transform: 'translateY(1px)',
							}}
						>
							{tab}
						</Button>
					);
				})}
			</Flex>
		</Box>
	);
};

export default Tabs;
