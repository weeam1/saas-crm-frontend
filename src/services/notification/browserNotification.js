import addNotification from 'react-push-notification';
import Logo from '../../assets/logo-crm.png';
import { requestNotificationPermission } from 'services/NotificationService';

// export const triggerBrowserNotification = async ({
// 	title,
// 	message,
// 	duration = 5000,
// }) => {
// 	const isGranted = await requestNotificationPermission();

// 	if (!isGranted) return;

// 	addNotification({
// 		title,
// 		message,
// 		// icon: Logo,
// 		native: true,
// 		duration,
// 	});
// };
// export const triggerBrowserNotification = async ({
// 	title,
// 	message,
// 	duration = 5000,
// }) => {
// 	if (Notification.permission === 'granted') {
// 		new Notification(title, { body: message });
// 	}
// };

// export const triggerBrowserNotification = async ({
// 	title,
// 	message,
// 	duration = 5000,
// }) => {
// 	const isGranted = await requestNotificationPermission();

// 	if (!isGranted) return;

// 	// Use browser's native notification API
// 	if ('Notification' in window) {
// 		const notification = new Notification(title, {
// 			body: message,
// 			icon: Logo,
// 			requireInteraction: false, // Auto close
// 		});

// 		console.log({ notification });

// 		// Auto close after duration
// 		setTimeout(() => {
// 			notification.close();
// 		}, duration);

// 		// Optional: Handle notification click
// 		notification.onclick = () => {
// 			window.focus();
// 			notification.close();
// 		};
// 	}
// };

// export const triggerBrowserNotification = async ({
// 	title,
// 	message,
// 	duration = 5000,
// }) => {
// 	console.log('1. Requesting notification permission...');
// 	const isGranted = await requestNotificationPermission();
// 	console.log('2. Permission granted?', isGranted);

// 	if (!isGranted) {
// 		console.log('3. Permission not granted, returning');
// 		return;
// 	}

// 	console.log('4. Attempting to show notification:', { title, message });
// 	try {
// 		addNotification({
// 			title,
// 			message,
// 			icon: Logo,
// 			native: false,
// 			duration,
// 		});
// 		console.log('5. Notification triggered successfully');
// 	} catch (error) {
// 		console.error('Error showing notification:', error);
// 	}
// };

export const triggerBrowserNotification = async ({
	title,
	message,
	duration = 5000,
	onClick = null,
	tag = null,
}) => {
	const isGranted = await requestNotificationPermission();

	// DEBUG: Check if we actually have permission here
	// console.log('Notification Permission Granted:', isGranted);

	if (!isGranted) return;

	try {
		const notification = new Notification(title, {
			body: message,
			// icon: Logo, // Ensure this path is 100% correct or it may fail
			tag: tag,
			requireInteraction: false,
			silent: false,
		});

		// Auto close
		setTimeout(() => notification.close(), duration);

		notification.onclick = (event) => {
			event.preventDefault(); // Prevent default browser behavior
			window.focus();
			notification.close();
			if (onClick) onClick();
		};

		return notification;
	} catch (err) {
		console.error('Failed to create notification:', err);
	}
};
