import { useState, useEffect } from 'react';

export const useLeadReportFilters = () => {
	const [filters, setFilters] = useState({
		managerId: '',
		agentId: '',
	});

	return { filters, setFilters };
};
