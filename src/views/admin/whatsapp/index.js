import React, {
	useState,
	useRef,
	useEffect,
	useMemo,
	useCallback,
} from 'react';
import {
	Box,
	Flex,
	Text,
	Avatar,
	Input,
	Button,
	IconButton,
	Tooltip,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	VStack,
	HStack,
	useColorModeValue,
	useBreakpointValue,
	useDisclosure,
	Drawer,
	DrawerOverlay,
	DrawerContent,
	DrawerCloseButton,
	DrawerHeader,
	DrawerBody,
	InputGroup,
	InputLeftElement,
	Divider,
	Popover,
	PopoverTrigger,
	PopoverContent,
	PopoverBody,
	PopoverArrow,
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	Icon,
	Image,
	Textarea,
	FormControl,
	FormLabel,
} from '@chakra-ui/react';
import {
	FiMic,
	FiImage,
	FiChevronLeft,
	FiSearch,
	FiFile,
	FiVideo,
	FiMusic,
	FiDownload,
	FiUser,
	FiSettings,
} from 'react-icons/fi';
import { IoMdMic, IoMdClose } from 'react-icons/io';
import { FaCheck, FaCheckDouble, FaSmile, FaWhatsapp } from 'react-icons/fa';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { RiSendPlaneFill } from 'react-icons/ri';
import { toast } from 'react-toastify';
import EmojiPicker from 'emoji-picker-react';

import ContactModal from './components/ContactModal';
import FileMessage from './components/FileMessage';
import UserList from './components/UserList';
import VoiceMessagePlayer from './components/VoiceMessagePlayer';

import {
	formatTime,
	formatDateHeader,
	formatMessageTime,
	whatsappColors,
} from 'utils/helpers.js';
import { useUpdateItemMutation, useCreateItemMutation } from 'api/apiSlice';
import { useFetchItemsQuery } from 'api/apiSlice';
import Loader from 'components/loading/Loader';
import ChatMessages from './components/ChatMessages';
import { useDispatch, useSelector } from 'react-redux';
import { appendMessage, setContacts } from '../../../redux/whatsappSlice';
import { resolveMessageType } from './components/helpers';

import { useSocketEvents } from 'hooks/useSocketEvents';
import UserAvatar from 'components/shared/UserAvatar';

const user = JSON.parse(localStorage.getItem('user'));
const isSuperAdmin = user?.role === 'superAdmin';

