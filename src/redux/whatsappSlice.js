import { createSlice } from '@reduxjs/toolkit';

const whatsappSlice = createSlice({
	name: 'whatsapp',
	initialState: {
		contacts: [],
		chat: [],
	},
	reducers: {
		setContacts: (state, action) => {
			state.contacts = action.payload;
		},
	},
});

export const { setContacts } = whatsappSlice.actions;
export default whatsappSlice.reducer;
