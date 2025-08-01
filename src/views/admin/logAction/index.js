import React, { useState } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  Text,
  Badge,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Button,
  Stack,
  Divider,
  SimpleGrid,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Select,
  useColorModeValue,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  FormControl,
  FormLabel,
  useColorMode
} from '@chakra-ui/react';
import { FiFilter, FiUser, FiX, FiSearch } from 'react-icons/fi';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

const goldenColors = {
  primary: '#b79045',
  light: '#d4b778',
  dark: '#9a7a38',
  lighter: '#f0e6d2',
  darkest: '#6a5729',
  text: '#2d2d2d',
  lightBg: '#f9f5ed',
  darkBg: '#1a1a1a',
  hoverBg: 'rgba(0, 0, 0, 0.05)',
  hoverText: '#6a5729'
};

const levels = {
  VIEW: 1,
  LOGIN_SUCCESS: 2,
  LIST: 2,
  CREATE: 3,
  UPDATE: 4,
  UPDATE_FAIL: 5,
  LOGIN_FAIL: 5,
  DELETE: 6,
  DELETE_FAIL: 6,
  BULK_DELETE: 7,
};

const dummyLogs = [
  {
    userId: '64f2c9e3d12a4b001f7c89d2',
    userName: 'Admin User',
    action: 'DELETE',
    entity: 'User',
    entityId: '64f2c9e3d12a4b001f7c89fa',
    status: 'success',
    securityLevel: levels.DELETE,
    message: 'Admin deleted user.',
    metadata: {
      ip: '103.255.4.11',
      device: 'Desktop (Windows)',
      browser: 'Chrome',
      country: 'Pakistan',
      region: 'Punjab',
      city: 'Lahore',
      timezone: 'Asia/Karachi',
      timestamp: new Date().toISOString()
    }
  },
  {
    userId: '64f2c9e3d12a4b001f7c89d3',
    userName: 'Manager User',
    action: 'UPDATE',
    entity: 'Role',
    entityId: '64f2c9e3d12a4b001f7c89fb',
    status: 'pending',
    securityLevel: levels.UPDATE,
    message: 'Role permissions updated',
    metadata: {
      ip: '192.168.1.1',
      device: 'Desktop (Mac)',
      browser: 'Safari',
      country: 'USA',
      region: 'California',
      city: 'San Francisco',
      timezone: 'America/Los_Angeles',
      timestamp: new Date(Date.now() - 86400000).toISOString()
    }
  },
  {
    userId: '64f2c9e3d12a4b001f7c89d4',
    userName: 'Regular User',
    action: 'LOGIN_FAIL',
    entity: 'Auth',
    entityId: '64f2c9e3d12a4b001f7c89fc',
    status: 'failure',
    securityLevel: levels.LOGIN_FAIL,
    message: 'Failed login attempt',
    metadata: {
      ip: '203.0.113.45',
      device: 'Mobile (Android)',
      browser: 'Firefox',
      country: 'UK',
      region: 'England',
      city: 'London',
      timezone: 'Europe/London',
      timestamp: new Date(Date.now() - 3600000).toISOString()
    }
  }
];

const statusOptions = [
  { label: 'Success', value: 'success' },
  { label: 'Failure', value: 'failure' },
  { label: 'Pending', value: 'pending' }
];

const timeRangeOptions = [
  { label: 'Last hour', value: '1h' },
  { label: 'Last 24 hours', value: '24h' },
  { label: 'Last 7 days', value: '7d' },
  { label: 'Last 30 days', value: '30d' }
];

const actionOptions = Object.keys(levels).map(action => ({
  label: action.replace(/_/g, ' '),
  value: action
}));

const levelOptions = Object.entries(levels).map(([name, value]) => ({
  label: `${name.replace(/_/g, ' ')} (${value})`,
  value: value.toString()
}));

const MotionTr = motion(Tr);

const LogTable = () => {
  const [selectedLog, setSelectedLog] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    timeRange: '',
    status: '',
    action: '',
    securityLevel: '',
    search: ''
  });

  const { colorMode } = useColorMode();
  const bgColor = useColorModeValue('white', goldenColors.darkBg);
  const textColor = useColorModeValue(goldenColors.text, 'white');

  const formatTimestamp = (timestamp) => format(new Date(timestamp), "MMM d, yyyy HH:mm:ss");

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'success': return 'green';
      case 'failure': return 'red';
      case 'pending': return 'yellow';
      default: return 'gray';
    }
  };

