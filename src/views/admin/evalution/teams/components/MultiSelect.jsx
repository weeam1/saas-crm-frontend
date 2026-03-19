// // MultiSelect.jsx
// import { useState, useMemo, useRef, useEffect } from "react";
// import {
//   Box,
//   VStack,
//   HStack,
//   Text,
//   Input,
//   InputGroup,
//   InputLeftElement,
//   Button,
//   IconButton,
//   Avatar,
//   Badge,
//   useColorModeValue,
//   Flex,
// } from "@chakra-ui/react";
// import { SearchIcon, AddIcon } from "@chakra-ui/icons";
// import { FiX } from "react-icons/fi";

// const MultiSelectWithBox = ({
//   options = [],
//   value = [],
//   onChange,
//   placeholder = "Search...",
//   maxHeight = "300px",
//   selectedBoxHeight = "200px",
//   formatOptionLabel,
// }) => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isOpen, setIsOpen] = useState(false);
//   const dropdownRef = useRef(null);

//   // Debug props
//   console.log("MultiSelect props:", { options, value });

//   const borderColor = useColorModeValue("gray.200", "gray.600");
//   const hoverBg = useColorModeValue("gray.50", "gray.700");
//   const selectedBg = useColorModeValue("brand.50", "brand.900");
//   const boxBg = useColorModeValue("white", "gray.800");
//   const headerBg = useColorModeValue("gray.50", "gray.700");

//   // Handle click outside to close dropdown
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsOpen(false);
//         setSearchTerm("");
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   // Get full selected items from value array
//   const selectedItems = useMemo(() => {
//     return value
//       .map((val) => options.find((opt) => opt.value === val))
//       .filter(Boolean);
//   }, [value, options]);

//   // Filter options based on search and exclude already selected ones
//   const filteredOptions = useMemo(() => {
//     // First filter out already selected items
//     let filtered = options.filter((option) => {
//       return !value.includes(option.value);
//     });

//     // Then apply search filter if there's a search term
//     if (searchTerm) {
//       filtered = filtered.filter((option) =>
//         option.label.toLowerCase().includes(searchTerm.toLowerCase()),
//       );
//     }

//     console.log("Filtered options:", filtered);
//     return filtered;
//   }, [options, searchTerm, value]);

//   // Handle adding an item
//   const handleAddItem = (item) => {
//     console.log("Adding item:", item);
//     const newValues = [...value, item.value];
//     onChange(newValues);
//     setSearchTerm("");
//   };

//   // Handle removing an item
//   const handleRemoveItem = (itemToRemove) => {
//     console.log("Removing item:", itemToRemove);
//     const newValues = value.filter((v) => v !== itemToRemove.value);
//     onChange(newValues);
//   };

//   // Handle add all filtered items
//   const handleAddAllFiltered = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     console.log("Add All clicked");
//     console.log("Current value:", value);
//     console.log("Filtered options to add:", filteredOptions);

//     // Get the values from filteredOptions
//     const newFilteredValues = filteredOptions.map((opt) => opt.value);
//     // Combine with existing values, removing duplicates just in case
//     const newValues = [...new Set([...value, ...newFilteredValues])];

//     console.log("New values to set:", newValues);
//     onChange(newValues);
//     setSearchTerm("");
//   };

//   // Handle remove all
//   const handleRemoveAll = () => {
//     onChange([]);
//   };

//   // Handle input focus
//   const handleInputFocus = () => {
//     setIsOpen(true);
//   };

//   // Default format option label if not provided
//   const defaultFormatOptionLabel = (option) => (
//     <HStack spacing={3} width="100%">
//       {option.avatar && (
//         <Avatar size="sm" name={option.label} src={option.avatar} />
//       )}
//       <Box flex="1">
//         <Text fontSize="sm" fontWeight="500">
//           {option.label}
//         </Text>
//         {option.role && (
//           <Text fontSize="xs" color="gray.500">
//             {option.role}
//           </Text>
//         )}
//       </Box>
//     </HStack>
//   );

//   const renderOption = formatOptionLabel || defaultFormatOptionLabel;

//   return (
//     <VStack spacing={4} align="stretch" width="100%">
//       {/* Search Input with Add All button */}
//       <HStack spacing={2}>
//         <InputGroup flex={1}>
//           <InputLeftElement pointerEvents="none">
//             <SearchIcon color="gray.400" />
//           </InputLeftElement>
//           <Input
//             placeholder={placeholder}
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             onFocus={handleInputFocus}
//             focusBorderColor="brand.500"
//             borderColor={borderColor}
//           />
//         </InputGroup>
//         {isOpen && filteredOptions.length > 0 && (
//           <Button
//             leftIcon={<AddIcon />}
//             colorScheme="brand"
//             variant="outline"
//             onClick={handleAddAllFiltered}
//             size="md"
//           >
//             Add All ({filteredOptions.length})
//           </Button>
//         )}
//       </HStack>

