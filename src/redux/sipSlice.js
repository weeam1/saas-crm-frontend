import { createSlice } from '@reduxjs/toolkit';

const sipSlice = createSlice({
	name: 'sip',
	initialState: {
		transcriptions: {},
	},
	reducers: {
		setAudioTranscription(state, action) {
			const { id, data } = action.payload;

			if (!id || !data?.language) {
				console.warn(
					'Invalid transcription payload: missing id or language',
					action.payload
				);
				return;
			}

			const key = `${id}_${data?.language}`;

			state.transcriptions[key] = data;
		},
	},
});

export const { setAudioTranscription } = sipSlice.actions;

export default sipSlice.reducer;
