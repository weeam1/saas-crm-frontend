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
			state.list.splice(action.payload, 1); // remove the announcement at the current index
		},
		clearAnnouncements: (state) => {
			state.list = []; // clear all announcements
		},
	},
});

export const { addAnnouncement, clearAnnouncement, clearAnnouncements } =
	announcementsSlice.actions;
export default announcementsSlice.reducer;
