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
	VStack,
	HStack,
	useColorModeValue,
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
	FiMessageSquare,
	FiMessageCircle,
} from 'react-icons/fi';
import { IoMdMic, IoMdClose } from 'react-icons/io';
import {
	FaCheck,
	FaCheckDouble,
	FaInfo,
	FaSmile,
	FaWhatsapp,
} from 'react-icons/fa';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { RiSendPlaneFill } from 'react-icons/ri';
import { toast } from 'react-toastify';
import EmojiPicker from 'emoji-picker-react';
import Recorder from 'opus-recorder';

import FileMessage from './components/FileMessage';
import UserList from './components/UserList';

import { formatTime, formatDateHeader, whatsappColors } from 'utils/helpers.js';
import { useUpdateItemMutation, useCreateItemMutation } from 'api/apiSlice';
import ChatMessages from './components/ChatMessages';
import { useDispatch, useSelector } from 'react-redux';
import { appendMessage } from '../../../redux/whatsappSlice';

import { resolveMessageType } from './components/helpers';

import { useSocketEvents } from 'hooks/useSocketEvents';
import UserAvatar from 'components/shared/UserAvatar';
import WhatsappTemplates from './components/modals/WhatsappTemplates';
import useIsMobile from './components/useIsMobile';
import MenuOptions from './components/MenuOptions';

const user = JSON.parse(localStorage.getItem('user'));
const isSuperAdmin = user?.role === 'superAdmin';

