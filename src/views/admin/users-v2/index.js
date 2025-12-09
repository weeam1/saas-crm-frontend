import {
  Box,
  Flex,
  Text,
  Avatar,
  Badge,
  IconButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Switch,
  Tooltip,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  Input,
  Button,
  PopoverBody,
  Portal,
  InputGroup,
  InputLeftElement,
  Select,
  InputRightElement,
} from "@chakra-ui/react";
import React, { useState } from "react";
import {
  Eye,
  Edit,
  Plus,
  Pencil,
  Coins,
  Search,
  Filter,
  X,
} from "lucide-react";
import { motion } from "framer-motion";

// Step 1: Define role styles
const roleBadgeStyles = {
  superAdmin: { colorScheme: "red" },
  Admin: { colorScheme: "blue" },
  Agent: { colorScheme: "teal" },
  Manager: { colorScheme: "orange" },
  "Finance Manager": { colorScheme: "purple" },
  Developer: { colorScheme: "cyan" },
  HR: { colorScheme: "pink" },
  User: { colorScheme: "gray" }, // fallback for generic users
};

// const initialUsers = [];

const initialUsers = [
  {
    id: 1,
    name: "John Carter",
    email: "john.carter@example.com",
    status: "online",
    role: "Admin",
    coins: 1200,
    target: "AED 5,000",
    accountStatus: "Active",
  },
  {
    id: 2,
    name: "Sophia Khan",
    email: "sophia.khan@example.com",
    status: "offline",
    role: "Manager",
    coins: 950,
    target: "AED 3,800",
    accountStatus: "Suspended",
  },
  {
    id: 3,
    name: "Daniel Lee",
    email: "daniel.lee@example.com",
    status: "online",
    role: "Agent",
    coins: 300,
    target: "AED 1,500",
    accountStatus: "Active",
  },
  {
    id: 4,
    name: "Emma Watson",
    email: "emma.watson@example.com",
    status: "online",
    role: "Finance Manager",
    coins: 500,
    target: "AED 2,500",
    accountStatus: "Active",
  },
  {
    id: 5,
    name: "Liam Smith",
    email: "liam.smith@example.com",
    status: "offline",
    role: "Manager",
    coins: 800,
    target: "AED 4,000",
    accountStatus: "Suspended",
  },
  {
    id: 6,
    name: "Olivia Brown",
    email: "olivia.brown@example.com",
    status: "online",
    role: "Admin",
    coins: 1300,
    target: "AED 6,500",
    accountStatus: "Active",
  },
  {
    id: 7,
    name: "Noah Davis",
    email: "noah.davis@example.com",
    status: "offline",
    role: "Developer",
    coins: 200,
    target: "AED 1,200",
    accountStatus: "Suspended",
  },
  {
    id: 8,
    name: "Ava Wilson",
    email: "ava.wilson@example.com",
    status: "online",
    role: "HR",
    coins: 450,
    target: "AED 2,000",
    accountStatus: "Active",
  },
  {
    id: 9,
    name: "Ethan Taylor",
    email: "ethan.taylor@example.com",
    status: "offline",
    role: "superAdmin",
    coins: 900,
    target: "AED 4,500",
    accountStatus: "Active",
  },
  {
    id: 10,
    name: "Isabella Martinez",
    email: "isabella.martinez@example.com",
    status: "online",
    role: "Agent",
    coins: 350,
    target: "AED 1,800",
    accountStatus: "Active",
  },
];

const MotionFilterIcon = React.memo(motion(Filter));

