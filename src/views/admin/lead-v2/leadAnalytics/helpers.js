// Small descriptions for each column
export const analyticsColumnDescriptions = {
	category: 'The primary grouping or classification for organizing your leads.',
	leadCount: 'Total number of leads in this category.',
	deals: 'Number of successfully closed deals from these leads.',
	notesCount:
		'Total number of notes recorded across all leads in this category.',
	interestedLeads: 'Leads actively engaged or expressing interest.',
	notInterestedLeads: 'Leads who declined or are no longer interested.',
	dealConversionRate:
		'Success rate: percentage of leads that converted to deals.\nFormula: (Deals / Total Leads × 100).',
	avgNotesPerLead:
		'Average number of notes per lead, indicating engagement level.\nFormula: (Total Notes / Total Leads).',
	todayLeads: 'Leads added in the last 24 hours.',
	currentWeekLeads: 'Leads added since the start of the current week.',
	currentMonthLeads: 'Leads added since the start of the current month.',
	prevMonthLeads: 'Leads created during the previous month.',
	newLeadsToday: 'New or untouched leads created today.',
	newLeadsThisWeek: 'New or untouched leads added this week.',
	newLeadsThisMonth: 'New or untouched leads added this month.',
	leadsAssignedToManagers: 'Leads currently being handled by managers.',
	leadsAssignedToAgents: 'Leads currently assigned to sales agents.',
	releasedLeads: 'Leads that were returned to the pool for reassignment.',
	unassignedLeads:
		'Leads that haven’t been allocated to any manager & agent yet and are available for assignment.',
	leadGrowthRate:
		'Growth rate: percentage change in leads compared to last month.\nFormula: (This Month - Last Month) / Last Month × 100.',
};

export const normalizeSearch = (str) =>
	str.toLowerCase().replace(/[^a-z0-9]/g, '');

// Helper function to format date as YYYY-M-D
export const formatDate = (date) => {
	if (!date) return null;
	const year = date.getFullYear();
	const month = date.getMonth() + 1; // getMonth() returns 0-11
	const day = date.getDate();
	return `${year}-${month}-${day}`;
};

export const CATEGORIES = [
	{ value: 'leadStatus', label: 'Lead Status' },
	{ value: 'eLeadStatus', label: 'Main Status' },
	{ value: 'adset', label: 'Ad Set' },
	{ value: 'leadSourceMedium', label: 'Source Medium' },
	{ value: 'leadSourceCampaign', label: 'Source Campaign' },
	{ value: 'leadCampaign', label: 'Campaign' },
	{ value: 'leadSourceChannel', label: 'Source Channel' },
	{ value: 'leadSource', label: 'Lead Source' },
	{ value: 'leadSourceDetails', label: 'Source Details' },
	{ value: 'leadLang', label: 'Language' },
];

export const getDateRange = (range) => {
	const now = new Date();
	let from, to;

	switch (range) {
		case 'today':
			from = new Date(now);
			to = new Date(now);
			break;
		case 'yesterday':
			from = new Date(now);
			from.setDate(now.getDate() - 1);
			to = new Date(from);
			break;
		case 'last7Days':
			from = new Date(now);
			from.setDate(now.getDate() - 7);
			to = new Date(now);
			break;
		case 'last30Days':
			from = new Date(now);
			from.setDate(now.getDate() - 30);
			to = new Date(now);
			break;
		case 'thisMonth':
			from = new Date(now.getFullYear(), now.getMonth(), 1);
			to = new Date(now.getFullYear(), now.getMonth() + 1, 0);
			break;
		case 'lastMonth':
			from = new Date(now.getFullYear(), now.getMonth() - 1, 1);
			to = new Date(now.getFullYear(), now.getMonth(), 0);
			break;
		case 'thisYear':
			from = new Date(now.getFullYear(), 0, 1);
			to = new Date(now.getFullYear(), 11, 31);
			break;
		case 'allTime':
			from = null;
			to = null;
			break;
		default:
			from = null;
			to = null;
	}

	// // Set time to beginning of day for from date
	// if (from) {
	// 	from.setHours(0, 0, 0, 0);
	// }

	// // Set time to end of day for to date
	// if (to) {
	// 	to.setHours(23, 59, 59, 999);
	// }

	return { from: formatDate(from), to: formatDate(to) };
};

export const dateOptions = [
	{ label: 'Today', value: 'today' },
	{ label: 'Yesterday', value: 'yesterday' },
	{ label: 'Last 7 days', value: 'last7Days' },
	{ label: 'Last 30 days', value: 'last30Days' },
	{ label: 'This month', value: 'thisMonth' },
	{ label: 'Last month', value: 'lastMonth' },
	{ label: 'This year', value: 'thisYear' },
	{ label: 'All Time', value: 'allTime' },
];

export const findMatchingRange = (from, to) => {
	for (const { value } of dateOptions) {
		const { from: f, to: t } = getDateRange(value);
		if (f === from && t === to) return value;
	}
	return null;
};
