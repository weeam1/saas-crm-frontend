import keys from 'config/keys';
import { useCallback, useEffect, useState } from 'react';
import socketService from 'services/socketService';

export function useSocketEvents() {
	const [isConnected, setIsConnected] = useState(false);

	const connect = useCallback(async () => {
		try {
			await socketService.connect('http://localhost:5000');
			// await socketService.connect(keys.socketIoUrl);

			if (socketService.socket) {
				setIsConnected(socketService.socket.connected);

				// also listen to socket events to track future changes
				socketService.socket.on('connect', () => setIsConnected(true));
				socketService.socket.on('disconnect', () => setIsConnected(false));
			}
		} catch (err) {
			console.error('Socket connection failed:', err);
			setIsConnected(false);
		}
	}, []);

	useEffect(() => {
		connect();

		return () => {
			socketService.disconnect();
		};
	}, []);

	// Register user payload
	const registerUser = useCallback((payload) => {
		console.log('Registering user with payload:', payload);
		socketService.registerUser(payload);
	}, []);

	// Create User activity log payload
	const createUserActivityLog = useCallback((payload) => {
		console.log('Registerin user activity log with payload:', payload);
		socketService.userActivity(payload);
	}, []);

	// General-purpose emit
	const emit = useCallback((event, data) => {
		return socketService.emit(event, data);
	}, []);

	return { registerUser, createUserActivityLog, isConnected, emit };
}
