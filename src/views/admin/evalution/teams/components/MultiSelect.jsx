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
  Flex,
} from "@chakra-ui/react";
import { SearchIcon, AddIcon } from "@chakra-ui/icons";
import { FiX } from "react-icons/fi";
import { useModalColors } from "hooks/useModalColors";

const MultiSelectWithBox = ({
  options = [],
  value = [],
  onChange,
  placeholder = "Search...",
  maxHeight = "300px",
  selectedBoxHeight = "200px",
  formatOptionLabel,
  onSearch,
  onMenuClose,
  searchValue = "",
  selectStyles = null, // Allow passing custom styles from parent
}) => {
  const colors = useModalColors();
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Sync external search value if provided
  useEffect(() => {
    if (searchValue !== undefined) {
      setSearchTerm(searchValue);
    }
  }, [searchValue]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
        // Call onMenuClose if provided
        if (onMenuClose) {
          onMenuClose();
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onMenuClose]);

  // Trigger search when search term changes
  useEffect(() => {
    if (onSearch && isOpen) {
      onSearch(searchTerm);
    }
  }, [searchTerm, onSearch, isOpen]);

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

    return filtered;
  }, [options, searchTerm, value]);

  // Handle adding an item
  const handleAddItem = (item) => {
    const newValues = [...value, item.value];
    onChange(newValues);
    setSearchTerm("");
    // Clear search term and keep dropdown open for adding more
    if (onSearch) {
      onSearch("");
    }
  };

  // Handle removing an item
  const handleRemoveItem = (itemToRemove) => {
    const newValues = value.filter((v) => v !== itemToRemove.value);
    onChange(newValues);
  };

  // Handle add all filtered items
  const handleAddAllFiltered = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const newFilteredValues = filteredOptions.map((opt) => opt.value);
    const newValues = [...new Set([...value, ...newFilteredValues])];

    onChange(newValues);
    setSearchTerm("");
    if (onSearch) {
      onSearch("");
    }
  };

  // Handle remove all
  const handleRemoveAll = () => {
    onChange([]);
  };

  // Handle input focus
  const handleInputFocus = () => {
    setIsOpen(true);
  };

  // Handle input blur with delay to allow click events
  const handleInputBlur = () => {
    // Small delay to allow click events on dropdown items
    setTimeout(() => {
      setIsOpen(false);
      setSearchTerm("");
      if (onMenuClose) {
        onMenuClose();
      }
    }, 200);
  };

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    // Keep dropdown open when typing
    setIsOpen(true);
  };

  // Default format option label if not provided
  const defaultFormatOptionLabel = (option) => (
    <HStack spacing={3} width="100%">
      <Box flex="1">
        <Text fontSize="sm" fontWeight="500" color={colors.bodyText}>
          {option.label}
        </Text>
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
          <Input
            ref={inputRef}
            placeholder={placeholder}
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            bg={colors.bgInput}
            borderColor={colors.borderColor}
            color={colors.headingText}
            _placeholder={{ color: colors.mutedText }}
            _focus={{
              borderColor: colors.accentGold,
              boxShadow: `0 0 0 1px ${colors.accentGold}`,
            }}
            _hover={{ borderColor: colors.accentGold }}
          />
        </InputGroup>

        {isOpen && filteredOptions.length > 0 && (
          <Button
            leftIcon={<AddIcon />}
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
            borderColor={colors.borderColor}
            borderRadius="md"
            maxH={maxHeight}
            overflowY="auto"
            bg={colors.bg}
            boxShadow={colors.cardShadow}
            position="absolute"
            width="100%"
            zIndex={10}
            top="0"
          >
            {filteredOptions.length > 0 ? (
              <VStack spacing={0} align="stretch">
                {filteredOptions.map((option) => (
                  <HStack
                    key={option.value}
                    justify="space-between"
                    p={3}
                    borderBottomWidth="1px"
                    borderBottomColor={colors.borderColor}
                    _last={{ borderBottom: "none" }}
                    _hover={{ bg: colors.bgDeep }}
                    cursor="pointer"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleAddItem(option);
                    }}
                  >
                    <Box flex={1}>{renderOption(option)}</Box>

                    <IconButton
                      icon={<AddIcon />}
                      size="sm"
                      variant="ghost"
                      aria-label="Add"
                      color={colors.accentGold}
                      _hover={{ bg: colors.bgDeep, color: colors.goldLight }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleAddItem(option);
                      }}
                    />
                  </HStack>
                ))}
              </VStack>
            ) : (
              <Box p={4} textAlign="center" color={colors.mutedText}>
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
          borderColor={colors.borderColor}
          borderRadius="md"
          bg={colors.bgInput}
          mt={isOpen ? maxHeight : 0}
        >
          {/* Header */}
          <Flex
            justify="space-between"
            align="center"
            p={3}
            borderBottomWidth="1px"
            borderBottomColor={colors.borderColor}
            bg={colors.bgDeep}
            borderTopRadius="md"
          >
            <HStack>
              <Text fontWeight="600" fontSize="sm" color={colors.headingText}>
                Selected Items
              </Text>

              <Badge
                bg={colors.badgeInfoBg}
                color={colors.badgeInfoText}
                borderRadius="full"
                px={2}
              >
                {selectedItems.length}
              </Badge>
            </HStack>

            <Button
              size="xs"
              variant="ghost"
              onClick={handleRemoveAll}
              color={colors.badgeErrorText}
              _hover={{ bg: colors.badgeErrorBg, color: colors.badgeErrorText }}
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
                  bg={colors.bg}
                  borderRadius="md"
                  borderWidth="1px"
                  borderColor={colors.borderColor}
                  _hover={{ boxShadow: colors.cardShadow }}
                >
                  <Box flex={1}>{renderOption(item)}</Box>

                  <IconButton
                    icon={<FiX />}
                    size="sm"
                    variant="ghost"
                    aria-label="Remove"
                    onClick={() => handleRemoveItem(item)}
                    color={colors.badgeErrorText}
                    _hover={{ bg: colors.badgeErrorBg, color: colors.badgeErrorText }}
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