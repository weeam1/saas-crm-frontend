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
			const { whatsappId, chat } = action.payload;
			if (!whatsappId || !chat) return;

			const chatsForUser = state.userChats[whatsappId] || [];
			const chatIndex = chatsForUser.findIndex((c) => c.id === chat.id);

			if (chatIndex >= 0) {
				chatsForUser[chatIndex] = { ...chatsForUser[chatIndex], ...chat };
			} else {
				chatsForUser.push(chat);
			}

			state.userChats[whatsappId] = chatsForUser;
		},
		newMessage: (state, action) => {
			state.messages.push(action.payload);
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
	chatsLoaded,
	chatLoaded,
	newMessage,
	disconnect,
	reset,
} = whatsappWebSlice.actions;

export default whatsappWebSlice.reducer;
