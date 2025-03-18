import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	newNotifyItem: {
		type: -1,
		message: '',
	},
};

const webSocketSlice = createSlice({
	name: 'socket',
	initialState,
	reducers: {
		newNotifyItem: (state, action) => {
			state.newNotifyItem = {
				type: action.payload.type,
				message: action.payload.message,
			};
		},
		clearNotifyItem: (state) => {
			state.newNotifyItem = { type: -1, message: '' };
		},
	},
});

export const { newNotifyItem, clearNotifyItem } = webSocketSlice.actions;
export default webSocketSlice.reducer;
