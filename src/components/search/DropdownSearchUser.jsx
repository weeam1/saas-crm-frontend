import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Input,
  Flex,
  Text,
  IconButton,
  InputGroup,
  InputRightElement,
  useColorModeValue,
} from '@chakra-ui/react';
import { ChevronDownIcon, CloseIcon } from '@chakra-ui/icons';
import NoData from 'components/Message/NoData';

const DropdownSearchUser = ({
  selectedUserId,
  users,
  onSelectUser,
  size = "md",
  placeholder = "Search users...",
}) => {
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef();
  const inputRef = useRef();

  useEffect(() => {
    if (selectedUserId && users?.length > 0) {
      const user = users.find((user) => user._id === selectedUserId);
      setSelectedUser(user);
      setSearch(user?.fullName || user?.name || '');
    }
  }, [selectedUserId, users]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (user) => {
    setSelectedUser(user);
    setSearch(user.fullName || user.name || '');
    setShowDropdown(false);
    onSelectUser(user);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setSelectedUser(null);
    setSearch('');
    setShowDropdown(false);
    onSelectUser(null);
  };

  const toggleDropdown = (e) => {
    e.stopPropagation(); 
    setShowDropdown(prev => !prev);
  };

  const handleInputFocus = () => {
    setShowDropdown(true);
  };

  const handleInputClick = (e) => {
    if (!selectedUser || !e.target.closest('.input-right-element')) {
      setShowDropdown(true);
    }
  };

  const filteredUsers = search
    ? users.filter(
        (user) =>
          user.fullName?.toLowerCase().includes(search.toLowerCase()) ||
          user.username?.toLowerCase().includes(search.toLowerCase()) ||
          user.name?.toLowerCase().includes(search.toLowerCase())
      )
    : users;

  const bg = useColorModeValue('gray.100', 'gray.700');
  const dropdownBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.300', 'gray.600');

  return (
    <Box position="relative" ref={containerRef}>
      <InputGroup>
        <Input
          ref={inputRef}
          placeholder={placeholder}
          bg="gray.100"
          borderColor={borderColor}
          fontSize="sm"
          py={1}
          {...(size === "sm" ? { size: "sm" } : {})}
          borderRadius="md"
          _focus={{
            borderColor: '#D99A36',
            boxShadow: '0 0 0 1px #D99A36',
            outline: 'none',
          }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={handleInputFocus}
          onClick={handleInputClick}
        />
        <InputRightElement className="input-right-element">
          {selectedUser ? (
            <IconButton
              icon={<CloseIcon fontSize="xs" />}
              variant="ghost"
              size="sm"
              onClick={handleClear}
              aria-label="Clear selection"
              top={size === "sm" ? "-4px" : "0px"}
            />
          ) : (
            <IconButton
              icon={<ChevronDownIcon />}
              variant="ghost"
              size="sm"
              onClick={toggleDropdown}
              aria-label="Toggle dropdown"
              top={size === "sm" ? "-4px" : "0px"}
            />
          )}
        </InputRightElement>
      </InputGroup>

      {showDropdown && (
        <Box
          position="absolute"
          width="100%"
          bg={dropdownBg}
          shadow="md"
          borderRadius="md"
          mt={1}
          zIndex={50}
          maxH="300px"
          overflowY="auto"
          border="1px solid"
          borderColor={borderColor}
        >
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user, index) => (
              <Flex
                key={`${index}-${user?._id}`}
                p={3}
                bg={bg}
                rounded="md"
                cursor="pointer"
                _hover={{ bg: 'brand.100' }}
                onClick={() => handleSelect(user)}
                align="center"
                justify="space-between"
                m={1}
              >
                <Box>
                  <Text fontSize="md">{user.fullName || user.name}</Text>
                  <Text fontSize="sm" color="gray.500">
                    {user.username}
                  </Text>
                </Box>
              </Flex>
            ))
          ) : (
            <NoData label="user" />
          )}
        </Box>
      )}
    </Box>
  );
};

export default DropdownSearchUser;