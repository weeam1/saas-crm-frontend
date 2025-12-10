import { createSlice } from '@reduxjs/toolkit';
import { maskPhoneNumber } from 'utils/webrtc';

const webrtcSlice = createSlice({
	name: 'webrtc',
	initialState: {
		isModalOpen: false,
		userSettings: {},

		activeCall: null,
		incomingCaller: '',
		dialMode: 'manual',
		callType: 'outbound',

		sipStatus: 'disconnected',
	},
	reducers: {
		// Outbound Call Actions
		setAutoDialLead: (state, action) => {
			state.activeCall = {
				phoneNumber: action.payload.phoneNumber,
				leadName: action.payload.leadName,
				id: action.payload.contactId,
			};

			state.dialMode = 'auto';
			state.callType = 'outbound';
			if (!state.isModalOpen) state.isModalOpen = true;
		},

		// Inbound Call Actions
		receiveIncomingCall: (state, action) => {
			if (!state.isModalOpen) state.isModalOpen = true;

			state.incomingCaller = action.payload;
			state.activeCall = {
				phoneNumber: action.payload,
				leadName: maskPhoneNumber(action.payload) || 'Lead',
				id: Date.now(),
			};
			state.callType = 'inbound';
		},

		saveUserDialerSettings: (state, action) => {
			state.userSettings = action.payload;
		},

		// Modal Control
		toggleDialerModal: (state) => {
			state.isModalOpen = !state.isModalOpen;
		},

		// Connection Status
		updateSipStatus: (state, action) => {
			state.sipStatus = action.payload;
		},

		// Call State Management
		resetAutoDailState: (state) => {
			state.activeCall = null;
			state.incomingCaller = '';
			state.dialMode = 'manual';
			state.callType = 'outbound';
		},

		resetSettings: (state) => {
			state.isModalOpen = false;
			state.userSettings = {};

			state.activeCall = null;
			state.incomingCaller = '';
			state.dialMode = 'manual';
			state.callType = 'outbound';

			state.sipStatus = 'disconnected';
		},
	},
});

export const {
	setAutoDialLead,
	resetAutoDailState,
	receiveIncomingCall,
	toggleDialerModal,
	updateSipStatus,
	resetSettings,
	saveUserDialerSettings,
} = webrtcSlice.actions;

export default webrtcSlice.reducer;
