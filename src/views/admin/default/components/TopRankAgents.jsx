
import React, { useEffect, useState, useCallback } from 'react';
import {
	Box,
	Heading,
	Text,
	SimpleGrid,
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
	IconButton,
	Center,
	Select,
	Avatar,
	Wrap,
	WrapItem,
	Divider,
} from '@chakra-ui/react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import keys from 'config/keys';
import { constant } from 'constant';
import { useFetchItemsQuery } from 'api/apiSlice';
import { toast } from 'react-toastify';
import RefreshButton from 'components/refresh/RefreshButton';

export default function TopRankAgents() {
	const [initialLoading, setInitialLoading] = useState(true);
	const [data, setData] = useState(null);
	const [period, setPeriod] = useState('monthly');
	const [limit, setLimit] = useState('all');
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [selectedAgencyId, setSelectedAgencyId] = useState('');
	const [noDataFound, setNoDataFound] = useState(false);

	const { data: agenciesData } = useFetchItemsQuery({ path: '/agencies' });
	const agencies = agenciesData?.doc || [];
	const users = useSelector((state) => state.user.users);
	const [enrichedLeaderboard, setEnrichedLeaderboard] = useState([]);
	const [enrichedRecentCalls, setEnrichedRecentCalls] = useState([]);

	const fetchLeaderboardData = useCallback(
		async (
			selectedPeriod = period,
			selectedLimit = limit,
			agencyId = selectedAgencyId,
			isRefresh = false,
		) => {
			try {
				if (isRefresh) setIsRefreshing(true);
				else setInitialLoading(true);

				setNoDataFound(false);

				let fetchLimit = agencyId
					? 100
					: selectedLimit === 'all'
						? 100
						: selectedLimit;
				let url = `${keys.sipApiUrl}/leaderboard/call-hours?period=${selectedPeriod}&top=${fetchLimit}&recent_limit=5`;

				if (agencyId) {
					const [leaderboardResponse, slotStatsResponse] = await Promise.all([
						axios.get(url),
						axios.get(`${keys.sipApiUrl}/slot-user-call-stats?days=365`),
					]);

					const usersWithCallData = leaderboardResponse.data.leaderboard.map(
						(agent) => agent.user_id,
					);
					const usersInSlotStats =
						slotStatsResponse.data.data?.map((item) => item.user_id) || [];

					const agencyFilteredUserIds = usersWithCallData.filter((userId) => {
						const matchedUser = users.find(
							(user) => String(user._id) === String(userId),
						);
						return (
							matchedUser?.agency?._id === agencyId &&
							usersInSlotStats.includes(userId)
						);
					});

					if (agencyFilteredUserIds.length === 0) {
						setNoDataFound(true);
						setData(null);
						setInitialLoading(false);
						setIsRefreshing(false);
						return;
					}

					const limitedUserIds =
						selectedLimit === 'all'
							? agencyFilteredUserIds
							: agencyFilteredUserIds.slice(0, selectedLimit);

					if (limitedUserIds.length === 0) {
						setNoDataFound(true);
						setData(null);
						setInitialLoading(false);
						setIsRefreshing(false);
						return;
					}

					const userParams = limitedUserIds
						.map((id) => `user_ids=${id}`)
						.join('&');
					const filteredUrl = `${keys.sipApiUrl}/leaderboard/call-hours?period=${selectedPeriod}&top=${limitedUserIds.length}&recent_limit=5&${userParams}`;
					const filteredResponse = await axios.get(filteredUrl);

					if (filteredResponse.data.leaderboard) {
						filteredResponse.data.leaderboard =
							filteredResponse.data.leaderboard.map((agent, index) => ({
								...agent,
								rank: index + 1,
							}));
					}

					setData(filteredResponse.data);
				} else {
					const response = await axios.get(url);
					setData(response.data);
				}
			} catch (error) {
				console.error('Error fetching leaderboard data:', error);
				setNoDataFound(true);
				toast.error('Failed to load leaderboard data');
			} finally {
				setInitialLoading(false);
				setIsRefreshing(false);
			}
		},
		[period, limit, selectedAgencyId, users],
	);

	const handlePeriodChange = (e) => {
		setPeriod(e.target.value);
		setNoDataFound(false);
	};

	const handleLimitChange = (e) => {
		setLimit(e.target.value === 'all' ? 'all' : Number(e.target.value));
		setNoDataFound(false);
	};

	const handleAgencyChange = (e) => {
		setSelectedAgencyId(e.target.value);
		setNoDataFound(false);
	};

	const handleRefresh = () =>
		fetchLeaderboardData(period, limit, selectedAgencyId, true);

	useEffect(() => {
		if (data?.leaderboard && users?.length && !noDataFound) {
			const enriched = data.leaderboard.map((agent) => {
				const matchedUser = users.find(
					(user) => String(user._id) === String(agent.user_id),
				);
				return {
					...agent,
					fullName: matchedUser?.fullName || agent.slot_number,
					profileImage: matchedUser?.profileImage || null,
					role: matchedUser?.role || 'Agent',
					agency: matchedUser?.agency?.name,
				};
			});
			setEnrichedLeaderboard(enriched);
		} else if (data?.leaderboard && !noDataFound) {
			setEnrichedLeaderboard(
				data.leaderboard.map((agent) => ({
					...agent,
					fullName: agent.slot_number,
					role: 'Agent',
				})),
			);
		} else if (noDataFound) {
			setEnrichedLeaderboard([]);
			setEnrichedRecentCalls([]);
		}
	}, [data, users, noDataFound]);

	useEffect(() => {
		if (data?.recent_calls && users?.length && !noDataFound) {
			const enriched = data.recent_calls.map((call) => {
				const matchedUser = users.find(
					(user) => String(user._id) === String(call.user_id),
				);
				return {
					...call,
					agentName: matchedUser?.fullName || call.call_from,
					agentProfileImage: matchedUser?.profileImage || null,
					agentRole: matchedUser?.role || 'Agent',
				};
			});
			setEnrichedRecentCalls(enriched);
		} else if (data?.recent_calls && !noDataFound) {
			setEnrichedRecentCalls(
				data.recent_calls.map((call) => ({
					...call,
					agentName: call.call_from,
					agentRole: 'Agent',
				})),
			);
		} else if (noDataFound) {
			setEnrichedRecentCalls([]);
		}
	}, [data, users, noDataFound]);

	useEffect(() => {
		fetchLeaderboardData();
	}, [period, limit, selectedAgencyId, fetchLeaderboardData]);

	const formatDate = (dateString) =>
		dateString ? new Date(dateString).toLocaleString() : '';
	const getCallStatusColor = (disposition) =>
		disposition === 'ANSWERED' ? 'green.400' : 'red.400';
	const getUserInitials = (name) => name?.charAt(0)?.toUpperCase() || '?';

	const getSelectedAgencyName = () => {
		if (!selectedAgencyId) return 'All Agencies';
		const agency = agencies.find((a) => a._id === selectedAgencyId);
		return agency?.name || 'Selected Agency';
	};

	const kpis = [
		{
			title: 'Total Call Hours',
			value: data
				? data?.summary?.total_call_hours?.toFixed(1) + 'h' || '0h'
				: '0h',
			sub: `Period: ${data?.start_date?.split(' ')[0]} to ${data?.end_date?.split(' ')[0]}`,
		},
		{
			title: 'Answered Calls',
			value: data?.summary?.answered_calls || 0,
			sub: `Answer Rate: ${((data?.summary?.answered_calls / (data?.summary?.answered_calls + data?.summary?.missed_calls)) * 100).toFixed(1)}%`,
		},
		{
			title: 'Missed Calls',
			value: data?.summary?.missed_calls || 0,
			sub: `Avg Duration: ${data?.summary?.avg_duration_minutes?.toFixed(1)} min`,
		},
		{
			title: 'Agents',
			value: data?.leaderboard?.length || 0,
			sub: `${data?.leaderboard?.filter((a) => a.answer_rate > 30).length || 0} with >30% answer rate`,
		},
	];

	const baseURL = constant.baseUrl;

	return (
		<Box bg='bg.app' p={{ base: 2, sm: 3, md: 4 }}>
			<VStack align='stretch' spacing={4}>
				{/* KPIs Section */}
				<SimpleGrid
					columns={{ base: 1, sm: 2, lg: 4 }}
					spacing={{ base: 3, sm: 4 }}
				>
					{kpis.map((kpi, index) => (
						<Box
							key={index}
							bg='bg.surface'
							p={{ base: 3, sm: 4 }}
							borderRadius='lg'
							borderWidth='1px'
							borderColor='border.default'
						>
							<Text
								fontSize={{ base: 'xs', sm: 'sm' }}
								color='text.muted'
								mb={1}
							>
								{kpi.title}
							</Text>
							<Text
								fontSize={{ base: 'xl', sm: '2xl', md: '3xl' }}
								fontWeight='bold'
								color='text.heading'
							>
								{kpi.value}
							</Text>
							<Text
								fontSize={{ base: '10px', sm: 'xs' }}
								color='text.muted'
								mt={1}
							>
								{kpi.sub}
							</Text>
						</Box>
					))}
				</SimpleGrid>

				{/* Main Table Box */}
				<Box
					bg='bg.surface'
					borderRadius='xl'
					p={{ base: 3, md: 6 }}
					borderWidth='1px'
					borderColor='border.default'
				>
					{/* Header Section - Responsive */}
					<Flex
						direction={{ base: 'column', md: 'row' }}
						align={{ base: 'flex-start', md: 'center' }}
						justify='space-between'
						gap={4}
						mb={5}
					>
						<Box>
							<Heading
								as='h2'
								size={{ base: 'sm', md: 'md' }}
								color='text.heading'
							>
								Top Agents by Call Hours
							</Heading>
							<Text fontSize='xs' color='text.muted' mt={1}>
								{period === 'weekly'
									? 'Weekly'
									: period === 'monthly'
										? 'Monthly'
										: 'Daily'}{' '}
								ranking based on total talk time
								{selectedAgencyId && ` - ${getSelectedAgencyName()}`}
							</Text>
						</Box>

						{/* Filters - Responsive Wrap */}
						<Wrap
							spacing={2}
							justify='flex-start'
							align='center'
							w={{ base: '100%', md: 'auto' }}
						>
							<WrapItem>
								<Select
									value={selectedAgencyId}
									onChange={handleAgencyChange}
									w='140px'
									size='sm'
									borderRadius='lg'
									bg='bg.input'
									color='text.heading'
									borderColor='border.default'
									_hover={{ borderColor: 'gold.dark' }}
									_focus={{
										borderColor: 'gold.primary',
										boxShadow: `0 0 0 1px #D4AF37`,
									}}
								>
									<option
										style={{ background: '#10273A', color: '#FFFFFF' }}
										value=''
									>
										All Agencies
									</option>
									{agencies.map((agency) => (
										<option
											style={{ background: '#10273A', color: '#FFFFFF' }}
											key={agency._id}
											value={agency._id}
										>
											{agency.name}
										</option>
									))}
								</Select>
							</WrapItem>

							<WrapItem>
								<Select
									value={period}
									onChange={handlePeriodChange}
									width='110px'
									size='sm'
									borderRadius='lg'
									bg='bg.input'
									color='text.heading'
									borderColor='border.default'
									_hover={{ borderColor: 'gold.dark' }}
									_focus={{
										borderColor: 'gold.primary',
										boxShadow: `0 0 0 1px #D4AF37`,
									}}
								>
									<option
										style={{ background: '#10273A', color: '#FFFFFF' }}
										value='daily'
									>
										Daily
									</option>
									<option
										style={{ background: '#10273A', color: '#FFFFFF' }}
										value='weekly'
									>
										Weekly
									</option>
									<option
										style={{ background: '#10273A', color: '#FFFFFF' }}
										value='monthly'
									>
										Monthly
									</option>
								</Select>
							</WrapItem>

							<WrapItem>
								<Select
									value={limit}
									onChange={handleLimitChange}
									width='110px'
									size='sm'
									borderRadius='lg'
									bg='bg.input'
									color='text.heading'
									borderColor='border.default'
									_hover={{ borderColor: 'gold.dark' }}
									_focus={{
										borderColor: 'gold.primary',
										boxShadow: `0 0 0 1px #D4AF37`,
									}}
								>
									<option
										style={{ background: '#10273A', color: '#FFFFFF' }}
										value={10}
									>
										Top 10
									</option>
									<option
										style={{ background: '#10273A', color: '#FFFFFF' }}
										value={20}
									>
										Top 20
									</option>
									<option
										style={{ background: '#10273A', color: '#FFFFFF' }}
										value='all'
									>
										All
									</option>
								</Select>
							</WrapItem>

							<WrapItem>
	<RefreshButton
	label="Refresh data"
	onClick={() => handleRefresh()}
	isLoading={isRefreshing}
	isFetching={isRefreshing}
	size="sm"
	/>

							</WrapItem>
						</Wrap>
					</Flex>

					<Divider borderColor='border.default' mb={4} />

					{/* Table Section - Responsive */}
					<Box
						maxH={{ base: '400px', md: '500px' }}
						overflowX='auto'
						overflowY='auto'
						borderRadius='lg'
						opacity={isRefreshing ? 0.6 : 1}
						transition='opacity 0.2s ease-in-out'
						css={{
							'&::-webkit-scrollbar': { width: '6px', height: '6px' },
							'&::-webkit-scrollbar-track': { background: 'navy.900' },
							'&::-webkit-scrollbar-thumb': {
								background: 'navy.600',
								borderRadius: '3px',
							},
						}}
					>
						{/* Desktop Table View - Hidden on mobile */}
						<Box display={{ base: 'none', lg: 'block' }}>
							<Table variant='simple' size='sm'>
								<Thead position='sticky' top={0} zIndex={1}>
									<Tr>
										<Th color='gold.primary' fontSize='xs'>
											Rank
										</Th>
										<Th color='gold.primary' fontSize='xs'>
											Agent
										</Th>
										<Th color='gold.primary' fontSize='xs'>
											Agency
										</Th>
										<Th color='gold.primary' fontSize='xs'>
											Slot
										</Th>
										<Th color='gold.primary' fontSize='xs'>
											Total Calls
										</Th>
										<Th color='gold.primary' fontSize='xs'>
											Answered
										</Th>
										<Th color='gold.primary' fontSize='xs'>
											Missed
										</Th>
										<Th color='gold.primary' fontSize='xs'>
											Call Hours
										</Th>
										<Th color='gold.primary' fontSize='xs'>
											Answer Rate
										</Th>
									</Tr>
								</Thead>
								<Tbody>
									{enrichedLeaderboard.map((agent) => (
										<Tr key={agent.rank} _hover={{ bg: 'bg.elevated' }}>
											<Td
												fontWeight='semibold'
												fontSize='sm'
												color='text.heading'
											>
												#{agent.rank}
											</Td>
											<Td>
												<Flex align='center' gap={2}>
													<Avatar
														size='xs'
														name={agent.fullName}
														src={baseURL + agent.profileImage}
														bg='navy.600'
													/>
													<Box>
														<Text
															fontSize='sm'
															fontWeight='medium'
															color='text.heading'
														>
															{agent.fullName}
														</Text>
														<Text fontSize='xs' color='text.muted'>
															{agent.role}
														</Text>
													</Box>
												</Flex>
											</Td>
											<Td fontSize='sm' color='text.body'>
												{agent.agency || '-'}
											</Td>
											<Td fontSize='sm' color='text.body'>
												{agent.slot_number}
											</Td>
											<Td fontSize='sm' color='text.body'>
												{agent.total_calls}
											</Td>
											<Td fontSize='sm' color='green.400'>
												{agent.answered_calls}
											</Td>
											<Td fontSize='sm' color='red.400'>
												{agent.missed_calls}
											</Td>
											<Td
												fontSize='sm'
												fontWeight='semibold'
												color='gold.primary'
											>
												{agent.total_hours.toFixed(2)}h
											</Td>
											<Td>
												<Badge
													variant='gold'
													borderRadius='full'
													px={2}
													fontSize='xs'
												>
													{agent.answer_rate.toFixed(1)}%
												</Badge>
											</Td>
										</Tr>
									))}
								</Tbody>
							</Table>
						</Box>

						{/* Mobile Card View - Visible only on mobile */}
						<Box display={{ base: 'block', lg: 'none' }}>
							<VStack spacing={3} align='stretch'>
								{enrichedLeaderboard.map((agent) => (
									<Box
										key={agent.rank}
										bg='bg.elevated'
										borderRadius='lg'
										p={3}
										borderWidth='1px'
										borderColor='border.subtle'
									>
										<Flex justify='space-between' align='start' mb={2}>
											<Flex align='center' gap={2}>
												<Avatar
													size='sm'
													name={agent.fullName}
													src={baseURL + agent.profileImage}
													bg='navy.600'
												/>
												<Box>
													<Text
														fontWeight='bold'
														fontSize='sm'
														color='text.heading'
													>
														{agent.fullName}
													</Text>
													<Text fontSize='xs' color='text.muted'>
														{agent.role}
													</Text>
												</Box>
											</Flex>
											<Badge variant='gold' borderRadius='full' px={2}>
												Rank #{agent.rank}
											</Badge>
										</Flex>

										<SimpleGrid columns={2} spacing={2} mt={2}>
											<Box>
												<Text fontSize='xs' color='text.muted'>
													Agency
												</Text>
												<Text
													fontSize='sm'
													fontWeight='medium'
													color='text.body'
												>
													{agent.agency || '-'}
												</Text>
											</Box>
											<Box>
												<Text fontSize='xs' color='text.muted'>
													Slot
												</Text>
												<Text
													fontSize='sm'
													fontWeight='medium'
													color='text.body'
												>
													{agent.slot_number}
												</Text>
											</Box>
											<Box>
												<Text fontSize='xs' color='text.muted'>
													Total Calls
												</Text>
												<Text fontSize='sm' color='text.body'>
													{agent.total_calls}
												</Text>
											</Box>
											<Box>
												<Text fontSize='xs' color='text.muted'>
													Answered
												</Text>
												<Text fontSize='sm' color='green.400'>
													{agent.answered_calls}
												</Text>
											</Box>
											<Box>
												<Text fontSize='xs' color='text.muted'>
													Missed
												</Text>
												<Text fontSize='sm' color='red.400'>
													{agent.missed_calls}
												</Text>
											</Box>
											<Box>
												<Text fontSize='xs' color='text.muted'>
													Call Hours
												</Text>
												<Text
													fontSize='sm'
													fontWeight='semibold'
													color='gold.primary'
												>
													{agent.total_hours.toFixed(2)}h
												</Text>
											</Box>
											<Box>
												<Text fontSize='xs' color='text.muted'>
													Answer Rate
												</Text>
												<Badge variant='gold' borderRadius='full' px={2}>
													{agent.answer_rate.toFixed(1)}%
												</Badge>
											</Box>
										</SimpleGrid>
									</Box>
								))}
							</VStack>
						</Box>

						{/* No Data State */}
						{!initialLoading && noDataFound && (
							<Center py={12} flexDirection='column'>
								<Box textAlign='center' px={4}>
									<Text
										fontSize={{ base: 'md', md: 'lg' }}
										color='text.muted'
										mb={2}
									>
										No agents found
									</Text>
									<Text
										fontSize={{ base: 'xs', md: 'sm' }}
										color='text.muted'
										opacity={0.7}
									>
										{selectedAgencyId
											? `No agents from ${getSelectedAgencyName()} agency have call data for the selected period`
											: 'No data available for the selected filters'}
									</Text>
								</Box>
							</Center>
						)}
					</Box>
				</Box>
			</VStack>
		</Box>
	);
}
