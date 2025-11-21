import { format } from 'date-fns';
import { formatSalaryType } from 'utils/formatUtils';

export const formatValue = (key, value, row = {}) => {
	switch (key) {
		case 'agency':
			return value?.name || 'N/A';
		case 'addedBy':
			return value?.fullName || value?.username || '-';
		case 'createdAt':
			return value ? format(new Date(value), 'MMM d, yyyy') : 'N/A';
		case 'salaryType':
			return formatSalaryType(value);
		case 'evaluationScore':
			return `${row.evaluation?.finalPercentage || 0}%`;
		default:
			return value ?? '-';
	}
};
