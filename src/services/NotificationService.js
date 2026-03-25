import addNotification from 'react-push-notification';

import logo from 'assets/img/app-logo.jpeg';

export const requestNotificationPermission = async () => {
	if (Notification.permission !== 'granted') {
		const permission = await Notification.requestPermission();
		return permission === 'granted';
	}
	return true;
};

export const showNotification = (customOptions) => {
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
