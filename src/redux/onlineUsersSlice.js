import { createSlice } from '@reduxjs/toolkit';

const onlineUsersSlice = createSlice({
	name: 'onlineUsers',
	initialState: { count: 0, users: [] },
	reducers: {
		setOnlineUsers: (state, action) => {
			state.count = action.payload.count;
			state.users = action.payload.users;
		},
	},
});

export const { setOnlineUsers } = onlineUsersSlice.actions;
export default onlineUsersSlice.reducer;