//       {/* Search Results Box */}
//       {isOpen && (
//         <Box ref={dropdownRef} position="relative" width="100%">
//           <Box
//             borderWidth="1px"
//             borderColor={borderColor}
//             borderRadius="md"
//             maxH={maxHeight}
//             overflowY="auto"
//             bg={boxBg}
//             boxShadow="lg"
//             position="absolute"
//             width="100%"
//             zIndex={10}
//           >
//             {filteredOptions.length > 0 ? (
//               <VStack spacing={0} align="stretch">
//                 {filteredOptions.map((option) => (
//                   <HStack
//                     key={option.value}
//                     justify="space-between"
//                     p={3}
//                     borderBottomWidth="1px"
//                     borderBottomColor={borderColor}
//                     _last={{ borderBottom: "none" }}
//                     _hover={{ bg: hoverBg }}
//                     cursor="pointer"
//                     onClick={() => handleAddItem(option)}
//                   >
//                     <Box flex={1}>{renderOption(option)}</Box>
//                     <IconButton
//                       icon={<AddIcon />}
//                       size="sm"
//                       colorScheme="brand"
//                       variant="ghost"
//                       aria-label="Add"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         handleAddItem(option);
//                       }}
//                     />
//                   </HStack>
//                 ))}
//               </VStack>
//             ) : (
//               <Box p={4} textAlign="center" color="gray.500">
//                 {searchTerm ? "No matching items found" : "No items available"}
//               </Box>
//             )}
//           </Box>
//         </Box>
//       )}

//       {/* Selected Items Box */}
//       {selectedItems.length > 0 && (
//         <Box
//           borderWidth="1px"
//           borderColor={borderColor}
//           borderRadius="md"
//           bg={selectedBg}
//           mt={isOpen ? maxHeight : 0}
//         >
//           {/* Header */}
//           <Flex
//             justify="space-between"
//             align="center"
//             p={3}
//             borderBottomWidth="1px"
//             borderBottomColor={borderColor}
//             bg={headerBg}
//             borderTopRadius="md"
//           >
//             <HStack>
//               <Text fontWeight="600" fontSize="sm">
//                 Selected Items
//               </Text>
//               <Badge colorScheme="brand" borderRadius="full" px={2}>
//                 {selectedItems.length}
//               </Badge>
//             </HStack>
//             <Button
//               size="xs"
//               variant="ghost"
//               colorScheme="red"
//               onClick={handleRemoveAll}
//             >
//               Clear All
//             </Button>
//           </Flex>

//           {/* Selected Items List with Scroll */}
//           <Box maxH={selectedBoxHeight} overflowY="auto" p={2}>
//             <VStack spacing={2} align="stretch">
//               {selectedItems.map((item) => (
//                 <HStack
//                   key={item.value}
//                   justify="space-between"
//                   p={2}
//                   bg={boxBg}
//                   borderRadius="md"
//                   borderWidth="1px"
//                   borderColor={borderColor}
//                   _hover={{ shadow: "sm" }}
//                 >
//                   <Box flex={1}>{renderOption(item)}</Box>
//                   <IconButton
//                     icon={<FiX />}
//                     size="sm"
//                     variant="ghost"
//                     colorScheme="red"
//                     aria-label="Remove"
//                     onClick={() => handleRemoveItem(item)}
//                   />
//                 </HStack>
//               ))}
//             </VStack>
//           </Box>
//         </Box>
//       )}
//     </VStack>
//   );
// };

// export default MultiSelectWithBox;

import { useState, useMemo, useRef, useEffect } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  IconButton,
  Avatar,
  Badge,
  useColorModeValue,
  Flex,
} from "@chakra-ui/react";
import { SearchIcon, AddIcon } from "@chakra-ui/icons";
import { FiX } from "react-icons/fi";

