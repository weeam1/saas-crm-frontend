import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	list: [],
	unreadCount: 0,
	hasNew: false,
};

const notificationSlice = createSlice({
	name: 'notifications',
	initialState,
	reducers: {
		resetNotifications(state) {
			state.list = [];
		},

		updateNotificationList(state, action) {
			const { notifications = [], append = false } = action.payload || {};

			if (!Array.isArray(notifications)) return;

			if (append) {
				// append older notifications (pagination)
				const existingIds = new Set(state.list.map((n) => n._id));

				const filtered = notifications.filter((n) => !existingIds.has(n._id));

				state.list = [...state.list, ...filtered];
			} else {
				// fresh fetch
				state.list = notifications;
			}
		},

		addNewNotification(state, action) {
			const notification = action.payload;
			if (!notification) return;

			const exists = state.list.some((n) => n._id === notification._id);

			if (exists) return;

			state.list = [notification, ...state.list];

			state.hasNew = true;
		},

		updateNotification(state, action) {
			const { id, updates } = action.payload || {};
			if (!id) return;

			const index = state.list.findIndex(
				(item) => item?.notification?._id === id,
			);
			console.log({ index });
			if (index === -1) return;

			state.list[index] = {
				...state.list[index],
				...updates,
			};
		},
		setUnreadCount(state, action) {
			state.unreadCount = action.payload;
		},

		incrementUnreadCount(state) {
			state.unreadCount += 1;
		},

		decrementUnreadCount(state) {
			console.log('decrement count');
			state.unreadCount = Math.max(0, state.unreadCount - 1);
		},

		clearNotifyItem(state) {
			state.hasNew = false;
		},
		setNotifyItem(state) {
			state.hasNew = true;
			state.unreadCount += 1;
		},
	},
});

export const {
	resetNotifications,
	updateNotificationList,
	addNewNotification,
	setNotifyItem,
	setUnreadCount,
	incrementUnreadCount,
	decrementUnreadCount,
	clearNotifyItem,
	updateNotification,
} = notificationSlice.actions;

export default notificationSlice.reducer;
