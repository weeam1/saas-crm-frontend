import { useReducer, useEffect, useCallback } from 'react';
import socketService from 'services/socketService';
import { eventHandlers } from './eventHandlers';

const initialState = {
	qr: '',
	isAuthenticated: false,
	isReady: false,
	chats: [],
	messages: [],
	error: null,
	whatsapp_disconnect: '',
};

function reducer(state, action) {
	const handler = eventHandlers[action.type];
	return handler ? handler(state, action.payload) : state;
}

export function useWhatsappEvents() {
	const [state, dispatch] = useReducer(reducer, initialState);

	useEffect(() => {
		// store refs to handlers so we can remove them later
		const listeners = [];

		Object.keys(eventHandlers).forEach((event) => {
			const handler = (payload) => dispatch({ type: event, payload });
			socketService.on(event, handler);
			listeners.push({ event, handler });
		});

		// proper cleanup: remove all
		return () => {
			listeners.forEach(({ event, handler }) => {
				socketService.off(event, handler);
			});
		};
	}, []);

	const whatsappInitialize = (payload) => {
		console.log('Regiter whatsapp: ', payload);
		socketService.emit('initialize_whatsapp', payload);
	};

	const getChats = useCallback((sessionId) => {
		console.log('Get chats: ', sessionId);
		socketService.emit('get_chats', { sessionId });
	}, []);

	return {
		...state,
		whatsappInitialize,
		getChats,
		isSocketConnected: socketService.connectionStatus === 'connected',
	};
}