const Whatsapp = () => {
	const users = useSelector((state) => state.whatsapp.contacts || []);
	const currentUser = useSelector((state) => state.whatsapp.currentUser || {});

	const [messages, setMessages] = useState([]);
	const [inputMessage, setInputMessage] = useState('');
	const [selectedFile, setSelectedFile] = useState(null);
	const [isRecording, setIsRecording] = useState(false);
	const [isSending, setIsSending] = useState(false);
	const [activeChat, setActiveChat] = useState(null);
	const [recordingTime, setRecordingTime] = useState(0);
	const [searchQuery, setSearchQuery] = useState('');
	const [audioLevel, setAudioLevel] = useState(0);
	const [replyingTo, setReplyingTo] = useState(null);
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	const [pausedVoiceMessages, setPausedVoiceMessages] = useState(new Set());
	const [isContactModalOpen, setIsContactModalOpen] = useState(false);
	const [selectedImage, setSelectedImage] = useState(null);
	const [isRecordingCanceled, setIsRecordingCanceled] = useState(false);
	const [apiKey, setApiKey] = useState('');
	const [bussinessPhone, setBussinessPhone] = useState('');

	const mediaRecorderRef = useRef(null);
	const chunksRef = useRef([]);
	const fileInputRef = useRef(null);
	const audioInputRef = useRef(null);
	const videoInputRef = useRef(null);
	const docInputRef = useRef(null);
	const timerRef = useRef(null);
	const analyserRef = useRef(null);
	const animationRef = useRef(null);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const btnRef = useRef();

	const { registerUser } = useSocketEvents();

	const { data: config } = useFetchItemsQuery({
		path: '/whatsapp/config',
	});

	useEffect(() => {
		if (config?.doc) {
			setBussinessPhone(config?.doc?.phoneNumber);
			setApiKey(config?.doc?.token);

			// When you have both business phone and user ID
			if (currentUser) {
				const registerPayload = {
					phoneNumber: currentUser?.phoneNumber,
					userId: currentUser?.user?._id || '',
				};

				registerUser(registerPayload);
			}
		}
	}, [config?.doc, currentUser, registerUser]);

	const dispatch = useDispatch();

	const isMobile = useBreakpointValue({ base: true, md: false });

	// const [users, setUsers] = useState([]);

	// const { data: contacts, isLoading: usersLoading } = useFetchItemsQuery({
	// 	path: '/whatsapp/contacts',
	// });

	const [createMessageAPI, { isLoading: sendingMessage }] =
		useCreateItemMutation();

	console.log({ currentUser });

	// useEffect(() => {
	// 	if (contacts?.doc) {
	// 		console.log('users set state');
	// 		// setUsers(contacts?.doc);
	// 		dispatch(setContacts(contacts?.doc));
	// 		// setActiveChat(contacts?.doc[0]?._id || null);
	// 	}
	// }, [contacts?.doc]);

	// Messages data
	const allMessages = useRef({
		1: [
			{
				id: users[0]?._id,
				sender: users[0],
				text: 'Hey there!',
				type: 'text',
				timestamp: new Date(Date.now() - 86400000 * 2),
				status: 'read',
			},
			{
				id: 2,
				sender: currentUser,
				text: 'Hi! How are you?',
				type: 'text',
				timestamp: new Date(Date.now() - 86400000),
				status: 'read',
			},
			{
				id: 3,
				sender: users[0],
				text: "I'm good, thanks for asking! How about you? I was thinking we could meet up this weekend if you're free.",
				type: 'text',
				timestamp: new Date(Date.now() - 3600000),
				status: 'delivered',
			},
			{
				id: 4,
				sender: currentUser,
				text: 'Great to hear! Yeah, weekend sounds good. What time works for you?',
				type: 'text',
				timestamp: new Date(),
				status: 'read',
			},
		],
		2: [
			{
				id: 1,
				sender: users[1],
				text: "Hi, don't forget our meeting at 3 PM tomorrow. We'll be discussing the quarterly reports.",
				type: 'text',
				timestamp: new Date(Date.now() - 7200000),
				status: 'read',
			},
			{
				id: 2,
				sender: currentUser,
				text: "Got it, I'll prepare the presentation slides and send them over tonight.",
				type: 'text',
				timestamp: new Date(Date.now() - 3600000),
				status: 'read',
			},
		],
		3: [
			{
				id: 1,
				sender: currentUser,
				text: "I've sent the files you requested. Let me know if you need anything else.",
				type: 'text',
				timestamp: new Date(Date.now() - 86400000 * 3),
				status: 'read',
			},
			{
				id: 2,
				sender: users[2],
				text: "Please send them again, I can't seem to find them in my email. Maybe there was an issue with the attachment?",
				type: 'text',
				timestamp: new Date(Date.now() - 43200000),
				status: 'delivered',
			},
			{
				id: 3,
				sender: currentUser,
				text: "Sure, I'll resend them now. Also, I've uploaded them to the shared drive just in case.",
				type: 'text',
				timestamp: new Date(Date.now() - 1800000),
				status: 'sent',
			},
		],
	}).current;

	// const filteredUsers = useMemo(() => {
	// 	return users.filter((user) =>
	// 		user.name.toLowerCase().includes(searchQuery.toLowerCase())
	// 	);
	// }, [users, searchQuery]);

	useEffect(() => {
		setMessages(allMessages[activeChat] || []);
	}, [activeChat]);

	useEffect(() => {
		return () => {
			if (timerRef.current) {
				clearInterval(timerRef.current);
			}
			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current);
			}
		};
	}, []);

	const handleSendMessage = useCallback(async () => {
		const inputText = inputMessage.trim();
		if (!inputText && !selectedFile && !activeChat) return;

		const formData = new FormData();

		formData.append('from', bussinessPhone ?? '654212707774447');
		formData.append('to', activeChat.phoneNumber);

		// Determine message type
		const isMedia = Boolean(selectedFile);
		const messageType = isMedia ? resolveMessageType(selectedFile) : 'text';
		formData.append('type', messageType);

		if (inputText && isMedia) {
			formData.append('caption', inputText);
		} else {
			formData.append('message', inputText);
		}

		if (isMedia) {
			formData.append('file', selectedFile.file);
		}

		setIsSending(true);
		try {
			const res = await createMessageAPI({
				path: '/whatsapp/messages',
				body: formData,
			}).unwrap();

			dispatch(
				appendMessage({
					chatId: activeChat.roomId,
					message: res?.data,
				})
			);

			// Optionally reset input + file
			setInputMessage('');
			setSelectedFile(null);
		} catch (err) {
			console.error(err);
			toast.error(err?.data?.message?.expired || 'Message could not be sent!');
		} finally {
			setIsSending(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [inputMessage, selectedFile, createMessageAPI, dispatch]);

	const handleFileUpload = useCallback((e, type = 'image') => {
		const file = e.target.files[0];
		if (file) {
			if (type === 'video' && file.size > 100 * 1024 * 1024) {
				toast.error('Video size should be less than 100MB');
				return;
			} else if (file.size > 25 * 1024 * 1024) {
				toast.error('File size should be less than 25MB');
				return;
			}

			setSelectedFile({
				url: URL.createObjectURL(file),
				name: file.name,
				type: file.type,
				size: file.size,
				file,
			});
			toast.info(
				`${type.charAt(0).toUpperCase() + type.slice(1)} selected, click send to share`
			);
		}
	}, []);

	const handleDownloadFile = (file) => {
		const a = document.createElement('a');
		a.href = file.url;
		a.download = file.name;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	};

	const cancelRecording = useCallback(() => {
		if (mediaRecorderRef.current && isRecording) {
			setIsRecordingCanceled(true);
			mediaRecorderRef.current.stop();
			mediaRecorderRef.current.stream
				.getTracks()
				.forEach((track) => track.stop());
			setIsRecording(false);
			setRecordingTime(0);
			setAudioLevel(0);
			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current);
			}
			chunksRef.current = [];
			toast.info('Recording cancelled');
		}
	}, [isRecording]);

	const stopRecording = useCallback(() => {
		if (mediaRecorderRef.current && isRecording) {
			setIsRecordingCanceled(false);
			mediaRecorderRef.current.stop();
			mediaRecorderRef.current.stream
				.getTracks()
				.forEach((track) => track.stop());
		}
	}, [isRecording]);

	const startRecording = useCallback(() => {
		setRecordingTime(0);
		setAudioLevel(0);
		chunksRef.current = [];
		setIsRecordingCanceled(false); // Reset cancel state
		navigator.mediaDevices
			.getUserMedia({ audio: true })
			.then((stream) => {
				setIsRecording(true);
				mediaRecorderRef.current = new MediaRecorder(stream);
				chunksRef.current = [];

				// Setup audio analyzer
				const audioContext = new (window.AudioContext ||
					window.webkitAudioContext)();
				analyserRef.current = audioContext.createAnalyser();
				analyserRef.current.fftSize = 32;
				const microphone = audioContext.createMediaStreamSource(stream);
				microphone.connect(analyserRef.current);
				const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);

				const analyzeAudio = () => {
					analyserRef.current.getByteFrequencyData(dataArray);
					let sum = 0;
					for (let i = 0; i < dataArray.length; i++) {
						sum += dataArray[i];
					}
					const average = sum / dataArray.length;
					setAudioLevel(Math.min(average / 50, 1));
					animationRef.current = requestAnimationFrame(analyzeAudio);
				};

				analyzeAudio();

				timerRef.current = setInterval(() => {
					setRecordingTime((prev) => prev + 1);
				}, 1000);

				mediaRecorderRef.current.ondataavailable = (e) => {
					chunksRef.current.push(e.data);
				};

				mediaRecorderRef.current.onstop = async () => {
					clearInterval(timerRef.current);
					if (animationRef.current) {
						cancelAnimationFrame(animationRef.current);
					}

					// Only process if we have chunks AND recording wasn't canceled
					if (chunksRef.current.length > 0 && !isRecordingCanceled) {
						try {
							const audioBlob = new Blob(chunksRef.current, {
								type: 'audio/webm',
							});
							const audioUrl = URL.createObjectURL(audioBlob);

							const audio = new Audio();
							audio.src = audioUrl;

							await new Promise((resolve) => {
								audio.onloadedmetadata = resolve;
								audio.onerror = () => {
									console.error('Failed to load audio metadata');
									resolve();
								};
							});

							const duration = Math.round(audio.duration || recordingTime);

							const newMessage = {
								id: Date.now(),
								sender: currentUser,
								audioUrl,
								type: 'voice',
								timestamp: new Date(),
								duration,
								status: 'sent',
							};

							const updatedMessages = [...messages, newMessage];
							setMessages(updatedMessages);
							allMessages[activeChat] = updatedMessages;
							toast.success('Voice message sent!');

							setTimeout(() => {
								const replyMessage = {
									id: Date.now() + 1,
									sender: users.find((u) => u.id === activeChat),
									text: 'Thanks for the voice message!',
									type: 'text',
									timestamp: new Date(),
									status: 'delivered',
								};
								const updatedWithReply = [...updatedMessages, replyMessage];
								setMessages(updatedWithReply);
								allMessages[activeChat] = updatedWithReply;

								setTimeout(() => {
									setMessages((prev) =>
										prev.map((msg) =>
											msg.id === newMessage.id
												? { ...msg, status: 'read' }
												: msg
										)
									);
									allMessages[activeChat] = allMessages[activeChat].map(
										(msg) =>
											msg.id === newMessage.id
												? { ...msg, status: 'read' }
												: msg
									);
								}, 1000);
							}, 2000);
						} catch (err) {
							console.error('Error processing voice message:', err);
							toast.error('Failed to send voice message');
						}
					}

					setIsRecording(false);
					setRecordingTime(0);
					setAudioLevel(0);
					setIsRecordingCanceled(false); // Reset for next recording
					chunksRef.current = []; // Clear chunks for next recording
				};

				mediaRecorderRef.current.start(100);
			})
			.catch((err) => {
				toast.error('Microphone access denied: ' + err.message);
				setIsRecording(false);
			});
	}, [messages, activeChat, recordingTime, isRecordingCanceled]);

	const getActiveUser = useCallback(() => {
		return users.find((user) => user.phoneNumber === activeChat) || users[0];
	}, [users, activeChat]);

	const onEmojiClick = (emojiData) => {
		setInputMessage((prev) => prev + emojiData.emoji);
	};

	const handleVoiceMessagePause = useCallback((messageId, isPaused) => {
		setPausedVoiceMessages((prev) => {
			const newSet = new Set(prev);
			if (isPaused) {
				newSet.add(messageId);
			} else {
				newSet.delete(messageId);
			}
			return newSet;
		});
	}, []);

	const sidebarBg = useColorModeValue(whatsappColors.sidebarBg, 'gray.800');

	// Group messages by date
	const groupedMessages = useMemo(() => {
		const groups = [];
		let currentDate = null;

		messages.forEach((message, index) => {
			const messageDate = formatDateHeader(message.timestamp);

			if (messageDate !== currentDate) {
				groups.push({
					type: 'date',
					date: messageDate,
					id: `date-${messageDate}-${index}`,
				});
				currentDate = messageDate;
			}

			groups.push({
				type: 'message',
				message,
				id: message.id,
			});
		});

		return groups;
	}, [messages]);

	// Generate waveform data based on current audio level
	const generateWaveformData = () => {
		const bars = [];
		const barCount = 16;
		const maxHeight = 24;

		for (let i = 0; i < barCount; i++) {
			const noise = Math.random() * 0.3;
			const positionFactor = Math.abs(i - barCount / 2) / (barCount / 2);
			const height = Math.max(
				3,
				audioLevel * maxHeight * (1 - positionFactor * 0.7) + noise * 6
			);

			bars.push(
				<Box
					key={i}
					w='2px'
					h={`${height}px`}
					bg={whatsappColors.primary}
					borderRadius='full'
					opacity={0.6 + Math.random() * 0.4}
					transition='height 0.1s ease'
				/>
			);
		}
		return bars;
	};

	return (
		<>
			<Flex
				h='80vh'
				overflow='hidden'
				position='relative'
				borderRadius='lg'
				boxShadow='lg'
			>
				{/* Mobile Drawer */}
				<Drawer
					isOpen={isOpen}
					placement='left'
					onClose={onClose}
					finalFocusRef={btnRef}
					h='80vh'
				>
					<DrawerOverlay />
					<DrawerContent maxW='320px' bg={sidebarBg}>
						<DrawerCloseButton />
						<DrawerHeader p={3} bg={sidebarBg}>
							<Flex align='center'>
								<UserAvatar
									src={currentUser?.user?.profileImage}
									name={currentUser?.user?.fullName}
									size='lg'
								/>
								<Text
									fontWeight='bold'
									isTruncated
									maxWidth='200px'
									color={whatsappColors.textDark}
								>
									{currentUser?.user?.fullName}
								</Text>
							</Flex>
						</DrawerHeader>
						<DrawerBody p={0}>
							<Box p={3} bg={sidebarBg}>
								<InputGroup>
									<InputLeftElement pointerEvents='none'>
										<FiSearch color='gray.300' />
									</InputLeftElement>
									<Input
										placeholder='Search contacts'
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										bg='white'
										borderRadius='lg'
										border='none'
										boxShadow='sm'
									/>
								</InputGroup>
							</Box>
							<Divider borderColor='gray.300' />
							<UserList
								users={users}
								activeChat={activeChat}
								setActiveChat={setActiveChat}
								isMobile={isMobile}
								onClose={onClose}
								sidebarBg={sidebarBg}
							/>
							<Flex
								p={3}
								justify='flex-end'
								position='sticky'
								bottom='0'
								bg={sidebarBg}
								borderTop='1px solid'
								borderColor='gray.200'
							>
								<Menu placement='top-end'>
									<MenuButton
										as={IconButton}
										icon={<BsThreeDotsVertical />}
										variant='ghost'
										color={whatsappColors.textSecondary}
										size='sm'
									/>
									<MenuList>
										<MenuItem
											icon={<FiUser />}
											onClick={() => setIsContactModalOpen(true)}
										>
											Manage Contacts
										</MenuItem>
									</MenuList>
								</Menu>
							</Flex>
						</DrawerBody>
					</DrawerContent>
				</Drawer>

				{/* Desktop Sidebar */}
				<Box
					w={{ base: '100%', md: '30%' }}
					bg={sidebarBg}
					borderRight='1px solid'
					borderColor='gray.200'
					display={{ base: 'none', md: 'block' }}
					h='100%'
					overflow='hidden'
					position='relative'
				>
					{/* Fixed Sidebar Header */}
					<Box
						position='sticky'
						top='0'
						zIndex='1'
						bg={sidebarBg}
						borderBottom='1px solid'
						borderColor='gray.300'
					>
						<Flex p={3} align='center' justify='space-between' bg={sidebarBg}>
							<Flex align='center' gap='2'>
								<UserAvatar
									src={currentUser?.user?.profileImage}
									name={currentUser?.user?.fullName}
									size='sm'
								/>
								<Text
									fontWeight='bold'
									isTruncated
									maxWidth='150px'
									color={whatsappColors.textDark}
								>
									{currentUser?.user?.fullName}
								</Text>
							</Flex>
							<Menu
								placement='top-end'
								display={{ base: 'none', sm: 'none', md: 'block' }}
							>
								<MenuButton
									as={IconButton}
									icon={<BsThreeDotsVertical />}
									variant='ghost'
									color={whatsappColors.textSecondary}
									size='sm'
								/>
								<MenuList>
									<MenuItem
										icon={<FiUser />}
										onClick={() => setIsContactModalOpen(true)}
									>
										Manage Contacts
									</MenuItem>
								</MenuList>
							</Menu>
						</Flex>

						{/* Fixed Search Box */}
						<Box p={3} bg={sidebarBg}>
							<InputGroup>
								<InputLeftElement pointerEvents='none'>
									<FiSearch color='gray.300' />
								</InputLeftElement>
								<Input
									placeholder='Search contacts'
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									bg='white'
									borderRadius='lg'
									border='none'
									boxShadow='sm'
								/>
							</InputGroup>
						</Box>
						<Divider borderColor='gray.300' />
					</Box>

					<UserList
						users={users}
						activeChat={activeChat}
						setActiveChat={setActiveChat}
						isMobile={isMobile}
						onClose={onClose}
						sidebarBg={sidebarBg}
						handleAddContact={() => setIsContactModalOpen(true)}
						bussinessPhone={bussinessPhone}
					/>
				</Box>

				{/* Chat Area */}
				<Box flex={1} display='flex' flexDirection='column' bg='white' h='100%'>
					{/* Chat Header */}
					{activeChat ? (
						<>
							<Flex
								bg={whatsappColors.chatHeaderBg}
								color={whatsappColors.textDark}
								p={3}
								alignItems='center'
								justifyContent='space-between'
								borderBottom='1px solid'
								borderColor='gray.200'
								position='sticky'
								top='0'
								zIndex='1'
							>
								<Flex alignItems='center'>
									<IconButton
										icon={<FiChevronLeft />}
										aria-label='Show sidebar'
										mr={2}
										onClick={isMobile ? onOpen : null}
										color={whatsappColors.textSecondary}
										background='transparent'
										display={{ base: 'flex', md: 'none' }}
									/>
									<Avatar src={''} size='sm' mr={3} />
									<Box>
										<Text fontWeight='bold'>
											{activeChat?.name === 'Unknown' || !activeChat?.name
												? activeChat?.phoneNumber
												: activeChat?.name}
										</Text>
										<Text fontSize='xs' color={whatsappColors.textSecondary}>
											{activeChat?.status}
										</Text>
									</Box>
								</Flex>
							</Flex>

							<ChatMessages
								to={activeChat?.phoneNumber}
								isSending={isSending}
								from={bussinessPhone}
								roomId={activeChat?.roomId || null}
							/>

							{/* Reply preview */}
							{replyingTo && (
								<Flex
									bg={whatsappColors.replyBg}
									p={2}
									align='center'
									justify='space-between'
									borderBottom='1px solid'
									borderColor='gray.200'
								>
									<Box flex={1}>
										<Text fontSize='sm' color={whatsappColors.primary}>
											Replying to {replyingTo.sender.name}
										</Text>
										<Text fontSize='sm' isTruncated>
											{replyingTo.text || 'Media message'}
										</Text>
									</Box>
									<IconButton
										icon={<IoMdClose />}
										aria-label='Cancel reply'
										size='sm'
										variant='ghost'
										onClick={() => setReplyingTo(null)}
									/>
								</Flex>
							)}

							{/* Input area */}
							<Box
								bg={whatsappColors.inputBg}
								p={3}
								boxShadow='md'
								borderTop='1px solid'
								borderColor='gray.200'
							>
								{/* {selectedFile && (
							<Flex
								bg='white'
								p={2}
								mb={2}
								borderRadius='md'
								justify='space-between'
								align='center'
							>
								<Text fontSize='sm' isTruncated flex={1}>
									{selectedFile.type.split('/')[0].charAt(0).toUpperCase() +
										selectedFile.type.split('/')[0].slice(1)}{' '}
									ready to send
								</Text>
								<Button size='sm' onClick={() => setSelectedFile(null)}>
									Cancel
								</Button>
							</Flex>
						)} */}
								{isRecording && (
									<Flex
										bg='white'
										p={2}
										mb={2}
										borderRadius='lg'
										justify='space-between'
										align='center'
										w='100%'
										boxShadow='md'
									>
										<HStack spacing={2} flex={1} overflow='hidden'>
											<Box
												w='10px'
												h='10px'
												bg={whatsappColors.recordingDot}
												borderRadius='full'
												animation='pulse 1s infinite'
												flexShrink={0}
											/>
											<HStack
												spacing={1}
												flex={1}
												justify='center'
												h='24px'
												align='center'
												overflow='hidden'
												px={1}
											>
												{generateWaveformData()}
											</HStack>
											<Text
												fontSize='sm'
												fontWeight='bold'
												minW='40px'
												textAlign='right'
												flexShrink={0}
											>
												{formatTime(recordingTime)}
											</Text>
										</HStack>
										<HStack ml={2} spacing={1}>
											<IconButton
												icon={<IoMdClose />}
												aria-label='Cancel recording'
												size='sm'
												onClick={cancelRecording}
												color={whatsappColors.textSecondary}
												variant='ghost'
											/>
											<IconButton
												icon={<RiSendPlaneFill />}
												aria-label='Send recording'
												size='sm'
												bg={whatsappColors.primary}
												color='white'
												_hover={{ bg: whatsappColors.secondary }}
												onClick={stopRecording}
											/>
										</HStack>
									</Flex>
								)}
								<Flex align='center'>
									<input
										type='file'
										accept='image/*'
										ref={fileInputRef}
										onChange={(e) => handleFileUpload(e, 'image')}
										style={{ display: 'none' }}
									/>
									<input
										type='file'
										accept='audio/*'
										ref={audioInputRef}
										onChange={(e) => handleFileUpload(e, 'audio')}
										style={{ display: 'none' }}
									/>
									<input
										type='file'
										accept='video/*'
										ref={videoInputRef}
										onChange={(e) => handleFileUpload(e, 'video')}
										style={{ display: 'none' }}
									/>
									<input
										type='file'
										ref={docInputRef}
										onChange={(e) => handleFileUpload(e, 'document')}
										style={{ display: 'none' }}
									/>

									{/* Attachment menu */}
									<Popover placement='top-start'>
										<PopoverTrigger>
											<IconButton
												icon={<BsThreeDotsVertical />}
												aria-label='Attach file'
												mr={2}
												color={whatsappColors.textSecondary}
												variant='ghost'
											/>
										</PopoverTrigger>
										<PopoverContent w='auto'>
											<PopoverArrow />
											<PopoverBody p={1}>
												<VStack spacing={1} align='stretch'>
													<Button
														leftIcon={<FiImage />}
														size='sm'
														variant='ghost'
														justifyContent='flex-start'
														onClick={() => fileInputRef.current.click()}
													>
														Image
													</Button>
													<Button
														leftIcon={<FiVideo />}
														size='sm'
														variant='ghost'
														justifyContent='flex-start'
														onClick={() => videoInputRef.current.click()}
													>
														Video
													</Button>
													<Button
														leftIcon={<FiMusic />}
														size='sm'
														variant='ghost'
														justifyContent='flex-start'
														onClick={() => audioInputRef.current.click()}
													>
														Audio
													</Button>
													<Button
														leftIcon={<FiFile />}
														size='sm'
														variant='ghost'
														justifyContent='flex-start'
														onClick={() => docInputRef.current.click()}
													>
														Document
													</Button>
												</VStack>
											</PopoverBody>
										</PopoverContent>
									</Popover>

									{/* Emoji picker */}
									<Popover
										isOpen={showEmojiPicker}
										onClose={() => setShowEmojiPicker(false)}
										placement='top-start'
									>
										<PopoverTrigger>
											<IconButton
												icon={<FaSmile />}
												aria-label='Select emoji'
												mr={2}
												onClick={() => setShowEmojiPicker(!showEmojiPicker)}
												color={whatsappColors.textSecondary}
												variant='ghost'
											/>
										</PopoverTrigger>
										<PopoverContent w='auto'>
											<PopoverArrow />
											<PopoverBody p={0}>
												<EmojiPicker
													width={300}
													height={350}
													onEmojiClick={onEmojiClick}
													previewConfig={{ showPreview: false }}
												/>
											</PopoverBody>
										</PopoverContent>
									</Popover>

									{/* <Input
								flex={1}
								bg='gray.200'
								value={inputMessage}
								onChange={(e) => setInputMessage(e.target.value)}
								onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
								borderRadius='full'
								border='none'
								boxShadow='sm'
								_focus={{ boxShadow: 'md' }}
							/> */}

									<Textarea
										flex={1}
										bg='gray.200'
										placeholder='Type a message...'
										value={!selectedFile ? inputMessage : ''}
										onChange={(e) => setInputMessage(e.target.value)}
										onKeyDown={(e) => {
											if (e.key === 'Enter' && !e.shiftKey) {
												e.preventDefault();
												handleSendMessage();
											}
										}}
										resize='none'
										border='none'
										rows={1}
										maxH='200px'
										overflowY='auto'
										scrollBehavior='smooth'
										_focus={{ boxShadow: 'md' }}
									/>

									{isRecording ? (
										<IconButton
											icon={<IoMdMic />}
											aria-label='Stop recording'
											colorScheme='red'
											ml={2}
											onClick={stopRecording}
										/>
									) : (
										<>
											{inputMessage || selectedFile ? (
												<IconButton
													icon={<RiSendPlaneFill />}
													aria-label='Send message'
													colorScheme='whatsapp'
													ml={2}
													onClick={handleSendMessage}
													disabled={
														(!inputMessage.trim() && !selectedFile) || isSending
													}
												/>
											) : (
												<Tooltip label='Record voice message'>
													<IconButton
														icon={<FiMic />}
														aria-label='Record voice message'
														ml={2}
														onClick={startRecording}
														color={whatsappColors.textSecondary}
														variant='ghost'
													/>
												</Tooltip>
											)}
										</>
									)}
								</Flex>
							</Box>
						</>
					) : (
						<Box
							bg='white'
							color='white'
							w='full'
							h='100vh'
							display='flex'
							alignItems='center'
							justifyContent='center'
							px={4}
						>
							<VStack spacing={4} align='center' textAlign='center'>
								<Icon as={FaWhatsapp} boxSize={12} color='gray.500' />

								<Text fontSize='xl' color='gray.400' fontWeight='semibold'>
									WhatsApp for CRM
								</Text>

								<Text fontSize='sm' color='gray.400' maxW='sm'>
									Send and receive customer messages directly from WEEAM CRM.
								</Text>
							</VStack>
						</Box>
					)}
				</Box>
			</Flex>

			{/* Contact management modal */}
			<ContactModal
				isOpen={isContactModalOpen}
				onClose={() => setIsContactModalOpen(false)}
				contacts={users}
			/>

			{/* File preview modal */}
			<Modal
				isOpen={!!selectedFile}
				onClose={() => setSelectedFile(null)}
				size={
					selectedFile?.type.includes('image') ||
					selectedFile?.type.includes('video')
						? '2xl'
						: 'md'
				}
				isCentered
			>
				<ModalOverlay />
				<ModalContent m='4' w='400px' minWidth='fit-content'>
					<ModalHeader>Preview</ModalHeader>
					{/* <ModalCloseButton /> */}
					<ModalBody>
						{/* <Text
							fontSize='sm'
							fontWeight='bold'
							mb={2}
							maxW='100%'
							isTruncated
							textAlign='center'
						>
							{selectedFile?.name}
						</Text> */}
						{selectedFile?.type.includes('image') ? (
							<>
								<Image
									src={selectedFile.url}
									alt='preview'
									w='100%' // full width
									h='auto' // height auto based on image ratio
									maxH='500px' // limit height
									objectFit='contain' // preserve aspect ratio
									borderRadius='md' // optional: rounded corners
								/>
							</>
						) : selectedFile?.type.includes('video') ? (
							<>
								<video
									controls
									style={{
										width: '100%',
										maxHeight: '400px',
										objectFit: 'contain',
									}}
								>
									<source src={selectedFile.url} type={selectedFile.type} />
									Your browser does not support the video tag.
								</video>
							</>
						) : selectedFile?.type.includes('audio') ? (
							<>
								<audio controls style={{ width: '100%' }}>
									<source src={selectedFile.url} type={selectedFile.type} />
									Your browser does not support the audio element.
								</audio>
							</>
						) : (
							<FileMessage
								file={selectedFile}
								isSelf={true}
								onDownload={() => handleDownloadFile(selectedFile)}
							/>
						)}

						<Textarea
							flex={1}
							bg='gray.200'
							placeholder='Caption (optional)'
							value={inputMessage}
							onChange={(e) => setInputMessage(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === 'Enter' && !e.shiftKey) {
									e.preventDefault();
									handleSendMessage();
								}
							}}
							resize='none'
							border='none'
							rows={1}
							maxH='120px'
							overflowY='auto'
							scrollBehavior='smooth'
							_focus={{ boxShadow: 'md' }}
						/>
					</ModalBody>
					<ModalFooter>
						<Button
							rounded='md'
							px='6'
							variant='ghost'
							onClick={() => setSelectedFile(null)}
						>
							Cancel
						</Button>
						<Button
							rounded='md'
							px='6'
							colorScheme='whatsapp'
							onClick={() => {
								handleSendMessage();
								setSelectedFile(null);
							}}
						>
							Send
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>

			{/* Image preview modal */}
			<Modal
				isOpen={!!selectedImage}
				isCentered
				onClose={() => setSelectedImage(null)}
			>
				<ModalOverlay />
				<ModalContent
					maxW={{ base: '90vw', md: '70vw' }}
					maxH='90vh'
					marginX={{ base: 2, md: 4 }}
				>
					{/* <ModalCloseButton bg='rgba(0,0,0,0.5)' color='white' /> */}
					<ModalBody
						p={0}
						display='flex'
						justifyContent='center'
						alignItems='center'
					>
						<img
							src={selectedImage}
							alt='preview'
							style={{
								maxWidth: '100%',
								maxHeight: '80vh',
								objectFit: 'contain',
							}}
						/>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
};

export default Whatsapp;
