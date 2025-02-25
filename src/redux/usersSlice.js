import { createSlice } from '@reduxjs/toolkit';

const usersSlice = createSlice({
	name: 'users',
	initialState: {
		list: [],
	},
	reducers: {
		setUsers: (state, action) => {
			console.log({ action });
			state.list = action.payload;
		},
	},
});

export const { setUsers } = usersSlice.actions;
export default usersSlice.reducer;
