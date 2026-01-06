import { useCallback, useMemo, useState } from 'react';
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
	const downloadedMedia = useSelector((s) => s.whatsappWeb.downloaded_media);
	const dispatch = useDispatch();

	// chat category
	// chats, groups, all
	const [category, setCategory] = useState('all');

	const isSocketConnected = useMemo(
		() => socketService?.connectionStatus === 'connected' || false,
		[]
	);

	const whatsappInitialize = useCallback((payload) => {
		console.log('initialize_whatsapp: ', payload);
		dispatch(reset());
		socketService.emit('initialize_whatsapp', payload);
	}, []);

	const getChats = useCallback(
		(sessionId, page = 1, limit = 30) => {
			if (!sessionId) return;
			dispatch(setChatsFetching(true));
			socketService.emit('get_chats', {
				sessionId,
				page,
				limit,
				category,
			});
		},
		[category, dispatch]
	);

	const getChat = useCallback(
		(sessionId, chat) => {
			if (!sessionId || !chat?.id) return;
			// dispatch(setActiveChat(chat));
			socketService.emit('get_chat', { sessionId, chatId: chat?.id });
		},
		[dispatch]
	);

	const markChatAsSeen = useCallback((sessionId, chatId) => {
		if (!sessionId || !chatId) return;
		socketService.emit(WHATSAPP_EVENTS.CHAT_SEEN, { sessionId, chatId });
	}, []);

	const sendMessage = useCallback(
		(payload) => {
			let { sessionId, to, message = '', media = null, options = {} } = payload;

			if (!sessionId || !to) return;
			// if message to yourself, mark send seen along with message
			if (state.activeChat && state.activeChat?.id === to) {
				options = { ...options, sendSeen: true };
			}

			const messageData = {
				sessionId,
				to,
				message: message || '',
				...(media && { media }),
				...(options && { options }),
			};

			socketService.emit('send_message', messageData);
		},
		[state.activeChat]
	);

	const downloadMedia = useCallback(
		({ sessionId, messageId, action = 'download' }) => {
			if (!sessionId || !messageId) return;

			// const isDownloaded = downloadedMedia[message]

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

	// console.log({ ...state });

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
		setCategory,
		category,
	};
};
