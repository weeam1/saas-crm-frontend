import { createSlice } from '@reduxjs/toolkit';

const whatsappSlice = createSlice({
	name: 'whatsapp',
	initialState: {
		contacts: [],
		chats: {},
	},
	reducers: {
		setContacts: (state, action) => {
			state.contacts = action.payload;
		},
		setChatHistory(state, action) {
			const { chatId, messages } = action.payload;

			console.log({ chatId, messages });
			state.chats[chatId] = messages;
		},

		// update messages (pagination scroll bar top)
		prependMessages(state, action) {
			const { chatId, messages } = action.payload;
			if (!state.chats[chatId]) {
				state.chats[chatId] = messages;
			} else {
				state.chats[chatId] = [...state.chats[chatId], ...messages];
			}
		},
		appendMessage(state, action) {
			const { chatId, message } = action.payload;
			if (!state.chats[chatId]) state.chats[chatId] = [];
			state.chats[chatId].push(message);
		},
	},
});

export const { setContacts, setChatHistory, prependMessages, appendMessage } =
	whatsappSlice.actions;

export default whatsappSlice.reducer;
