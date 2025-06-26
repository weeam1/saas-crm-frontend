import { constant } from 'constant';
import socketService from './socketService';

class SocketManager {
	constructor() {
		this.connectionEstablished = false;
	}

	async initializeConnection() {
		if (this.connectionEstablished) return;

		return socketService
			.connect(constant['baseUrl'])
			.then(() => {
				this.connectionEstablished = true;
			})
			.catch((error) => {
				console.error('Socket connection failed:', error);
				throw error;
			});
	}

	registerUser(userData) {
		if (!userData.phoneNumber || !userData.userId) {
			console.warn('Cannot register user - missing phone number or user ID');
			return;
		}

		socketService.registerUser(userData);
	}
}

export const socketManager = new SocketManager();
