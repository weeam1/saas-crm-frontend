import { createSlice } from '@reduxjs/toolkit';
import { buildPermissionMap } from 'utils/permissionUtils';

const initialState = {
	permissionMap:
		buildPermissionMap(JSON.parse(localStorage.getItem('user'))) || {},
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
