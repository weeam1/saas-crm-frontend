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

		updateMultipleLeadFields: (state, action) => {
			const { updates } = action.payload; // Array of updates [{ id, key, value }, ...]

			// Convert updates array into a dictionary for quick lookup
			const updatesMap = updates.reduce((acc, { id, key, value }) => {
				if (!acc[id]) acc[id] = {};
				acc[id][key] = value;
				return acc;
			}, {});

			// Efficiently update only the necessary leads
			state.doc = state.doc.map(
				(lead) =>
					updatesMap[lead._id] // If this lead needs an update
						? { ...lead, ...updatesMap[lead._id] } // Merge updated fields
						: lead // Keep unchanged leads as they are
			);
		},

		addOrUpdateLead: (state, action) => {
			const newLead = action.payload;

			// Check if lead already exists
			const existingIndex = state.doc.findIndex(
				(lead) => lead._id === newLead._id
			);

			if (existingIndex !== -1) {
				// **Update existing lead**
				state.doc[existingIndex] = {
					...state.doc[existingIndex],
					...newLead,
				};
			} else if (state.currentPage === 1) {
				// **Add new lead**
				if (state.doc.length > 0) {
					state.doc.pop(); // Remove last item
				}
				state.doc.unshift(newLead); // Add new lead at the top
			}
		},
	},
});

export const {
	updateLeads,
	updateLeadField,
	updateMultipleLeadFields,
	addOrUpdateLead,
} = leadsSlice.actions;
export default leadsSlice.reducer;
