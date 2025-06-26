import { createSlice } from '@reduxjs/toolkit';

const whatsappSlice = createSlice({
	name: 'whatsapp',
	initialState: {
		contacts: [],
		currentUser: {},
		chats: {},
	},
	reducers: {
		setContacts: (state, action) => {
			state.contacts = action.payload;
		},

		setCurrentUser: (state, action) => {
			state.currentUser = action.payload;
		},

		addContact: (state, action) => {
			const newContact = action.payload;
			const exists = state.contacts.some(
				(contact) => contact.phoneNumber === newContact.phoneNumber
			);

			if (!exists) {
				state.contacts.unshift(newContact);
			}
		},

		updateContact: (state, action) => {
			const updated = action.payload;
			const index = state.contacts.findIndex(
				(contact) => contact.phoneNumber === updated.phoneNumber
			);

			if (index !== -1) {
				state.contacts[index] = {
					...state.contacts[index],
					...updated,
				};
			}
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

export const {
	setContacts,
	addContact,
	updateContact,
	setChatHistory,
	prependMessages,
	appendMessage,
	setCurrentUser,
} = whatsappSlice.actions;

export default whatsappSlice.reducer;