const Whatsapp = () => {
	const users = useSelector((state) => state.whatsapp.contacts || []);
	const currentUser = useSelector((state) => state.whatsapp.currentUser || {});
	const activeChat = useSelector((state) => state.whatsapp.activeChat || null);
	const contacts = useSelector((state) => state.whatsapp.contacts || []);

	const {
		isOpen: isWATemplateOpen,
		onOpen: onWATemplateOpen,
		onClose: onWATemplateClose,
	} = useDisclosure();

	const [inputMessage, setInputMessage] = useState('');
	const [selectedFile, setSelectedFile] = useState(null);
	const [isRecording, setIsRecording] = useState(false);
	const [isSending, setIsSending] = useState(false);
	// const [activeChat, setActiveChat] = useState(null);
	const [recordingTime, setRecordingTime] = useState(0);
	const [searchQuery, setSearchQuery] = useState('');
	const [audioLevel, setAudioLevel] = useState(0);
	const [replyingTo, setReplyingTo] = useState(null);
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	const [pausedVoiceMessages, setPausedVoiceMessages] = useState(new Set());
	const [isContactModalOpen, setIsContactModalOpen] = useState(false);
	const [selectedImage, setSelectedImage] = useState(null);
	const [isRecordingCanceled, setIsRecordingCanceled] = useState(false);
	const [businessPhone, setBusinessPhone] = useState('');

	// const [voiceFile, setVoiceFile] = useState(null);

	const voiceFileRef = useRef(null);
	const audioBlobRef = useRef(null);
	const voiceDurationRef = useRef(0);
	// const recordingDataPromiseRef = useRef(null);
	const recordingDataPromiseRef = useRef(null);

	const mediaRecorderRef = useRef(null);
	const chunksRef = useRef([]);
	const fileInputRef = useRef(null);
	const audioInputRef = useRef(null);
	const videoInputRef = useRef(null);
	const docInputRef = useRef(null);
	const timerRef = useRef(null);
	const analyserRef = useRef(null);
	const animationRef = useRef(null);
	const streamRef = useRef(null);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const btnRef = useRef();

	const { registerUser, isConnected } = useSocketEvents();

	const filteredContacts = useMemo(() => {
		if (!searchQuery.trim()) return contacts;

		const query = searchQuery.trim().toLowerCase();

		return contacts.filter(({ name = '', phoneNumber = '' }) => {
			const combined = `${name} ${phoneNumber}`.toLowerCase();
			return combined.includes(query);
		});
	}, [contacts, searchQuery]);

	useEffect(() => {
		if (currentUser?.phoneNumber && isConnected) {
			setBusinessPhone(currentUser?.phoneNumber);
			const registerPayload = {
				phoneNumber: currentUser?.phoneNumber,
				userId: currentUser?.user?._id || '',
			};

			registerUser(registerPayload);
		}
	}, [currentUser, registerUser, isConnected]);

	const dispatch = useDispatch();

	// const isMobile = useBreakpointValue({ base: true, md: false });
	const isMobile = useIsMobile();

	const [createMessageAPI, { isLoading: sendingMessage }] =
		useCreateItemMutation();

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

	const handleSendMessage = useCallback(
		async (values) => {
			const formData = new FormData();

			if (values?.type === 'template') {
				formData.append('templateName', values.templateName);
				formData.append('languageCode', values.languageCode);
				formData.append('message', values.message);
				formData.append('type', values.type);
				formData.append('palceholder', values.palceholder);
			} else {
				let voiceFile = null;
				if (voiceFileRef.current && voiceFileRef.current.size) {
					voiceFile = voiceFileRef.current;
				}

				// Determine message type
				const isMedia = Boolean(selectedFile);
				const messageType = voiceFile
					? 'audio'
					: isMedia
						? resolveMessageType(selectedFile)
						: 'text';

				const inputText = inputMessage.trim();

				if (!activeChat?.phoneNumber) {
					return toast.error('Something is wrong, Refresh & try again.');
				} else if (messageType === 'text' && !inputText) {
					return toast.error('Please write something to send the message');
				}

				formData.append('type', messageType);

				if (inputText && isMedia && messageType !== 'audio') {
					formData.append('caption', inputText);
				} else if (messageType === 'text') {
					formData.append('message', inputText);
				}

				if (isMedia || voiceFile) {
					const file = voiceFile ?? selectedFile.file;
					formData.append('file', file);
				}
			}

			// important fields
			formData.append('from', businessPhone);
			formData.append('to', activeChat?.phoneNumber);

			setInputMessage('');
			// if (isSending) return;

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
				if (values?.type === 'template') {
					onWATemplateClose();
				}
			} catch (err) {
				if (err.status === 403 && err?.data.message.includes('session')) {
					// open template modal if session expired
					onWATemplateOpen();
				}
				console.error(err);
				toast.error(err?.data?.message || 'Message could not be sent!');
			} finally {
				setIsSending(false);
				// setVoiceFile(null);
				setSelectedFile(null);
				voiceFileRef.current = null;
				audioBlobRef.current = null;
				voiceDurationRef.current = 0;
				recordingDataPromiseRef.current = null;
			}
			// eslint-disable-next-line react-hooks/exhaustive-deps
		},
		[inputMessage, activeChat, selectedFile, createMessageAPI, dispatch]
	);

	const handleFileUpload = useCallback(async (e, type = 'image') => {
		const file = e.target.files[0];
		if (file) {
			if (['video', 'audio'].includes(type) && file.size > 16 * 1024 * 1024) {
				toast.error('Video size should be less than 16MB');
				e.target.value = null;
				return;
			} else if (type === 'image' && file.size > 5 * 1024 * 1024) {
				toast.error('File size should be less than 5MB');
				e.target.value = null;
				return;
			} else if (type === 'document' && file.size > 100 * 1024 * 1024) {
				toast.error('File size should be less than 100MB');
				e.target.value = null;
				return;
			}

			setSelectedFile({
				url: URL.createObjectURL(file),
				name: file.name,
				type: file.type,
				size: file.size,
				file,
			});
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

	// const cancelRecording = useCallback(() => {
	// 	if (mediaRecorderRef.current && isRecording) {
	// 		setIsRecordingCanceled(true);
	// 		mediaRecorderRef.current.stop();
	// 		mediaRecorderRef.current.stream
	// 			.getTracks()
	// 			.forEach((track) => track.stop());
	// 		setIsRecording(false);
	// 		setRecordingTime(0);
	// 		setAudioLevel(0);
	// 		if (animationRef.current) {
	// 			cancelAnimationFrame(animationRef.current);
	// 		}
	// 		chunksRef.current = [];
	// 		toast.info('Recording cancelled');
	// 	}
	// }, [isRecording]);

	// const startRecording = useCallback(() => {
	// 	setRecordingTime(0);
	// 	setAudioLevel(0);
	// 	setIsRecordingCanceled(false);

	// 	console.log('recording started', recordingTime);

	// 	navigator.mediaDevices
	// 		.getUserMedia({ audio: true })
	// 		.then((stream) => {
	// 			setIsRecording(true);

	// 			const recorder = new Recorder({
	// 				encoderPath: '/workers/encoderWorker.min.js',
	// 				encoderSampleRate: 16000,
	// 				outputContainer: 'ogg',
	// 				encoderBitRate: 16000,
	// 				numberOfChannels: 1,
	// 				resampleQuality: 3,
	// 			});

	// 			recorder.ondataavailable = (typedArray) => {
	// 				const audioBlob = new Blob([typedArray], {
	// 					type: 'audio/ogg; codecs=opus',
	// 				});
	// 				const file = new File([audioBlob], 'recording.ogg', {
	// 					type: 'audio/ogg; codecs=opus',
	// 				});

	// 				// setVoiceFile(file);
	// 				voiceFileRef.current = file;
	// 				audioBlobRef.current = audioBlob;

	// 				// Resolve the promise
	// 				if (recordingDataPromiseRef.current) {
	// 					recordingDataPromiseRef.current.resolve();
	// 				}
	// 			};

	// 			recorder.onstop = () => {
	// 				clearInterval(timerRef.current);
	// 				if (animationRef.current) {
	// 					cancelAnimationFrame(animationRef.current);
	// 				}
	// 				setIsRecording(false);
	// 				setRecordingTime(0);
	// 				setAudioLevel(0);
	// 			};

	// 			const audioContext = new (window.AudioContext ||
	// 				window.webkitAudioContext)();
	// 			analyserRef.current = audioContext.createAnalyser();
	// 			analyserRef.current.fftSize = 32;
	// 			const microphone = audioContext.createMediaStreamSource(stream);
	// 			microphone.connect(analyserRef.current);
	// 			const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);

	// 			const analyzeAudio = () => {
	// 				analyserRef.current.getByteFrequencyData(dataArray);
	// 				let sum = 0;
	// 				for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
	// 				const average = sum / dataArray.length;
	// 				setAudioLevel(Math.min(average / 50, 1));
	// 				animationRef.current = requestAnimationFrame(analyzeAudio);
	// 			};
	// 			analyzeAudio();

	// 			timerRef.current = setInterval(() => {
	// 				console.log('updated timer-------------');
	// 				setRecordingTime((prev) => prev + 1);
	// 			}, 1000);

	// 			recordingDataPromiseRef.current = {};
	// 			recordingDataPromiseRef.current.promise = new Promise((resolve) => {
	// 				recordingDataPromiseRef.current.resolve = resolve;
	// 			});

	// 			recorder.start().catch((err) => {
	// 				toast.error('Failed to start recording: ' + err.message);
	// 				setIsRecording(false);
	// 			});

	// 			mediaRecorderRef.current = recorder;
	// 			streamRef.current = stream;
	// 		})
	// 		.catch((err) => {
	// 			toast.error('Microphone access denied: ' + err.message);
	// 			setIsRecording(false);
	// 			voiceFileRef.current = null;
	// 			audioBlobRef.current = null;
	// 		});
	// }, []);

	const startRecording = useCallback(() => {
		setRecordingTime(0);
		setAudioLevel(0);
		setIsRecordingCanceled(false);

		// Clear any existing resources first
		if (mediaRecorderRef.current) {
			mediaRecorderRef.current.stop();
		}
		if (streamRef.current) {
			streamRef.current.getTracks().forEach((track) => track.stop());
		}
		clearInterval(timerRef.current);
		if (animationRef.current) {
			cancelAnimationFrame(animationRef.current);
		}

		navigator.mediaDevices
			.getUserMedia({ audio: true })
			.then((stream) => {
				setIsRecording(true);
				streamRef.current = stream;

				const recorder = new Recorder({
					encoderPath: '/workers/encoderWorker.min.js',
					encoderSampleRate: 16000,
					outputContainer: 'ogg',
					encoderBitRate: 16000,
					numberOfChannels: 1,
					resampleQuality: 3,
				});

				// Cleanup function for this recording session
				const cleanup = () => {
					clearInterval(timerRef.current);
					if (animationRef.current) {
						cancelAnimationFrame(animationRef.current);
						animationRef.current = null;
					}
					if (streamRef.current) {
						streamRef.current.getTracks().forEach((track) => track.stop());
						streamRef.current = null;
					}
					setIsRecording(false);
					setRecordingTime(0);
					setAudioLevel(0);
				};

				recorder.ondataavailable = (typedArray) => {
					const audioBlob = new Blob([typedArray], {
						type: 'audio/ogg; codecs=opus',
					});
					const file = new File([audioBlob], 'recording.ogg', {
						type: 'audio/ogg; codecs=opus',
					});

					voiceFileRef.current = file;
					audioBlobRef.current = audioBlob;

					if (recordingDataPromiseRef.current) {
						recordingDataPromiseRef.current.resolve();
					}
				};

				recorder.onstop = () => {
					cleanup();
				};

				recorder.onerror = (error) => {
					console.error('Recorder error:', error);
					cleanup();
					toast.error('Recording error occurred');
				};

				const audioContext = new (window.AudioContext ||
					window.webkitAudioContext)();
				analyserRef.current = audioContext.createAnalyser();
				analyserRef.current.fftSize = 32;
				const microphone = audioContext.createMediaStreamSource(stream);
				microphone.connect(analyserRef.current);
				const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);

				const analyzeAudio = () => {
					if (!analyserRef.current) return;
					analyserRef.current.getByteFrequencyData(dataArray);
					let sum = 0;
					for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
					const average = sum / dataArray.length;
					setAudioLevel(Math.min(average / 50, 1));
					animationRef.current = requestAnimationFrame(analyzeAudio);
				};
				animationRef.current = requestAnimationFrame(analyzeAudio);

				timerRef.current = setInterval(() => {
					setRecordingTime((prev) => prev + 1);
				}, 1000);

				recordingDataPromiseRef.current = {};
				recordingDataPromiseRef.current.promise = new Promise((resolve) => {
					recordingDataPromiseRef.current.resolve = resolve;
				});

				// recordingDataPromiseRef.current = {
				// 	promise: new Promise((resolve) => {
				// 		recordingDataPromiseRef.current.resolve = resolve;
				// 	}),
				// };

				recorder.start().catch((err) => {
					cleanup();
					toast.error('Failed to start recording: ' + err.message);
				});

				mediaRecorderRef.current = recorder;
			})
			.catch((err) => {
				toast.error('Microphone access denied: ' + err.message);
				setIsRecording(false);
				voiceFileRef.current = null;
				audioBlobRef.current = null;
			});
	}, []);

	const getAudioDuration = async (blob) => {
		try {
			const audioContext = new (window.AudioContext ||
				window.webkitAudioContext)();
			const buffer = await blob.arrayBuffer();
			const decoded = await audioContext.decodeAudioData(buffer);
			return Math.round(decoded.duration);
		} catch (err) {
			console.error('Failed to decode audio duration', err);
			return 0;
		}
	};

	const sendRecording = useCallback(async () => {
		if (mediaRecorderRef.current && isRecording) {
			setIsRecordingCanceled(false);

			mediaRecorderRef.current.stop().catch((err) => {
				console.error('Error stopping recorder:', err);
				toast.error('Failed to stop recording');
			});

			if (streamRef.current) {
				streamRef.current.getTracks().forEach((track) => track.stop());
				streamRef.current = null;
			}

			//  Wait for ondataavailable to populate file/blob
			if (recordingDataPromiseRef.current?.promise) {
				await recordingDataPromiseRef.current.promise;
			}

			const file = voiceFileRef.current;
			const blob = audioBlobRef.current;
			if (!file || !blob) {
				toast.error('No voice recording found');
				return;
			}

			const duration = await getAudioDuration(blob);
			voiceDurationRef.current = duration;

			if (!file || duration <= 0) {
				toast.error('Invalid or empty voice message');
				return;
			}

			handleSendMessage(); // or upload logic
		}
	}, [handleSendMessage, isRecording]);

	const cancelRecording = useCallback(() => {
		if (mediaRecorderRef.current && isRecording) {
			setIsRecordingCanceled(true);

			mediaRecorderRef.current.stop().catch((err) => {
				console.error('Error stopping recorder:', err);
				toast.error('Failed to cancel recording');
			});

			// Stop and release audio stream
			if (streamRef.current) {
				streamRef.current.getTracks().forEach((track) => track.stop());
				streamRef.current = null;
			}

			// Cancel audio level animation
			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current);
				animationRef.current = null;
			}

			// Clear timers, states, and refs
			clearInterval(timerRef.current);
			setIsRecording(false);
			setRecordingTime(0);
			setAudioLevel(0);
			voiceFileRef.current = null;
			voiceDurationRef.current = 0;
			audioBlobRef.current = null;
			recordingDataPromiseRef.current = null;

			toast.info('Recording cancelled');
		}
	}, [isRecording]);

	// const startRecording = useCallback(() => {
	// 	setRecordingTime(0);
	// 	setAudioLevel(0);
	// 	setIsRecordingCanceled(false);
	// 	navigator.mediaDevices
	// 		.getUserMedia({ audio: true })
	// 		.then((stream) => {
	// 			setIsRecording(true);

	// 			const recorder = new Recorder({
	// 				encoderPath: '/workers/encoderWorker.min.js', // Include the worker file
	// 				encoderSampleRate: 16000, // Matches WhatsApp's minimum 16kbps bitrate
	// 				outputContainer: 'ogg', // Ensure OGG container
	// 				encoderBitRate: 16000, // Set bitrate to 16kbps or higher
	// 				numberOfChannels: 1, // Mono for WhatsApp voice messages
	// 				resampleQuality: 3, // Default, adjust if needed
	// 			});

	// 			recorder.ondataavailable = (typedArray) => {
	// 				const audioBlob = new Blob([typedArray], {
	// 					type: 'audio/ogg; codecs=opus',
	// 				});
	// 				const file = new File([audioBlob], 'recording.ogg', {
	// 					type: 'audio/ogg; codecs=opus',
	// 				});
	// 				setVoiceFile(file);

	// 				const audioUrl = URL.createObjectURL(audioBlob);
	// 				const audio = new Audio(audioUrl);
	// 				audio.onloadedmetadata = () => {
	// 					const duration = Math.round(audio.duration || recordingTime);

	// 					if (file.size > 16 * 1024 * 1024) {
	// 						toast.error('Voice message exceeds 16MB limit');
	// 						return;
	// 					}

	// 					if (file && duration > 0) {
	// 						console.log('Voice message ready:', file, duration);
	// 						handleSendMessage();
	// 					}
	// 				};
	// 			};

	// 			recorder.onstop = () => {
	// 				clearInterval(timerRef.current);
	// 				if (animationRef.current) {
	// 					cancelAnimationFrame(animationRef.current);
	// 				}
	// 				setIsRecording(false);
	// 				setRecordingTime(0);
	// 				setAudioLevel(0);
	// 				setIsRecordingCanceled(false);
	// 			};

	// 			// Audio analyzer setup (unchanged)
	// 			const audioContext = new (window.AudioContext ||
	// 				window.webkitAudioContext)();
	// 			analyserRef.current = audioContext.createAnalyser();
	// 			analyserRef.current.fftSize = 32;
	// 			const microphone = audioContext.createMediaStreamSource(stream);
	// 			microphone.connect(analyserRef.current);
	// 			const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);

	// 			const analyzeAudio = () => {
	// 				analyserRef.current.getByteFrequencyData(dataArray);
	// 				let sum = 0;
	// 				for (let i = 0; i < dataArray.length; i++) {
	// 					sum += dataArray[i];
	// 				}
	// 				const average = sum / dataArray.length;
	// 				setAudioLevel(Math.min(average / 50, 1));
	// 				animationRef.current = requestAnimationFrame(analyzeAudio);
	// 			};
	// 			analyzeAudio();

	// 			timerRef.current = setInterval(() => {
	// 				setRecordingTime((prev) => prev + 1);
	// 			}, 1000);

	// 			recorder.start().catch((err) => {
	// 				toast.error('Failed to start recording: ' + err.message);
	// 				setIsRecording(false);
	// 			});

	// 			// Store recorder reference to stop it later
	// 			mediaRecorderRef.current = recorder;
	// 		})
	// 		.catch((err) => {
	// 			toast.error('Microphone access denied: ' + err.message);
	// 			setIsRecording(false);
	// 		});
	// }, [recordingTime]);

	// const startRecording = useCallback(() => {
	// 	setRecordingTime(0);
	// 	setAudioLevel(0);
	// 	chunksRef.current = [];
	// 	setIsRecordingCanceled(false);
	// 	navigator.mediaDevices
	// 		.getUserMedia({ audio: true })
	// 		.then((stream) => {
	// 			setIsRecording(true);
	// 			mediaRecorderRef.current = new MediaRecorder(stream);
	// 			chunksRef.current = [];

	// 			// Setup audio analyzer
	// 			const audioContext = new (window.AudioContext ||
	// 				window.webkitAudioContext)();
	// 			analyserRef.current = audioContext.createAnalyser();
	// 			analyserRef.current.fftSize = 32;
	// 			const microphone = audioContext.createMediaStreamSource(stream);
	// 			microphone.connect(analyserRef.current);
	// 			const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);

	// 			const analyzeAudio = () => {
	// 				analyserRef.current.getByteFrequencyData(dataArray);
	// 				let sum = 0;
	// 				for (let i = 0; i < dataArray.length; i++) {
	// 					sum += dataArray[i];
	// 				}
	// 				const average = sum / dataArray.length;
	// 				setAudioLevel(Math.min(average / 50, 1));
	// 				animationRef.current = requestAnimationFrame(analyzeAudio);
	// 			};

	// 			analyzeAudio();

	// 			timerRef.current = setInterval(() => {
	// 				setRecordingTime((prev) => prev + 1);
	// 			}, 1000);

	// 			mediaRecorderRef.current.ondataavailable = (e) => {
	// 				chunksRef.current.push(e.data);
	// 			};

	// 			mediaRecorderRef.current.onstop = async () => {
	// 				clearInterval(timerRef.current);
	// 				if (animationRef.current) {
	// 					cancelAnimationFrame(animationRef.current);
	// 				}

	// 				// Only process if we have chunks AND recording wasn't canceled
	// 				if (chunksRef.current.length > 0 && !isRecordingCanceled) {
	// 					try {
	// 						const audioBlob = new Blob(chunksRef.current, {
	// 							type: 'audio/ogg; codecs=opus',
	// 						});

	// 						const file = new File([audioBlob], 'recording.ogg', {
	// 							type: 'audio/ogg; codecs=opus',
	// 						});

	// 						setVoiceFile(file);

	// 						const audioUrl = URL.createObjectURL(audioBlob);

	// 						const audio = new Audio();
	// 						audio.src = audioUrl;

	// 						await new Promise((resolve) => {
	// 							audio.onloadedmetadata = resolve;
	// 							audio.onerror = () => {
	// 								console.error('Failed to load audio metadata');
	// 								resolve();
	// 							};
	// 						});
	// 						const duration = Math.round(audio.duration || recordingTime);

	// 						console.log('Audio duration:', duration);

	// 						if (voiceFile && duration > 0) {
	// 							// send message
	// 							handleSendMessage();
	// 						}

	// 						// const newMessage = {
	// 						// 	id: Date.now(),
	// 						// 	sender: currentUser,
	// 						// 	audioUrl,
	// 						// 	type: 'voice',
	// 						// 	timestamp: new Date(),
	// 						// 	duration,
	// 						// 	status: 'sent',
	// 						// };

	// 						// const updatedMessages = [...messages, newMessage];
	// 						// setMessages(updatedMessages);
	// 						// allMessages[activeChat] = updatedMessages;

	// 						// setTimeout(() => {
	// 						// 	const replyMessage = {
	// 						// 		id: Date.now() + 1,
	// 						// 		sender: users.find((u) => u.id === activeChat),
	// 						// 		text: 'Thanks for the voice message!',
	// 						// 		type: 'text',
	// 						// 		timestamp: new Date(),
	// 						// 		status: 'delivered',
	// 						// 	};
	// 						// 	const updatedWithReply = [...updatedMessages, replyMessage];
	// 						// 	setMessages(updatedWithReply);
	// 						// 	allMessages[activeChat] = updatedWithReply;

	// 						// 	setTimeout(() => {
	// 						// 		setMessages((prev) =>
	// 						// 			prev.map((msg) =>
	// 						// 				msg.id === newMessage.id
	// 						// 					? { ...msg, status: 'read' }
	// 						// 					: msg
	// 						// 			)
	// 						// 		);
	// 						// 		allMessages[activeChat] = allMessages[activeChat].map(
	// 						// 			(msg) =>
	// 						// 				msg.id === newMessage.id
	// 						// 					? { ...msg, status: 'read' }
	// 						// 					: msg
	// 						// 		);
	// 						// 	}, 1000);
	// 						// }, 2000);
	// 					} catch (err) {
	// 						console.error('Error processing voice message:', err);
	// 						toast.error('Failed to send voice message');
	// 					}
	// 				}

	// 				setIsRecording(false);
	// 				setRecordingTime(0);
	// 				setAudioLevel(0);
	// 				setIsRecordingCanceled(false); // Reset for next recording
	// 				chunksRef.current = []; // Clear chunks for next recording
	// 			};

	// 			mediaRecorderRef.current.start(100);
	// 		})
	// 		.catch((err) => {
	// 			toast.error('Microphone access denied: ' + err.message);
	// 			setIsRecording(false);
	// 		});
	// }, [messages, activeChat, recordingTime]);

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
			{isWATemplateOpen && (
				<WhatsappTemplates
					onClose={onWATemplateClose}
					isOpen={isWATemplateOpen}
					accountId={currentUser?.businessId}
					onSend={handleSendMessage}
					isLoading={isSending}
				/>
			)}

			<HStack
				justifyContent='space-between'
				display={{ base: 'flex', md: 'none' }}
				align='center'
				zIndex='1000'
			>
				<Button
					onClick={isMobile ? onOpen : null}
					aria-label='Show sidebar'
					bg='softGray.50'
					color={whatsappColors.textSecondary}
					p={0}
					mb='2'
					w='40px'
					h='40px'
					borderRadius='full'
					alignItems='center'
					justifyContent='center'
				>
					<FiMessageSquare size={20} />
				</Button>

				<MenuOptions businessPhone={businessPhone} />
			</HStack>

			<Flex
				h='80vh'
				overflow='hidden'
				position='relative'
				flexDir={{ base: 'column', md: 'row' }}
				borderRadius='lg'
				gap={{ base: 2, md: 0 }}
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
							<Flex align='center' gap='2'>
								<UserAvatar
									src={currentUser?.user?.profileImage}
									name={currentUser?.user?.fullName}
									size='sm'
								/>
								<Text
									fontWeight='bold'
									isTruncated
									fontSize='sm'
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
										fontSize='sm'
										boxShadow='sm'
									/>
								</InputGroup>
							</Box>
							<Divider borderColor='gray.300' />
							<UserList
								users={users}
								// activeChat={activeChat}
								// setActiveChat={setActiveChat}
								isMobile={isMobile}
								contacts={filteredContacts}
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
					w={{ base: '100%', md: '30%', lg: '25%' }}
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
							<MenuOptions businessPhone={businessPhone} />
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
						// activeChat={activeChat}
						// setActiveChat={setActiveChat}
						isMobile={isMobile}
						contacts={filteredContacts}
						onClose={onClose}
						sidebarBg={sidebarBg}
						handleAddContact={() => setIsContactModalOpen(true)}
						businessPhone={businessPhone}
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
								zIndex='0'
							>
								<Flex alignItems='center'>
									<UserAvatar src={activeChat?.avatar} size='sm' mr={3} />
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
								from={businessPhone}
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
												onClick={sendRecording}
											/>
										</HStack>
									</Flex>

									// <VoiceMessageRecorder
									// 	isRecording={isRecording}
									// 	setIsRecording={setIsRecording}
									// 	onSend={handleVoiceMessageSend}
									// 	onCancel={() => {
									// 		// Handle recording cancellation
									// 	}}
									// />
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
									<Popover placement='top-start' _focus={{ outline: 'none' }}>
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
											onClick={cancelRecording}
										/>
									) : (
										<>
											{inputMessage || selectedFile ? (
												<IconButton
													icon={<RiSendPlaneFill />}
													aria-label='Send message'
													colorScheme='whatsapp'
													px='6'
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

			{/* File preview modal */}
			{selectedFile && (
				<Modal
					isOpen={selectedFile}
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

							{!selectedFile?.type?.startsWith('audio') && (
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
							)}
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
			)}
		</>
	);
};

export default Whatsapp;
