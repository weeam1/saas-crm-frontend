import { createSlice } from '@reduxjs/toolkit';

// const webrtcSlice = createSlice({
// 	name: 'webrtc',
// 	initialState: {
// 		modal: false,
// 		lead: null,
// 		incomingNumber: '',
// 		callingMode: 'manual',
// 		userStatus: 'disconnected',
// 	},
// 	reducers: {
// 		setLeadDetails: (state, action) => {
// 			state.lead = {
// 				phoneNumber: action.payload.phoneNumber,
// 				leadName: action.payload.leadName,
// 			};
// 			state.callingMode = 'auto';
// 			if (!state.modal) state.modal = true;
// 		},
// 		setIncomingCall: (state, action) => {
// 			state.incomingNumber = action.payload;
// 			state.modal = true;
// 		},
// 		resetLeadDetails: (state) => {
// 			state.lead = null;
// 			state.callingMode = 'manual';
// 		},
// 		toggleWebRTCModal: (state) => {
// 			state.modal = !state.modal;
// 		},
// 		setSipUserStatus: (state, action) => {
// 			state.userStatus = action.payload;
// 		},
// 	},
// });

const webrtcSlice = createSlice({
  name: 'webrtc',
  initialState: {
		isModalOpen: false,
		
    activeCall: null, 
    incomingCaller: '',
    dialMode: 'manual',
 callType: 'outbound',
    // Connection Status
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
      state.callType = 'outbound'
      if (!state.isModalOpen) state.isModalOpen = true;
    },
    
    // Inbound Call Actions
    receiveIncomingCall: (state, action) => {
      state.incomingCaller = action.payload.phoneNumber;
      state.activeCall = {
        phoneNumber: action.payload.phoneNumber,
        leadName: action.payload.leadName || 'Unknown',
        id: Date.now(),
      };
      state.callType = 'inbound'

      state.isModalOpen = true;
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
		}
  },
});

// export const {
// 	setLeadPhoneNumber,
// 	setIncomingCall, 
// 	resetLeadDetails,
// 	toggleWebRTCModal,
// 	setSipUserStatus,
// } = webrtcSlice.actions;

export const {
  setAutoDialLead,
	resetAutoDailState, 
	receiveIncomingCall,
  toggleDialerModal,
	updateSipStatus,
} = webrtcSlice.actions;

export default webrtcSlice.reducer;
