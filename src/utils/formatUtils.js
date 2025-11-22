import { salaryTypes } from './options';

export const formatSalaryType = (type) => {
	const item = salaryTypes.find((t) => t.value === type);
	return item?.label || type;
};
