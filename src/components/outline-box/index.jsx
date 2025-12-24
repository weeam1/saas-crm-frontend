import { VStack, Text } from '@chakra-ui/react';

const OutlineBox = ({ title, children, h, borderColor }) => {
	return (
		<VStack align='stretch' h={h || ''} w='full'>
			<VStack
				border='1px'
				borderColor={borderColor || ''}
				position='relative'
				borderRadius={5}
				p={4}
				h={h || ''}
				align='start'
			>
				<Text
					position='absolute'
					top={-3}
					left={2}
					bg='white'
					color={borderColor || ''}
					px={2}
				>
					{title}
				</Text>
				{children}
			</VStack>
		</VStack>
	);
};

export default OutlineBox;
