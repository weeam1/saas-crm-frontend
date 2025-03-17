import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	list: [],
	countryNames: [],
};

const countriesSlice = createSlice({
	name: 'countries',
	initialState,
	reducers: {
		setCountries: (state, action) => {
			state.list = action.payload;
		},
		setCountryNames: (state, action) => {
			state.countryNames = [...new Set(action.payload)];
		},
	},
});

export const { setCountries, setCountryNames } = countriesSlice.actions;
export default countriesSlice.reducer;
