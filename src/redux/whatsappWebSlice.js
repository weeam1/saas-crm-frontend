import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	qr: '',
	isAuthenticated: false,
	isReady: false,
	allConversations: [],
	activeChat: null,
	userChats: {},
	messages: [],
	error: null,
	whatsapp_disconnect: '',
	whatsapp_loading: null,
};

const whatsappWebSlice = createSlice({
	name: 'whatsappWeb',
	initialState,
	reducers: {
		qrCode: (state, action) => {
			state.qr = action.payload?.qrCode || '';
		},
		authFail: (state, action) => {
			state.error = action.payload;
		},
		authenticated: (state) => {
			state.isAuthenticated = true;
		},
		ready: (state) => {
			state.isReady = true;
			state.whatsapp_disconnect = '';
		},
		fail: (state, action) => {
			state.error = action.payload;
		},
		whatsappLoading: (state, action) => {
			state.whatsapp_loading = action.payload;
		},
		error: (state, action) => {
			console.log('message error: ', action.payload);
			state.error = action.payload?.message || 'Unknown error';
		},
		chatsLoaded: (state, action) => {
			state.allConversations = action.payload?.chats || [];
		},
		setActiveChat: (state, action) => {
			state.activeChat = action.payload;
		},
		chatLoaded: (state, action) => {
			const { sessionId, chatId, messages } = action.payload;
			if (!sessionId || !chatId) return;

			// Replace or set messages list for this chatId
			state.userChats[chatId] = messages || [];
		},
		newMessage: (state, action) => {
			const { message } = action.payload;

			if (!message) return;
			console.log('new message received:', message);

			const chatId = message?.fromMe ? message?.to : message?.from;
			if (!chatId) return;

			// Ensure the chat array exists
			if (!Array.isArray(state.userChats[chatId])) {
				state.userChats[chatId] = [];
			}

			const messages = state.userChats[chatId];

			// Check for duplicate
			const exists = messages.some(
				(m) => m?.id?._serialized === message?.id?._serialized
			);

			if (!exists) {
				messages.push(message);
			} else {
				// Find the index of the existing message
				const index = messages.findIndex(
					(m) => m?.id?._serialized === message?.id?._serialized
				);

				// Replace that message with the new one
				if (index !== -1) {
					messages[index] = {
						...messages[index],
						...message, // merge fields (so old props not lost)
					};
				}
			}

			state.userChats[chatId] = messages;
		},
		messageAck: (state, action) => {
			const { message, ack } = action.payload;

			if (!message || !ack) return;
			console.log('message ack:', ack);

			const chatId = message?.fromMe ? message?.to : message?.from;
			if (!chatId) return;

			// Ensure the chat array exists
			if (!Array.isArray(state.userChats[chatId])) {
				state.userChats[chatId] = [];
			}

			const messages = state.userChats[chatId];

			// Find the index of the existing message
			const index = messages.findIndex(
				(m) => m?.id?._serialized === message?.id?._serialized
			);

			// Replace that message with the new one
			if (index !== -1) {
				messages[index] = {
					...messages[index],
					ack, // update only ack value
				};
			}

			state.userChats[chatId] = messages;
		},

		disconnect: (state, action) => ({
			...initialState,
			whatsapp_disconnect: action.payload?.message || 'WhatsApp disconnected',
		}),

		reset: () => initialState,
	},
});

export const {
	qrCode,
	authFail,
	authenticated,
	whatsappLoading,
	ready,
	fail,
	error,
	setActiveChat,
	chatsLoaded,
	chatLoaded,
	newMessage,
	messageAck,
	disconnect,
	reset,
} = whatsappWebSlice.actions;

// export the selector
export const getMessagesByChatId = (state, chatId) =>
	state.whatsappWeb.userChats[chatId] || [];

export default whatsappWebSlice.reducer;
