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

			// Ensure the chat array exists
			const messages = state.userChats[chatId] || [];
			state.userChats[chatId] = messages;

			const msgId = message?.id?._serialized;
			if (!msgId) return;

			// const messages = state.userChats[chatId];

			// Find message index directly
			const index = messages.findIndex((m) => m?.id?._serialized === msgId);

			if (index === -1) {
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

			// update the all converstations lastMessage data and also unread count
			const chatIndex = state.allConversations?.findIndex(
				(item) => item?.id === chatId
			);

			if (chatIndex !== -1) {
				const isActiveChat = state.activeChat?.id === chatId;

				const isNotLastMessage =
					state.allConversations[chatIndex]?.lastMessage?.id !==
					message?.id?._serialized;

				if (isNotLastMessage) {
					const newLastMessage = {
						id: message?.id?._serialized,
						body: message?.body || '',
						timestamp: message?.timestamp || Date.now(),
						type: message?.type || 'chat',
						fromMe: message?.fromMe,
						hasMedia: message?.hasMedia || false,
					};

					console.log({ count: state.allConversations[chatIndex].unreadCount });

					// Build updated chat
					const updatedChat = {
						...state.allConversations[chatIndex],
						lastMessage: newLastMessage,
						unreadCount: isActiveChat
							? 0
							: Number(state.allConversations[chatIndex].unreadCount || 0) + 1,
						timestamp: message?.timestamp || Date.now(),
					};

					// Remove from current position and move to top
					state.allConversations.splice(chatIndex, 1);
					state.allConversations.unshift(updatedChat);

					state.allConversations.sort((a, b) => b.timestamp - a.timestamp);
				}
			}
			// state.userChats[chatId] = messages;
		},
		messageAck: (state, action) => {
			const { message, ack } = action.payload;

			if (!message || !ack) return;
			console.log('message ack:', ack);

			const chatId = message?.fromMe ? message?.to : message?.from;
			if (!chatId) return;

			const messages = state.userChats[chatId] || [];

			// Ensure the chat array exists
			if (!Array.isArray(messages)) return;

			// Find the index of the existing message
			const index = messages.findIndex(
				(m) => m?.id?._serialized === message?.id?._serialized
			);

			// Replace that message with the new one
			if (index !== -1) {
				messages[index] = {
					...messages[index],
					ack,
				};
			}

			// state.userChats[chatId] = messages;
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
export const getMessagesByChatId = (state, chatId) => {
	console.log('get messages: ', chatId);
	return state.whatsappWeb.userChats[chatId] || [];
};

export default whatsappWebSlice.reducer;
