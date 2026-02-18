import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	leads: [],
};

const freshLeadPoolSlice = createSlice({
	name: 'freshLeadPool',
	initialState,
	reducers: {
		addFreshLeadPool(state, action) {
			const lead = action.payload;

			// prevent duplicates
			const exists = state.leads.find((l) => l._id === lead._id);
			if (exists) return;

			state.leads.push({
				...lead,
				isResolved: false,
			});
		},

		removeFreshLeadPool(state, action) {
			const leadId = action.payload;
			if (!leadId) return;
			state.leads = state.leads.filter((l) => l._id !== leadId);
		},

		markLeadPoolResolved(state, action) {
			const { leadId, isResolved = true } = action.payload;

			const lead = state.leads.find((l) => l._id === leadId);

			if (lead) {
				lead.isResolved = isResolved;
			}
		},

		clearExpiredLeadPool(state) {
			const now = Date.now();

			state.leads = state.leads.filter((l) => l.expiresAt > now);
		},

		clearAllLeadPoolFreshLeads(state) {
			state.leads = [];
		},
	},
});

export const {
	addFreshLeadPool,
	removeFreshLeadPool,
	markLeadPoolResolved,
	clearExpiredLeadPool,
	clearAllLeadPoolFreshLeads,
} = freshLeadPoolSlice.actions;

export default freshLeadPoolSlice.reducer;