const renderSecurityLevel = (levelValue) => {
  const maxLevel = 7; 
  const boxSize = "10px"; 
  const gap = "2px"; 

  const getLevelColor = (level) => {
    if (level >= 6) return "red.500";
    if (level >= 4) return "orange.500";
    if (level >= 2) return "blue.500";
    return "green.500";
  };

  const levelColor = getLevelColor(levelValue);

  return (
    <Flex
      borderWidth="1px"
      borderColor="gray.300"
      borderRadius="sm"
      p="3px"
      w={`calc(${maxLevel} * (${boxSize} + ${gap}) + 6px)`} 
      h={`calc(${boxSize} + 6px)`} 
      alignItems="center"
      justifyContent="center"
      bg="white"
    >
      <Flex gap={gap}>
        {Array.from({ length: maxLevel }).map((_, index) => (
          <Box
            key={index}
            w={boxSize}
            h={boxSize}
            borderRadius="sm"
            bg={index < levelValue ? levelColor : "gray.100"}
            borderWidth="1px"
            borderColor={index < levelValue ? levelColor : "gray.300"}
          />
        ))}
      </Flex>
    </Flex>
  );
};
  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => setIsFilterOpen(false);
  
  const resetFilters = () => setFilters({
    timeRange: '',
    status: '',
    action: '',
    securityLevel: '',
    search: ''
  });

  const closeDrawer = () => setIsDrawerOpen(false);

  const filteredLogs = dummyLogs.filter(log => {
    if (filters.search && !log.userName.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.status && log.status !== filters.status) return false;
    if (filters.action && log.action !== filters.action) return false;
    if (filters.securityLevel && log.securityLevel.toString() !== filters.securityLevel) return false;
    return true;
  });

  return (
    <Box px={4} py={2} minH="100vh" bg={bgColor} borderRadius="md">
      {/* Header with title and filter button */}
      <Flex justify="space-between" align="center" mb={6}>
        <Text fontSize="2xl" fontWeight="bold" color={goldenColors.primary}>
          Actions
        </Text>
        <Button
          leftIcon={<FiFilter />}
          bg={goldenColors.primary}
          color="white"
          _hover={{ bg: goldenColors.dark }}
          _active={{ bg: goldenColors.darkest }}
          onClick={() => setIsFilterOpen(true)}
        >
          Filters
        </Button>
      </Flex>

      {/* Main Log Table */}
      <Box
        borderWidth="1px"
        borderRadius="lg"
        borderColor={goldenColors.light}
        overflow="hidden"
        boxShadow="md"
      >
        <Table variant="simple" size="md">
          <Thead bg={goldenColors.primary}>
            <Tr>
              <Th color="white" py={4} px={4}>User</Th>
              <Th color="white" py={4} px={4}>Action</Th>
              <Th color="white" py={4} px={4}>Status</Th>
              <Th color="white" py={4} px={4}>Security Level</Th>
              <Th color="white" py={4} px={4}>Message</Th>
              <Th color="white" py={4} px={4}>Timestamp</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredLogs.map((log, index) => (
              <MotionTr
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                _hover={{ 
                  bg: colorMode === 'light' ? 'gray.50' : 'gray.700'
                }}
                onClick={() => {
                  setSelectedLog(log);
                  setIsDrawerOpen(true);
                }}
                cursor="pointer"
              >
                <Td py={3} px={4}>
                  <Flex align="center">
                    <Icon as={FiUser} mr={2} color={goldenColors.primary} />
                    <Text>{log.userName}</Text>
                  </Flex>
                </Td>
                <Td py={3} px={4}>{log.action.replace(/_/g, ' ')}</Td>
                <Td py={3} px={4}>
                  <Badge 
                    colorScheme={getStatusColor(log.status)}
                    px={3}
                    py={1}
                    borderRadius="full"
                  >
                    {log.status}
                  </Badge>
                </Td>
                <Td py={3} px={4}>
                  {renderSecurityLevel(log.securityLevel)}
                </Td>
                <Td py={3} px={4} maxW="300px" isTruncated>{log.message}</Td>
                <Td py={3} px={4}>{formatTimestamp(log.metadata.timestamp)}</Td>
              </MotionTr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {/* Filter Modal */}
      <Modal isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} size="xl">
        <ModalOverlay />
        <ModalContent maxH="80vh" overflow="hidden">
          <ModalHeader 
            bg={goldenColors.primary}
            color="white"
            py={4}
          >
            <Flex justify="space-between" align="center">
              <Text>Filter Logs</Text>
              <IconButton
                icon={<FiX />}
                variant="ghost"
                color="white"
                _hover={{ bg: goldenColors.dark }}
                onClick={() => setIsFilterOpen(false)}
                aria-label="Close"
              />
            </Flex>
          </ModalHeader>
          <ModalBody p={6} overflowY="auto">
            <SimpleGrid columns={2} spacing={6}>
              {/* User Search */}
              <FormControl gridColumn="1 / -1">
                <FormLabel>Search User</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FiSearch} color="gray.400" />
                  </InputLeftElement>
                  <Input
                    placeholder="Search by user name..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    focusBorderColor={goldenColors.primary}
                  />
                </InputGroup>
              </FormControl>

              {/* Time Range */}
              <FormControl>
                <FormLabel>Time Range</FormLabel>
                <Select
                  placeholder="Select time range"
                  value={filters.timeRange}
                  onChange={(e) => handleFilterChange('timeRange', e.target.value)}
                  focusBorderColor={goldenColors.primary}
                >
                  {timeRangeOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </Select>
              </FormControl>

              {/* Status */}
              <FormControl>
                <FormLabel>Status</FormLabel>
                <Select
                  placeholder="Select status"
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  focusBorderColor={goldenColors.primary}
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </Select>
              </FormControl>

              {/* Action */}
              <FormControl>
                <FormLabel>Action</FormLabel>
                <Select
                  placeholder="Select action"
                  value={filters.action}
                  onChange={(e) => handleFilterChange('action', e.target.value)}
                  focusBorderColor={goldenColors.primary}
                >
                  {actionOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </Select>
              </FormControl>

              {/* Security Level */}
              <FormControl>
                <FormLabel>Security Level</FormLabel>
                <Select
                  placeholder="Select security level"
                  value={filters.securityLevel}
                  onChange={(e) => handleFilterChange('securityLevel', e.target.value)}
                  focusBorderColor={goldenColors.primary}
                >
                  {levelOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </Select>
              </FormControl>
            </SimpleGrid>
          </ModalBody>
          <ModalFooter 
            bg={useColorModeValue(goldenColors.lighter, 'gray.700')}
            py={4}
          >
            <Button
              variant="outline"
              colorScheme="gray"
              mr={3}
              onClick={resetFilters}
            >
              Reset All
            </Button>
            <Button
              bg={goldenColors.primary}
              color="white"
              _hover={{ bg: goldenColors.dark }}
              onClick={applyFilters}
            >
              Apply Filters
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Log Details Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        placement="right"
        onClose={closeDrawer}
        size="md"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader 
            bg={goldenColors.primary}
            color="white"
            py={4}
          >
            <Flex justify="space-between" align="center">
              <Text>Log Details</Text>
              <IconButton
                icon={<FiX />}
                variant="ghost"
                color="white"
                _hover={{ bg: goldenColors.dark }}
                onClick={closeDrawer}
                aria-label="Close"
              />
            </Flex>
          </DrawerHeader>
          <DrawerBody p={6}>
            {selectedLog && (
              <Stack spacing={6}>
                <SimpleGrid columns={2} spacing={6}>
                  <Box>
                    <Text fontSize="sm" color="gray.500">User</Text>
                    <Text fontWeight="medium" color={textColor}>
                      <Flex align="center">
                        <Icon as={FiUser} mr={2} color={goldenColors.primary} />
                        {selectedLog.userName}
                      </Flex>
                    </Text>
                  </Box>
                  <Box>
                    <Text fontSize="sm" color="gray.500">Action</Text>
                    <Text fontWeight="medium" color={textColor}>
                      {selectedLog.action.replace(/_/g, ' ')}
                    </Text>
                  </Box>
                  <Box>
                    <Text fontSize="sm" color="gray.500">Status</Text>
                    <Badge 
                      colorScheme={getStatusColor(selectedLog.status)}
                      px={3}
                      py={1}
                      borderRadius="full"
                      fontSize="xs"
                      fontWeight="bold"
                    >
                      {selectedLog.status}
                    </Badge>
                  </Box>
                  <Box>
                    <Text fontSize="sm" color="gray.500">Security Level</Text>
                    {renderSecurityLevel(selectedLog.securityLevel)}
                  </Box>
                  <Box>
                    <Text fontSize="sm" color="gray.500">Timestamp</Text>
                    <Text fontWeight="medium" color={textColor}>
                      {formatTimestamp(selectedLog.metadata.timestamp)}
                    </Text>
                  </Box>
                </SimpleGrid>

                <Divider borderColor={goldenColors.light} />

                <Box>
                  <Text fontSize="sm" color="gray.500">Message</Text>
                  <Text 
                    fontWeight="medium" 
                    color={textColor}
                    p={3}
                    bg={goldenColors.lighter}
                    borderRadius="md"
                  >
                    {selectedLog.message}
                  </Text>
                </Box>

                <Divider borderColor={goldenColors.light} />

                <Box>
                  <Text fontSize="md" fontWeight="bold" mb={3} color={goldenColors.primary}>
                    Metadata
                  </Text>
                  <SimpleGrid columns={2} spacing={6}>
                    <Box>
                      <Text fontSize="sm" color="gray.500">IP Address</Text>
                      <Text fontWeight="medium" color={textColor}>
                        {selectedLog.metadata.ip}
                      </Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.500">Device</Text>
                      <Text fontWeight="medium" color={textColor}>
                        {selectedLog.metadata.device}
                      </Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.500">Browser</Text>
                      <Text fontWeight="medium" color={textColor}>
                        {selectedLog.metadata.browser}
                      </Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.500">Location</Text>
                      <Text fontWeight="medium" color={textColor}>
                        {selectedLog.metadata.city}, {selectedLog.metadata.region}, {selectedLog.metadata.country}
                      </Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.500">Timezone</Text>
                      <Text fontWeight="medium" color={textColor}>
                        {selectedLog.metadata.timezone}
                      </Text>
                    </Box>
                  </SimpleGrid>
                </Box>
              </Stack>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default LogTable;