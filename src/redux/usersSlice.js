import { createSlice } from '@reduxjs/toolkit';

const usersSlice = createSlice({
	name: 'users',
	initialState: {
		list: [],
		allUsers: [],
	},
	reducers: {
		setUsers: (state, action) => {
			state.list = action.payload;
		},
		setAllUsers: (state, action) => {
			state.allUsers = action.payload;
		},

		updateAllUsers: (state, action) => {
			const { id, updates } = action.payload;
			const index = state.allUsers.findIndex((user) => user._id === id);
			if (index !== -1) {
				state.allUsers[index] = {
					...state.allUsers[index],
					...updates,
				};
			}
		},
	},
});

export const { setUsers, setAllUsers, updateAllUsers } = usersSlice.actions;
export default usersSlice.reducer;
