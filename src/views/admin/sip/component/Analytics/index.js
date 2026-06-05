import React, { useEffect, useState } from 'react';
import {
	Box,
	Heading,
	SimpleGrid,
	Skeleton,
	IconButton,
	useDisclosure,
	Select,
	Flex,
} from '@chakra-ui/react';
import { useFetchItemsQuery } from 'api/apiSlice';
import axios from 'axios';
import keys from 'config/keys';
import AnalyticsCard from './components/AnalyticsCard';
import NoData from 'views/admin/lead-v2/components/subComponents/NoData';
import { useSelector } from 'react-redux';
import CountUpComponent from 'components/countUpComponent/countUpComponent';
import { useModalColors } from 'hooks/useModalColors';
import RefreshButton from 'components/refresh/RefreshButton';

const Analytics = () => {
	const colors = useModalColors();
	const now = new Date();
	const currentMonth = now.getMonth() + 1;
	const currentYear = now.getFullYear();

	const { data, isLoading } = useFetchItemsQuery(
		{ path: 'sipSetting' },
		{ refetchOnMountOrArgChange: true },
	);
	const [selectedUserId, setSelectedUserId] = useState(null);
	const [selectedUserName, setSelectedUserName] = useState(null);
	const {
		isOpen: isModalOpen,
		onOpen: onModalOpen,
		onClose: onModalClose,
	} = useDisclosure();

	// Add handler for viewing details
	const handleViewDetails = (userId, userName) => {
		setSelectedUserId(userId);
		setSelectedUserName(userName);
		onModalOpen();
	};
	const [analyticsData, setAnalyticsData] = useState(null);
	const [loadingAnalytics, setLoadingAnalytics] = useState(false);

	// Get users from Redux - fixed to match your state structure
	const users = useSelector((state) => state.user.users);
	const usersLoading = useSelector((state) => state.user.loading);

	console.log('Users from Redux:', users);

	const [month, setMonth] = useState(currentMonth);
	const [year, setYear] = useState(currentYear);
	const [graphData, setGraphData] = useState(null);
	const [loadingGraph, setLoadingGraph] = useState(false);
	const [totalItems, setTotalItems] = useState(0);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [selectedChart, setSelectedChart] = useState(null);
	const [view, setView] = useState(() => {
		const savedView = localStorage.getItem('analyticsView');
		return savedView || 'card';
	});

	const [days, setDays] = useState(365);

	// Merge analytics data with user information from Redux
	const fetchAnalytics = async (selectedDays = days) => {
		try {
			setLoadingAnalytics(true);
			const url = `${keys.sipApiUrl}/slot-user-call-stats?days=${selectedDays}`;
			const res = await axios.get(url);
			setTotalItems(res?.data?.total_users);
			// Merge user data from Redux with analytics data
			const mergedData =
				res.data.data?.map((item) => {
					// Find user from Redux users array by matching user_id
					const matchedUser = users?.find(
						(user) => String(user._id) === String(item.user_id),
					);

					return {
						...item,
						fullName:
							matchedUser?.fullName || matchedUser?.name || `Unknown User`,
						email: matchedUser?.email || '',
						sipId: matchedUser?.sipId || '-',
					};
				}) || [];

			setAnalyticsData({
				...res.data,
				data: mergedData,
			});
		} catch (err) {
			console.error('Error fetching analytics:', err);
		} finally {
			setLoadingAnalytics(false);
		}
	};

	// Fetch analytics when users are loaded or days change
	useEffect(() => {
		if (users && users.length > 0) {
			fetchAnalytics(days);
		}
	}, [users, days]);

	const fetchGraphAnalytics = async (m = month, y = year) => {
		if (!data?.sipSettings?.length) return;

		const extensionsParams = data.sipSettings
			.map((item) => `extensions=${item.extensionId}`)
			.join('&');

		const url = `${keys.sipApiUrl}/user-analytics?year=${y}&month=${m}&${extensionsParams}`;

		try {
			setLoadingGraph(true);
			const res = await axios.get(url);

			// Map extension IDs to names using Redux users
			const mappedCharts = {};
			for (const [key, chart] of Object.entries(res.data.charts || {})) {
				if (Array.isArray(chart)) {
					mappedCharts[key] = chart.map((entry) => {
						if (entry.extension) {
							// Find user from Redux by extension
							const matchedUser = users?.find(
								(user) => String(user.extensionId) === String(entry.extension),
							);
							return {
								...entry,
								fullName:
									matchedUser?.fullName ||
									matchedUser?.name ||
									`Ext ${entry.extension}`,
								email: matchedUser?.email || '',
							};
						}
						return entry;
					});
				} else {
					mappedCharts[key] = chart;
				}
			}

			setGraphData({
				...res.data,
				charts: mappedCharts,
			});
		} catch (err) {
			console.error('Error fetching graph analytics:', err);
		} finally {
			setLoadingGraph(false);
		}
	};

	useEffect(() => {
		if (data?.sipSettings?.length && users?.length) {
			if (view === 'card') {
				fetchAnalytics(days);
			} else {
				fetchGraphAnalytics();
			}
		}
	}, [data, view, users]);

	const onFilterChange = (value) => {
		setMonth(Number(value.month));
		setYear(Number(value.year));
		fetchAnalytics(value.month, value.year);
		fetchGraphAnalytics(value.month, value.year);
	};

	return (
		<Box p={6} bg={colors.bg} mt={'-16px'} borderRadius="lg" boxShadow={colors.cardShadow} border="1px solid" borderColor={colors.borderColor}>
			<Box
				display='flex'
				justifyContent='space-between'
				alignItems='center'
				mb={6}
				flexDir={{ base: 'column', sm: 'column', md: 'row' }}
				gap={2}
			>
				<Flex alignItems='center' gap='2' fontWeight='bold'>
					<Heading fontSize={{ base: 'md', sm: 'md', md: 'lg' }} color={colors.headingText}>
						Users Analytics
					</Heading>
					<CountUpComponent key={totalItems} targetNumber={totalItems} />
				</Flex>
				<Box
					display='flex'
					gap={3}
					alignItems={'center'}
					flexDir={{ base: 'column', sm: 'column', md: 'row' }}
				>
					<Select
						value={days}
						onChange={(e) => {
							const newDays = Number(e.target.value);
							setDays(newDays);
						}}
						w='160px'
						bg={colors.bgInput}
						borderColor={colors.borderColor}
						color={colors.headingText}
						borderRadius='lg'
						size='sm'
						_hover={{ borderColor: colors.accentGold, cursor: 'pointer' }}
						_focus={{
							borderColor: colors.accentGold,
							boxShadow: `0 0 0 1px ${colors.accentGold}`,
						}}
					>
						<option value={1} style={{ background: colors.bg, color: colors.headingText }}>Today</option>
						<option value={3} style={{ background: colors.bg, color: colors.headingText }}>3 Days</option>
						<option value={7} style={{ background: colors.bg, color: colors.headingText }}>7 Days</option>
						<option value={30} style={{ background: colors.bg, color: colors.headingText }}>30 Days</option>
						<option value={60} style={{ background: colors.bg, color: colors.headingText }}>60 Days</option>
						<option value={90} style={{ background: colors.bg, color: colors.headingText }}>90 Days</option>
						<option value={180} style={{ background: colors.bg, color: colors.headingText }}>6 Months</option>
						<option value={365} style={{ background: colors.bg, color: colors.headingText }}>12 Months</option>
					</Select>

					{/* Refresh Button - Ghost variant */}
						<RefreshButton
											  label="Refresh"
											onClick={() => {
							fetchAnalytics(days);
							fetchGraphAnalytics();
						}}
											  isLoading={isLoading}
											  isFetching={isLoading}
											  size="sm"
											/>

				</Box>
			</Box>

			<SimpleGrid
				spacing={6}
				sx={{
					gridTemplateColumns: {
						base: 'repeat(auto-fit, minmax(250px, 1fr))',
						md: 'repeat(auto-fit, minmax(300px, 1fr))',
						lg: 'repeat(auto-fit, minmax(350px, 1fr))',
					},
					alignItems: 'stretch',
				}}
			>
				{loadingAnalytics || isLoading || usersLoading ? (
					Array.from({ length: 30 }).map((_, i) => (
						<Skeleton key={i} height='220px' borderRadius='2xl' startColor={colors.bgInput} endColor={colors.bgDeep} />
					))
				) : analyticsData?.data?.length > 0 ? (
					analyticsData.data.map((item) => (
						<AnalyticsCard
							onViewDetails={handleViewDetails}
							key={item.slot_number || item.user_id}
							item={item}
							month={month}
							year={year}
						/>
					))
				) : (
					<Box w='full' p='4' textAlign='center'>
						<NoData label='user analytics records' />
					</Box>
				)}
			</SimpleGrid>
		</Box>
	);
};

export default Analytics;