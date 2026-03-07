import addNotification from 'react-push-notification';

import logo from 'assets/img/app-logo.jpeg';

// export const requestNotificationPermission = async () => {
// 	if (!('Notification' in window)) {
// 		console.log('This browser does not support notifications');
// 		return false;
// 	}

// 	if (Notification.permission !== 'granted') {
// 		const permission = await Notification.requestPermission();
// 		return permission === 'granted';
// 	}
// 	return true;
// };
export const requestNotificationPermission = async () => {
	if (!('Notification' in window)) {
		console.error('This browser does not support desktop notifications');
		return false;
	}

	if (Notification.permission === 'granted') return true;

	if (Notification.permission !== 'denied') {
		const permission = await Notification.requestPermission();
		return permission === 'granted';
	}

	return false;
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
