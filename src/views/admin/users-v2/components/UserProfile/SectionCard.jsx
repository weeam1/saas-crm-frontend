import { Box, Heading, VStack } from '@chakra-ui/react';

const SectionCard = ({ title, children, ...props }) => {
	return (
		<Box
			bg='white'
			borderRadius='lg'
			boxShadow='sm'
			border='1px solid'
			borderColor='gray.200'
			p={{ base: 2, md: 4, lg: 6 }}
			{...props}
		>
			<VStack align='stretch' spacing={4}>
				{title && (
					<Heading
						as='h3'
						size='md'
						color='gray.700'
						pb={2}
						borderBottom='2px solid'
						borderColor='blue.100'
					>
						{title}
					</Heading>
				)}
				{children}
			</VStack>
		</Box>
	);
};

export default SectionCard;
