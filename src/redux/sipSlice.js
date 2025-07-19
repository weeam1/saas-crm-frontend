import { createSlice } from '@reduxjs/toolkit';

const sipSlice = createSlice({
	name: 'sip',
	initialState: {
		transcriptions: {},
	},
	reducers: {
		setAudioTranscription(state, action) {
			const { id, data } = action.payload;

			console.log({ id, data });

			state.transcriptions[id] = data;
		},
	},
});

export const { setAudioTranscription } = sipSlice.actions;

export default sipSlice.reducer;
