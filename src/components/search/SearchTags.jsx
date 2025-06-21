import { Tag, TagLabel, HStack } from '@chakra-ui/react';
// import { leadlabelFontSize } from 'views/admin/lead-v2/components/constants';

const labelFontSize = 'clamp(0.75rem, min(1.1vw, 0.75rem), 1rem)';

const SearchTags = ({ searchTags }) => {
	return (
		<HStack wrap='wrap' py='2' gap='2'>
			{Object.entries(searchTags).map(([key, value]) =>
				value ? (
					<Tag
						key={key}
						size='xs'
						borderRadius='md'
						bg='softGray.50'
						color='gray.800'
						fontWeight='medium'
						px={4}
						py={2}
					>
						<TagLabel fontSize={labelFontSize}>{`${value}`}</TagLabel>
					</Tag>
				) : null
			)}
		</HStack>
	);
};

export default SearchTags;
