import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import 'assets/css/App.css';
import {
	BrowserRouter as Router,
	Routes,
	Route,
	useNavigate,
} from 'react-router-dom';
import AuthLayout from './layouts/auth';
import AdminLayout from 'layouts/admin';
import UserLayout from 'layouts/user';
import { ChakraProvider, ColorModeScript, Flex } from '@chakra-ui/react';
import theme from 'theme/theme';
import { ThemeEditorProvider } from '@hypertheme-editor/chakra-ui';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Provider, useSelector } from 'react-redux';
import store from './redux/store';
import { useDispatch } from 'react-redux';
import { getApi } from 'services/api';
import { setTree, setUsers } from './redux/localSlice';
import ContextProvider from 'contexts/store';
import LeadCycle from 'views/admin/leadCycle';
import webSocketService from 'services/WebSocketService';
import { newNotifyItem } from './redux/webSocketReducer';
import { addAnnouncement } from './redux/announcementsSlice';
import AnnouncementsModal from 'views/admin/announcement/components/AnnouncementsModal';
import addNotification, { Notifications } from 'react-push-notification';

import logo from 'assets/img/app-logo.jpeg';

// Import your audio file
import newAnnouncementSound from 'assets/sounds/new-notification.mp3';
import { requestNotificationPermission } from 'services/NotificationService';
import Loader from 'components/loading/Loader';
import useChunkErrorHandler from 'hooks/useChunkErrorHandler';
// Create an audio instance
const announcementSound = new Audio(newAnnouncementSound);

