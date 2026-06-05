
import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Heading,
  Text,
  Button,
  ButtonGroup,
  SimpleGrid,
  Grid,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  VStack,
  HStack,
  Flex,
  Spinner,
  IconButton,
  Center,
  useToast,
  Select,
  Avatar,
} from '@chakra-ui/react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import keys from 'config/keys';
import { constant } from 'constant';
import { useFetchItemsQuery } from 'api/apiSlice';
import { useModalColors } from 'hooks/useModalColors';
import RefreshButton from 'components/refresh/RefreshButton';

export default function CRMLeaderboardDashboard() {
  const colors = useModalColors();
  const [initialLoading, setInitialLoading] = useState(true);
  const [data, setData] = useState(null);
  const [period, setPeriod] = useState('weekly');
  const [limit, setLimit] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedAgencyId, setSelectedAgencyId] = useState('');
  const [noDataFound, setNoDataFound] = useState(false);
  const toast = useToast();

  const { data: agenciesData } = useFetchItemsQuery({ path: '/agencies' });
  const agencies = agenciesData?.doc || [];
  const users = useSelector((state) => state.user.users);
  const [enrichedLeaderboard, setEnrichedLeaderboard] = useState([]);
  const [enrichedRecentCalls, setEnrichedRecentCalls] = useState([]);

