export const minutesTo12Hour = (minutes) => {
	if (typeof minutes !== 'number') return null;

	const hrs = Math.floor(minutes / 60);
	const mins = minutes % 60;

	const period = hrs >= 12 ? 'PM' : 'AM';
	const hour12 = hrs % 12 || 12;

	return `${hour12}:${mins.toString().padStart(2, '0')} ${period}`;
};
