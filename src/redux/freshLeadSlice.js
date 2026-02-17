// import { createSlice } from '@reduxjs/toolkit';

// const initialState = {
// 	currentLead: null, // normalized single active lead
// 	isOpen: false,
// 	ownedByMe: null,
// };

// const freshLeadSlice = createSlice({
// 	name: 'freshLead',
// 	initialState,
// 	reducers: {
// 		setFreshLead(state, action) {
// 			state.currentLead = action.payload;
// 			state.isOpen = true;
// 			state.ownedByMe = null;
// 		},
// 		clearFreshLead(state, action) {
// 			state.currentLead = null;
// 			state.isOpen = false;
// 			state.ownedByMe = null;
// 		},
// 		setLeadClaimed(state, action) {
// 			const { leadId, isClaimed = false } = action.payload;
// 			state.currentLead = null;
// 			state.isOpen = false;
// 			state.ownedByMe = !isClaimed;
// 		},
// 	},
// });

// export const { setFreshLead, clearFreshLead, setLeadClaimed } =
// 	freshLeadSlice.actions;
// export default freshLeadSlice.reducer;
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	leads: [],
};

const freshLeadSlice = createSlice({
	name: 'freshLead',
	initialState,
	reducers: {
		addFreshLead(state, action) {
			const lead = action.payload;

			// prevent duplicates
			const exists = state.leads.find((l) => l._id === lead._id);
			if (exists) return;

			state.leads.push({
				...lead,
				isClaimed: false,
			});
		},

		removeFreshLead(state, action) {
			const leadId = action.payload;
			if (!leadId) return;
			state.leads = state.leads.filter((l) => l._id !== leadId);
		},

		markLeadClaimed(state, action) {
			const { leadId, isClaimed = true } = action.payload;

			const lead = state.leads.find((l) => l._id === leadId);

			if (lead) {
				lead.isClaimed = isClaimed;
			}
		},

		clearExpiredLeads(state) {
			const now = Date.now();

			state.leads = state.leads.filter((l) => l.expiresAt > now);
		},

		clearAllLeads(state) {
			state.leads = [];
		},
	},
});

export const {
	addFreshLead,
	removeFreshLead,
	markLeadClaimed,
	clearExpiredLeads,
	clearAllLeads,
} = freshLeadSlice.actions;

export default freshLeadSlice.reducer;
