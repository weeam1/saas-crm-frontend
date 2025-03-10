// import { useState, useEffect } from "react"; // Added useEffect
// import {
//   Input,
//   InputGroup,
//   InputRightElement,
//   Button,
//   HStack,
//   Box,
// } from "@chakra-ui/react";
// import { SearchIcon } from "@chakra-ui/icons";
// import AdvancedSearchModal from "./AdvancedModal";

// const SearchBox = ({
//   onSearch,
//   searchQuery,
//   fetchAdvancedSearch,
//   setSearchClear,
//   setFormValues,
//   isFormReset,
//   setIsFormReset,
//   pageSize,
//   setGetTagValues,
//   loading,
//   clearAdvancedSearch,
//   formValues = {},
// }) => {
//   const [isAdvanceOpen, setIsAdvanceOpen] = useState(false);
//   const [inputValue, setInputValue] = useState(searchQuery || "");

//   // Sync inputValue with searchQuery from parent
//   useEffect(() => {
//     setInputValue(searchQuery);
//   }, [searchQuery]);

//   const toggleAdvanceSearch = () => {
//     setIsAdvanceOpen((prev) => !prev);
//   };

//   const handleSearch = () => {
//     onSearch(inputValue);
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") {
//       handleSearch();
//     }
//   };

//   const handleInputChange = (e) => {
//     setInputValue(e.target.value);
//     if (!e.target.value) {
//       onSearch("");
//     }
//   };

//   const isAdvancedSearchActive =
//     formValues && Object.keys(formValues).length > 0;

//   return (
//     <Box
//       width={{ base: "100%", lg: "fit-content" }}
//       bg="softGray.50"
//       borderRadius="md"
//       display="flex"
//       flexDirection="column"
//       alignItems="center"
//       position="relative"
//       zIndex="1"
//     >
//       <HStack spacing={1} flexDirection={{ base: "column", md: "row" }}>
//         <InputGroup
//           bg="white"
//           border="1px solid"
//           borderColor="softGray.600"
//           borderRadius="md"
//           w={{ base: "100%", md: "280px" }}
//           overflow="hidden"
//           position="relative"
//         >
//           <Input
//             placeholder="Search by lead name..."
//             value={inputValue}
//             onChange={handleInputChange}
//             onKeyDown={handleKeyDown}
//             border="none"
//             w="100%"
//             fontSize="xs"
//             height="2.2rem"
//             textOverflow="ellipsis"
//             _focus={{ boxShadow: "none" }}
//           />
//           <InputRightElement
//             width="auto"
//             height="100%"
//             display="flex"
//             alignItems="center"
//             position="absolute"
//             right="0"
//             top="0"
//             zIndex="2"
//           >
//             <Button
//               size="md"
//               bg="softGray.700"
//               borderLeft="1px solid"
//               borderColor="softGray.600"
//               px={4}
//               borderRadius="0"
//               fontSize="xs"
//               height="100%"
//               _hover={{ bg: "gray.50" }}
//               _active={{ bg: "gray.100" }}
//               onClick={handleSearch}
//             >
//               Search <SearchIcon fontSize="xs" color="brand.500" ml={1} />
//             </Button>
//           </InputRightElement>
//         </InputGroup>

//         <HStack gap="1">
//           <Button
//             border="1px solid"
//             borderColor="softGray.600"
//             bg="white"
//             borderRadius="md"
//             p={4}
//             fontSize="xs"
//             w="150px"
//             minW="max-content"
//             height="2.2rem"
//             onClick={toggleAdvanceSearch}
//             _hover={{ bg: "gray.50" }}
//             _active={{ bg: "gray.100" }}
//             isDisabled={loading}
//           >
//             Advanced Search
//           </Button>
//         </HStack>
//       </HStack>

//       <AdvancedSearchModal
//         setAdvaceSearch={setIsAdvanceOpen}
//         advaceSearch={isAdvanceOpen}
//         isLoading={loading}
//         fetchAdvancedSearch={fetchAdvancedSearch}
//         setSearchClear={setSearchClear}
//         setFormValues={setFormValues}
//         isFormReset={isFormReset}
//         setIsFormReset={setIsFormReset}
//         pageSize={pageSize}
//         setGetTagValues={setGetTagValues}
//       />
//     </Box>
//   );
// };

