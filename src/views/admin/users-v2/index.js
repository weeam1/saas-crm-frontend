import {
  Box,
  Flex,
  Text,
  Avatar,
  Badge,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Divider,
  Switch,
  Tooltip,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  Input,
  Button,
  PopoverBody,
  Portal,
} from "@chakra-ui/react";
import { useState } from "react";
import {
  Eye,
  Edit,
  MoreVertical,
  Plus,
  Minus,
  Trash2,
  Pencil,
  Coins,
} from "lucide-react";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";

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

const UserTable = () => {
  const [users, setUsers] = useState(initialUsers);

  // --- STATE ---
  // const [mode, setMode] = (useState < "add") | ("subtract" > "add");
  // const [amount, setAmount] = useState("");
  // const [isLoading, setIsLoading] = useState(false);

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
    <Box p={6}>
      <Flex justify="space-between" align="center" mb={6}>
        <Text fontSize="26px" fontWeight="800">
          Users
        </Text>
      </Flex>

      <Box
        bg="white"
        borderRadius="20px"
        boxShadow="0px 4px 30px rgba(0,0,0,0.06)"
        p={6}
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
            {users.map((user, index) => (
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
                {/* <Td fontWeight="600" px={3}>
                  {user.coins}
                </Td> */}

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
                                    mode === "add" ? "green.500" : "transparent"
                                  }
                                  color={mode === "add" ? "white" : "gray.700"}
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
                                  bg: mode === "add" ? "green.600" : "red.600",
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
                  <Flex align="center" gap={2}>
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
                    {/* <Text
                      fontSize="sm"
                      fontWeight="600"
                      color={
                        user.accountStatus === "Active"
                          ? "green.600"
                          : "red.500"
                      }
                    >
                      {user.accountStatus}
                    </Text> */}
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
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default UserTable;
