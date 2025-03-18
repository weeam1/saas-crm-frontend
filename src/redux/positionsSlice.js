import { createSlice } from '@reduxjs/toolkit';

const positionsSlice = createSlice({
	name: 'positions',
	initialState: {
		options: [],
	},
	reducers: {
		addPositions: (state, action) => {
			state.options = action.payload;
		},
	},
});

export const { addPositions } = positionsSlice.actions;
export default positionsSlice.reducer;
