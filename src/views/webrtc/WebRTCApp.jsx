import {
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	Grid,
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { DEFAULT_COLOR_SCHEME } from 'common/constants';
import { getActiveSettings, getCallHistories, getSettings } from 'storage';

// import CallHistories from './history';
import Footer from './footer/footer';
import Phone from './phone';
import Settings from './settings';
import { resetAutoDailState } from '../../redux/webrtc/webrtcSlice';

import './index.css';
import DialerSettings from './dialer_settings';
import { usePermissions } from 'hooks/usePermissions';

const WebRTCApp = () => {
	const [sipDomain, setSipDomain] = useState('');
	const [sipUsername, setSipUsername] = useState('');
	const [sipServerAddress, setSipServerAddress] = useState('');
	const [sipPassword, setSipPassword] = useState('');
	const [sipDisplayName, setSipDisplayName] = useState('');
	// const [callHistories, setCallHistories] = useState([]);
	const [calledNumber, setCalledNumber] = useState('');
	const [calledName, setCalledName] = useState('');
	const [tabIndex, setTabIndex] = useState(0);
	const [status, setStatus] = useState('stop');
	const [allSettings, setAllSettings] = useState([]);
	const [advancedSettings, setAdvancedSettings] = useState(null);
	const [isSwitchingUserStatus, setIsSwitchingUserStatus] = useState(false);
	const [isOnline, setIsOnline] = useState(false);
	const phoneSipAschildRef = useRef(null);

	const { hasPermission } = usePermissions();

	// check dialer settiings permision
	const isDialerSettingsAllowed = hasPermission('sip', 'edit_dialer_settings');

	// get user settings from redux store
	const userActiveSettings = useSelector(
		(state) => state.webrtc.userSettings?.modes?.wss || {}
	);

	const handleGoOffline = (s) => {
		if (s === status) return;

		if (phoneSipAschildRef.current) {
			if (s === 'unregistered') {
				phoneSipAschildRef.current.updateGoOffline('stop');
			} else {
				phoneSipAschildRef.current.updateGoOffline('start');
			}
		}
	};

	// console.log({ userActiveSettings });

	const loadSettings = () => {
		// const settings = getSettings();
		// const activeSettings = settings.find((el) => el.active);

		// Settings pulled from Redux; already fetched from the DB
		setAllSettings([userActiveSettings]);
		setSipDomain(userActiveSettings?.domain || '');
		setSipServerAddress(userActiveSettings?.url || '');
		setSipUsername(userActiveSettings?.username || '');
		setSipPassword(userActiveSettings?.password || '');
		setSipDisplayName(userActiveSettings?.cid || '');

		setAdvancedSettings(getActiveSettings());
	};
	// const loadSettings = () => {
	// 	const settings = getSettings();
	// 	const activeSettings = settings.find((el) => el.active);

	// 	setAllSettings(getSettings());
	// 	setAdvancedSettings(getActiveSettings());
	// 	setSipDomain(activeSettings?.decoded.sipDomain || '');
	// 	setSipServerAddress(activeSettings?.decoded.sipServerAddress || '');
	// 	setSipUsername(activeSettings?.decoded.sipUsername || '');
	// 	setSipPassword(activeSettings?.decoded.sipPassword || '');
	// 	setSipDisplayName(activeSettings?.decoded.sipDisplayName || '');
	// };

	const tabsSettings = [
		{
			title: 'Dialer',
			content: (
				<Phone
					ref={phoneSipAschildRef}
					sipUsername={sipUsername}
					sipPassword={sipPassword}
					sipDomain={sipDomain}
					sipDisplayName={sipDisplayName}
					sipServerAddress={sipServerAddress}
					calledNumber={[calledNumber, setCalledNumber]}
					calledName={[calledName, setCalledName]}
					stat={[status, setStatus]}
					advancedSettings={advancedSettings}
					allSettings={allSettings}
					reload={loadSettings}
					setIsSwitchingUserStatus={setIsSwitchingUserStatus}
					setIsOnline={setIsOnline}
				/>
			),
		},
		// {
		// 	title: 'Calls',
		// 	content: (
		// 		<CallHistories
		// 			calls={callHistories}
		// 			onDataChange={() => setCallHistories(getCallHistories(sipUsername))}
		// 			onCallNumber={(number, name) => {
		// 				setCalledNumber(number);
		// 				setCalledName(name || '');
		// 				setTabIndex(0);
		// 			}}
		// 		/>
		// 	),
		// },
		{
			title: 'Settings',
			content: <DialerSettings />,
			// content: <Settings />,
		},
	];

	useEffect(() => {
		if (userActiveSettings && Object.keys(userActiveSettings).length > 0) {
			loadSettings();
		}
	}, [userActiveSettings]);

	const onTabsChange = (i) => {
		loadSettings();
		setTabIndex(i);
		// reset lead details
		resetAutoDailState();
		// setCallHistories(getCallHistories(sipUsername));
	};

	return (
		<Grid
			maxH='full'
			minH='70vh'
			templateRows='1fr auto'
			overflowY='auto'
			overflowX='hidden'
			scrollBehavior='smooth'
		>
			<Tabs
				isFitted
				variant='enclosed'
				colorScheme={DEFAULT_COLOR_SCHEME}
				onChange={onTabsChange}
				index={tabIndex}
				size='sm'
				gap={1}
				w='100%'
				overflow='hidden'
			>
				{isDialerSettingsAllowed && (
					<TabList gap={1}>
						{tabsSettings.map((s, i) => (
							<Tab
								_selected={{ color: 'white', bg: 'greenish.500' }}
								bg='grey.500'
								key={i}
								rounded={0}
								fontSize='md'
								flex='1'
								minW={0}
							>
								{s.title}
							</Tab>
						))}
					</TabList>
				)}

				<TabPanels>
					{tabsSettings.map((s, i) => (
						<TabPanel key={i}>{s.content}</TabPanel>
					))}
				</TabPanels>
			</Tabs>

			<Footer
				sipServerAddress={sipServerAddress}
				sipUsername={sipUsername}
				sipDomain={sipDomain}
				sipDisplayName={sipDisplayName}
				sipPassword={sipPassword}
				status={status}
				setStatus={setStatus}
				isSwitchingUserStatus={isSwitchingUserStatus}
				setIsSwitchingUserStatus={setIsSwitchingUserStatus}
				isOnline={isOnline}
				setIsOnline={setIsOnline}
				onHandleGoOffline={handleGoOffline}
			/>
		</Grid>
	);
};

export default WebRTCApp;
