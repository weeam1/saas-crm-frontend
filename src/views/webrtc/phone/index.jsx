import {
	Box,
	Button,
	Circle,
	HStack,
	Heading,
	IconButton,
	Image,
	Input,
	Spacer,
	Text,
	Avatar,
	Icon,
	Tooltip,
	VStack,
} from '@chakra-ui/react';
import {
	forwardRef,
	useCallback,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from 'react';

import { SipConstants, SipUA } from 'lib/webrtc';
import IncommingCall from './incoming-call';
import DialPad from './dial-pad';
import {
	isSipClientAnswered,
	isSipClientIdle,
	isSipClientRinging,
	maskPhoneNumber,
} from 'utils/webrtc';

// import Avatar from 'assets/webrtc-imgs/icons/Avatar.svg';
// import GreenAvatar from 'assets/webrtc-imgs/icons/Avatar-Green.svg';
import './styles.css';
import {
	deleteCurrentCall,
	getCurrentCall,
	saveCallHistory,
	saveCurrentCall,
	setActiveSettings,
} from 'storage';
import { OutGoingCall } from './outgoing-call';
import { v4 as uuidv4 } from 'uuid';
import IconButtonMenu from 'components/menu';
import {
	getApplications,
	getConferences,
	getQueues,
	getRegisteredUser,
	getSelfRegisteredUser,
} from 'api/webrtc';

import {
	FaChevronDown,
	FaList,
	FaMicrophone,
	FaMicrophoneSlash,
	FaPause,
	FaPeopleGroup,
	FaPhoneSlash,
	FaPlay,
	FaPhone,
	FaUserGroup,
} from 'react-icons/fa6';
import JoinConference from './conference';
import AvailableAccounts from './availableAccounts';
import { PhoneIcon } from '@chakra-ui/icons';
import {
	receiveIncomingCall,
	resetAutoDailState,
} from './../../../redux/webrtc/webrtcSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import useUserSession from 'hooks/useUserSession';
import { constant } from 'constant';

function transform(t1, t2) {
	const diff = Math.abs(t1 - t2) / 1000;
	const hours = Math.floor(diff / 3600);
	const minutes = Math.floor((diff % 3600) / 60);
	const seconds = Math.floor(diff % 60);
	return `${hours.toString().padStart(2, '0')}:${minutes
		.toString()
		.padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

const PAGE_VIEW = Object.freeze({
	DIAL_PAD: 0,
	INCOMING_CALL: 1,
	OUTGOING_CALL: 2,
	JOIN_CONFERENCE: 3,
});

const Phone = forwardRef((props, ref) => {
	const {
		sipDomain,
		sipServerAddress,
		sipUsername,
		sipPassword,
		sipDisplayName,
		stat: [status, setStatus],
		calledNumber: [calledANumber, setCalledANumber],
		calledName: [calledAName, setCalledAName],
		advancedSettings,
		allSettings,
		reload,
		setIsSwitchingUserStatus,
		setIsOnline,
	} = props;

	const dispatch = useDispatch();

	const { user } = useUserSession();

	const webrtc = useSelector((state) => state.webrtc);
	const leadDetails = webrtc?.activeCall;

	// is mask number ?
	const isMaskNumber =
		webrtc.dialMode === 'auto' || webrtc.callType === 'inbound';

	const [inputNumber, setInputNumber] = useState('');
	const [appName, setAppName] = useState('');
	const [callStatus, setCallStatus] = useState(SipConstants.SESSION_ENDED);
	const [sessionDirection, setSessionDirection] = useState('');
	const [seconds, setSeconds] = useState(0);
	const [isCallButtonLoading, setIsCallButtonLoading] = useState(false);
	const [isAdvanceMode, setIsAdvancedMode] = useState(false);
	const [pageView, setPageView] = useState(PAGE_VIEW.DIAL_PAD);
	const [registeredUser, setRegisteredUser] = useState({
		allow_direct_app_calling: false,
		allow_direct_queue_calling: false,
		allow_direct_user_calling: false,
	});
	const [selectedConference, setSelectedConference] = useState('');
	const [callSid, setCallSid] = useState('');
	const [showConference, setShowConference] = useState(false);
	const [showAccounts, setShowAccounts] = useState(false);

	const inputNumberRef = useRef(inputNumber);
	const sessionDirectionRef = useRef(sessionDirection);
	const sipUA = useRef(null);
	const timerRef = useRef(null);
	const FetchUsertimerRef = useRef(null);
	const isRestartRef = useRef(false);
	const sipDomainRef = useRef('');
	const sipUsernameRef = useRef('');
	const sipPasswordRef = useRef('');
	const sipServerAddressRef = useRef('');
	const sipDisplayNameRef = useRef('');
	const unregisteredReasonRef = useRef('');
	const isInputNumberFocusRef = useRef(false);
	const secondsRef = useRef(seconds);
	const accountsCardRef = useRef(null);

	// ####### 	SET INPUT NUMBER FROM LEAD MODULE TO AUTO CALL DIRECT ########## //

	// 00CC format phone number for any country
	useEffect(() => {
		if (leadDetails?.phoneNumber && webrtc?.callType === 'outbound') {
			// direct goesh to call directly
			makeOutboundCall(leadDetails?.phoneNumber);
		} else if (leadDetails?.leadName) {
			setInputNumber(leadDetails?.leadName);
		}
	}, [leadDetails]);

	useImperativeHandle(ref, () => ({
		updateGoOffline(newState) {
			if (newState === 'stop') {
				sipUA.current?.stop();
			} else {
				sipUA.current?.start();
			}
		},
	}));

	function stopCallDurationCounter() {
		if (timerRef.current) {
			clearInterval(timerRef.current);
			timerRef.current = null;
			setSeconds(0);
		}
	}

	const addCallHistory = useCallback(() => {
		const call = getCurrentCall();
		if (call) {
			saveCallHistory(sipUsername, {
				number: call.number,
				direction: call.direction,
				duration: transform(Date.now(), call.timeStamp),
				timeStamp: call.timeStamp,
				callSid: call.callSid,
				name: call.name,
			});
		}
		deleteCurrentCall();
	}, [sipUsername]);

	const startCallDurationCounter = useCallback(() => {
		stopCallDurationCounter();
		timerRef.current = setInterval(() => {
			setSeconds((seconds) => seconds + 1);
		}, 1000);
	}, []);

	const createSipClient = useCallback(() => {
		setIsSwitchingUserStatus(true);
		const client = {
			username: `${sipUsernameRef.current}@${sipDomainRef.current}`,
			password: sipPasswordRef.current,
			name: sipDisplayNameRef.current ?? sipUsernameRef.current,
		};

		const settings = {
			pcConfig: {
				iceServers: [{ urls: ['stun:stun.l.google.com:19302'] }],
			},
			wsUri: sipServerAddressRef.current,
			register: true,
		};

		const sipClient = new SipUA(client, settings);

		// UA Status
		sipClient.on(SipConstants.UA_REGISTERED, () => {
			setStatus('registered');
		});

		sipClient.on(SipConstants.UA_UNREGISTERED, (args) => {
			setStatus('unregistered');
			if (sipUA.current) sipUA.current.stop();
			unregisteredReasonRef.current = `User is not registered${
				args.cause ? `, ${args.cause}` : ''
			}`;
		});

		sipClient.on(SipConstants.UA_DISCONNECTED, (args) => {
			if (unregisteredReasonRef.current) {
				// toast.warning(unregisteredReasonRef.current);
				unregisteredReasonRef.current = '';
			}
			setStatus('disconnected');
			setIsOnline(false);
			setIsSwitchingUserStatus(false);
			if (sipUA.current) sipUA.current.stop();

			if (args.error) {
				toast.warning(
					`Cannot connect to ${sipServerAddressRef.current}${
						args.reason ? `, ${args.reason}` : ''
					}`
				);
			} else if (isRestartRef.current) {
				createSipClient();
				isRestartRef.current = false;
			}
		});

		// Call Status
		sipClient.on(SipConstants.SESSION_RINGING, (args) => {
			if (args.session.direction === 'incoming') {
				saveCurrentCall({
					number: args.session.user,
					direction: args.session.direction,
					timeStamp: Date.now(),
					duration: '0',
					callSid: uuidv4(),
				});

				// **** OPEN CRM CALL MODAL **** //
				dispatch(receiveIncomingCall(args.session.user));
			}
			setCallStatus(SipConstants.SESSION_RINGING);
			setSessionDirection(args.session.direction);
			setInputNumber(args.session.user);
		});

		sipClient.on(SipConstants.SESSION_ANSWERED, (args) => {
			setCallSid(args.callSid);
			const currentCall = getCurrentCall();
			if (currentCall) {
				currentCall.timeStamp = Date.now();
				saveCurrentCall(currentCall);
			}
			setCallStatus(SipConstants.SESSION_ANSWERED);
			startCallDurationCounter();
		});

		sipClient.on(SipConstants.SESSION_ENDED, () => {
			addCallHistory();
			setCallStatus(SipConstants.SESSION_ENDED);
			setSessionDirection('');
			stopCallDurationCounter();
			setInputNumber(''); // extra add for clear the input number
		});

		sipClient.on(SipConstants.SESSION_FAILED, () => {
			addCallHistory();
			setCallStatus(SipConstants.SESSION_FAILED);
			setSessionDirection('');
			stopCallDurationCounter();
			setInputNumber(''); // extra add for clear the input number
		});

		sipClient.start();
		sipUA.current = sipClient;
	}, [
		addCallHistory,
		setIsSwitchingUserStatus,
		setStatus,
		startCallDurationCounter,
		setIsOnline,
	]);

	function fetchRegisterUser() {
		getSelfRegisteredUser(sipUsernameRef.current)
			.then(({ json }) => setRegisteredUser(json))
			.catch(() =>
				setRegisteredUser({
					allow_direct_app_calling: false,
					allow_direct_queue_calling: false,
					allow_direct_user_calling: false,
				})
			);
	}

	const handleDialPadClick = (value, fromKeyboad) => {
		if (!(isInputNumberFocusRef.current && fromKeyboad)) {
			setInputNumber((prev) => prev + value);
		}

		if (isSipClientAnswered(callStatus)) {
			sipUA.current?.dtmf(value);
		}

		// reset the redux lead phone number
		dispatch(resetAutoDailState());
	};

	const handleCallButtion = () => makeOutboundCall(inputNumber);

	const makeOutboundCall = (number, name = '') => {
		if (sipUA.current && number) {
			setIsCallButtonLoading(true);
			setCallStatus(SipConstants.SESSION_RINGING);
			setSessionDirection('outgoing');
			saveCurrentCall({
				number,
				name,
				direction: 'outgoing',
				timeStamp: Date.now(),
				duration: '0',
				callSid: uuidv4(),
			});

			let customHeaders = [];
			if (number.startsWith('app-')) {
				customHeaders = [`X-Application-Sid: ${number.substring(4)}`];
			}

			sipUA.current.call(number, customHeaders);
		}
	};

	const clientGoOffline = () => {
		if (sipUA.current) {
			sipUA.current.stop();
			sipUA.current = null;
		}
	};

	const handleHangup = () => {
		if (isSipClientAnswered(callStatus) || isSipClientRinging(callStatus)) {
			sipUA.current?.terminate(480, 'Call Finished');
		}
	};

	const handleCallOnHold = () => {
		if (isSipClientAnswered(callStatus)) {
			sipUA.current?.isHolded()
				? sipUA.current?.unhold()
				: sipUA.current?.hold();
		}
	};

	const handleCallMute = () => {
		if (isSipClientAnswered(callStatus)) {
			sipUA.current?.isMuted()
				? sipUA.current?.unmute()
				: sipUA.current?.mute();
		}
	};

	const handleAnswer = () => {
		if (isSipClientRinging(callStatus)) sipUA.current?.answer();
	};

	const handleDecline = () => {
		if (isSipClientRinging(callStatus))
			sipUA.current?.terminate(486, 'Busy here');
	};

	const isStatusRegistered = () => status === 'registered';

	const handleSetActive = (id) => {
		setActiveSettings(id);
		setShowAccounts(false);
		reload();
	};

	const handleClickOutside = (event) => {
		const target = event.target;
		if (accountsCardRef.current && !accountsCardRef.current.contains(target)) {
			setShowAccounts(false);
		}
	};

	const clearFetchUserTimer = () => {
		if (FetchUsertimerRef.current) {
			clearInterval(FetchUsertimerRef.current);
			FetchUsertimerRef.current = null;
		}
	};

	useEffect(() => {
		sipDomainRef.current = sipDomain;
		sipUsernameRef.current = sipUsername;
		sipPasswordRef.current = sipPassword;
		sipServerAddressRef.current = sipServerAddress;
		sipDisplayNameRef.current = sipDisplayName;
		if (sipDomain && sipUsername && sipPassword && sipServerAddress) {
			if (sipUA.current) {
				if (sipUA.current.isConnected()) {
					clientGoOffline();
					isRestartRef.current = true;
				} else {
					createSipClient();
				}
			} else {
				createSipClient();
			}
		} else {
			clientGoOffline();
		}
	}, [
		sipDomain,
		sipUsername,
		sipPassword,
		sipServerAddress,
		sipDisplayName,
		createSipClient,
	]);

	useEffect(() => {
		setIsAdvancedMode(!!advancedSettings?.decoded?.accountSid);
		fetchRegisterUser();
	}, [advancedSettings]);

	useEffect(() => {
		inputNumberRef.current = inputNumber;
		sessionDirectionRef.current = sessionDirection;
		secondsRef.current = seconds;
	}, [inputNumber, seconds, sessionDirection]);

	useEffect(() => {
		if (isSipClientIdle(callStatus) && isCallButtonLoading) {
			setIsCallButtonLoading(false);
		}

		switch (callStatus) {
			case SipConstants.SESSION_RINGING:
				if (sessionDirection === 'incoming') {
					setPageView(PAGE_VIEW.INCOMING_CALL);
				} else {
					setPageView(PAGE_VIEW.OUTGOING_CALL);
				}
				break;
			case SipConstants.SESSION_ANSWERED:
				if (selectedConference) {
					setPageView(PAGE_VIEW.JOIN_CONFERENCE);
				} else {
					setPageView(PAGE_VIEW.DIAL_PAD);
				}
				break;
			case SipConstants.SESSION_ENDED:
			case SipConstants.SESSION_FAILED:
				setSelectedConference('');
				setPageView(PAGE_VIEW.DIAL_PAD);
				break;
		}
	}, [callStatus, isCallButtonLoading, selectedConference, sessionDirection]);

	useEffect(() => {
		if (calledANumber) {
			if (
				!(
					calledANumber.startsWith('app-') ||
					calledANumber.startsWith('queue-') ||
					calledANumber.startsWith('conference-')
				)
			) {
				setInputNumber(calledANumber);
			}

			setAppName(calledAName);
			makeOutboundCall(calledANumber, calledAName);
			setCalledANumber('');
			setCalledAName('');
		}
	}, [calledANumber, calledAName, setCalledAName, setCalledANumber]);

	useEffect(() => {
		if (status === 'registered' || status === 'disconnected') {
			setIsSwitchingUserStatus(false);
			setIsOnline(status === 'registered');
		}
	}, [status, setIsOnline, setIsSwitchingUserStatus]);

	useEffect(() => {
		if (isAdvanceMode) {
			getConferences()
				.then(() => setShowConference(true))
				.catch(() => setShowConference(false));

			FetchUsertimerRef.current = setInterval(() => {
				fetchRegisterUser();
			}, 10000);
		} else {
			clearFetchUserTimer();
			setShowConference(false);
		}
	}, [isAdvanceMode]);

	useEffect(() => {
		if (showAccounts) {
			document.addEventListener('mousedown', handleClickOutside);
		} else {
			document.removeEventListener('mousedown', handleClickOutside);
		}

		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [showAccounts]);

	const profileSrc = user?.profileImage
		? `${constant.baseUrl}${user.profileImage}`
		: user?.fullName || undefined;

	return (
		<Box flexDirection='column'>
			{allSettings.length >= 1 ? (
				<>
					<Text fontSize={'small'} fontWeight={'semibold'} color={'gray.600'}>
						Account
					</Text>
					<Box className='relative' w={'full'}>
						{
							<HStack
								// onClick={() => setShowAccounts(true)}
								_hover={{
									cursor: 'pointer',
								}}
								spacing={2}
								boxShadow='md'
								w='full'
								borderRadius={5}
								paddingY={2}
								paddingX={3.5}
							>
								{sipUsername && sipDomain ? (
									<>
										{/* <Image
											src={isStatusRegistered() ? GreenAvatar : Avatar}
											boxSize='35px'
										/> */}

										<Avatar
											size='sm'
											src={profileSrc}
											name={user?.fullName}
											// border='2px solid'
											// borderColor={
											// 	isStatusRegistered() ? 'green.400' : 'gray.300'
											// }
										/>
										<VStack alignItems='start' w='full' spacing={0}>
											<HStack spacing={2} w='full'>
												<Text fontWeight='bold' fontSize='13px'>
													{user?.firstName || sipDisplayName || sipUsername}
												</Text>
												<Circle
													size='8px'
													bg={isStatusRegistered() ? 'green.500' : 'gray.500'}
												/>
											</HStack>
											<Text fontWeight='bold' w='full'>
												{`${sipUsername}@${sipDomain}`}
											</Text>
										</VStack>

										<Spacer />
										{/* <VStack h='full' align='center'>
											<Icon as={FaChevronDown} />
										</VStack> */}
									</>
								) : (
									<Text fontWeight={'extrabold'}>Select Account</Text>
								)}
							</HStack>
						}
						{showAccounts && (
							<AvailableAccounts
								refData={accountsCardRef}
								allSettings={allSettings}
								onSetActive={handleSetActive}
							/>
						)}
					</Box>
				</>
			) : (
				<Heading textAlign={'center'} size='md' mb={2}>
					Go to Settings to configure your account
				</Heading>
			)}
			{pageView === PAGE_VIEW.DIAL_PAD && (
				<VStack
					spacing={2}
					w='full'
					mt={5}
					className={isStatusRegistered() ? '' : 'blurred'}
				>
					{isAdvanceMode && isSipClientIdle(callStatus) && (
						<HStack spacing={2} align='start' w='full'>
							{registeredUser.allow_direct_user_calling && (
								<IconButtonMenu
									icon={<FaUserGroup />}
									tooltip='Call an online user'
									noResultLabel='No one else is online'
									onClick={(_, value) => {
										setInputNumber(value);
										makeOutboundCall(value);
									}}
									onOpen={() => {
										return new Promise((resolve, reject) => {
											getRegisteredUser()
												.then(({ json }) => {
													const sortedUsers = json.sort((a, b) =>
														a.localeCompare(b)
													);
													resolve(
														sortedUsers
															.filter((u) => !u.includes(sipUsername))
															.map((u) => {
																const uName = u.match(/(^.*)@.*/);
																return {
																	name: uName ? uName[1] : u,
																	value: uName ? uName[1] : u,
																};
															})
													);
												})
												.catch((err) => reject(err));
										});
									}}
								/>
							)}

							{registeredUser.allow_direct_queue_calling && (
								<IconButtonMenu
									icon={<FaList />}
									tooltip='Take a call from queue'
									noResultLabel='No calls in queue'
									onClick={(name, value) => {
										setAppName(`Queue ${name}`);
										const calledQueue = `queue-${value}`;
										setInputNumber('');
										makeOutboundCall(calledQueue, `Queue ${name}`);
									}}
									onOpen={() => {
										return new Promise((resolve, reject) => {
											getQueues()
												.then(({ json }) => {
													const sortedQueues = json.sort((a, b) =>
														a.name.localeCompare(b.name)
													);
													resolve(
														sortedQueues.map((q) => ({
															name: `${q.name} (${q.length})`,
															value: q.name,
														}))
													);
												})
												.catch((err) => reject(err));
										});
									}}
								/>
							)}

							{registeredUser.allow_direct_app_calling && (
								<IconButtonMenu
									icon={<FaChevronDown />}
									tooltip='Call an application'
									noResultLabel='No applications'
									onClick={(name, value) => {
										setAppName(`App ${name}`);
										const calledAppId = `app-${value}`;
										setInputNumber('');
										makeOutboundCall(calledAppId, `App ${name}`);
									}}
									onOpen={() => {
										return new Promise((resolve, reject) => {
											getApplications()
												.then(({ json }) => {
													const sortedApps = json.sort((a, b) =>
														a.name.localeCompare(b.name)
													);
													resolve(
														sortedApps.map((a) => ({
															name: a.name,
															value: a.application_sid,
														}))
													);
												})
												.catch((err) => reject(err));
										});
									}}
								/>
							)}
							{registeredUser.allow_direct_app_calling && showConference && (
								<IconButtonMenu
									icon={<FaPeopleGroup />}
									tooltip='Join a conference'
									noResultLabel='No conference'
									onClick={(name, value) => {
										setPageView(PAGE_VIEW.JOIN_CONFERENCE);
										setSelectedConference(
											value === PAGE_VIEW.JOIN_CONFERENCE.toString()
												? ''
												: value
										);
									}}
									onOpen={() => {
										return new Promise((resolve, reject) => {
											getConferences()
												.then(({ json }) => {
													const sortedApps = json.sort((a, b) =>
														a.localeCompare(b)
													);
													resolve([
														{
															name: 'Start new conference',
															value: PAGE_VIEW.JOIN_CONFERENCE.toString(),
														},
														...sortedApps.map((a) => ({
															name: a,
															value: a,
														})),
													]);
												})
												.catch((err) => reject(err));
										});
									}}
								/>
							)}
						</HStack>
					)}

					{/* Input Dail Number */}
					{/* <Input
						value={inputNumber}
						bg='grey.500'
						fontWeight='bold'
						fontSize='24px'
						onChange={(e) => {
							setInputNumber(e.target.value);
						}}
						onFocus={() => {
							isInputNumberFocusRef.current = true;
						}}
						onBlur={() => {
							isInputNumberFocusRef.current = false;
						}}
						textAlign='center'
						isReadOnly={!isSipClientIdle(callStatus)}
					/> */}
					<Input
						value={isMaskNumber ? maskPhoneNumber(inputNumber) : inputNumber}
						variant='unstyled'
						textAlign='center'
						fontWeight='semibold'
						fontSize='28px'
						letterSpacing='1px'
						bg='transparent'
						h='54px'
						// Bottom border only
						border='1px solid'
						borderBottom='2px solid'
						borderColor='gray.300'
						// Hover effect (professional minimal)
						_hover={{
							borderColor: isSipClientIdle(callStatus)
								? 'gray.400'
								: 'gray.300',
						}}
						// Focus effect — clean, no outline, no shadow
						_focus={{
							borderColor: isSipClientIdle(callStatus)
								? 'green.500'
								: 'gray.300',
							outline: 'none',
						}}
						isReadOnly={!isSipClientIdle(callStatus)}
						// Select all on focus
						onFocus={(e) => {
							isInputNumberFocusRef.current = true;
							e.target.select();
						}}
						onBlur={() => {
							isInputNumberFocusRef.current = false;
						}}
						// Only allow digits, *, #
						onChange={(e) => setInputNumber(e.target.value)}
					/>

					{!isSipClientIdle(callStatus) && seconds >= 0 && (
						<Text fontSize='15px'>
							{new Date(seconds * 1000).toISOString().substr(11, 8)}
						</Text>
					)}

					<DialPad handleDigitPress={handleDialPadClick} />

					{isSipClientIdle(callStatus) ? (
						// <Button
						// 	w='full'
						// 	onClick={handleCallButtion}
						// 	isDisabled={!isStatusRegistered()}
						// 	colorScheme='brand'
						// 	alignContent='center'
						// 	rounded='sm'
						// 	isLoading={isCallButtonLoading}
						// >
						// 	Call
						// </Button>
						<Button
							w='full'
							onClick={handleCallButtion}
							isDisabled={!isStatusRegistered()}
							colorScheme='green'
							// rounded='md'
							size='lg'
							mt='4'
							borderRadius='full'
							isLoading={isCallButtonLoading}
							loadingText='Calling...'
							_hover={{
								transform: isStatusRegistered() ? 'scale(1.05)' : 'none',
								shadow: isStatusRegistered() ? 'md' : 'none',
							}}
							transition='all 0.2s ease'
						>
							<HStack spacing={2} justify='center'>
								<PhoneIcon />
								<Text fontWeight='bold'>Call</Text>
							</HStack>
						</Button>
					) : (
						<HStack align='center' gap={4} justify='space-evenly'>
							<Tooltip
								label={sipUA.current?.isHolded(undefined) ? 'UnHold' : 'Hold'}
							>
								<IconButton
									aria-label='Place call onhold'
									icon={
										sipUA.current?.isHolded(undefined) ? (
											<FaPlay />
										) : (
											<FaPause />
										)
									}
									// w='33%'
									variant='ghost'
									borderRadius='full'
									size='md'
									colorScheme='blue'
									display='flex'
									alignItems='center'
									justifyContent='center'
									onClick={handleCallOnHold}
								/>
							</Tooltip>

							<Spacer />
							<IconButton
								aria-label='Hangup'
								icon={<FaPhoneSlash />}
								w='60px'
								h='60px'
								borderRadius='100%'
								colorScheme='red'
								onClick={handleHangup}
							/>
							<Spacer />
							<Tooltip
								label={sipUA.current?.isMuted(undefined) ? 'Unmute' : 'Mute'}
							>
								<IconButton
									aria-label='Mute'
									icon={
										sipUA.current?.isMuted(undefined) ? (
											<FaMicrophone />
										) : (
											<FaMicrophoneSlash />
										)
									}
									// w='33%'
									size='md'
									variant='ghost'
									borderRadius='full'
									display='flex'
									alignItems='center'
									justifyContent='center'
									colorScheme='blue'
									onClick={handleCallMute}
								/>
							</Tooltip>
						</HStack>
					)}
				</VStack>
			)}
			{pageView === PAGE_VIEW.INCOMING_CALL && (
				<IncommingCall
					number={inputNumber}
					answer={handleAnswer}
					decline={handleDecline}
				/>
			)}
			{pageView === PAGE_VIEW.OUTGOING_CALL && (
				<OutGoingCall
					number={inputNumber || appName}
					cancelCall={handleDecline}
				/>
			)}
			{pageView === PAGE_VIEW.JOIN_CONFERENCE && (
				<JoinConference
					conferenceId={selectedConference}
					callSid={callSid}
					callDuration={seconds}
					callStatus={callStatus}
					handleCancel={() => {
						if (isSipClientAnswered(callStatus)) {
							sipUA.current?.terminate(480, 'Call Finished', undefined);
						}
						setPageView(PAGE_VIEW.DIAL_PAD);
					}}
					call={(name) => {
						const conference = `conference-${name}`;
						setSelectedConference(name);
						setInputNumber(conference);
						makeOutboundCall(conference, `Conference ${name}`);
					}}
				/>
			)}
		</Box>
	);
});

export default Phone;