const UserTable = () => {
  const [users, setUsers] = useState(initialUsers);

  // Inside UserTable component, after this line
  const [showFilters, setShowFilters] = useState(false);
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [coinsFilter, setCoinsFilter] = useState("");

  const [searchQuery, setSearchQuery] = useState("");

  // Filtered users derived from search + role + status filters
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter ? user.role === roleFilter : true;
    const matchesStatus = statusFilter
      ? user.accountStatus === statusFilter
      : true;

    // Handle coin ranges
    let matchesCoins = true;

    if (coinsFilter) {
      const [min, max] = coinsFilter.split("-").map(Number);
      if (coinsFilter === "10000+") {
        matchesCoins = user.coins > 10000;
      } else {
        matchesCoins = user.coins >= min && user.coins <= max;
      }
    }

    return matchesSearch && matchesRole && matchesStatus && matchesCoins;
  });

  const filtersApplied =
    roleFilter || statusFilter || searchQuery || coinsFilter;

  // Filtered users based on selections

  const [mode, setMode] = useState("add");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // --- HANDLER ---
  const handleUpdateCoins = async () => {
    if (!amount || Number(amount) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    setIsLoading(true);

    try {
      const value = Number(amount);

      const payload = {
        userId: "1",
        coins: mode === "add" ? value : -value, // Add = +value, Subtract = -value
      };

      // 🔥 Call your backend API here
      // await updateUserCoins(payload);

      // Optional: refresh list or update local state
      // refreshUsers();
    } catch (err) {
      console.error(err);
    }

    setAmount("");
    setIsLoading(false);
  };

  const handleToggle = (userId) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? {
              ...u,
              accountStatus:
                u.accountStatus === "Active" ? "Suspended" : "Active",
            }
          : u
      )
    );
  };

  return (
    <Box p={{ base: 2, md: 6 }}>
      {/* Header + Action Row */}
      <Flex
        justify="space-between"
        align={{ base: "flex-start", md: "center" }}
        mb={4}
        flexDir={{ base: "column", md: "row" }}
        gap={{ base: 3, md: 0 }}
      >
        <Text fontSize={{ base: "20px", md: "26px" }} fontWeight="800">
          Users
        </Text>

        <Button
          leftIcon={<Plus size={18} />}
          bg="gray.50"
          color="gray.800"
          border="1px solid #D0D5DD"
          size="md"
          borderRadius="12px"
          fontWeight="600"
          px={5}
          mt={{ base: 2, md: 0 }} // spacing on mobile
          _hover={{ bg: "gray.100" }}
          boxShadow="0px 1px 3px rgba(0,0,0,0.08)"
        >
          New User
        </Button>
      </Flex>

      {/* Search + Filters Row */}
      <Flex
        justify={{ base: "flex-start", md: "flex-end" }}
        align="center"
        mb={4}
        gap={3}
        flexWrap="wrap"
      >
        {/* Search Input */}
        <InputGroup maxW={{ base: "100%", md: "260px" }}>
          <InputLeftElement pointerEvents="none">
            <Search size={16} color="#A0AEC0" />
          </InputLeftElement>

          <Input
            placeholder="Search users..."
            bg="white"
            border="1px solid #E2E8F0"
            borderRadius="12px"
            fontSize="sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            _focus={{
              borderColor: "gray.400",
              boxShadow: "0 0 0 1px #CBD5E0",
            }}
          />

          {searchQuery && (
            <InputRightElement>
              <X
                size={16}
                color="#A0AEC0"
                cursor="pointer"
                onClick={() => setSearchQuery("")}
              />
            </InputRightElement>
          )}
        </InputGroup>

        {/* Filter Toggle Button */}
        <Button
          leftIcon={
            <MotionFilterIcon
              size={16}
              color={showFilters ? "#4A5568" : "#A0AEC0"}
              animate={{ rotate: showFilters ? 180 : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            />
          }
          bg={showFilters ? "gray.100" : "gray.50"}
          border="1px solid #D0D5DD"
          color="gray.800"
          borderRadius="12px"
          fontWeight="600"
          px={4}
          _hover={{ bg: showFilters ? "gray.200" : "gray.100" }}
          boxShadow={
            showFilters
              ? "0 2px 6px rgba(0,0,0,0.08)"
              : "0px 1px 3px rgba(0,0,0,0.08)"
          }
          onClick={() => setShowFilters((prev) => !prev)}
          mt={{ base: 2, md: 0 }} // spacing on mobile
        >
          Filters
        </Button>
      </Flex>

      {/* Filters Panel */}
      {showFilters && (
        <Flex
          mb={6}
          p={4}
          bg="white"
          borderRadius="20px"
          boxShadow="0px 8px 24px rgba(0,0,0,0.08)"
          align="center"
          justify="space-between"
          flexWrap="wrap"
          gap={4}
          border="1px solid #E2E8F0"
        >
          <Flex gap={4} flexWrap="wrap" align="center">
            {/* Role Filter */}
            <Box flex="1" minW={{ base: "100%", md: "200px" }}>
              <Text fontSize="sm" fontWeight="600" mb={1} color="gray.600">
                Role
              </Text>
              <Select
                placeholder="Select role"
                size="md"
                borderRadius="14px"
                borderColor="gray.300"
                bg="gray.50"
                fontSize="sm"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                _hover={{ borderColor: "gray.400" }}
                _focus={{
                  borderColor: "gray.500",
                  boxShadow: "0 0 0 1px rgba(0,0,0,0.08)",
                }}
              >
                {Object.keys(roleBadgeStyles).map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </Select>
            </Box>

            {/* Status Filter */}
            <Box flex="1" minW={{ base: "100%", md: "200px" }}>
              <Text fontSize="sm" fontWeight="600" mb={1} color="gray.600">
                Account Status
              </Text>
              <Select
                placeholder="Select status"
                size="md"
                borderRadius="14px"
                borderColor="gray.300"
                bg="gray.50"
                fontSize="sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                _hover={{ borderColor: "gray.400" }}
                _focus={{
                  borderColor: "gray.500",
                  boxShadow: "0 0 0 1px rgba(0,0,0,0.08)",
                }}
              >
                <option value="Active">Active</option>
                <option value="Suspended">Suspended</option>
              </Select>
            </Box>

            {/* Coins Filter */}
            <Box flex="1" minW={{ base: "100%", md: "200px" }}>
              <Text fontSize="sm" fontWeight="600" mb={1} color="gray.600">
                Coins Range
              </Text>

              <Select
                placeholder="Select coins range"
                size="md"
                borderRadius="14px"
                borderColor="gray.300"
                bg="gray.50"
                fontSize="sm"
                value={coinsFilter}
                onChange={(e) => setCoinsFilter(e.target.value)}
                _hover={{ borderColor: "gray.400" }}
                _focus={{
                  borderColor: "gray.500",
                  boxShadow: "0 0 0 1px rgba(0,0,0,0.08)",
                }}
              >
                <option value="0-100">0 - 100</option>
                <option value="100-500">100 - 500</option>
                <option value="500-1000">500 - 1000</option>
                <option value="1000-5000">1000 - 5000</option>
                <option value="5000-10000">5000 - 10000</option>
                <option value="10000+">Above 10000</option>
              </Select>
            </Box>
          </Flex>

          {/* Clear Filters Button */}
          {filtersApplied && (
            <Box
              flex={{ base: "1", md: "auto" }}
              textAlign={{ base: "left", md: "right" }}
            >
              <Button
                size="md"
                borderRadius="14px"
                bg="white"
                color="gray.600"
                fontWeight="500"
                px={5}
                gap={2}
                leftIcon={<X size={16} />}
                border="1px solid #E2E8F0"
                _hover={{
                  bg: "gray.50",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                }}
                _active={{
                  bg: "gray.100",
                  transform: "scale(0.98)",
                }}
                transition="all 0.2s ease"
                onClick={() => {
                  setRoleFilter("");
                  setStatusFilter("");
                  setSearchQuery("");
                  setCoinsFilter("");
                }}
              >
                Clear Filters
              </Button>
            </Box>
          )}
        </Flex>
      )}

      <Box
        bg="white"
        borderRadius="20px"
        boxShadow="0px 4px 30px rgba(0,0,0,0.06)"
        p={{ base: 3, md: 6 }}
        border="1px solid"
        borderColor="gray.100"
        overflowX="auto"
      >
        <Table variant="simple" size="md">
          <Thead bg="gray.50">
            <Tr>
              <Th
                fontSize="sm"
                fontWeight="700"
                color="gray.600"
                textTransform="uppercase"
                letterSpacing="0.5px"
                px={3} // reduce horizontal padding
                w="40px" // optional: fix width for #
              >
                #
              </Th>
              <Th
                fontSize="sm"
                fontWeight="700"
                color="gray.600"
                textTransform="uppercase"
                letterSpacing="0.5px"
                px={3} // reduce padding
              >
                User
              </Th>

              <Th
                fontSize="sm"
                fontWeight="700"
                color="gray.600"
                textTransform="uppercase"
                letterSpacing="0.5px"
                px={3}
              >
                Role
              </Th>
              <Th
                fontSize="sm"
                fontWeight="700"
                color="gray.600"
                textTransform="uppercase"
                letterSpacing="0.5px"
                px={3}
              >
                Online Status
              </Th>

              <Th
                fontSize="sm"
                fontWeight="700"
                color="gray.600"
                textTransform="uppercase"
                letterSpacing="0.5px"
                px={3}
              >
                Coins
              </Th>
              <Th
                fontSize="sm"
                fontWeight="700"
                color="gray.600"
                textTransform="uppercase"
                letterSpacing="0.5px"
                px={3}
              >
                Target
              </Th>
              <Th
                fontSize="sm"
                fontWeight="700"
                color="gray.600"
                textTransform="uppercase"
                letterSpacing="0.5px"
                px={3}
              >
                Active
              </Th>
              <Th
                textAlign="right"
                fontSize="sm"
                fontWeight="700"
                color="gray.600"
                textTransform="uppercase"
                letterSpacing="0.5px"
                px={3}
              >
                Actions
              </Th>
            </Tr>
          </Thead>

          <Tbody>
            {filteredUsers.length === 0 ? (
              <Tr>
                <Td colSpan={8} py={14}>
                  <Flex
                    direction="column"
                    align="center"
                    justify="center"
                    gap={3}
                  >
                    <Box
                      w="60px"
                      h="60px"
                      borderRadius="full"
                      bg="gray.100"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Search size={28} color="#718096" />
                    </Box>

                    {/* Heading */}
                    <Text fontSize="lg" fontWeight="700" color="gray.700">
                      {initialUsers?.length === 0
                        ? "No users found"
                        : "No matching results"}
                    </Text>

                    {/* Sub-text */}
                    <Text fontSize="sm" color="gray.500" textAlign="center">
                      {initialUsers?.length === 0
                        ? "There are no users to display right now."
                        : "Try adjusting your filters to find what you're looking for."}
                    </Text>

                    {/* Clear Filters button ONLY if filters caused this */}
                    {(roleFilter ||
                      statusFilter ||
                      coinsFilter ||
                      searchQuery) &&
                      initialUsers?.length > 0 && (
                        <Button
                          size="sm"
                          borderRadius="10px"
                          mt={2}
                          bg="gray.100"
                          _hover={{ bg: "gray.200" }}
                          onClick={() => {
                            setRoleFilter("");
                            setStatusFilter("");
                            setSearchQuery("");
                            setCoinsFilter("");
                          }}
                        >
                          Clear Filters
                        </Button>
                      )}
                  </Flex>
                </Td>
              </Tr>
            ) : (
              filteredUsers?.map((user, index) => (
                <Tr
                  key={user.id}
                  _hover={{
                    bg: "gray.50",
                    transform: "translateY(-1px)",
                    transition: "0.2s",
                  }}
                >
                  {/* # */}
                  <Td fontWeight="600" px={3}>
                    {index + 1}
                  </Td>

                  {/* User */}
                  <Td px={3}>
                    <Flex align="center" gap={2}>
                      {" "}
                      {/* reduce gap from 3 -> 2 */}
                      <Avatar name={user.name} size="sm" />
                      <Box>
                        <Text fontWeight="600">{user.name}</Text>
                        <Text fontSize="sm" color="gray.500">
                          {user.email}
                        </Text>
                      </Box>
                    </Flex>
                  </Td>

                  {/* Role */}
                  <Td px={3}>
                    <Badge
                      px={3}
                      py={1}
                      borderRadius="12px"
                      variant="subtle"
                      fontWeight="600"
                      colorScheme={
                        roleBadgeStyles[user.role]
                          ? roleBadgeStyles[user.role].colorScheme
                          : "gray"
                      }
                    >
                      {user.role}
                    </Badge>
                  </Td>

                  {/* Online Status */}
                  <Td px={3}>
                    <Flex align="center" gap={2}>
                      {/* Colored dot */}
                      <Box
                        w="10px"
                        h="10px"
                        borderRadius="full"
                        bg={user.status === "online" ? "green.400" : "gray.400"}
                      />
                      {/* Status text */}
                      <Text
                        fontSize="sm"
                        fontWeight="600"
                        color={
                          user.status === "online" ? "green.600" : "gray.600"
                        }
                        textTransform="capitalize"
                      >
                        {user.status}
                      </Text>
                    </Flex>
                  </Td>

                  {/* Coins */}
                  <Td px={3}>
                    <Flex align="center" gap={2}>
                      {/* Coins Display */}

                      <Flex align="center" gap={2}>
                        <Coins size={16} strokeWidth={1.5} color="#D4A017" />
                        <Text
                          fontWeight="600"
                          fontSize="15px"
                          color="gray.800"
                          fontFamily="mono"
                        >
                          {user.coins}
                        </Text>
                      </Flex>

                      {/* Minimal Edit Trigger */}

                      <Popover placement="bottom-end" isLazy>
                        <PopoverTrigger>
                          <IconButton
                            aria-label="Edit Coins"
                            icon={<Pencil size={16} />}
                            variant="ghost"
                            size="xs"
                            opacity={0.6}
                            _hover={{
                              opacity: 1,
                              bg: "gray.100",
                            }}
                          />
                        </PopoverTrigger>

                        <Portal>
                          {/* Portal ensures popover renders above ALL z-index stack */}
                          <PopoverContent
                            w="220px"
                            borderRadius="14px"
                            p={3}
                            boxShadow="0px 6px 24px rgba(0,0,0,0.12)"
                            zIndex={2000}
                            border="1px solid"
                            borderColor="gray.100"
                            bg="white"
                            animation="fadeIn 0.15s ease-out"
                            _focus={{
                              outline: "none",
                              boxShadow:
                                "0px 6px 24px rgba(0,0,0,0.12) !important",
                            }}
                          >
                            <PopoverArrow />
                            <PopoverBody>
                              <Flex direction="column" gap={4}>
                                {/* Segmented Toggle */}
                                <Flex
                                  bg="gray.100"
                                  p="4px"
                                  borderRadius="10px"
                                  gap="4px"
                                >
                                  <Box
                                    flex={1}
                                    textAlign="center"
                                    py={1}
                                    fontSize="sm"
                                    fontWeight="600"
                                    cursor="pointer"
                                    borderRadius="8px"
                                    bg={
                                      mode === "add"
                                        ? "green.500"
                                        : "transparent"
                                    }
                                    color={
                                      mode === "add" ? "white" : "gray.700"
                                    }
                                    transition="all 0.15s"
                                    onClick={() => setMode("add")}
                                  >
                                    Add
                                  </Box>

                                  <Box
                                    flex={1}
                                    textAlign="center"
                                    py={1}
                                    fontSize="sm"
                                    fontWeight="600"
                                    cursor="pointer"
                                    borderRadius="8px"
                                    bg={
                                      mode === "subtract"
                                        ? "red.500"
                                        : "transparent"
                                    }
                                    color={
                                      mode === "subtract" ? "white" : "gray.700"
                                    }
                                    transition="all 0.15s"
                                    onClick={() => setMode("subtract")}
                                  >
                                    Sub
                                  </Box>
                                </Flex>

                                {/* Minimal Input */}
                                <Input
                                  variant="flushed"
                                  placeholder="Enter amount"
                                  type="number"
                                  min={1}
                                  value={amount}
                                  onChange={(e) => setAmount(e.target.value)}
                                  fontSize="sm"
                                  _focus={{ borderColor: "gray.400" }}
                                />

                                {/* Apply Button */}
                                <Button
                                  size="sm"
                                  borderRadius="10px"
                                  bg={mode === "add" ? "green.500" : "red.500"}
                                  color="white"
                                  fontWeight="600"
                                  _hover={{
                                    bg:
                                      mode === "add" ? "green.600" : "red.600",
                                  }}
                                  onClick={handleUpdateCoins}
                                >
                                  Apply
                                </Button>
                              </Flex>
                            </PopoverBody>
                          </PopoverContent>
                        </Portal>
                      </Popover>
                    </Flex>
                  </Td>

                  {/* Target */}
                  <Td px={3}>
                    <Box
                      px={2}
                      py={1}
                      bg="purple.50" // subtle background
                      color="purple.800" // text color
                      borderRadius="8px" // rounded corners
                      fontWeight="600"
                      fontSize="sm"
                      textAlign="center"
                      maxW="100px" // optional: control width
                      overflow="hidden"
                      textOverflow="ellipsis"
                      whiteSpace="nowrap"
                    >
                      {user.target}
                    </Box>
                  </Td>

                  {/* Active Toggle */}
                  <Td px={3}>
                    <Flex align="center" gap={2} minW="120px">
                      <Switch
                        size="md"
                        colorScheme={
                          user.accountStatus === "Active" ? "green" : "red"
                        }
                        isChecked={user.accountStatus === "Active"}
                        onChange={() => handleToggle(user.id)}
                        borderRadius="full"
                        boxShadow="sm"
                        transition="all 0.2s"
                        _hover={{ boxShadow: "md" }}
                      />
                      <Text
                        fontSize="sm"
                        fontWeight="500"
                        color={
                          user.accountStatus === "Active"
                            ? "green.600"
                            : "red.500"
                        }
                      >
                        {user.accountStatus}
                      </Text>
                    </Flex>
                  </Td>

                  {/* Actions */}
                  <Td textAlign="right" px={3}>
                    <Flex justify="flex-end" align="center" gap="2px">
                      {/* View */}
                      <Tooltip
                        label="View User"
                        placement="top"
                        bg="gray.700"
                        color="white"
                        fontSize="xs"
                        borderRadius="6px"
                        px={2}
                        py={1}
                        hasArrow
                      >
                        <IconButton
                          aria-label="View"
                          icon={<Eye size={16} />}
                          variant="ghost"
                          size="sm"
                          _hover={{ bg: "gray.100" }}
                        />
                      </Tooltip>

                      {/* Edit */}
                      <Tooltip
                        label="Edit User"
                        placement="top"
                        bg="gray.700"
                        color="white"
                        fontSize="xs"
                        borderRadius="6px"
                        px={2}
                        py={1}
                        hasArrow
                      >
                        <IconButton
                          aria-label="Edit"
                          icon={<Edit size={16} />}
                          variant="ghost"
                          size="sm"
                          _hover={{ bg: "gray.100" }}
                        />
                      </Tooltip>

                      {/* More Options */}
                      {/* <Menu placement="left-start">
                      <MenuButton
                        as={IconButton}
                        icon={<MoreVertical size={16} />}
                        variant="ghost"
                        size="sm"
                        _hover={{ bg: "gray.100" }}
                      />
                      <MenuList borderRadius="12px" py={2} shadow="lg">
                        <MenuItem icon={<Plus size={16} />}>Add Coins</MenuItem>
                        <MenuItem icon={<Minus size={16} />}>
                          Remove Coins
                        </MenuItem>
                        <Divider my={2} />
                        <MenuItem icon={<Trash2 size={16} />} color="red.500">
                          Delete User
                        </MenuItem>
                      </MenuList>
                    </Menu> */}
                    </Flex>
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default UserTable;
