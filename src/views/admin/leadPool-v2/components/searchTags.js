import { Tag, TagLabel, HStack } from "@chakra-ui/react";

const SearchTags = () => {
  return (
    <HStack wrap="wrap" py="2" gap="2">
      <Tag
        size="xs"
        borderRadius="md"
        bg="softGray.50"
        color="gray.800"
        fontWeight="medium"
        px={4}
        py={2}
      >
        <TagLabel></TagLabel>
        <TagLabel></TagLabel>
      </Tag>
    </HStack>
  );
};

export default SearchTags;
