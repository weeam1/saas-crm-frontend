import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	qr: '',
	isAuthenticated: false,
	isReady: false,
	allConversations: [],
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
		},
		fail: (state, action) => {
			state.error = action.payload;
		},
		whatsappLoading: (state, action) => {
			state.whatsapp_loading = action.payload;
		},
		error: (state, action) => {
			state.error = action.payload?.message || 'Unknown error';
		},
		chatsLoaded: (state, action) => {
			state.allConversations = action.payload?.chats || [];
		},
		chatLoaded: (state, action) => {
			const { whatsappId, chat } = action.payload;
			if (!whatsappId || !chat) return;

			console.log('coming chat: ', chat[0]);

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
		disconnect: (state, action) => {
			state.whatsapp_disconnect =
				action.payload?.message || 'Whatsapp disconnected';
		},
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
