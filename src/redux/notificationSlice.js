import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	list: [],
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

			const index = state.list.findIndex((n) => n._id === id);
			if (index === -1) return;

			state.list[index] = {
				...state.list[index],
				...updates,
			};
		},

		clearNotifyItem(state) {
			state.hasNew = false;
		},
		setNotifyItem(state) {
			state.hasNew = false;
		},
	},
});

export const {
	resetNotifications,
	updateNotificationList,
	addNewNotification,
	setNotifyItem,
	clearNotifyItem,
	updateNotification,
} = notificationSlice.actions;

export default notificationSlice.reducer;
