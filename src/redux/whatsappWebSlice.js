import { createSlice } from '@reduxjs/toolkit';
import { getMessageLabel } from 'views/admin/whatsapp-v2/utils/helpers';
import { getMediaSrc } from 'views/admin/whatsapp-v2/utils/mediaSelector';

const initialState = {
	qr: '',
	isAuthenticated: false,
	isReady: false,
	allConversations: [],
	totalChats: 0,
	page: 1,
	hasMoreChats: false,
	activeChat: null,
	userChats: {},
	messages: [],
	error: null,
	isChatsFetching: false,
	whatsapp_disconnect: '',
	whatsapp_loading: {},
	downloaded_media: {}, // { messageId: base64String }
};

const whatsappWebSlice = createSlice({
	name: 'whatsappWeb',
	initialState,
	reducers: {
		qrCode: (state, action) => {
			state.qr = action.payload?.qrCode || '';
			state.whatsapp_disconnect = '';
		},
		authFail: (state, action) => {
			state.error = action.payload;
		},
		setChatsFetching: (state, action) => {
			state.isChatsFetching = action.payload;
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
			state.error =
				action.payload?.message || 'Error: Please reload and try again!';
		},
		// chatsLoaded: (state, action) => {
		// 	console.log('chats loaded: ', action.payload);
		// 	if (action.payload?.page === 1) {
		// 		state.allConversations = action.payload?.chats || [];
		// 		state.totalChats = action.payload?.total || 0;
		// 	} else if (action.payload?.chats?.length > 0) {
		// 		state.allConversations = [
		// 			...state.allConversations,
		// 			...(action.payload?.chats || []),
		// 		];
		// 	}
		// 	state.page = action.payload?.page || 1;
		// 	state.hasMoreChats = action.payload?.hasMore || false;
		// },
		chatsLoaded: (state, action) => {
			console.log('chats loaded:', action.payload);
			const {
				page = 1,
				chats = [],
				total = 0,
				hasMore = false,
			} = action.payload || {};

			if (page === 1) {
				// Reset on first page
				state.allConversations = chats;
				state.totalChats = total;
			} else if (chats.length > 0) {
				// Merge and de-duplicate by chat.id (or your unique key)
				const existingChats = new Map(
					state.allConversations.map((chat) => [chat.id, chat])
				);
				for (const chat of chats) {
					existingChats.set(chat.id, chat);
				}
				state.allConversations = Array.from(existingChats.values());
			}

			state.page = page;
			state.hasMoreChats = hasMore;
		},
		saveDownloadedMedia: (state, action) => {
			const { media, mediaKey } = action.payload || {};
			// if (!media) return;

			// state.downloaded_media[mediaKey] = media?.data;

			console.log('SLICE DWONLOAD MEDIA: ', mediaKey);

			if (!media || !mediaKey) return;
			// media = { data: 'base64string', mimeType: 'image/png', fileName: 'pic.png' }
			state.downloaded_media[mediaKey] = {
				data: getMediaSrc({
					data: media.data,
					mimeType: media.mimetype,
				}),
				mimeType: media.mimetype,
				fileName: media.filename || 'File',
			};
		},

		setActiveChat: (state, action) => {
			state.activeChat = action.payload;
		},
		chatLoaded: (state, action) => {
			const { sessionId, chatId, messages } = action.payload;
			if (!sessionId || !chatId) return;

			// Replace or set messages list for this chatId
			state.userChats[chatId] = messages || [];

			// also update unread count to 0 in all conversations if active chat
			const chat = state.allConversations?.find((c) => c.id === chatId);
			if (chat) {
				chat.unreadCount = 0;
			}
		},
		newMessage: (state, action) => {
			const { message } = action.payload;

			if (!message) return;
			console.log('new message received:', message);

			const msgId = message?.id?._serialized;
			if (!msgId || message?.isStatus) return;

			const chatId = message?.fromMe ? message?.to : message?.from;
			if (!chatId) return;

			// Ensure the chat array exists
			if (!Array.isArray(state.userChats[chatId])) {
				state.userChats[chatId] = [];
			}

			// Ensure the chat array exists
			const messages = state.userChats[chatId] || [];
			state.userChats[chatId] = messages;

			// ********** UPDATE OR ADD MESSAGE IN CHAT MESSAGES **********
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

			// ************ UPDATE ALL CONVERSATIONS LAST MESSAGE & UNREAD COUNT ************

			const chatIndex = state.allConversations?.findIndex(
				(item) => item?.id === chatId
			);

			const newLastMessage = {
				id: message?.id?._serialized,
				body: message?.body || 'New Message',
				timestamp: message?.timestamp || Date.now(),
				type: message?.type || 'chat',
				fromMe: message?.fromMe,
				hasMedia: message?.hasMedia || false,
			};

			if (chatIndex !== -1) {
				const isActiveChat = state.activeChat?.id === chatId;

				const isNotLastMessage =
					state.allConversations[chatIndex]?.lastMessage?.id !==
					message?.id?._serialized;

				if (isNotLastMessage) {
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
				}
			}
			//  if chat not found in all conversations, add it to the top of the list
			else {
				const newChat = {
					id: message?.from || message?.to,
					name: message?.contact?.pushname || message?.from || message?.to,
					lastMessage: newLastMessage,
					unreadCount: message?.fromMe ? 0 : 1,
					timestamp: message?.timestamp || Date.now(),
					isGroup: message?.isGroup || false,
					isReadOnly: message?.isReadOnly || false,
					profilePicture: null,
					pinned: false,
					isMuted: false,
				};

				state.allConversations.unshift(newChat);
			}
			// Always sort by timestamp descending to ensure correct order
			state.allConversations.sort((a, b) => b.timestamp - a.timestamp);
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
			// whatsapp_disconnect: action.payload?.message || 'WhatsApp disconnected',
		}),

		reset: (state) => {
			const preservedMedia = state.downloaded_media;
			return {
				...initialState,
				downloaded_media: preservedMedia,
			};
		},
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
	setChatsFetching,
	reset,
	saveDownloadedMedia,
} = whatsappWebSlice.actions;

// export the selector
export const getMessagesByChatId = (state, chatId) => {
	return state.whatsappWeb.userChats[chatId] || [];
};

// export const getMessagesByChatId = (state, chatId, options = {}) => {
// 	const { onlyMedia = false } = options;

// 	let messages = state.whatsappWeb.userChats[chatId] || [];

// 	// // Normalize timestamp (some messages may have timestamp in seconds)
// 	// messages = messages.map((msg) => ({
// 	// 	...msg,
// 	// 	timestamp:
// 	// 		Number(msg.timestamp) * (String(msg.timestamp).length <= 10 ? 1000 : 1),
// 	// }));

// 	// Optional: Filter only media messages
// 	if (onlyMedia) {
// 		messages = messages.filter((msg) => msg.hasMedia === true);
// 	}

// 	// Sort ascending by timestamp
// 	messages.sort((a, b) => a?.timestamp - b?.timestamp);

// 	return messages;
// };

export const getChat = (state, chatId) => {
	const chat = state.whatsappWeb.allConversations?.find(
		(item) => item?.id === chatId
	);
	return chat ?? null;
};

export default whatsappWebSlice.reducer;
