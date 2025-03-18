import { createSlice } from '@reduxjs/toolkit';

const missingFilesSlice = createSlice({
	name: 'missingFiles',
	initialState: {
		missingFiles: [],
	},
	reducers: {
		addMissingFile(state, action) {
			// Check if the file is already in the array before adding
			if (!state.missingFiles.includes(action.payload)) {
				state.missingFiles.push(action.payload); // Use push to add the file
			}
		},
		clearMissingFiles(state) {
			state.missingFiles = []; // Clear the array of missing files
		},
	},
});

export const { addMissingFile, resetMissingFiles } = missingFilesSlice.actions;

export default missingFilesSlice.reducer;
