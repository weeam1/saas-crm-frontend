import { createSlice } from '@reduxjs/toolkit';

const announcementsSlice = createSlice({
	name: 'announcements',
	initialState: {
		list: [],
	},
	reducers: {
		addAnnouncement: (state, action) => {
			state.list.unshift(action.payload);
		},
		addAnnouncements: (state, action) => {
			const newAnnouncements = action.payload?.data || [];

			// Prevent duplicates by id
			const existingIds = new Set(state.list.map((a) => a.id));

			const filtered = newAnnouncements.filter((a) => !existingIds.has(a.id));

			state.list = [...filtered, ...state.list];
		},

		clearAnnouncement: (state, action) => {
			const idToRemove = action.payload; // The ID of the announcement to remove
			state.list = state.list.filter(
				(announcement) => announcement.id !== idToRemove,
			);
		},
		clearAnnouncements: (state) => {
			state.list = []; // clear all announcements
		},
	},
});

export const {
	addAnnouncement,
	addAnnouncements,
	clearAnnouncement,
	clearAnnouncements,
} = announcementsSlice.actions;
export default announcementsSlice.reducer;
