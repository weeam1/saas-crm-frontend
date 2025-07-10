import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	currentPage: null,
	pageSize: null,
	totalLeads: null,
	totalPages: null,
	doc: [],
};

const leadsSlice = createSlice({
	name: 'leads',
	initialState,
	reducers: {
		updateLeads: (state, action) => {
			const { currentPage, leads, pageSize } = action.payload;

			// For any other page (e.g., page 2), remove previous doc and update.
			state.currentPage = currentPage;
			state.doc = leads?.doc ?? [];
			state.totalLeads = leads?.totalLeads;
			state.totalPages = leads?.totalPages;
			state.pageSize = pageSize;
		},

		// Updates a specific field of a lead based on lead ID
		updateLeadField: (state, action) => {
			const { id, key, value } = action.payload;

			const leadIndex = state.doc.findIndex((lead) => lead._id === id);

			if (leadIndex !== -1) {
				// Create a new leads array with updated value (Immutable Update)
				state.doc = state.doc?.map((lead, index) =>
					index === leadIndex ? { ...lead, [key]: value } : lead
				);
			}
		},

		updateLeadFields: (state, action) => {
			const { id, updates } = action.payload; // updates is an array of { key, value }
			const leadIndex = state.doc.findIndex((lead) => lead._id === id);

			if (leadIndex !== -1) {
				// Update multiple fields (Immutable Update)
				state.doc = state.doc.map((lead, index) =>
					index === leadIndex
						? {
								...lead,
								...updates.reduce((acc, { key, value }) => {
									acc[key] = value;
									return acc;
								}, {}),
							}
						: lead
				);
			}
		},

		// updateMultipleLeadFields: (state, action) => {
		// 	// Array of updates [{ id, key, value }, ...]
		// 	const { updates } = action.payload;

		// 	console.log({ updates });

		// 	const updatesMap = updates.reduce((acc, { id, key, value }) => {
		// 		if (!acc[id]) acc[id] = {};
		// 		acc[id][key] = value;
		// 		return acc;
		// 	}, {});

		// 	state.doc = state.doc.map((lead) =>
		// 		updatesMap[lead._id] ? { ...lead, ...updatesMap[lead._id] } : lead
		// 	);
		// },

		updateMultipleLeadFields: (state, action) => {
			const { updates } = action.payload;

			// Convert updates array into a map for easy lookup
			const updatesMap = updates.reduce((acc, update) => {
				if (!update.id) {
					return acc;
				}
				acc[update.id] = { ...update }; // Store full update object
				return acc;
			}, {});

			// Apply updates
			// state.doc = state.doc.map((lead) =>
			// 	updatesMap[lead._id] ? { ...lead, ...updatesMap[lead._id] } : lead
			// );

			state.doc = state.doc.map((lead) => {
				const update = updatesMap[lead._id];
				if (!update) return lead;

				const updatedLead = { ...lead, ...update };

				// Handle nested latestNote update if present
				if (update.latestNote) {
					updatedLead.latestNote = {
						...lead.latestNote,
						...update.latestNote,
					};
				}

				return updatedLead;
			});
		},

		addOrUpdateLead: (state, action) => {
			const newLead = action.payload;

			const existingIndex = state.doc.findIndex(
				(lead) => lead._id === newLead._id
			);

			if (existingIndex !== -1) {
				state.doc[existingIndex] = {
					...state.doc[existingIndex],
					...newLead,
				};
			} else if (state.currentPage === 1) {
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
	updateLeadFields,
	updateMultipleLeadFields,
	addOrUpdateLead,
} = leadsSlice.actions;
export default leadsSlice.reducer;
