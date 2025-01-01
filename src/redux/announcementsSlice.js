import { createSlice } from "@reduxjs/toolkit";

const announcementsSlice = createSlice({
	name: "announcements",
	initialState: {
		list: [],
	},
	reducers: {
		addAnnouncement: (state, action) => {
			state.list.push(action.payload);
		},
		clearAnnouncement: (state, action) => {
			const idToRemove = action.payload; // The ID of the announcement to remove
			state.list = state.list.filter(
				(announcement) => announcement.id !== idToRemove
			);
		},
		clearAnnouncements: (state) => {
			state.list = []; // clear all announcements
		},
	},
});

export const { addAnnouncement, clearAnnouncement, clearAnnouncements } =
	announcementsSlice.actions;
export default announcementsSlice.reducer;
