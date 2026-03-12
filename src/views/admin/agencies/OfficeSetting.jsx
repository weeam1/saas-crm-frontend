import {
	Box,
	Button,
	Flex,
	Input,
	IconButton,
	Text,
	InputGroup,
	InputLeftElement,
	VStack,
	Alert,
	AlertIcon,
	Divider,
} from '@chakra-ui/react';
import { CiEdit } from 'react-icons/ci';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
	useLocation,
	useNavigate,
	useParams,
	useSearchParams,
} from 'react-router-dom';
import OfficeTiming from './components/OfficeTiming';
import AdminTiming from './components/AdminTiming';
import RulesSection from './components/Rules';
import Search from './components/Search';
import Buttons from './components/Buttons';
import UserList from './components/UserList';
import { useFetchItemsQuery } from 'api/apiSlice';
import RoleTabs from '../attendance/components/employees/RoleTabs';
import { useUpdateItemMutation } from 'api/apiSlice';
import { toast } from 'react-toastify';
import moment from 'moment';
import OfficeShimmer from './OfficeShimmer';
import { usePermissions } from 'hooks/usePermissions';
import useUserSession from 'hooks/useUserSession';
import LateDeductionSettings from './components/LateDeductionSettings';
import EarlyDeductionSettings from './components/EarlyDeductionSettings';

