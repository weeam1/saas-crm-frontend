// import { useState } from "react";
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
// import ClearAdvancedSearchButton from "./ClearButton"; // Import the new component

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
//   formValues = {}, // Default to empty object to avoid undefined errors
// }) => {
//   const [isAdvanceOpen, setIsAdvanceOpen] = useState(false);
//   const [inputValue, setInputValue] = useState(searchQuery || "");

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

//   // Determine if a search (basic or advanced) is active
//   const isSearchActive = !!searchQuery || (formValues && !!Object.keys(formValues).length);

//   return (
//     <Box
//       width={{ base: "100%", lg: "fit-content" }}
//       bg="softGray.50"
//       borderRadius="md"
//       display="flex"
//       flexDirection="column"
//       alignItems="center"
//     >
//       <HStack spacing={1} flexDirection={{ base: "column", md: "row" }}>
//         <InputGroup
//           bg="white"
//           border="1px solid"
//           borderColor="softGray.600"
//           borderRadius="md"
//           w={{ base: "100%", md: "300px" }}
//           overflow="hidden"
//         >
//           <Input
//             placeholder="Search by lead name..."
//             value={inputValue}
//             onChange={handleInputChange}
//             onKeyDown={handleKeyDown}
//             border="none"
//             minW={{ base: "100%", md: "400px" }}
//             fontSize="xs"
//             height="2.2rem"
//             _focus={{ boxShadow: "none" }}
//           />
//           <InputRightElement width="auto">
//             <Button
//               size="md"
//               bg="softGray.700"
//               borderLeft="1px solid"
//               borderColor="softGray.600"
//               px={4}
//               borderRadius="0"
//               fontSize="xs"
//               _hover={{ bg: "gray.50" }}
//               _active={{ bg: "gray.100" }}
//               onClick={handleSearch}
//               isLoading={loading}
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
//           {isSearchActive && (
//             <ClearAdvancedSearchButton
//               clearAdvancedSearch={clearAdvancedSearch}
//               loading={loading}
//             />
//           )}
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
import { useState } from "react";
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
// import ClearAdvancedSearchButton from "./ClearButton";

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
  formValues = {}, // Default to empty object
}) => {
  const [isAdvanceOpen, setIsAdvanceOpen] = useState(false);
  const [inputValue, setInputValue] = useState(searchQuery || "");

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

  // Debugging: Log formValues to verify it’s updating
  console.log("SearchBox - formValues:", formValues);

  // Check if an advanced search is active
  const isAdvancedSearchActive = formValues && Object.keys(formValues).length > 0;

  return (
    <Box
      width={{ base: "100%", lg: "fit-content" }}
      bg="softGray.50"
      borderRadius="md"
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <HStack spacing={1} flexDirection={{ base: "column", md: "row" }}>
        <InputGroup
          bg="white"
          border="1px solid"
          borderColor="softGray.600"
          borderRadius="md"
          w={{ base: "100%", md: "300px" }}
          overflow="hidden"
        >
          <Input
            placeholder="Search by lead name..."
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            border="none"
            minW={{ base: "100%", md: "400px" }}
            fontSize="xs"
            height="2.2rem"
            _focus={{ boxShadow: "none" }}
          />
          <InputRightElement width="auto">
            <Button
              size="md"
              bg="softGray.700"
              borderLeft="1px solid"
              borderColor="softGray.600"
              px={4}
              borderRadius="0"
              fontSize="xs"
              _hover={{ bg: "gray.50" }}
              _active={{ bg: "gray.100" }}
              onClick={handleSearch}
              isLoading={loading}
            >
              Search <SearchIcon fontSize="xs" color="brand.500" ml={1} />
            </Button>
          </InputRightElement>
        </InputGroup>

        <HStack gap="1">
          <Button
            border="1px solid"
            borderColor="softGray.600"
            bg="white"
            borderRadius="md"
            p={4}
            fontSize="xs"
            w="150px"
            minW="max-content"
            height="2.2rem"
            onClick={toggleAdvanceSearch}
            _hover={{ bg: "gray.50" }}
            _active={{ bg: "gray.100" }}
            isDisabled={loading}
          >
            Advanced Search
          </Button>
          {/* {isAdvancedSearchActive && (
            <ClearAdvancedSearchButton
              clearAdvancedSearch={clearAdvancedSearch}
              loading={loading}
            />
          )} */}
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