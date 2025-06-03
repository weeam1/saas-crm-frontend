export const getFilteredStats = (stats, type) => {
	const filtered = stats.filter((stat) => stat.value > 0); // Exclude zero values
	const sorted = [...filtered].sort((a, b) => b.value - a.value);
	// const sorted = [...stats].sort((a, b) => b.value - a.value);

	switch (type) {
		case 'top5':
			return sorted.slice(0, 5);
		case 'top10':
			return sorted.slice(0, 10);
		default:
			return sorted;
	}
};

export const getTopAgentsByLeads = (agents = [], topN = 5) => {
	if (!Array.isArray(agents)) return [];

	return agents
		.filter((agent) => agent?.leadData?.totalLeads >= 0)
		.sort((a, b) => b.leadData.totalLeads - a.leadData.totalLeads)
		.slice(0, topN);
};

export const getTopAgentsByNotes = (agents = [], topN = 5) => {
	if (!Array.isArray(agents)) return [];

	return agents
		.filter((agent) => agent?.leadData?.totalNotes >= 0)
		.sort((a, b) => b.leadData.totalNotes - a.leadData.totalNotes)
		.slice(0, topN);
};

export const getTopAgentsByKey = (agents, key, limit = 5) =>
	[...agents]
		.sort((a, b) => (b[key] || 0) - (a[key] || 0))
		.slice(0, limit)
		.map((agent) => ({
			name: agent.fullName,
			value: agent[key] || 0,
			_id: agent._id,
		}));
