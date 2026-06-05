// import { Box, Tag, TagCloseButton, Flex, Button } from "@chakra-ui/react";
// import React from "react";

// const SearchTags = ({ searchTags, removeTag, clearAllTags }) => {
//   console.log("SearchTags component rendered with tags:", searchTags);
//   return (
//     <Box mb={4}>
//       {/* Display Search Tags */}
//       {searchTags?.map(({ key, value }) => (
//         <Tag
//           key={key}
//           size="md"
//           colorScheme="brand"
//           borderRadius="full"
//           m={1}
//           p="2"

//           // onClick={() => removeTag(key)}
//         >
//           {key}: {value} <TagCloseButton onClick={() => removeTag(key)} />
//         </Tag>
//       ))}
//       <Flex justifyContent="flex-end" alignItems="center" flexWrap="wrap">
//         {/* Clear All Button - only shown when there are tags */}
//         {searchTags?.length > 0 && (
//           <Button
//             size="sm"
//             color="red"
//             ml={2}
//             onClick={clearAllTags}
//             border={"1px solid red"}
//             bg={"transparent"}
//             _hover={{ bg: "transparent" }}
//             _active={{ bg: "transparent" }}
//           >
//             Clear
//           </Button>
//         )}
//       </Flex>
//     </Box>
//   );
// };

// export default SearchTags;

import { Box, Tag, TagCloseButton, Flex, Button } from "@chakra-ui/react";
import React from "react";

const SearchTags = ({ searchTags, removeTag, clearAllTags }) => {
  return (
    <Box mb={4}>
      {/* Display Search Tags */}
      {searchTags?.map(({ key, label, value }) => (
        <Tag
          key={key}  // Use key for React rendering
          size="md"
          colorScheme="brand"
          borderRadius="full"
          m={1}
          p="2"
        >
          {label || key}: {value} <TagCloseButton onClick={() => removeTag(key)} />
        </Tag>
      ))}
      <Flex justifyContent="flex-end" alignItems="center" flexWrap="wrap">
        {searchTags?.length > 0 && (
          <Button
            size="sm"
            color="red"
            ml={2}
            onClick={clearAllTags}
            border={"1px solid red"}
            bg={"transparent"}
            _hover={{ bg: "transparent" }}
            _active={{ bg: "transparent" }}
          >
            Clear
          </Button>
        )}
      </Flex>
    </Box>
  );
};

export default SearchTags;