// export default SearchBox;
import { useState, useEffect } from "react";
import {
  Input,
  InputGroup,
  InputRightElement,
  Button,
  HStack,
  Box,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import AdvancedSearchModal from "./AdvancedModal";

const SearchBox = ({
  onSearch,
  searchQuery,
  fetchAdvancedSearch,
  setSearchClear,
  setFormValues,
  isFormReset,
  setIsFormReset,
  pageSize,
  setGetTagValues,
  loading,
  clearAdvancedSearch,
  formValues = {},
}) => {
  const [isAdvanceOpen, setIsAdvanceOpen] = useState(false);
  const [inputValue, setInputValue] = useState(searchQuery || "");

  // Sync inputValue with searchQuery from parent
  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  const toggleAdvanceSearch = () => {
    setIsAdvanceOpen((prev) => !prev);
  };

  const handleSearch = () => {
    onSearch(inputValue);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    if (!e.target.value) {
      onSearch("");
    }
  };

  const isAdvancedSearchActive =
    formValues && Object.keys(formValues).length > 0;

  return (
    <Box
      width={{ base: "100%", lg: "fit-content" }} // Full width on base, fit-content on lg
      bg="softGray.50"
      borderRadius="md"
      display="flex"
      flexDirection="column"
      alignItems="center"
      position="relative"
      zIndex="1"
      px={{ base: 2, md: 0 }} // Add padding on small screens for better spacing
    >
      <HStack
        spacing={1}
        flexDirection={{ base: "column", md: "row" }}
        w="100%" // Ensure HStack takes full width
      >
        <InputGroup
          bg="white"
          border="1px solid"
          borderColor="softGray.600"
          borderRadius="md"
          w={{ base: "100%", lg: "280px" }} // Full width on base, 280px on md+
          overflow="hidden"
          position="relative"
        >
          <Input
            placeholder="Search by lead name..."
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            border="none"
            w="100%" // Ensure Input takes full width of InputGroup
            fontSize="xs"
            height="2.2rem"
            textOverflow="ellipsis"
            _focus={{ boxShadow: "none" }}
          />
          <InputRightElement
            width="auto"
            height="100%"
            display="flex"
            alignItems="center"
            position="absolute"
            right="0"
            top="0"
            zIndex="2"
          >
            <Button
              size="md"
              bg="softGray.700"
              borderLeft="1px solid"
              borderColor="softGray.600"
              px={4}
              borderRadius="0"
              fontSize="xs"
              height="100%"
              _hover={{ bg: "gray.50" }}
              _active={{ bg: "gray.100" }}
              onClick={handleSearch}
            >
              Search <SearchIcon fontSize="xs" color="brand.500" ml={1} />
            </Button>
          </InputRightElement>
        </InputGroup>

        <HStack gap="1" w={{ base: "100%", md: "auto" }}>
          {" "}
          {/* Full width on base */}
          <Button
            border="1px solid"
            borderColor="softGray.600"
            bg="white"
            borderRadius="md"
            p={4}
            fontSize="xs"
            mx="auto"
            w={{ base: "150px", md: "150px" }} // Full width on base, 150px on md+
            minW="max-content"
            height="2.2rem"
            onClick={toggleAdvanceSearch}
            _hover={{ bg: "gray.50" }}
            _active={{ bg: "gray.100" }}
            isDisabled={loading}
          >
            Advanced Search
          </Button>
        </HStack>
      </HStack>

      <AdvancedSearchModal
        setAdvaceSearch={setIsAdvanceOpen}
        advaceSearch={isAdvanceOpen}
        isLoading={loading}
        fetchAdvancedSearch={fetchAdvancedSearch}
        setSearchClear={setSearchClear}
        setFormValues={setFormValues}
        isFormReset={isFormReset}
        setIsFormReset={setIsFormReset}
        pageSize={pageSize}
        setGetTagValues={setGetTagValues}
      />
    </Box>
  );
};

export default SearchBox;
