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

export const PAYROLL_COLUMNS = [
	{ key: 'user', label: 'Employee', width: '220px' },
	{
		key: 'payrollSummary.basicSalary',
		label: 'Basic Salary',
		width: '150px',
	},
	{
		key: 'payrollSummary.commissionEarned',
		label: 'Commission',
		width: '130px',
	},
	{
		key: 'payrollSummary.incentiveEarned',
		label: 'Incentive',
		width: '120px',
	},
	{
		key: 'payrollSummary.totalDeductions',
		label: 'Total Deduction',
		width: '140px',
	},
	{ key: 'payrollSummary.netSalary', label: 'Net Salary', width: '140px' },
	{
		key: 'evaluationScore',
		label: 'Performance',
		width: '120px',
	},
	{ key: 'createdAt', label: 'Joining Date', width: '100px' },
	{ key: 'actions', label: 'Actions', width: '100px' },
];
