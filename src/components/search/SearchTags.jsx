import { Tag, TagLabel, HStack } from '@chakra-ui/react';
// import { leadlabelFontSize } from 'views/admin/lead-v2/components/constants';

const labelFontSize = 'clamp(0.75rem, min(1.1vw, 0.75rem), 1rem)';

const SearchTags = ({ searchTags }) => {
  return (
    <HStack wrap="wrap" py="2" gap="2">
      {Object.entries(searchTags).map(([key, value]) =>
        value ? (
          <Tag
            size="sm"
            borderRadius="md"
            bg="brand.400"
            color="white"
            fontWeight="medium"
            px={3}
            py={1}
            minH="26px"
            maxW="35vh"
          >
            <TagLabel
              isTruncated
              fontSize={{ base: 'xs', sm: 'sm' }}
            >
              {value}
            </TagLabel>
          </Tag>
        ) : null
      )}
    </HStack>
  );
};

export default SearchTags;
