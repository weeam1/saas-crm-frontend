import { Box, Text } from '@chakra-ui/react';

const NoteBody = ({ text }) => {
	return (
		<Box>
			<Box
				// overflowY='auto' maxH={'400px'}
				p='1'
			>
				<Text
					as='pre'
					whiteSpace='pre-wrap'
					overflowWrap='break-word'
					wordBreak='break-word'
					color='gray.600'
					fontSize={{ base: 'xs', md: 'sm', lg: 'md' }}
					fontFamily='DM Sans, sans-serif'
				>
					{text}
				</Text>
			</Box>
		</Box>
	);
};

export default NoteBody;