const fetchLeaderboardData = useCallback(async (selectedPeriod = period, selectedLimit = limit, agencyId = selectedAgencyId, isRefresh = false) => {
  try {
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setInitialLoading(true);
    }

    setNoDataFound(false);

    // If agency is selected, fetch more data first to ensure we have enough to filter
    let fetchLimit = agencyId ? 100 : (selectedLimit === 'all' ? 100 : selectedLimit);

    // Step 1: First fetch all call data to see which users have call records
    let initialUrl = `${keys.sipApiUrl}/leaderboard/call-hours?period=${selectedPeriod}&top=${fetchLimit}&recent_limit=5`;
    const initialResponse = await axios.get(initialUrl);

    // Step 2: Get the user_ids from the API response (only users who have call data)
    const usersWithCallData = initialResponse.data.leaderboard.map(agent => agent.user_id);
    console.log('Users with call data from leaderboard:', usersWithCallData);

    if (agencyId && users?.length) {
      // Step 3: Filter these users by agency (only keep users from selected agency)
      const agencyFilteredUserIds = usersWithCallData.filter(userId => {
        const matchedUser = users.find(user => String(user._id) === String(userId));
        return matchedUser?.agency?._id === agencyId;
      });

      console.log(`Users from selected agency in leaderboard:`, agencyFilteredUserIds);

      if (agencyFilteredUserIds.length === 0) {
        setNoDataFound(true);
        setData(null);
        setInitialLoading(false);
        setIsRefreshing(false);
        return;
      }

      // Step 4: Check which of these users exist in slot-user-call-stats API
      const slotStatsUrl = `${keys.sipApiUrl}/slot-user-call-stats?days=365`;
      const slotStatsResponse = await axios.get(slotStatsUrl);

      // Get user_ids from slot-user-call-stats API
      const usersInSlotStats = slotStatsResponse.data.data?.map(item => item.user_id) || [];
      console.log('Users in slot-user-call-stats:', usersInSlotStats);

      // Step 5: Filter only users that exist in BOTH APIs
      let finalUserIds = agencyFilteredUserIds.filter(userId =>
        usersInSlotStats.includes(userId)
      );

      console.log(`Final users before limit (exist in both APIs):`, finalUserIds);

      // Step 6: Apply the limit AFTER filtering (THIS IS THE KEY FIX)
      if (selectedLimit !== 'all') {
        finalUserIds = finalUserIds.slice(0, selectedLimit);
        console.log(`Limited to top ${selectedLimit} users:`, finalUserIds);
      }

      if (finalUserIds.length === 0) {
        setNoDataFound(true);
        setData(null);
        setInitialLoading(false);
        setIsRefreshing(false);
        return;
      }

      // Step 7: Make final API call with ONLY the filtered user_ids
      const userParams = finalUserIds.map(id => `user_ids=${id}`).join('&');
      const filteredUrl = `${keys.sipApiUrl}/leaderboard/call-hours?period=${selectedPeriod}&top=${finalUserIds.length}&recent_limit=5&${userParams}`;
      console.log('Fetching filtered URL:', filteredUrl);

      const filteredResponse = await axios.get(filteredUrl);

      // Re-rank the filtered results (important for top 10/20 display)
      if (filteredResponse.data.leaderboard) {
        filteredResponse.data.leaderboard = filteredResponse.data.leaderboard.map((agent, index) => ({
          ...agent,
          rank: index + 1
        }));
      }

      setData(filteredResponse.data);

      if (!filteredResponse.data?.leaderboard || filteredResponse.data.leaderboard.length === 0) {
        setNoDataFound(true);
      }
    } else {
      // No agency selected, show all data with original limit
      const response = await axios.get(initialUrl);
      setData(response.data);

      if (!response.data?.leaderboard || response.data.leaderboard.length === 0) {
        setNoDataFound(true);
      }
    }
  } catch (error) {
    console.error('Error fetching leaderboard data:', error);
    setNoDataFound(true);
    toast({
      title: 'Error',
      description: 'Failed to load leaderboard data',
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
  } finally {
    setInitialLoading(false);
    setIsRefreshing(false);
  }
}, [period, limit, selectedAgencyId, users, toast]);


  const handlePeriodChange = useCallback((newPeriod) => {
    setPeriod(newPeriod);
    setNoDataFound(false);
  }, []);

  const handleLimitChange = useCallback((e) => {
    const newLimit = e.target.value === 'all' ? 'all' : Number(e.target.value);
    setLimit(newLimit);
    setNoDataFound(false);
  }, []);

  const handleAgencyChange = useCallback((e) => {
    setSelectedAgencyId(e.target.value);
    setNoDataFound(false);
  }, []);

  const handleRefresh = useCallback(() => {
    fetchLeaderboardData(period, limit, selectedAgencyId, true);
  }, [fetchLeaderboardData, period, limit, selectedAgencyId]);

  // Enrich leaderboard data with user details from Redux
  useEffect(() => {
    if (data?.leaderboard && users && users.length > 0 && !noDataFound) {
      const enriched = data.leaderboard.map(agent => {
        const matchedUser = users.find(user => String(user._id) === String(agent.user_id));

        return {
          ...agent,
          fullName: matchedUser?.fullName || matchedUser?.name || agent.slot_number,
          email: matchedUser?.email || '',
          profileImage: matchedUser?.profileImage || matchedUser?.avatar || null,
          role: matchedUser?.role || 'Agent',
          agency: matchedUser?.agency?.name
        };
      });
      setEnrichedLeaderboard(enriched);
    } else if (data?.leaderboard && (!users || users.length === 0) && !noDataFound) {
      const fallbackData = data.leaderboard.map(agent => ({
        ...agent,
        fullName: agent.slot_number,
        email: '',
        profileImage: null,
        role: 'Agent',
      }));
      setEnrichedLeaderboard(fallbackData);
    } else if (noDataFound) {
      setEnrichedLeaderboard([]);
    }
  }, [data, users, noDataFound]);

  // Enrich recent calls with user details from Redux
  useEffect(() => {
    if (data?.recent_calls && users && users.length > 0 && !noDataFound) {
      const enriched = data.recent_calls.map(call => {
        const matchedUser = users.find(user => String(user._id) === String(call.user_id));

        return {
          ...call,
          agentName: matchedUser?.fullName || matchedUser?.name || call.call_from,
          agentEmail: matchedUser?.email || '',
          agentProfileImage: matchedUser?.profileImage || matchedUser?.avatar || null,
          agentRole: matchedUser?.role || 'Agent',
        };
      });
      setEnrichedRecentCalls(enriched);
    } else if (data?.recent_calls && (!users || users.length === 0) && !noDataFound) {
      const fallbackData = data.recent_calls.map(call => ({
        ...call,
        agentName: call.call_from,
        agentEmail: '',
        agentProfileImage: null,
        agentRole: 'Agent',
      }));
      setEnrichedRecentCalls(fallbackData);
    } else if (noDataFound) {
      setEnrichedRecentCalls([]);
    }
  }, [data, users, noDataFound]);

  useEffect(() => {
    fetchLeaderboardData();
  }, [period, limit, selectedAgencyId, fetchLeaderboardData]);

  const formatDate = useCallback((dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString();
  }, []);

  const getCallStatusColor = useCallback((disposition) => {
    return disposition === 'ANSWERED' ? 'green' : 'red';
  }, []);

  const getUserInitials = useCallback((name) => {
    return name?.charAt(0)?.toUpperCase() || '?';
  }, []);

  const kpis = [
    {
      title: "Total Call Hours",
      value: data?.summary?.total_call_hours?.toFixed(1) + 'h' || '0h',
      sub: `Period: ${data?.start_date?.split(' ')[0]} to ${data?.end_date?.split(' ')[0]}`
    },
    {
      title: "Answered Calls",
      value: data?.summary?.answered_calls || 0,
      sub: `Answer Rate: ${((data?.summary?.answered_calls / (data?.summary?.answered_calls + data?.summary?.missed_calls)) * 100).toFixed(1)}%`
    },
    {
      title: "Missed Calls",
      value: data?.summary?.missed_calls || 0,
      sub: `Avg Duration: ${data?.summary?.avg_duration_minutes?.toFixed(1)} min`
    },
    {
      title: "Agents",
      value: data?.leaderboard?.length || 0,
      sub: `${data?.leaderboard?.filter(a => a.answer_rate > 30).length || 0} with >30% answer rate`
    },
  ];

  const baseURL = constant.baseUrl;

  return (
    <Box minH="100vh" bg={colors.bgDeep}>
      <Box>
        <VStack spacing={6} align="stretch">
          {/* Header Card */}
          <Box borderRadius="xl" bg={colors.bg} p={6} boxShadow={colors.cardShadow} border="1px solid" borderColor={colors.borderColor}>
            <Flex
              direction={{ base: "column", md: "row" }}
              gap={4}
              alignItems={{ md: "center" }}
              justifyContent="space-between"
            >
              <Box>
                <Heading size="lg" mt={1} letterSpacing="tight" color={colors.headingText}>
                  Leaderboard & Agent Performance
                </Heading>
                <Text fontSize="sm" color={colors.bodyText} mt={2}>
                  Track {period} call-hour leaders, agent productivity, and queue performance.
                  {selectedAgencyId && ` - Filtered by ${agencies.find(a => a._id === selectedAgencyId)?.name || 'Agency'}`}
                </Text>
              </Box>
              <HStack gap={3} flexWrap="wrap">
                {/* Mobile Period Buttons */}
                <ButtonGroup
                  isAttached
                  variant="outline"
                  size="xs"
                  display={{ base: "flex", md: "none" }}
                >
                  <Button
                    onClick={() => handlePeriodChange('daily')}
                    variant={period === 'daily' ? 'brand' : 'outline'}
                    borderRadius="2xl"
                    borderRightRadius="0"
                  >
                    Daily
                  </Button>
                  <Button
                    onClick={() => handlePeriodChange('weekly')}
                    variant={period === 'weekly' ? 'brand' : 'outline'}
                    borderRadius="0"
                  >
                    Weekly
                  </Button>
                  <Button
                    onClick={() => handlePeriodChange('monthly')}
                    variant={period === 'monthly' ? 'brand' : 'outline'}
                    borderRadius="2xl"
                    borderLeftRadius="0"
                  >
                    Monthly
                  </Button>
                </ButtonGroup>

                {/* Desktop Period Buttons */}
                <ButtonGroup
                  isAttached
                  variant="outline"
                  size="md"
                  display={{ base: "none", md: "flex" }}
                >
                  <Button
                    onClick={() => handlePeriodChange('daily')}
                    variant={period === 'daily' ? 'brand' : 'outline'}
                    borderRadius="2xl"
                    borderRightRadius="0"
                  >
                    Daily
                  </Button>
                  <Button
                    onClick={() => handlePeriodChange('weekly')}
                    variant={period === 'weekly' ? 'brand' : 'outline'}
                    borderRadius="0"
                  >
                    Weekly
                  </Button>
                  <Button
                    onClick={() => handlePeriodChange('monthly')}
                    variant={period === 'monthly' ? 'brand' : 'outline'}
                    borderRadius="2xl"
                    borderLeftRadius="0"
                  >
                    Monthly
                  </Button>
                </ButtonGroup>

                {/* Refresh Button - Ghost variant */}
              	<RefreshButton
										label="Refresh"
										onClick={handleRefresh}
										isLoading={isRefreshing}
										isFetching={isRefreshing}
										size="sm"
									/>
              </HStack>
            </Flex>
          </Box>

          {/* KPI Cards */}
          <Box position="relative">
            {isRefreshing && (
              <Box
                position="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                zIndex={2}
                bg={colors.bg}
                p={3}
                borderRadius="full"
                boxShadow={colors.cardShadow}
              >
                <Spinner size="sm" color={colors.accentGold} thickness="3px" />
              </Box>
            )}
            <SimpleGrid
              columns={{ base: 1, md: 2, xl: 4 }}
              spacing={4}
              opacity={isRefreshing ? 0.7 : 1}
              transition="opacity 0.2s ease-in-out"
            >
              {!noDataFound && kpis.map((item) => (
                <Box key={item.title} borderRadius="xl" bg={colors.bg} p={5} boxShadow={colors.cardShadow} border="1px solid" borderColor={colors.borderColor}>
                  <Text fontSize="sm" fontWeight="medium" color={colors.labelColor}>
                    {item.title}
                  </Text>
                  <Box fontSize="3xl" fontWeight="bold" color={colors.headingText} mt={3}>
                    {item.value}
                  </Box>
                  <Text fontSize="sm" color={colors.mutedText} mt={2}>
                    {item.sub}
                  </Text>
                </Box>
              ))}
              {noDataFound && (
                <Box gridColumn="span 4" borderRadius="xl" bg={colors.bg} p={8} textAlign="center" border="1px solid" borderColor={colors.borderColor}>
                  <Text color={colors.bodyText}>No data available for selected agency</Text>
                </Box>
              )}
            </SimpleGrid>
          </Box>

          {/* Leaderboard & Recent Calls Grid */}
          <Grid width="100%" templateColumns={{ xl: "2fr 1fr" }} gap={6}>
            {/* Leaderboard Table */}
            <Box minW={0} borderRadius="xl" bg={colors.bg} p={6} boxShadow={colors.cardShadow} border="1px solid" borderColor={colors.borderColor}>
              <Flex alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={4} mb={5}>
                <Box>
                  <Heading as="h2" size="md" color={colors.headingText}>
                    Top Agents by Call Hours
                  </Heading>
                  <Text fontSize="sm" color={colors.mutedText} mt={1}>
                    {period === 'weekly' ? 'Weekly' : period === 'monthly' ? 'Monthly' : 'Daily'} ranking based on total talk time
                  </Text>
                </Box>
                <Flex gap={3} alignItems="center" flexWrap="wrap">
                  <Select
                    value={selectedAgencyId}
                    onChange={handleAgencyChange}
                    width="160px"
                    borderRadius="lg"
                    borderColor={colors.borderColor}
                    bg={colors.bgInput}
                    color={colors.headingText}
                    size="md"
                    placeholder="All Agencies"
                    _hover={{ borderColor: colors.accentGold }}
                    _focus={{ borderColor: colors.accentGold, boxShadow: `0 0 0 1px ${colors.accentGold}` }}
                  >
                    {agencies.map((agency) => (
                      <option key={agency._id} value={agency._id} style={{ background: colors.bg, color: colors.headingText }}>
                        {agency.name}
                      </option>
                    ))}
                  </Select>
                  <Select
                    value={limit}
                    onChange={handleLimitChange}
                    width="140px"
                    borderRadius="lg"
                    borderColor={colors.borderColor}
                    bg={colors.bgInput}
                    color={colors.headingText}
                    size="md"
                    _hover={{ borderColor: colors.accentGold }}
                    _focus={{ borderColor: colors.accentGold, boxShadow: `0 0 0 1px ${colors.accentGold}` }}
                  >
                    <option value={10} style={{ background: colors.bg, color: colors.headingText }}>Top 10</option>
                    <option value={20} style={{ background: colors.bg, color: colors.headingText }}>Top 20</option>
                    <option value="all" style={{ background: colors.bg, color: colors.headingText }}>All</option>
                  </Select>
                </Flex>
              </Flex>

              <Box
                    maxHeight="70vh"
      minH="70vh"
                overflowX="auto"
                overflowY="auto"
                borderRadius="lg"
                width="100%"
                maxW="100%"
                borderWidth="1px"
                borderColor={colors.borderColor}
                opacity={isRefreshing ? 0.6 : 1}
                transition="opacity 0.2s ease-in-out"
                sx={{
                  '&::-webkit-scrollbar': {
                    width: '8px',
                    height: '8px',
                  },
                  '&::-webkit-scrollbar-track': {
                    background: colors.bgInput,
                    borderRadius: '10px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: colors.accentGold,
                    borderRadius: '10px',
                  },
                  '&::-webkit-scrollbar-thumb:hover': {
                    background: colors.goldDark,
                  },
                }}
              >
                {!noDataFound && enrichedLeaderboard.length > 0 && (
                  <Table variant="unstyled" size="sm">
                    <Thead bg={colors.bgDeep} position="sticky" top={0} zIndex={1}>
                      <Tr>
                        <Th px={4} py={3} fontWeight="medium" color={colors.labelColor} borderColor={colors.borderColor}>Rank</Th>
                        <Th px={4} py={3} fontWeight="medium" color={colors.labelColor} borderColor={colors.borderColor}>Agent</Th>
                        <Th px={4} py={3} fontWeight="medium" color={colors.labelColor} borderColor={colors.borderColor}>Agency</Th>
                        <Th px={4} py={3} fontWeight="medium" color={colors.labelColor} borderColor={colors.borderColor}>Slot</Th>
                        <Th px={4} py={3} fontWeight="medium" color={colors.labelColor} borderColor={colors.borderColor}>Total Calls</Th>
                        <Th px={4} py={3} fontWeight="medium" color={colors.labelColor} borderColor={colors.borderColor}>Answered</Th>
                        <Th px={4} py={3} fontWeight="medium" color={colors.labelColor} borderColor={colors.borderColor}>Missed</Th>
                        <Th px={4} py={3} fontWeight="medium" color={colors.labelColor} borderColor={colors.borderColor}>Call Hours</Th>
                        <Th px={4} py={3} fontWeight="medium" color={colors.labelColor} borderColor={colors.borderColor}>Answer Rate</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {enrichedLeaderboard.map((agent) => (
                        <Tr
                          key={agent.rank}
                          borderTopWidth="1px"
                          borderColor={colors.borderColor}
                          _hover={{ bg: colors.bgDeep }}
                          transition="background 0.2s"
                        >
                          <Td px={4} py={4} fontWeight="semibold" color={colors.accentGold} borderColor={colors.borderColor}>#{agent.rank}</Td>
                          <Td px={4} py={4} borderColor={colors.borderColor}>
                            <Flex align="center" gap={3}>
                              <Avatar
                                size="sm"
                                name={agent.fullName}
                                src={baseURL + agent.profileImage}
                                bg={colors.bgInput}
                                color={colors.headingText}
                              />
                              <Box>
                                <Text fontWeight="medium" color={colors.headingText}>
                                  {agent.fullName}
                                </Text>
                                <Text fontSize="xs" color={colors.mutedText}>
                                  {agent.role}
                                </Text>
                              </Box>
                            </Flex>
                          </Td>
                          <Td px={4} py={4} color={colors.bodyText} borderColor={colors.borderColor}>{agent.agency || '-'}</Td>
                          <Td px={4} py={4} color={colors.bodyText} borderColor={colors.borderColor}>{agent.slot_number}</Td>
                          <Td px={4} py={4} color={colors.bodyText} borderColor={colors.borderColor}>{agent.total_calls}</Td>
                          <Td px={4} py={4} color="green.400" borderColor={colors.borderColor}>{agent.answered_calls}</Td>
                          <Td px={4} py={4} color="red.400" borderColor={colors.borderColor}>{agent.missed_calls}</Td>
                          <Td px={4} py={4} fontWeight="semibold" color={colors.headingText} borderColor={colors.borderColor}>{agent.total_hours.toFixed(2)}h</Td>
                          <Td px={4} py={4} borderColor={colors.borderColor}>
                            <Badge
                              colorScheme={agent.answer_rate > 30 ? 'green' : 'orange'}
                              borderRadius="full"
                              px={2}
                            >
                              {agent.answer_rate.toFixed(1)}%
                            </Badge>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                )}
                {(!enrichedLeaderboard || enrichedLeaderboard.length === 0) && !noDataFound && !initialLoading && (
                  <Center py={8}>
                    <Text color={colors.bodyText}>No agents found</Text>
                  </Center>
                )}
                {noDataFound && (
                  <Center py={8}>
                    <Text color={colors.bodyText}>No agents found for selected agency</Text>
                  </Center>
                )}
              </Box>
            </Box>

            {/* Recent Calls Section */}
            <Box minW={0} borderRadius="xl" bg={colors.bg} p={6} boxShadow={colors.cardShadow} border="1px solid" borderColor={colors.borderColor}>
              <Box>
                <Heading as="h2" size="md" color={colors.headingText}>
                  Recent Calls
                </Heading>
                <Text fontSize="sm" color={colors.mutedText} mt={1}>
                  Latest call activity
                </Text>
              </Box>
              <VStack
                spacing={3}
                mt={4}
                align="stretch"
                      maxHeight="70vh"
      minH="70vh"
                overflowY="auto"
                opacity={isRefreshing ? 0.6 : 1}
                transition="opacity 0.2s ease-in-out"
                sx={{
                  '&::-webkit-scrollbar': {
                    width: '6px',
                  },
                  '&::-webkit-scrollbar-track': {
                    background: colors.bgInput,
                    borderRadius: '10px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: colors.accentGold,
                    borderRadius: '10px',
                  },
                }}
              >
                {enrichedRecentCalls.map((call) => {
                  return (
                    <Box
                      key={call.uniqueid}
                      borderRadius="lg"
                      borderWidth="1px"
                      borderColor={colors.borderColor}
                      p={4}
                      bg={colors.bg}
                      _hover={{ bg: colors.bgDeep }}
                      transition="background 0.2s"
                    >
                      <Flex alignItems="center" justifyContent="space-between" mb={2}>
                        <Flex align="center" gap={3}>
                          <Avatar
                            size="sm"
                            name={call.agentName}
                            src={call.agentProfileImage ? baseURL + call.agentProfileImage : null}
                            bg={colors.bgInput}
                            color={colors.headingText}
                          />
                          <Box>
                            <Text fontWeight="semibold" color={colors.headingText} fontSize="md">
                              {call.agentName}
                            </Text>
                            <Text fontSize="xs" color={colors.mutedText}>
                              Slot: {call.call_from} • {call.agentRole}
                            </Text>
                          </Box>
                        </Flex>
                        <Badge
                          borderRadius="full"
                          px={3}
                          py={1}
                          fontSize="xs"
                          fontWeight="medium"
                          colorScheme={getCallStatusColor(call.disposition)}
                        >
                          {call.disposition}
                        </Badge>
                      </Flex>

                      <Flex justifyContent="space-between" mt={2} pl={1}>
                        <Text fontSize="xs" color={colors.mutedText}>
                          Duration: {call.duration}s
                        </Text>
                        <Text fontSize="xs" color={colors.mutedText}>
                          {formatDate(call.calldate)}
                        </Text>
                      </Flex>

                      {call.billsec > 0 && (
                        <Text fontSize="xs" color="green.400" mt={1} pl={1}>
                          Talk time: {call.billsec}s
                        </Text>
                      )}
                    </Box>
                  );
                })}
                {(!enrichedRecentCalls || enrichedRecentCalls.length === 0) && !initialLoading && (
                  <Center py={8}>
                    <Text color={colors.bodyText}>No recent calls found</Text>
                  </Center>
                )}
              </VStack>
            </Box>
          </Grid>
        </VStack>
      </Box>
    </Box>
  );
}