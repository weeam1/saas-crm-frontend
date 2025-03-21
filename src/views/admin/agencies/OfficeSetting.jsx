import {
	Box,
	Button,
	Flex,
	Input,
	IconButton,
	Text,
	InputGroup,
	InputLeftElement,
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
import Loader from 'components/loading/Loader';
import { useUpdateItemMutation } from 'api/apiSlice';
import { toast } from 'react-toastify';
import AppButton from 'components/shared/AppButton';
import { IoArrowBack } from 'react-icons/io5';
import moment from 'moment';

const OfficeSettings = () => {
	const searchTermRef = useRef('');
	const [searchClear, setSearchClear] = useState(false);

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
	const { id: agencyId } = useParams();

	const { data: officeSettings, isLoading: officeSettingsLoading } =
		useFetchItemsQuery(
			{ path: `/attendance/office-settings/${agencyId}` },
			{ refetchOnMountOrArgChange: true }
		);

	const handleCancel = () => {
		navigate(`/agencies`);
	};

	useEffect(() => {
		const role = searchParams.get('role') || 'All';
		const search = searchParams.get('search') || '';

		console.log({ role });

		setSearchParams(
			(prev) => {
				const newParams = {
					role,
					...(search && { search }),
				};

				return newParams;
			},
			{ replace: true }
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
		{ refetchOnMountOrArgChange: true }
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
			setOfficeTimezone(settings?.timezone || 'Asia/Karachi');
			setOfficeOffDays(settings?.offDays || [0]);
			setOfficeGracePeriod(settings?.gracePeriod || 0);
			setSpecialUsers(settings?.specialUsers || []);

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
				// specialUsers,
			};

			await updateItemMutation({
				path: `/attendance/office-settings/${agencyId}`,
				body: allData,
			}).unwrap();

			toast.success('Office settings updated successfully');
			navigate(`/agencies`);
		} catch (error) {
			console.log(error);
		}
	};

	const updateFilters = (newFilters) => {
		setSearchParams(
			(prev) => {
				const prevParams = Object.fromEntries(prev.entries());
				const updatedParams = { ...prevParams, ...newFilters };

				console.log({ prevParams, updatedParams });

				// Prevent updating if nothing has changed
				if (JSON.stringify(prevParams) === JSON.stringify(updatedParams)) {
					return prevParams; // No change, avoid state update
				}

				return updatedParams;
			},
			{ replace: true }
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
		<Box>
			<Loader />
		</Box>
	) : officeSettings ? (
		<Box
			p={{ base: 3, md: 5 }}
			borderRadius='lg'
			fontFamily="'DM Sans', sans-serif"
		>
			<AppButton
				leftIcon={<IoArrowBack />}
				onClick={() => navigate('/agencies')}
			>
				Back
			</AppButton>

			<Text
				size='md'
				mb={{ base: 3, md: 5 }}
				fontWeight='400'
				fontSize='32px'
				textAlign={{ base: 'center', md: 'left' }}
			>
				{officeSettings?.doc?.agency?.name} Agency – Office Settings
			</Text>

			<RoleTabs updateFilters={updateFilters} key='office' />

			<Flex
				direction={{ base: 'column', md: 'column', lg: 'row' }}
				alignItems={{ base: 'stretch', md: 'stretch' }}
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
					<Box flex={{ base: 'none', md: 1 }} w={{ base: '100%', md: 'auto' }}>
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

					<Box minWidth={{ base: '100%', md: '300px' }}>
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
					/>
				</Box>
			</Flex>

			<RulesSection rules={rules} setRules={setRules} />
			<Buttons
				onCancel={handleCancel}
				onSave={handleSave}
				isUpdating={isUpdating}
			/>
		</Box>
	) : (
		<Text>Office Settings not found! </Text>
	);
};

export default OfficeSettings;
