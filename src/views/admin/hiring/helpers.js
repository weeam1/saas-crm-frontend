export const jobRoles = [
	{ label: 'Manager', value: 'Manager' },
	{ label: 'HR', value: 'HR' },
	{ label: 'Secretary', value: 'Secretary' },
	{ label: 'Team Leader', value: 'Team Leader' },
	{ label: 'Sales', value: 'Sales' },
	{ label: 'Telesales', value: 'Telesales' },
];

export const jobTypes = [
	{ value: 'Slaray', label: 'Salary' },
	{ value: 'Comission', label: 'Comission' },
];

export const genderOptions = [
	{ label: 'Male', value: 'Male' },
	{ label: 'Female', value: 'Female' },
];

export const experienceYearsOptions = [
	{ label: '0 Years', value: '0' },
	{ label: '1 Year', value: '1' },
	{ label: '2 Years', value: '2' },
	{ label: '3 Years', value: '3' },
	{ label: '4 Years', value: '4' },
	{ label: '5 Years', value: '5' },
	{ label: '6 Years', value: '6' },
	{ label: '7 Years', value: '7' },
	{ label: '8 Years', value: '8' },
	{ label: '9 Years', value: '9' },
	{ label: 'More than 9 Years', value: '10' },
];

export const getCurrentInterviewRound = (interview) => {
	return interview?.isMultiRound && interview?.nextRound
		? interview?.nextRound
		: interview;
};

export const getInterviewStatusConfig = (status) => {
	const statusMap = {
		offer_rejected: {
			text: 'Offer Rejected',
			color: 'red.100',
			textColor: 'red.800',
		},
		accepted: {
			text: 'Hired',
			color: 'green.100',
			textColor: 'green.800',
		},
		rejected: {
			text: 'Rejected',
			color: 'red.100',
			textColor: 'red.800',
		},
		in_progress: {
			text: 'In Progress',
			color: 'yellow.100',
			textColor: 'yellow.800',
		},
		interviewing: {
			text: 'Interviewing',
			color: 'blue.100',
			textColor: 'blue.800',
		},
		offer_sent: {
			text: 'Offer Sent',
			color: 'purple.100',
			textColor: 'purple.800',
		},
		// Add more statuses as needed
	};

	return (
		statusMap[status] || {
			text: 'Applied',
			color: 'gray.100',
			textColor: 'gray.800',
		}
	);
};
