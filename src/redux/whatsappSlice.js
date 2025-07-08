import { createSlice } from '@reduxjs/toolkit';

const whatsappSlice = createSlice({
	name: 'whatsapp',
	initialState: {
		contacts: [],
		currentUser: {},
		chats: {},
		mediaUrls: {},
		activeChat: null,
	},
	reducers: {
		setContacts: (state, action) => {
			state.contacts = action.payload;

			// localStorage.removeItem('activeChat');
			// localStorage.setItem('activeChat', JSON.stringify(action.payload));
		},

		setActiveChat: (state, action) => {
			const chat = action.payload;
			state.activeChat = chat;

			// Reset unread count
			const room = state.contacts.find((r) => r.roomId === chat.roomId);
			if (room) room.unreadCount = 0;
		},

		deleteContact: (state, action) => {
			const id = action.payload;

			state.contacts.filter((item) => item._id === id);
		},

		setMediaUrl(state, action) {
			const { mediaId, url } = action.payload;

			state.mediaUrls[mediaId] = url;
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
				(contact) => contact._id === updated._id
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
			state.chats[chatId] = messages;
		},

		// update messages (pagination scroll bar top)
		prependMessages(state, action) {
			const { chatId, messages } = action.payload;

			if (!state.chats[chatId]) {
				state.chats[chatId] = messages;
			} else {
				// Get existing message IDs for quick lookup
				const existingIds = new Set(state.chats[chatId].map((msg) => msg._id));

				// Filter out any messages that already exist
				const uniqueNewMessages = messages.filter(
					(msg) => !existingIds.has(msg._id)
				);

				// Only prepend if there are unique messages
				if (uniqueNewMessages.length > 0) {
					state.chats[chatId] = [...uniqueNewMessages, ...state.chats[chatId]];
				}
			}
		},
		// prependMessages(state, action) {
		// 	const { chatId, messages } = action.payload;
		// 	if (!state.chats[chatId]) {
		// 		state.chats[chatId] = messages;
		// 	} else {
		// 		state.chats[chatId] = [...messages, ...state.chats[chatId]];
		// 	}
		// },
		appendMessage(state, action) {
			const { chatId, message } = action.payload;

			if (!state.chats[chatId]) state.chats[chatId] = [];

			// if message already exisit then update the status
			const index = state.chats[chatId].findIndex(
				(msg) => msg.messageId === message.messageId
			);

			if (index !== -1) {
				state.chats[chatId][index] = {
					...state.chats[chatId][index],
					...message,
				};
			}
			// else push new message
			else {
				state.chats[chatId].push(message);
				const contact = state.contacts.find(
					(r) => r.roomId === message?.roomId
				);

				// Update message metadata
				contact.lastMessage = message.content || '';
				contact.lastMessageAt = message.sentAt;
				contact.type = message.type;

				// Increment unread count if not active chat
				if (state.activeChat.roomId !== message.roomId) {
					contact.unreadCount += 1;
				}

				// Move contact to the top
				state.contacts = [
					contact,
					...state.contacts.filter((item, i) => item.roomId !== contact.roomId),
				];
			}
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
	setMediaUrl,
	setActiveChat,
	deleteContact,
} = whatsappSlice.actions;

export default whatsappSlice.reducer;