function App() {
	// chunk handler
	useChunkErrorHandler();

	const token = localStorage.getItem('token') || null;
	const dispatch = useDispatch();
	const [appLoaded, setAppLoaded] = useState(false);
	// const [permissionGranted, setPermissionGranted] = useState(false);
	const user = JSON.parse(localStorage.getItem('user'));
	useNavigate();

	// const assignedLeadMessage = (data) => {
	// 	return ``;
	// };

	const showNotification = (customOptions) => {
		const notificationOptions = {
			theme: 'darkblue',
			native: true,
			duration: 20000,
			icon: logo,
			...customOptions,
		};

		Notification.requestPermission();
		addNotification(notificationOptions);
	};

	const user2 = useSelector((state) => state.user.user);

	const [isModalOpen, setIsModalOpen] = useState(false);

	useEffect(() => {
		if (!user?._id) return;

		webSocketService.connect(user._id);

		webSocketService.socket.onmessage = async (event) => {
			try {
				const socketData = JSON.parse(event.data);
				console.log('WebSocket message:', socketData);

				let notificationDetails = {};
				const { type, data } = socketData;
				const message = data?.message
					? data?.message
					: data?.lead_id
						? `You have been assigned a new lead${data?.lead_name && `: ${data?.lead_name}`}`
						: 'Check out the latest updates!';

				// Handle announcements (type === 1)
				if (type === 1) {
					if (Array.isArray(data) && data.length > 0) {
						data.forEach((announcement) =>
							dispatch(addAnnouncement(announcement))
						);
					} else {
						dispatch(addAnnouncement(data));
					}
				}

				// Push notification if type is valid
				if (type !== -1 && message) {
					dispatch(newNotifyItem(socketData));

					notificationDetails = {
						title:
							type === 1
								? 'New Announcement'
								: type === 2
									? 'Interview Invite'
									: 'New Notification',
						message,
					};
				}

				// Request and send notifications
				const isGranted = await requestNotificationPermission();
				if (isGranted) {
					showNotification({
						title: notificationDetails.title,
						message: notificationDetails.message,
					});
				} else {
					toast.success('Check out the latest updates!');
				}

				// Play notification sound
				await announcementSound
					.play()
					.catch((error) => console.error('Error playing sound:', error));

				// Open the modal and clear previous notification
				setIsModalOpen(true);
			} catch (error) {
				console.error('Error handling WebSocket message:', error);
			}
		};

		return () => {
			webSocketService.socket.onmessage = null; // Cleanup
		};
	}, [dispatch, user]);

	// useEffect(() => {
	// 	if (user && user?._id) {
	// 		webSocketService.connect(user._id);

	// 		webSocketService.socket.onmessage = (event) => {
	// 			const socketData = JSON.parse(event.data);

	// 			console.log('WebSocket message:', socketData);

	// 			// Type = 1 mean Announcemnents
	// 			if (socketData.type === 1 && socketData.data.length > 0) {
	// 				socketData.data.forEach((announcement) =>
	// 					dispatch(addAnnouncement(announcement))
	// 				);
	// 			} else if (socketData.type === 1 && socketData.data.message) {
	// 				dispatch(addAnnouncement(socketData));
	// 				dispatch(newNotifyItem(socketData));
	// 			}

	// 			if (socketData.type !== -1 && socketData.data.message) {
	// 				dispatch(newNotifyItem(socketData));
	// 				if (socketData?.type === 1) {
	// 					setNotify({
	// 						title: 'New Announcement',
	// 						message:
	// 							socketData.data.message || 'Check out the latest updates!',
	// 					});
	// 				} else if (socketData?.type === 0) {
	// 					setNotify({
	// 						title: 'New Notification',
	// 						message:
	// 							socketData.data.message || 'Check out the latest updates!',
	// 					});
	// 				} else if (socketData?.type === 2) {
	// 					setNotify({
	// 						title: 'Interiew Invite',
	// 						message:
	// 							socketData.data.message || 'Check out the latest updates!',
	// 					});
	// 				}
	// 			}

	// 			requestNotificationPermission().then((isGranted) => {
	// 				if (isGranted) {
	// 					console.log('Notification granted');
	// 					showNotification(notify);
	// 				} else {
	// 					// Fallback to in-app notification
	// 					toast.success('Check out the latest updates!');
	// 				}
	// 			});

	// 			// Play the sound effect for new announcement
	// 			announcementSound.play().catch((error) => {
	// 				console.error('Error playing sound:', error);
	// 			});

	// 			setIsModalOpen(true);
	// 			dispatch(clearNotifyItem());
	// 		};

	// 		// webSocketService.socket.onmessage = (event) => {
	// 		// 	try {
	// 		// 		const message = JSON.parse(event.data);

	// 		// 		console.log('WebSocket message:', message);

	// 		// 		// Type = 1 mean Announcemnents
	// 		// 		if (message.type === 1 && message.data.length > 0) {
	// 		// 			message.data.forEach((announcement) =>
	// 		// 				dispatch(addAnnouncement(announcement))
	// 		// 			);
	// 		// 		} else if (message.type === 1 && message.data.message) {
	// 		// 			dispatch(addAnnouncement(message.data));

	// 		// 			if (Notification.permission === 'granted') {
	// 		// 				console.log('Notification granted');
	// 		// 				showNotification({
	// 		// 					title: 'New Announcement',
	// 		// 					message:
	// 		// 						message.data.message || 'Check out the latest updates!',
	// 		// 				});
	// 		// 			} else {
	// 		// 				// Fallback to an in-app notification or alert
	// 		// 				toast.success('Check out the latest updates!');
	// 		// 			}

	// 		// 			// Play the sound effect for new announcement
	// 		// 			announcementSound.play().catch((error) => {
	// 		// 				console.error('Error playing sound:', error);
	// 		// 			});
	// 		// 		}

	// 		// 		// Type = 0 mean Notificaitons
	// 		// 		// if (message.type === 0) {
	// 		// 		// 	message.data.forEach((announcement) =>
	// 		// 		// 		dispatch(addNotification(announcement))
	// 		// 		// 	);
	// 		// 		// }

	// 		// 		// Automatically open the modal to show new announcements
	// 		// 		setIsModalOpen(true);
	// 		// 	} catch (error) {
	// 		// 		console.error('Error handling WebSocket message:', error);
	// 		// 	}
	// 		// };
	// 	}
	// }, [dispatch, newNotifyItem, notify, user]);

	// useEffect(() => {
	// 	const checkPermissions = () => {
	// 		if (Notification.permission === 'granted') {
	// 			setPermissionGranted(true);
	// 		} else if (Notification.permission === 'denied') {
	// 			setPermissionGranted(false);
	// 		} else {
	// 			// Permission is not yet requested (default).
	// 			setIsPermissionModalOpen(false);
	// 		}
	// 	};

	// 	checkPermissions();

	// 	if (permissionGranted && user?._id) {
	// 		webSocketService.connect(user?._id);
	// 		// WebSocket connection logic here
	// 		webSocketService.socket.onmessage = (event) => {
	// 			const message = JSON.parse(event.data);

	// 			if (message.type === 1 && message.data.message) {
	// 				dispatch(addAnnouncement(message.data));

	// 				showNotification({
	// 					title: 'New Announcement',
	// 					message: message.data.message || 'Check out the latest updates!',
	// 				});

	// 				announcementSound.play().catch((error) => {
	// 					console.error('Error playing sound:', error);
	// 				});
	// 			}
	// 		};
	// 	}
	// }, [dispatch, permissionGranted, user]);

	const getToken = () => {
		return localStorage.getItem('token') || null;
	};

	const fetchTree = async () => {
		setAppLoaded(false);
		const response = await getApi('api/user/tree');
		const data = response.data || null;

		dispatch(setTree(data));

		setTimeout(() => {
			setAppLoaded(true);
		}, 0);
	};

	const fetchUsers = async () => {
		setAppLoaded(false);
		const response = await getApi('api/user/');
		const data = response.data || null;
		dispatch(setUsers(data?.user));

		setTimeout(() => {
			setAppLoaded(true);
		}, 0);
	};

	useEffect(() => {
		if (getToken() && user2) {
			fetchTree();
			fetchUsers();
		} else if (!getToken()) {
			setAppLoaded(true);
		}
	}, [user2]);

	if (appLoaded)
		return (
			<>
				<Notifications />

				{/* {isPermissionModalOpen && (
					<PermissionModal
						isOpen={isPermissionModalOpen}
						onClose={() => setIsPermissionModalOpen(false)}
					/>
				)} */}

				{isModalOpen && (
					<AnnouncementsModal
						isOpen={isModalOpen}
						onClose={() => setIsModalOpen(false)}
					/>
				)}

				<ToastContainer />
				<Routes>
					{token && user?.role ? (
						user?.role == 'user' ? (
							<Route path='/*' element={<UserLayout />} />
						) : user?.role === 'superAdmin' ? (
							<Route path='/*' element={<AdminLayout />} />
						) : (
							''
						)
					) : (
						<Route path='/*' element={<AuthLayout />} />
					)}
				</Routes>
				<LeadCycle />
			</>
		);
	else
		return (
			<>
				<Flex
					justifyContent={'center'}
					alignItems={'center'}
					width='100%'
					height={'100vh'}
				>
					<Loader />
				</Flex>
			</>
		);
}

ReactDOM.render(
	<Provider store={store}>
		<ContextProvider>
			<ChakraProvider theme={theme} cssVarsRoot='body'>
				<React.StrictMode>
					<ThemeEditorProvider>
						<Router>
							<ColorModeScript
								initialColorMode={theme.config.initialColorMode}
							/>
							<App />
						</Router>
					</ThemeEditorProvider>
				</React.StrictMode>
			</ChakraProvider>
		</ContextProvider>
	</Provider>,
	document.getElementById('root')
);
