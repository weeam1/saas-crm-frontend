import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	permissionMap: {},
};

const permissionSlice = createSlice({
	name: 'permissions',
	initialState,
	reducers: {
		setPermissions: (state, action) => {
			state.permissionMap = action.payload;
		},
		clearPermissions: (state) => {
			state.permissionMap = {};
		},
	},
});

export const { setPermissions, clearPermissions } = permissionSlice.actions;
export default permissionSlice.reducer;
