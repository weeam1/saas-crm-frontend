export const CHART_CONFIG = {
	leadStatus: {
		component: 'LeadStatusPieChart',
		title: 'Lead Status Distribution',
		type: 'pie',
		fullScreenTitle: 'Lead Status Distribution',
	},
	leadAssignment: {
		component: 'LeadAssignmentBarChart',
		title: 'Lead Assignment Distribution',
		type: 'bar',
		fullScreenTitle: 'Lead Assignment Distribution',
	},
	monthlyLeads: {
		component: 'MonthlyLeadsChart',
		title: 'Monthly Leads Comparison',
		type: 'bar',
		fullScreenTitle: 'Monthly Leads Trend',
	},
	// leadTimeline: {
	// 	component: 'LeadTimelineChart',
	// 	title: 'Leads Timeline',
	// 	type: 'area',
	// 	fullScreenTitle: 'Leads Acquisition Timeline',
	// },
	// performanceMetrics: {
	// 	// component:   'PerformanceRadarChart',
	// 	component: 'PerformanceDemographicChart',
	// 	title: 'Performance Metrics',
	// 	type: 'radar',
	// 	fullScreenTitle: 'Performance Overview',
	// },
	keyMetrics: {
		component: 'KeyMetricsBarChart',
		title: 'Key Metrics',
		type: 'bar',
		fullScreenTitle: 'Key Metrics Overview',
		description: 'Summary of leads, notes, and deals',
	},
	// Add more charts here easily...
};

export const CHART_GRID_LAYOUT = {
	default: ['leadStatus', 'leadAssignment', 'monthlyLeads', 'keyMetrics'],
	detailed: [
		'leadStatus',
		'leadAssignment',
		'monthlyLeads',
		'leadTimeline',
		'performanceMetrics',
	],
};
