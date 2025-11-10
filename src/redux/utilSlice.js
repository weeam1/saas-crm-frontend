import { createSlice } from '@reduxjs/toolkit';

const utilSlice = createSlice({
	name: 'util',
	initialState: {
		agencies: [],
	},
	reducers: {
		setAgenciesData(state, action) {
			const data = action.payload;

			state.agencies = data;
		},
	},
});

export const { setAgenciesData } = utilSlice.actions;

export default utilSlice.reducer;