const OfficeSettings = ({ userId }) => {
	const searchTermRef = useRef('');
	const [searchClear, setSearchClear] = useState(false);

	const { user, isSuperAdmin } = useUserSession();

	const { hasPermission } = usePermissions();

	const [specialUsers, setSpecialUsers] = useState([]);
	const [selectedUser, setSelectedUser] = useState(null);

	const [specialCheckinTime, setSpecialCheckinTime] = useState('9:00 AM');
	const [specialCheckoutTime, setSpecialCheckoutTime] = useState('6: 00 PM');
	// const [adminTimezone, setAdminTimezone] = useState('Asia/Dubai');
	// const [adminOffDays, setAdminOffDays] = useState([0]);
	const [officeCheckinTime, setOfficeCheckinTime] = useState('');
	const [officeCheckoutTime, setOfficeCheckoutTime] = useState('');
	const [officeTimezone, setOfficeTimezone] = useState('');
	const [officeOffDays, setOfficeOffDays] = useState([0]);
	const [officeGracePeriod, setOfficeGracePeriod] = useState(0);
	const [monthlyLateLimit, setMonthlyLateLimit] = useState(0);
	const [monthlyEarlyCheckoutLimit, setMonthlyEarlyCheckoutLimit] = useState(0);

	// const [isMobile, setIsMobile] = useState(false);

	// useEffect(() => {
	// 	const checkScreenSize = () => {
	// 		setIsMobile(window.screen.width < 1190);
	// 	};

	// 	checkScreenSize();

	// 	window.addEventListener('resize', checkScreenSize);

	// 	return () => window.removeEventListener('resize', checkScreenSize);
	// }, []);

	const [lateDeductionSettings, setLateDeductionSettings] = useState({
		lateDeductionRules: [],
		importantDay: null,
	});
	const [earlyCheckoutDeductionSettings, setEarlyCheckoutDeductionSettings] =
		useState({
			earlyCheckoutDeductionRules: [],
		});

	const [rules, setRules] = useState([
		{
			ruleId: 1,
			label: 'Early Check In',
			action: 'Plus',
			coins: 0,
			perMin: null,
		},
		{
			ruleId: 2,
			label: 'Late Check In',
			action: 'Minus',
			coins: 0,
			perMin: 10,
		},
		{
			ruleId: 0,
			label: 'Absent',
			action: 'Minus',
			coins: 0,
			perMin: null,
		},
	]);

	const [searchParams, setSearchParams] = useSearchParams();

	const navigate = useNavigate();

	let { id } = useParams();
	const agencyId = id || userId;
	const { data: officeSettings, isLoading: officeSettingsLoading } =
		useFetchItemsQuery(
			{ path: `/attendance/office-settings/${agencyId}` },
			{ refetchOnMountOrArgChange: true },
		);

	const handleCancel = () => {
		navigate(`/agencies`);
	};

	useEffect(() => {
		const role = searchParams.get('role') || 'All';
		const search = searchParams.get('search') || '';

		setSearchParams(
			(prev) => {
				const newParams = {
					role,
					...(search && { search }),
				};

				return newParams;
			},
			{ replace: true },
		);
	}, [searchParams, setSearchParams]);

	const queryParams = useMemo(() => {
		const search = searchParams.get('search') || '';
		const role = searchParams.get('role') || 'All';
		const agency = agencyId || '';

		return {
			role,
			...(search && { search }),
			...(agency && { agency }),
		};
	}, [searchParams]);

	const {
		data: users,
		isLoading: usersLoading,
		isFetching: usersFetching,
		refetch: usersRefetch,
	} = useFetchItemsQuery(
		{ path: '/v2/user/employees', params: queryParams },
		{ refetchOnMountOrArgChange: true },
	);

	const [updateItemMutation, { isLoading: isUpdating }] =
		useUpdateItemMutation();

	useEffect(() => {
		usersRefetch();
	}, [searchParams, usersRefetch]);

	useEffect(() => {
		if (officeSettings?.doc) {
			const settings = officeSettings?.doc;
			setOfficeCheckinTime(settings?.checkinTime || '09: 00 AM');
			setOfficeCheckoutTime(settings?.checkoutTime || '06: 00 PM');
			setOfficeTimezone(settings?.timezone || 'Asia/Dubai');
			setOfficeOffDays(settings?.offDays || [0]);
			setOfficeGracePeriod(settings?.gracePeriod || 0);
			setSpecialUsers(settings?.specialUsers || []);
			setMonthlyLateLimit(settings?.monthlyLateLimit || 0);
			setMonthlyEarlyCheckoutLimit(settings?.monthlyEarlyCheckoutLimit || 0);
			setLateDeductionSettings({
				importantDay: settings?.importantDay?.[0] || null,
				lateDeductionRules: settings?.lateDeductionRules || [],
			});
			setEarlyCheckoutDeductionSettings({
				earlyCheckoutDeductionRules:
					settings?.earlyCheckoutDeductionRules || [],
			});

			if (settings?.rules) {
				const transformedRules = settings?.rules.map((rule) => {
					if (rule.ruleId === 1) {
						return {
							ruleId: 1,
							label: 'Early Check In',
							action: rule.coinChange < 0 ? 'Minus' : 'Plus',
							coins: Math.abs(rule.coinChange),
						};
					} else if (rule.ruleId === 2) {
						return {
							ruleId: 2,
							label: 'Late Check In',
							action: rule.perMinutePenalty < 0 ? 'Minus' : 'Plus',
							coins: Math.abs(rule.perMinutePenalty),
							perMin: rule.intervalMinutes,
						};
					} else if (rule.ruleId === 0) {
						return {
							ruleId: 0,
							label: 'Absent',
							action: rule.coinChange < 0 ? 'Minus' : 'Plus',
							coins: Math.abs(rule.coinChange),
						};
					}
					return rule;
				});

				setRules(transformedRules);
			}
		}
	}, [officeSettings?.doc]);

	const handleSave = async () => {
		const checkIn = moment(officeCheckinTime, 'hh:mm A');
		const checkOut = moment(officeCheckoutTime, 'hh:mm A');

		if (checkOut.isBefore(checkIn)) {
			toast.error('Check-Out time must be greater than Check-In time!');
			return;
		}

		try {
			const transformedRules = rules.map((rule, index) => {
				if (rule.label === 'Early Check In') {
					return {
						ruleId: 1,
						name: 'earlyCheckIn',
						description: 'Bonus coins for early check-in',
						coinChange: rule.action === 'Minus' ? -rule.coins : rule.coins,
					};
				} else if (rule.label === 'Late Check In') {
					return {
						ruleId: 2,
						name: 'lateCheckInPenalty',
						description:
							'Deduct coins for late check-in based on time intervals',
						isTimeBased: true,
						perMinutePenalty:
							rule.action === 'Minus' ? -rule.coins : rule.coins,
						intervalMinutes: rule.perMin,
					};
				} else if (rule.label === 'Absent') {
					return {
						ruleId: 0,
						name: 'absentPenalty',
						description: 'Deduct coins for being absent',
						coinChange: rule.action === 'Minus' ? -rule.coins : rule.coins,
					};
				}
				return rule;
			});

			const allData = {
				checkinTime: officeCheckinTime,
				checkoutTime: officeCheckoutTime,
				timezone: officeTimezone,
				offDays: officeOffDays,
				gracePeriod: officeGracePeriod,
				agency: agencyId,
				rules: transformedRules,
				monthlyLateLimit,
				...lateDeductionSettings,
				...earlyCheckoutDeductionSettings,
				// specialUsers,
			};

			await updateItemMutation({
				path: `/attendance/office-settings/${agencyId}`,
				body: allData,
			}).unwrap();

			toast.success('Office settings updated successfully');
			const redirectUrl = hasPermission('admin_settings')
				? '/agencies'
				: '/attendance';
			navigate(redirectUrl);
		} catch (error) {
			console.log(error);
		}
	};

	const updateFilters = (newFilters) => {
		setSearchParams(
			(prev) => {
				const prevParams = Object.fromEntries(prev.entries());
				const updatedParams = { ...prevParams, ...newFilters };

				// Prevent updating if nothing has changed
				if (JSON.stringify(prevParams) === JSON.stringify(updatedParams)) {
					return prevParams; // No change, avoid state update
				}

				return updatedParams;
			},
			{ replace: true },
		);
	};

	const handleSearch = () => {
		const term = searchTermRef.current.trim();
		if (!term) return;

		updateFilters({ search: term, role: 'All' });
		setSearchClear(true);
	};

	const handleClear = () => {
		searchTermRef.current = '';
		document.getElementById('searchInput').value = '';
		updateFilters({ role: 'All' });

		setSearchParams((prev) => {
			const newParams = new URLSearchParams(prev);
			newParams.delete('search');
			return newParams;
		});
		setSearchClear(false);
	};

	return officeSettingsLoading ? (
		<OfficeShimmer />
	) : officeSettings ? (
		<>
			<Box
				fontFamily="'DM Sans', sans-serif"
				marginTop={'-16px'}
				marginLeft={'-4px'}
			>
				<RoleTabs updateFilters={updateFilters} key='office' />

				<Flex
					direction={{ base: 'column', xl: 'row' }}
					alignItems={{ base: 'stretch', xl: 'stretch' }}
					gap={{ base: 3, md: 5 }}
					py='2'
				>
					<Flex
						bg='white'
						p={{ base: 3, md: 5 }}
						borderRadius='5px'
						flex='1'
						// maxWidth='fit-content'
						border='1px solid #cacaca'
						direction={{ base: 'column', md: 'row' }}
						gap={{ base: 3, md: 5 }}
						justifyContent='space-between'
					>
						<Box
							flex={{ base: 'none', md: 1 }}
							w={{ base: '100%', md: 'auto' }}
						>
							<Search
								handleSearch={handleSearch}
								searchTermRef={searchTermRef}
								handleClear={handleClear}
								searchClear={searchClear}
							/>

							<UserList
								agencyId={agencyId}
								users={users}
								specialUsers={specialUsers}
								usersLoading={usersLoading}
								usersFetching={usersFetching}
								setSpecialUsers={setSpecialUsers}
								setSelectedUser={setSelectedUser}
								setCheckinTime={setSpecialCheckinTime}
								setCheckoutTime={setSpecialCheckoutTime}
							/>
						</Box>

						<Box minWidth={{ base: '100%', md: 'auto' }}>
							<AdminTiming
								agencyId={agencyId}
								checkinTime={specialCheckinTime}
								setCheckinTime={setSpecialCheckinTime}
								checkoutTime={specialCheckoutTime}
								setCheckoutTime={setSpecialCheckoutTime}
								selectedUser={selectedUser}
								setSelectedUser={setSelectedUser}
								setSpecialUsers={setSpecialUsers}
							/>
						</Box>
					</Flex>

					<Box
						flex={{ base: 'none', md: 1 }}
						w={{ base: '100%', md: 'auto' }}
						display='flex'
						justifyContent={{ base: 'center', md: 'flex-start' }}
					>
						<OfficeTiming
							checkinTime={officeCheckinTime}
							setCheckinTime={setOfficeCheckinTime}
							checkoutTime={officeCheckoutTime}
							setCheckoutTime={setOfficeCheckoutTime}
							timezone={officeTimezone}
							setTimezone={setOfficeTimezone}
							offDays={officeOffDays}
							setOffDays={setOfficeOffDays}
							gracePeriod={officeGracePeriod}
							setGracePeriod={setOfficeGracePeriod}
							monthlyLateLimit={monthlyLateLimit}
							setMonthlyLateLimit={setMonthlyLateLimit}
							monthlyEarlyCheckoutLimit={monthlyEarlyCheckoutLimit}
							setMonthlyEarlyCheckoutLimit={setMonthlyEarlyCheckoutLimit}
						/>
					</Box>
				</Flex>

				<Box
					bg='white'
					borderRadius='lg'
					border='1px solid'
					borderColor='gray.200'
					p={{ base: 5, md: 6 }}
					shadow='sm'
				>
					<VStack align='stretch' spacing={6}>
						{/* Main Heading */}
						<Box>
							<Text fontSize='lg' fontWeight='bold' color='gray.800'>
								Attendance Deduction Rules
							</Text>
							<Text fontSize='sm' color='gray.500'>
								Configure deduction rules for late check-ins and early
								checkouts.
							</Text>

							{/* Information Message */}
							<Alert status='info' mb={4} borderRadius='md' fontSize='sm'>
								<AlertIcon />
								<Box>
									<Text fontWeight='medium'>Important Day Notice</Text>
									<Text fontSize='xs' color='gray.700'>
										Attendance deductions on important day are applied at double
										the rate. For example: 50% deduction will become 100% on
										important days.
									</Text>
								</Box>
							</Alert>
						</Box>

						<Divider />

						{/* Late Deduction */}
						<LateDeductionSettings
							lateDeductionSettings={lateDeductionSettings}
							setLateDeductionSettings={setLateDeductionSettings}
						/>

						<Divider />

						{/* Early Checkout */}
						<EarlyDeductionSettings
							earlyCheckoutDeductionSettings={earlyCheckoutDeductionSettings}
							setEarlyCheckoutDeductionSettings={
								setEarlyCheckoutDeductionSettings
							}
						/>
					</VStack>
				</Box>

				<Flex flexDir={{ base: 'column', lg: 'row' }}>
					<RulesSection rules={rules} setRules={setRules} />
				</Flex>

				<Buttons
					onCancel={handleCancel}
					onSave={handleSave}
					isUpdating={isUpdating}
				/>
			</Box>
		</>
	) : (
		<Text>Office Settings not found! </Text>
	);
};

export default OfficeSettings;
