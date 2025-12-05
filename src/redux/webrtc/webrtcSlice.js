import { createSlice } from '@reduxjs/toolkit';

const webrtcSlice = createSlice({
	name: 'webrtc',
	initialState: {
		modal: false,
		callingNumber: null,
	},
	reducers: {
		setCallingNumber: (state, action) => {
			state.callingNumber = action.payload;
		},
		toggleWebRTCModal: (state) => {
			state.modal = !state.modal;
		},
	},
});

export const { setCallingNumber, toggleWebRTCModal } = webrtcSlice.actions;
export default webrtcSlice.reducer;
