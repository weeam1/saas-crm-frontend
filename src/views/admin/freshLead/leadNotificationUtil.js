import soundPlayer from 'utils/sound/soundUtil';
import notificationFile from 'assets/sounds/new-notification.mp3';

export const playNewLeadNotification = async () => {
	try {
		await soundPlayer.play(notificationFile, {
			volume: 1,
			loop: false,
			id: 'notification-1',
		});

		// Store timeout ID for cleanup
		const timeoutId = setTimeout(() => {
			soundPlayer.stop('notification-1');
		}, 3000);

		// Return cleanup function
		return () => clearTimeout(timeoutId);
	} catch (error) {
		console.error('Failed to play notification:', error);
	}
};
