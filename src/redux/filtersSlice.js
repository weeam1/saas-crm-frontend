import { createSlice } from '@reduxjs/toolkit';
import { generateSearchTags } from 'utils';

const initialState = {
	queryParams: {},
	searchTags: [],
	currentPage: 1,
	pageSize: 32,
};

const filtersSlice = createSlice({
	name: 'filters',
	initialState,
	reducers: {
		setFilters: (state, action) => {
			state.queryParams = action.payload;
			state.searchTags = generateSearchTags(action.payload);
		},
		updateFilter: (state, action) => {
			state.queryParams = { ...state.queryParams, ...action.payload };
			state.searchTags = generateSearchTags(state.queryParams);
		},
		clearFilters: (state) => {
			state.queryParams = {};
			state.searchTags = [];
		},
		setCurrentPage: (state, action) => {
			state.currentPage = action.payload;
		},
		setPageSize: (state, action) => {
			state.pageSize = action.payload;
		},
	},
});

export const {
	setFilters,
	updateFilter,
	clearFilters,
	setCurrentPage,
	setPageSize,
} = filtersSlice.actions;

export default filtersSlice.reducer;
