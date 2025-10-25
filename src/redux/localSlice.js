import { createSlice } from '@reduxjs/toolkit';

const getUserFromStorage = () => {
	try {
		const data = localStorage.getItem('user') || sessionStorage.getItem('user');
		if (!data) return null;
		const parsed = JSON.parse(data);
		return {
			...parsed,
			roleName: parsed?.roles?.[0]?.roleName || parsed?.role || 'user',
		};
	} catch {
		return null;
	}
};

console.log('local user: ', getUserFromStorage());

const initialState = {
	user: getUserFromStorage(),
	tree: null,
	activeTree: null,
	users: null,
	leadPoolState: 'all_leads',
};

const localSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		// setUser: (state, action) => {
		// 	state.user = { ...action.payload };
		// },

		setUser(state, action) {
			state.user = action.payload;
			const json = JSON.stringify(action.payload);

			console.log('UPDATE LOCAL USER ');
			sessionStorage.setItem('user', json);
			localStorage.setItem('user', json);
		},
		clearUser(state) {
			state.user = null;
			sessionStorage.removeItem('user');
			localStorage.removeItem('user');
		},

		logOutUser() {
			sessionStorage.clear();
			localStorage.clear();
		},

		// clearUser: (state) => {
		// 	state.user = null;
		// 	// You can also update localStorage here if needed
		// },
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

		syncUser(state) {
			state.user = getUserFromStorage();
		},
	},
});

export const {
	setUser,
	clearUser,
	syncUser,
	setTree,
	setActiveTree,
	setUsers,
	logOutUser,
	setLeadPoolState,
} = localSlice.actions;

export default localSlice.reducer;