const MultiSelectWithBox = ({
  options = [],
  value = [],
  onChange,
  placeholder = "Search...",
  maxHeight = "300px",
  selectedBoxHeight = "200px",
  formatOptionLabel,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Debug props
  console.log("MultiSelect props:", { options, value });

  const borderColor = useColorModeValue("gray.200", "gray.600");
  const hoverBg = useColorModeValue("gray.50", "gray.700");
  const selectedBg = useColorModeValue("brand.50", "brand.900");
  const boxBg = useColorModeValue("white", "gray.800");
  const headerBg = useColorModeValue("gray.50", "gray.700");

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Get full selected items from value array
  const selectedItems = useMemo(() => {
    return value
      .map((val) => options.find((opt) => opt.value === val))
      .filter(Boolean);
  }, [value, options]);

  // Filter options based on search and exclude already selected ones
  const filteredOptions = useMemo(() => {
    let filtered = options.filter((option) => {
      return !value.includes(option.value);
    });

    if (searchTerm) {
      filtered = filtered.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    console.log("Filtered options:", filtered);
    return filtered;
  }, [options, searchTerm, value]);

  // Handle adding an item
  const handleAddItem = (item) => {
    console.log("Adding item:", item);
    const newValues = [...value, item.value];
    onChange(newValues);
    setSearchTerm("");
  };

  // Handle removing an item
  const handleRemoveItem = (itemToRemove) => {
    console.log("Removing item:", itemToRemove);
    const newValues = value.filter((v) => v !== itemToRemove.value);
    onChange(newValues);
  };

  // Handle add all filtered items
  const handleAddAllFiltered = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Add All clicked");
    console.log("Current value:", value);
    console.log("Filtered options to add:", filteredOptions);

    const newFilteredValues = filteredOptions.map((opt) => opt.value);
    const newValues = [...new Set([...value, ...newFilteredValues])];

    console.log("New values to set:", newValues);
    onChange(newValues);
    setSearchTerm("");
  };

  // Handle remove all
  const handleRemoveAll = () => {
    onChange([]);
  };

  // Handle input focus
  const handleInputFocus = () => {
    setIsOpen(true);
  };

  // Default format option label if not provided
  const defaultFormatOptionLabel = (option) => (
    <HStack spacing={3} width="100%">
      {option.avatar && (
        <Avatar size="sm" name={option.label} src={option.avatar} />
      )}
      <Box flex="1">
        <Text fontSize="sm" fontWeight="500">
          {option.label}
        </Text>
        {option.role && (
          <Text fontSize="xs" color="gray.500">
            {option.role}
          </Text>
        )}
      </Box>
    </HStack>
  );

  const renderOption = formatOptionLabel || defaultFormatOptionLabel;

  return (
    <VStack
      ref={dropdownRef}
      spacing={4}
      align="stretch"
      width="100%"
      position="relative"
    >
      {/* Search Input with Add All button */}
      <HStack spacing={2}>
        <InputGroup flex={1}>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.400" />
          </InputLeftElement>

          <Input
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={handleInputFocus}
            focusBorderColor="brand.500"
            borderColor={borderColor}
          />
        </InputGroup>

        {isOpen && filteredOptions.length > 0 && (
          <Button
            leftIcon={<AddIcon />}
            colorScheme="brand"
            variant="outline"
            onClick={handleAddAllFiltered}
            size="md"
          >
            Add All ({filteredOptions.length})
          </Button>
        )}
      </HStack>

      {/* Search Results Box */}
      {isOpen && (
        <Box position="relative" width="100%">
          <Box
            borderWidth="1px"
            borderColor={borderColor}
            borderRadius="md"
            maxH={maxHeight}
            overflowY="auto"
            bg={boxBg}
            boxShadow="lg"
            position="absolute"
            width="100%"
            zIndex={10}
          >
            {filteredOptions.length > 0 ? (
              <VStack spacing={0} align="stretch">
                {filteredOptions.map((option) => (
                  <HStack
                    key={option.value}
                    justify="space-between"
                    p={3}
                    borderBottomWidth="1px"
                    borderBottomColor={borderColor}
                    _last={{ borderBottom: "none" }}
                    _hover={{ bg: hoverBg }}
                    cursor="pointer"
                    onClick={() => handleAddItem(option)}
                  >
                    <Box flex={1}>{renderOption(option)}</Box>

                    <IconButton
                      icon={<AddIcon />}
                      size="sm"
                      colorScheme="brand"
                      variant="ghost"
                      aria-label="Add"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddItem(option);
                      }}
                    />
                  </HStack>
                ))}
              </VStack>
            ) : (
              <Box p={4} textAlign="center" color="gray.500">
                {searchTerm ? "No matching items found" : "No items available"}
              </Box>
            )}
          </Box>
        </Box>
      )}

      {/* Selected Items Box */}
      {selectedItems.length > 0 && (
        <Box
          borderWidth="1px"
          borderColor={borderColor}
          borderRadius="md"
          bg={selectedBg}
          mt={isOpen ? maxHeight : 0}
        >
          {/* Header */}
          <Flex
            justify="space-between"
            align="center"
            p={3}
            borderBottomWidth="1px"
            borderBottomColor={borderColor}
            bg={headerBg}
            borderTopRadius="md"
          >
            <HStack>
              <Text fontWeight="600" fontSize="sm">
                Selected Items
              </Text>

              <Badge colorScheme="brand" borderRadius="full" px={2}>
                {selectedItems.length}
              </Badge>
            </HStack>

            <Button
              size="xs"
              variant="ghost"
              colorScheme="red"
              onClick={handleRemoveAll}
            >
              Clear All
            </Button>
          </Flex>

          {/* Selected Items List with Scroll */}
          <Box maxH={selectedBoxHeight} overflowY="auto" p={2}>
            <VStack spacing={2} align="stretch">
              {selectedItems.map((item) => (
                <HStack
                  key={item.value}
                  justify="space-between"
                  p={2}
                  bg={boxBg}
                  borderRadius="md"
                  borderWidth="1px"
                  borderColor={borderColor}
                  _hover={{ shadow: "sm" }}
                >
                  <Box flex={1}>{renderOption(item)}</Box>

                  <IconButton
                    icon={<FiX />}
                    size="sm"
                    variant="ghost"
                    colorScheme="red"
                    aria-label="Remove"
                    onClick={() => handleRemoveItem(item)}
                  />
                </HStack>
              ))}
            </VStack>
          </Box>
        </Box>
      )}
    </VStack>
  );
};

export default MultiSelectWithBox;
