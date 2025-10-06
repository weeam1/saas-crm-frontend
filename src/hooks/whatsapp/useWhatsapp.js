// import { useReducer, useEffect, useCallback } from 'react';
// import socketService from 'services/socketService';
// import { eventHandlers } from './eventHandlers';

// const initialState = {
// 	qr: '',
// 	isAuthenticated: false,
// 	isReady: false,
// 	allConversations: [],
// 	userChats: {}, // { userId: [chat objects] }
// 	messages: [],

// 	error: null,
// 	whatsapp_disconnect: '',
// };

// function reducer(state, action) {
// 	const handler = eventHandlers[action.type];
// 	return handler ? handler(state, action.payload) : state;
// }

// export function useWhatsapp() {
// 	const [state, dispatch] = useReducer(reducer, initialState);

// 	useEffect(() => {
// 		// store refs to handlers so we can remove them later
// 		const listeners = [];

// 		Object.keys(eventHandlers).forEach((event) => {
// 			const handler = (payload) => dispatch({ type: event, payload });
// 			socketService.on(event, handler);
// 			listeners.push({ event, handler });
// 		});

// 		// proper cleanup: remove all
// 		return () => {
// 			listeners.forEach(({ event, handler }) => {
// 				socketService.off(event, handler);
// 			});
// 		};
// 	}, []);

// 	const whatsappInitialize = useCallback((payload) => {
// 		console.log('Regiter whatsapp: ', payload);
// 		socketService.emit('initialize_whatsapp', payload);
// 	}, []);

// 	const getChats = useCallback((sessionId) => {
// 		console.log('Get chats: ', sessionId);
// 		socketService.emit('get_chats', { sessionId });
// 	}, []);

// 	const disconnectWhatsapp = useCallback((sessionId) => {
// 		console.log('whatsapp diconnected');
// 		socketService.emit('disconnect_whatsapp', { sessionId });
// 	}, []);

// 	const logoutWhatsapp = useCallback((sessionId) => {
// 		console.log('whatsapp logout');
// 		socketService.emit('logout_whatsapp', { sessionId });
// 		localStorage.setItem('whatsapp_auth', false);
// 	}, []);

// 	const getChat = useCallback((sessionId, whatsappId) => {
// 		console.log('get user Chat');
// 		if (!sessionId || !whatsappId) {
// 			return console.warn('sessionId and whatsappId missing');
// 		}
// 		socketService.emit('get_chat', { sessionId, whatsappId });
// 	}, []);

// 	return {
// 		...state,
// 		whatsappInitialize,
// 		getChats,
// 		getChat,
// 		disconnectWhatsapp,
// 		logoutWhatsapp,
// 		isSocketConnected: socketService.connectionStatus === 'connected',
// 	};
// }

import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { reset } from './../../redux/whatsappWebSlice';
import socketService from 'services/socketService';

export const useWhatsapp = () => {
	const state = useSelector((s) => s.whatsappWeb);
	const dispatch = useDispatch();

	const isSocketConnected = useMemo(
		() => socketService?.connectionStatus === 'connected' || false,
		[]
	);

	const whatsappInitialize = useCallback((payload) => {
		socketService.emit('initialize_whatsapp', payload);
	}, []);

	const getChats = useCallback((sessionId) => {
		socketService.emit('get_chats', { sessionId });
	}, []);

	const getChat = useCallback((sessionId, whatsappId) => {
		if (!sessionId || !whatsappId) return;
		socketService.emit('get_chat', { sessionId, whatsappId });
	}, []);

	const disconnectWhatsapp = useCallback((sessionId) => {
		socketService.emit('disconnect_whatsapp', { sessionId });
	}, []);

	const logoutWhatsapp = useCallback(
		(sessionId) => {
			socketService.emit('logout_whatsapp', { sessionId });
			localStorage.setItem('whatsapp_auth', false);
			dispatch(reset());
		},
		[dispatch]
	);

	// console.log({ ...state });

	return {
		...state,
		whatsappInitialize,
		getChats,
		getChat,
		disconnectWhatsapp,
		logoutWhatsapp,
		isSocketConnected,
	};
};
