import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	user: JSON.parse(window.localStorage.getItem('user')),
	tree: null,
	activeTree: null,
	users: null,
	leadPoolState: 'all_leads',
};

const localSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setUser: (state, action) => {
			state.user = { ...action.payload };
		},

		clearUser: (state) => {
			state.user = null;
			// You can also update localStorage here if needed
		},
		setTree: (state, action) => {
			state.tree = action.payload;
		},
		setActiveTree: (state, action) => {
			state.activeTree = action.payload;
		},
		setUsers: (state, action) => {
			state.users = action?.payload;
		},
		setLeadPoolState: (state, action) => {
			state.leadPoolState = action?.payload;
		},
	},
});

export const {
	setUser,
	clearUser,
	setTree,
	setActiveTree,
	setUsers,
	setLeadPoolState,
} = localSlice.actions;

export default localSlice.reducer;
