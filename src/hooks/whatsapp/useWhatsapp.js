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

// 	const getChat = useCallback((sessionId, sessionId) => {
// 		console.log('get user Chat');
// 		if (!sessionId || !sessionId) {
// 			return console.warn('sessionId and sessionId missing');
// 		}
// 		socketService.emit('get_chat', { sessionId, sessionId });
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
import {
	reset,
	setActiveChat,
	setChatsFetching,
} from './../../redux/whatsappWebSlice';
import socketService from 'services/socketService';
import { WHATSAPP_EVENTS } from 'services/whatsapp/types';

export const useWhatsapp = () => {
	const state = useSelector((s) => s.whatsappWeb);
	const dispatch = useDispatch();

	const isSocketConnected = useMemo(
		() => socketService?.connectionStatus === 'connected' || false,
		[]
	);

	const whatsappInitialize = useCallback((payload) => {
		console.log('initialize_whatsapp: ', payload);
		dispatch(reset());
		socketService.emit('initialize_whatsapp', payload);
	}, []);

	const getChats = useCallback((sessionId, page = 1, limit = 30) => {
		console.warn('getChats: ', { sessionId, page, limit });
		if (!sessionId) return;
		dispatch(setChatsFetching(true));
		socketService.emit('get_chats', { sessionId, page, limit });
	}, []);

	const getChat = useCallback(
		(sessionId, chat) => {
			if (!sessionId || !chat?.id) return;
			dispatch(setActiveChat(chat));
			socketService.emit('get_chat', { sessionId, chatId: chat?.id });
		},
		[dispatch]
	);

	const markChatAsSeen = useCallback((sessionId, chatId) => {
		if (!sessionId || !chatId) return;
		socketService.emit(WHATSAPP_EVENTS.CHAT_SEEN, { sessionId, chatId });
	}, []);

	const sendMessage = useCallback(
		(sessionId, to, message, options = {}) => {
			if (!sessionId || !to) return;
			// if active chat is same as to, send seen along with message
			if (state.activeChat && state.activeChat?.id === to) {
				options = { ...options, sendSeen: true, isViewOnce: true };
			}
			socketService.emit('send_message', { sessionId, to, message });
		},
		[state.activeChat]
	);

	const downloadMedia = useCallback(
		({ sessionId, messageId, action = 'download' }) => {
			if (!sessionId || !messageId) return;

			// socketService.emit('download_media', { sessionId, messageId });

			const payload = {
				sessionId,
				messageId,
				action,
			};

			socketService.emit('download_media', payload);
		},
		[]
	);

	const disconnectWhatsapp = useCallback(
		(sessionId) => {
			socketService.emit('disconnect_whatsapp', { sessionId });
			dispatch(reset());
		},
		[dispatch]
	);

	const logoutWhatsapp = useCallback(
		(sessionId) => {
			socketService.emit('logout_whatsapp', { sessionId });
			localStorage.setItem('whatsapp_auth', false);
			dispatch(reset());
		},
		[dispatch]
	);

	console.log({ ...state });

	return {
		...state,
		whatsappInitialize,
		getChats,
		getChat,
		sendMessage,
		markChatAsSeen,
		disconnectWhatsapp,
		logoutWhatsapp,
		downloadMedia,
		isSocketConnected,
	};
};
