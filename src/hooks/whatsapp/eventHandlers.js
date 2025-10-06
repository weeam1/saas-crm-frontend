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
		const { whatsappId, chat } = payload;

		const userChats = { ...state.userChats };
		const chatsForUser = userChats[whatsappId]
			? [...userChats[whatsappId]]
			: [];

		const chatIndex = chatsForUser.findIndex((c) => c.id === chat.id);

		if (chatIndex >= 0) {
			chatsForUser[chatIndex] = { ...chatsForUser[chatIndex], ...chat };
		} else {
			chatsForUser.push(chat);
		}

		userChats[whatsappId] = chatsForUser;

		return {
			...state,
			userChats,
		};
	},
	[WHATSAPP_EVENTS.NEW_MESSAGE]: (state, payload) => ({
		...state,
		messages: [...state.messages, payload],
	}),
	[WHATSAPP_EVENTS.DISCONNECT]: (state, payload) => ({
		...state,
		whatsapp_disconnect: payload?.message || 'Whatsapp disconnected',
	}),
};
