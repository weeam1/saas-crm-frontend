import { Box, Heading, VStack } from '@chakra-ui/react';
import { useModalColors } from 'hooks/useModalColors';

const SectionCard = ({ title, children, ...props }) => {
	const colors = useModalColors();

	return (
		<Box
			bg={colors.bg}
			borderRadius='lg'
			boxShadow={colors.cardShadow}
			border='1px solid'
			borderColor={colors.borderColor}
			p={{ base: 2, md: 4, lg: 6 }}
			{...props}
		>
			<VStack align='stretch' spacing={4}>
				{title && (
					<Heading
						as='h3'
						size='md'
						color={colors.headingText}
						pb={2}
						borderBottom='2px solid'
						borderColor={colors.borderColor}
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