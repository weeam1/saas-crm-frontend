import { Box, Text } from '@chakra-ui/react';

const NoteBody = ({ text }) => {
	return (
		<Box>
			<Box p="1">
				<Text
					as="pre"
					whiteSpace="pre-wrap"
					overflowWrap="break-word"
					wordBreak="break-word"
					color="text.body"
					fontWeight="500"
					fontSize="clamp(0.95rem, 2vw, 1.1rem)"
					fontFamily="'DM Sans', sans-serif"
					lineHeight="1.6"
				>
					{text}
				</Text>
			</Box>
		</Box>
	);
};

export default NoteBody;
