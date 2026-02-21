import { minutesTo12Hour } from 'utils/timeUtil';

export const formatTimeToCall = (lead) => {
	// If legacy value exists, prefer it
	if (lead?.timetocall) return lead.timetocall;

	const from = minutesTo12Hour(lead?.timeToCallFrom);
	const to = minutesTo12Hour(lead?.timeToCallTo);

	if (from && to) return `${from} - ${to}`;
	if (from) return from;
	if (to) return to;

	return null;
};
