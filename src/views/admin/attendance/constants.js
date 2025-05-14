export const buttonStyle = {
	size: 'sm',
	borderRadius: 'md',
	_hover: { shadow: 'sm', transition: 'all 0.2s ease-in-out' },
	_active: { bg: 'brand.500' },
	color: 'white',
	fontWeight: 'medium',
	py: '5',
	px: '8',
};

export const ATTENDANCE_STATUS_CONFIG = {
	0: { bg: '#FFE5EE', text: '#AA0000', label: 'Absent' },
	1: {
		bg: '#E6EFFC',
		text: '#0764E6',
		label: 'Office',
		gradient: 'linear(to-r, #E0F7FF, white)',
	},
	2: { bg: '#FFF8E7', text: '#D5B500', label: 'Late' },
	3: { bg: '#E8F9F1', text: '#2E8B57', label: 'Leave' },
};

export const attendanceStatusFilters = [
	{ label: 'All', value: '' },
	{ label: 'Absent', value: 0 },
	{ label: 'Office', value: 1 },
	{ label: 'Late', value: 2 },
	{ label: 'Leave', value: 3 },
];

export const getLocalAttendanceFilter = () => {
	return localStorage.getItem('attendanceAgencyFilter');
};
