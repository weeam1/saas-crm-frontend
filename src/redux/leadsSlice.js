import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	currentPage: null, // Tracks the current page number of stored leads
	pageSize: null,
	totalLeads: null,
	totalPages: null,
	doc: [], // Stores the leads doc
};

const leadsSlice = createSlice({
	name: 'leads',
	initialState,
	reducers: {
		// This action updates the leads doc based on the page number provided.
		updateLeads: (state, action) => {
			const { currentPage, leads, pageSize } = action.payload;

			// If page is 1 and doc for page 1 already exists, do not update.
			if (
				currentPage === 1 &&
				state.currentPage === 1 &&
				state.doc.length > 0
			) {
				return;
			}

			// For any other page (e.g., page 2), remove previous doc and update.
			state.currentPage = currentPage;
			state.doc = leads?.doc;
			state.totalLeads = leads?.totalLeads;
			state.totalPages = leads?.totalPages;
			state.pageSize = pageSize;
		},

		// Updates a specific field of a lead based on lead ID
		updateLeadField: (state, action) => {
			const { id, key, value } = action.payload;

			const leadIndex = state.doc.findIndex((lead) => lead._id === id);

			// console.log({ leadIndex, key, value });

			if (leadIndex !== -1) {
				// Create a new leads array with updated value (Immutable Update)
				state.doc = state.doc?.map((lead, index) =>
					index === leadIndex ? { ...lead, [key]: value } : lead
				);

				// console.log({ leads: state.doc });
			}
		},
	},
});

export const { updateLeads, updateLeadField } = leadsSlice.actions;
export default leadsSlice.reducer;
