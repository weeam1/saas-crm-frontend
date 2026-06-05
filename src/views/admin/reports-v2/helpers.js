export const getFilteredStats = (stats, type) => {
	const filtered = stats?.filter((stat) => stat.value > 0); // Exclude zero values
	const sorted = [...filtered]?.sort((a, b) => b.value - a.value);
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

export const viewOptions = [
	{ label: 'Top 5', value: 'top5' },
	{ label: 'Top 10', value: 'top10' },
	{ label: 'All', value: 'all' },
];

export const yearsOptions = [
	{ label: '2025', value: 2025 },
	{ label: '2024', value: 2024 },
	{ label: '2023', value: 2023 },
];

export const PERIOD_OPTIONS = [
	{ label: 'Today', value: 'today' },
	{ label: 'Weekly', value: 'weekly' },
	{ label: 'Monthly', value: 'monthly' },
];

export const dayOptions = [
	{ label: '30 Days', value: 30 },
	{ label: '60 Days', value: 60 },
	{ label: '90 Days', value: 90 },
	// { label: 'All Time', value: 'all' },
];

// benchmark targets for performance calculation
const BENCHMARKS = {
	leadTarget: 300, // 100 leads = good performance
	agentTarget: 20, // 10 agents = full capacity
	notesTarget: 500, // 10 agents = full capacity
	assignedTarget: 500, // 10 agents = full capacity
};

export const calculatePerformance = (
	leads = 0,
	agents = 0,
	assigned = 0,
	notes = 0,
) => {
	const leadScore = Math.min((leads / BENCHMARKS.leadTarget) * 40, 50); // 40%
	const agentScore = Math.min((agents / BENCHMARKS.agentTarget) * 20, 50); // 30%
	const noteScore = Math.min((notes / BENCHMARKS.notesTarget) * 20, 50); // 30%
	const assignedScore = Math.min(
		(assigned / BENCHMARKS.assignedTarget) * 20,
		50,
	); // 30%

	const totalScore = Math.min(
		leadScore + agentScore + assignedScore + noteScore,
		100,
	);

	console.log({ totalScore });
	const rating = +Math.round((totalScore / 100) * 5);

	return {
		score: +Math.round(totalScore),
		rating,
	};
};
