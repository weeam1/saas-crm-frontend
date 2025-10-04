import { Flex, Image, HStack, Box, keyframes } from '@chakra-ui/react';
import BrandLogo from 'assets/logo/logo.png';

// Smooth bouncing dots animation
const bounce = keyframes`
  0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
  40% { transform: scale(1.2); opacity: 1; }
`;

const AppLoader = () => {
	return (
		<Flex
			direction='column'
			align='center'
			justify='center'
			h='100vh'
			w='full'
			bg='white'
			gap={6}
		>
			{/* App Logo */}
			<Image
				src={BrandLogo}
				alt='App Logo'
				boxSize='100px'
				objectFit='contain'
			/>

			{/* Progress Dots */}
			<HStack spacing={3}>
				{[0, 1, 2].map((i) => (
					<Box
						key={i}
						w='12px'
						h='12px'
						bg='brand.500'
						borderRadius='full'
						animation={`${bounce} 1.4s ease-in-out infinite`}
						animationDelay={`${i * 0.2}s`}
					/>
				))}
			</HStack>
		</Flex>
	);
};

export default AppLoader;
