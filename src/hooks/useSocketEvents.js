import { useCallback, useEffect } from 'react';
import socketService from 'services/socketService';

export function useSocketEvents() {
	useEffect(() => {
		(async () => {
			try {
				// await socketService.connect('http://localhost:5000');
				await socketService.connect('https://stageapi.weeam.info');
			} catch (err) {
				console.error('Socket connection failed:', err);
			}
		})();

		return () => {
			// cleanup on unmount
			socketService.disconnect();
		};
	}, []);

	// Register user payload
	const registerUser = useCallback((payload) => {
		socketService.emit('register', payload).catch(console.error);
	}, []);

	// General-purpose emit
	const emit = useCallback((event, data) => {
		return socketService.emit(event, data);
	}, []);

	return { registerUser, emit };
}
