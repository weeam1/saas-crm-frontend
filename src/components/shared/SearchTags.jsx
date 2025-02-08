import { Box, Tag, TagCloseButton } from '@chakra-ui/react';
import React from 'react';

const SearchTags = ({ searchTags, removeTag }) => {
	return (
		<Box mb={4}>
			{/* Display Search Tags */}
			{searchTags?.map(({ key, value }) => (
				<Tag
					key={key}
					size='md'
					colorScheme='brand'
					borderRadius='full'
					m={1}
					p='2'

					// onClick={() => removeTag(key)}
				>
					{key}: {value} <TagCloseButton onClick={() => removeTag(key)} />
				</Tag>
			))}
		</Box>
	);
};

export default SearchTags;
