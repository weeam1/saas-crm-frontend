import { WHATSAPP_EVENTS } from '../../services/whatsapp/types';

export const eventHandlers = {
	[WHATSAPP_EVENTS.QR_CODE]: (state, payload) => ({
		...state,
		qr: payload?.qrCode,
	}),
	[WHATSAPP_EVENTS.AUTH_FAIL]: (state, payload) => ({
		...state,
		error: payload,
	}),
	[WHATSAPP_EVENTS.AUTHENTICATED]: (state) => ({
		...state,
		isAuthenticated: true,
	}),
	[WHATSAPP_EVENTS.READY]: (state) => ({
		...state,
		isReady: true,
	}),
	[WHATSAPP_EVENTS.FAIL]: (state, payload) => ({
		...state,
		error: payload,
	}),
	[WHATSAPP_EVENTS.ERROR]: (state, payload) => ({
		...state,
		error: payload?.message,
	}),
	[WHATSAPP_EVENTS.CHATS_LOADED]: (state, payload) => ({
		...state,
		allConversations: payload?.chats || [],
	}),
	[WHATSAPP_EVENTS.CHAT_LOADED]: (state, payload) => {
		const { sessionId, chat } = payload;

		console.log('coming chat: ', chat);

		const userChats = { ...state.userChats };
		const chatsForUser = userChats[sessionId] ? [...userChats[sessionId]] : [];

		const chatIndex = chatsForUser.findIndex((c) => c.id === chat.id);

		if (chatIndex >= 0) {
			chatsForUser[chatIndex] = { ...chatsForUser[chatIndex], ...chat };
		} else {
			chatsForUser.push(chat);
		}

		userChats[sessionId] = chatsForUser;

		return {
			...state,
			userChats,
		};
	},
	[WHATSAPP_EVENTS.NEW_MESSAGE]: (state, payload) => ({
		...state,
		messages: [...state.messages, payload],
	}),
	[WHATSAPP_EVENTS.MESSAGE_ACK]: (state, { payload }) => {
		const { chatId, sessionId, msgResponse } = payload;

		// Ensure the user's chat array exists
		if (!state.userChats[sessionId]) {
			state.userChats[sessionId] = [];
		}

		// Append new message
		const chat = state.userChats[sessionId];

		// append messages in chat[0]
	},

	[WHATSAPP_EVENTS.DISCONNECT]: (state, payload) => ({
		...state,
		whatsapp_disconnect: payload?.message || 'Whatsapp disconnected',
	}),
};
